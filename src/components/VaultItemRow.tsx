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
    <tr className="border-b dark:border-gray-700">
      <td className="px-4 py-3">
        <div className="font-medium">{item.data.title}</div>
        {item.data.url && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <a 
              href={item.data.url.startsWith('http') ? item.data.url : `https://${item.data.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {item.data.url}
            </a>
          </div>
        )}
      </td>
      
      <td className="px-4 py-3">
        <div className="text-sm">{item.data.username}</div>
      </td>
      
      <td className="px-4 py-3">
        <div className="font-mono text-sm">
          {'•'.repeat(Math.min(item.data.password.length, 12))}
        </div>
      </td>
      
      <td className="px-4 py-3">
        <div className="flex space-x-2">
          <button
            onClick={copyPassword}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            aria-label={`Copy password for ${item.data.title}`}
          >
            Copy
          </button>
          
          <button
            onClick={() => onEdit(item)}
            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            aria-label={`Edit ${item.data.title}`}
          >
            Edit
          </button>
          
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
            aria-label={`Delete ${item.data.title}`}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}