import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Sun, Moon } from 'lucide-react'
import PasswordGenerator from '../../components/PasswordGenerator'
import VaultList from '../../components/VaultList'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../contexts/ThemeContext'

export default function Dashboard() {
  const router = useRouter()
  const { isAuthenticated, encryptionSalt, derivedKey, logout, restoreSession, loading } = useAuth()
  const { theme, toggleTheme } = useTheme()
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-900 dark:text-white">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Image
                src="/logo.png"
                alt="Password Manager Logo"
                width={32}
                height={32}
                className="sm:w-10 sm:h-10 rounded-lg"
              />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Password Manager</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto justify-end">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors duration-200"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              >
                {theme === 'light' ? <Moon size={18} className="sm:w-5 sm:h-5" /> : <Sun size={18} className="sm:w-5 sm:h-5" />}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 sm:px-4 text-sm sm:text-base rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Enter Your Password</h3>
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
                <label htmlFor="session-password" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
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