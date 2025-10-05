interface VaultItemData {
  title: string
  username: string
  password: string
  url: string
  notes: string
}

export interface DecryptedVaultItem {
  _id: string
  data: VaultItemData
  createdAt: string
  updatedAt: string
}

interface VaultItemRowProps {
  item: DecryptedVaultItem
  onEdit: (item: DecryptedVaultItem) => void
  onDelete: (itemId: string) => void
}

export default function VaultItemRow({ item, onEdit, onDelete }: VaultItemRowProps) {
  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(item.data.password)
      
      // Auto-clear clipboard after 15 seconds
      setTimeout(async () => {
        try {
          await navigator.clipboard.writeText('')
        } catch (error) {
          console.log('Clipboard cleared')
        }
      }, 15000)
      
      // Brief visual feedback
      console.log('Password copied to clipboard (will clear in 15s)')
    } catch (error) {
      console.error('Failed to copy password:', error)
    }
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this item?')) {
      onDelete(item._id)
    }
  }

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
      <td className="px-2 sm:px-4 py-2 sm:py-3">
        <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{item.data.title}</div>
        <div className="sm:hidden text-xs text-gray-600 dark:text-gray-400 mt-1">
          {item.data.username}
        </div>
        {item.data.url && (
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            <a 
              href={item.data.url.startsWith('http') ? item.data.url : `https://${item.data.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {item.data.url}
            </a>
          </div>
        )}
      </td>
      
      <td className="px-2 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">
        <div className="text-sm text-gray-900 dark:text-white">{item.data.username}</div>
      </td>
      
      <td className="px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell">
        <div className="font-mono text-sm text-gray-900 dark:text-white">
          {'•'.repeat(Math.min(item.data.password.length, 8))}
        </div>
      </td>
      
      <td className="px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
          <button
            onClick={copyPassword}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm px-2 py-1 rounded transition-colors duration-200"
            aria-label={`Copy password for ${item.data.title}`}
          >
            Copy
          </button>
          
          <button
            onClick={() => onEdit(item)}
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-xs sm:text-sm px-2 py-1 rounded transition-colors duration-200"
            aria-label={`Edit ${item.data.title}`}
          >
            Edit
          </button>
          
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs sm:text-sm px-2 py-1 rounded transition-colors duration-200"
            aria-label={`Delete ${item.data.title}`}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}