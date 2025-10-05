import { useState, useCallback } from 'react'

interface PasswordGeneratorProps {
  onPasswordGenerated?: (password: string) => void
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>/?'

// Characters that look similar
const LOOK_ALIKES = 'l1I0Oo'

export default function PasswordGenerator({ onPasswordGenerated }: PasswordGeneratorProps) {
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeLookAlikes, setExcludeLookAlikes] = useState(true)
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [countdown, setCountdown] = useState(0)

  const generatePassword = useCallback(() => {
    if (typeof window === 'undefined') return

    let charset = ''
    const categories: string[] = []

    if (includeUppercase) {
      let chars = UPPERCASE
      if (excludeLookAlikes) {
        chars = chars.split('').filter(c => !LOOK_ALIKES.includes(c)).join('')
      }
      charset += chars
      categories.push(chars)
    }

    if (includeLowercase) {
      let chars = LOWERCASE
      if (excludeLookAlikes) {
        chars = chars.split('').filter(c => !LOOK_ALIKES.includes(c)).join('')
      }
      charset += chars
      categories.push(chars)
    }

    if (includeNumbers) {
      let chars = NUMBERS
      if (excludeLookAlikes) {
        chars = chars.split('').filter(c => !LOOK_ALIKES.includes(c)).join('')
      }
      charset += chars
      categories.push(chars)
    }

    if (includeSymbols) {
      charset += SYMBOLS
      categories.push(SYMBOLS)
    }

    if (charset.length === 0) {
      alert('Please select at least one character type')
      return
    }

    const password: string[] = []
    
    // Ensure at least one character from each selected category
    for (const category of categories) {
      const randomValues = new Uint8Array(1)
      crypto.getRandomValues(randomValues)
      const randomIndex = randomValues[0] % category.length
      password.push(category[randomIndex])
    }

    // Fill the rest randomly
    const remainingLength = length - password.length
    for (let i = 0; i < remainingLength; i++) {
      const randomValues = new Uint8Array(1)
      crypto.getRandomValues(randomValues)
      const randomIndex = randomValues[0] % charset.length
      password.push(charset[randomIndex])
    }

    // Shuffle the password using Fisher-Yates algorithm with crypto random
    for (let i = password.length - 1; i > 0; i--) {
      const randomValues = new Uint8Array(1)
      crypto.getRandomValues(randomValues)
      const j = randomValues[0] % (i + 1)
      ;[password[i], password[j]] = [password[j], password[i]]
    }

    const finalPassword = password.join('')
    setGeneratedPassword(finalPassword)
    onPasswordGenerated?.(finalPassword)
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeLookAlikes, onPasswordGenerated])

  const copyToClipboard = async () => {
    if (!generatedPassword) return

    try {
      await navigator.clipboard.writeText(generatedPassword)
      
      // Start 15-second countdown
      setCountdown(15)
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval)
            // Clear clipboard
            navigator.clipboard.writeText('').catch(() => {
              // Fallback if clearing fails
              console.log('Clipboard cleared')
            })
            return 0
          }
          return prev - 1
        })
      }, 1000)

      // Show success message briefly
      const originalText = generatedPassword
      setGeneratedPassword('Copied!')
      setTimeout(() => setGeneratedPassword(originalText), 1000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Password Generator</h2>
      
      <div className="space-y-4">
        {/* Length Slider */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Length: {length}
          </label>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            aria-label={`Password length: ${length} characters`}
          />
        </div>

        {/* Options */}
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="mr-2"
            />
            Uppercase letters (A-Z)
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="mr-2"
            />
            Lowercase letters (a-z)
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="mr-2"
            />
            Numbers (0-9)
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="mr-2"
            />
            Symbols (!@#$%^&*)
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={excludeLookAlikes}
              onChange={(e) => setExcludeLookAlikes(e.target.checked)}
              className="mr-2"
            />
            Exclude look-alikes (l, 1, I, 0, O, o)
          </label>
        </div>

        {/* Generate Button */}
        <button
          onClick={generatePassword}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Generate Password
        </button>

        {/* Generated Password */}
        {generatedPassword && (
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={generatedPassword}
                readOnly
                className="flex-1 p-3 border border-gray-300 rounded font-mono text-sm bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                aria-label="Generated password"
              />
              <button
                onClick={copyToClipboard}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded"
                aria-label="Copy password to clipboard"
              >
                Copy
              </button>
            </div>
            
            {countdown > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Clipboard will be cleared in {countdown}s
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}