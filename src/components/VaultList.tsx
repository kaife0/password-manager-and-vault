import { useState, useEffect } from 'react'
import axios from 'axios'
import { encryptJson, decryptJson } from '../utils/crypto'
import VaultItemRow, { DecryptedVaultItem } from './VaultItemRow'

interface VaultListProps {
  derivedKey: CryptoKey | null
  encryptionSalt: string | null
  userPassword?: string
  onUnlockVault?: () => void
}

interface VaultItemData {
  title: string
  username: string
  password: string
  url: string
  notes: string
}

interface EncryptedVaultItem {
  _id: string
  ciphertext: string
  iv: string
  createdAt: string
  updatedAt: string
}

export default function VaultList({ derivedKey, encryptionSalt, userPassword, onUnlockVault }: VaultListProps) {
  const [items, setItems] = useState<DecryptedVaultItem[]>([])
  const [filteredItems, setFilteredItems] = useState<DecryptedVaultItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<DecryptedVaultItem | null>(null)
  const [formData, setFormData] = useState<VaultItemData>({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: ''
  })

  useEffect(() => {
    if (derivedKey && encryptionSalt && userPassword) {
      fetchItems()
    }
  }, [derivedKey, encryptionSalt, userPassword])

  useEffect(() => {
    // Filter items based on search term
    const filtered = items.filter(item =>
      item.data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.data.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.data.url.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredItems(filtered)
  }, [items, searchTerm])

  const fetchItems = async () => {
    if (!derivedKey || !encryptionSalt || !userPassword) return

    setLoading(true)
    setError('')

    try {
      const response = await axios.get('/api/items')
      const encryptedItems: EncryptedVaultItem[] = response.data

      const decryptedItems: DecryptedVaultItem[] = []
      
      for (const item of encryptedItems) {
        try {
          const decryptedData = await decryptJson<VaultItemData>(
            item.ciphertext,
            item.iv,
            userPassword,
            encryptionSalt
          )
          
          decryptedItems.push({
            _id: item._id,
            data: decryptedData,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          })
        } catch (decryptError) {
          console.error('Failed to decrypt item:', item._id, decryptError)
        }
      }

      setItems(decryptedItems)
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch items')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!derivedKey || !encryptionSalt || !userPassword) return

    setLoading(true)
    setError('')

    try {
      // Encrypt the form data
      const encrypted = await encryptJson(formData, userPassword, encryptionSalt)

      if (editingItem) {
        // Update existing item
        await axios.put(`/api/items/${editingItem._id}`, {
          ciphertext: encrypted.ciphertext,
          iv: encrypted.iv
        })
      } else {
        // Create new item
        await axios.post('/api/items', {
          ciphertext: encrypted.ciphertext,
          iv: encrypted.iv
        })
      }

      // Refresh items
      await fetchItems()
      setShowModal(false)
      setEditingItem(null)
      setFormData({ title: '', username: '', password: '', url: '', notes: '' })
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to save item')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: DecryptedVaultItem) => {
    setEditingItem(item)
    setFormData(item.data)
    setShowModal(true)
  }

  const handleDelete = async (itemId: string) => {
    setLoading(true)
    setError('')

    try {
      await axios.delete(`/api/items/${itemId}`)
      await fetchItems() // Refresh items
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to delete item')
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingItem(null)
    setFormData({ title: '', username: '', password: '', url: '', notes: '' })
    setShowModal(true)
  }

  if (!derivedKey || !encryptionSalt || !userPassword) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Your Vault</h2>
          {onUnlockVault && (
            <button
              onClick={onUnlockVault}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 text-sm sm:text-base rounded-lg transition-colors duration-200 w-full sm:w-auto"
            >
              Unlock Vault
            </button>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          {!onUnlockVault ? 'Please log in to access your vault.' : 'Click "Unlock Vault" to access your encrypted passwords.'}
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Your Vault</h2>
        <button
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 text-sm sm:text-base rounded-lg transition-colors duration-200 w-full sm:w-auto"
        >
          Add Item
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <label htmlFor="search-input" className="sr-only">
          Search vault items
        </label>
        <input
          id="search-input"
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Items Table */}
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-300">
          {items.length === 0 ? 'No items in your vault yet.' : 'No items match your search.'}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-left min-w-full sm:min-w-0">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-gray-900 dark:text-white font-medium text-sm sm:text-base">Title & URL</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-gray-900 dark:text-white font-medium text-sm sm:text-base hidden sm:table-cell">Username</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-gray-900 dark:text-white font-medium text-sm sm:text-base hidden md:table-cell">Password</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-gray-900 dark:text-white font-medium text-sm sm:text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <VaultItemRow
                  key={item._id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md border border-gray-200 dark:border-gray-600 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Gmail"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="username or email"
                />
              </div>

              <div>
                <label htmlFor="password-input" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Password</label>
                <input
                  id="password-input"
                  type="text"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onPaste={(e) => {
                    e.preventDefault()
                    const pastedText = e.clipboardData.getData('text')
                    setFormData({ ...formData, password: pastedText })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono"
                  placeholder="Enter or paste password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">URL</label>
                <input
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Optional notes"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
              <button
                onClick={handleSave}
                disabled={loading || !formData.title}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg disabled:opacity-50 transition-colors duration-200"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}