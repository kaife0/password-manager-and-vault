import { useState, useEffect } from 'react'
import axios from 'axios'
import { generateSaltBase64, deriveKeyFromPassword } from '../utils/crypto'

interface AuthState {
  isAuthenticated: boolean
  encryptionSalt: string | null
  derivedKey: CryptoKey | null
  loading: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    encryptionSalt: null,
    derivedKey: null,
    loading: true
  })

  useEffect(() => {
    // Check if we have stored salt (indicating previous login)
    if (typeof window !== 'undefined') {
      const storedSalt = sessionStorage.getItem('encryptionSalt')
      if (storedSalt) {
        setAuthState(prev => ({
          ...prev,
          encryptionSalt: storedSalt,
          loading: false
        }))
      } else {
        setAuthState(prev => ({ ...prev, loading: false }))
      }
    }
  }, [])

  const signup = async (email: string, password: string) => {
    try {
      // Generate encryption salt
      const encryptionSaltBase64 = await generateSaltBase64()

      await axios.post('/api/auth/signup', {
        email,
        password,
        encryptionSaltBase64
      })

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Signup failed'
      }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password
      })

      const { encryptionSaltBase64 } = response.data

      // Derive key and store salt
      const derivedKey = await deriveKeyFromPassword(password, encryptionSaltBase64)

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('encryptionSalt', encryptionSaltBase64)
      }

      setAuthState({
        isAuthenticated: true,
        encryptionSalt: encryptionSaltBase64,
        derivedKey,
        loading: false
      })

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      }
    }
  }

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout')
      
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('encryptionSalt')
      }

      setAuthState({
        isAuthenticated: false,
        encryptionSalt: null,
        derivedKey: null,
        loading: false
      })

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Logout failed'
      }
    }
  }

  const restoreSession = async (password: string) => {
    if (!authState.encryptionSalt) {
      return { success: false, error: 'No stored session' }
    }

    try {
      // Try to derive the key to verify password
      const derivedKey = await deriveKeyFromPassword(password, authState.encryptionSalt)

      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        derivedKey
      }))

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: 'Invalid password'
      }
    }
  }

  return {
    ...authState,
    signup,
    login,
    logout,
    restoreSession
  }
}