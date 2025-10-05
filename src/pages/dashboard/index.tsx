import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import PasswordGenerator from '../../components/PasswordGenerator'
import VaultList from '../../components/VaultList'
import { useAuth } from '../../hooks/useAuth'

export default function Dashboard() {
  const router = useRouter()
  const { isAuthenticated, encryptionSalt, derivedKey, logout, restoreSession, loading } = useAuth()
  const [userPassword, setUserPassword] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [vaultUnlocked, setVaultUnlocked] = useState(false)

  useEffect(() => {
    // If user is not authenticated and not loading, redirect to login
    if (!loading && !isAuthenticated && !encryptionSalt) {
      router.push('/auth/login')
      return
    }

    // Check if vault is already unlocked
    if (encryptionSalt && derivedKey) {
      setVaultUnlocked(true)
    }
  }, [isAuthenticated, encryptionSalt, derivedKey, loading, router])

  const handlePasswordSubmit = async (password: string) => {
    const result = await restoreSession(password)
    
    if (result.success) {
      setUserPassword(password)
      setShowPasswordModal(false)
      setVaultUnlocked(true)
    } else {
      alert(result.error || 'Invalid password')
    }
  }

  const handleUnlockVault = () => {
    setShowPasswordModal(true)
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const handlePasswordGenerated = (password: string) => {
    // Store the generated password temporarily for easy use in vault
    console.log('Generated password:', password)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="Password Manager Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <h1 className="text-2xl font-bold">Password Manager</h1>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Password Generator Section */}
          <PasswordGenerator onPasswordGenerated={handlePasswordGenerated} />
          
          {/* Vault Section */}
          <VaultList 
            derivedKey={vaultUnlocked ? derivedKey : null} 
            encryptionSalt={encryptionSalt}
            userPassword={userPassword}
            onUnlockVault={handleUnlockVault}
          />
        </div>
      </div>

      {/* Password Modal for Session Restoration */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Enter Your Password</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Please enter your password to decrypt your vault.
            </p>

            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const password = formData.get('password') as string
              if (password) {
                handlePasswordSubmit(password)
              }
            }}>
              <div className="mb-4">
                <label htmlFor="session-password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  id="session-password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  Unlock Vault
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                >
                  Logout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}