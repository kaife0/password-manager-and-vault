import type { NextApiResponse } from 'next'
import connectDB from '../../../lib/mongodb'
import VaultItem from '../../../models/VaultItem'
import { withAuth, AuthenticatedRequest } from '../../../lib/auth'
import { Types } from 'mongoose'

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await connectDB()

  const { id } = req.query

  if (!id || typeof id !== 'string' || !Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid item ID' })
  }

  const itemId = new Types.ObjectId(id)

  if (req.method === 'PUT') {
    try {
      const { ciphertext, iv } = req.body

      // Validation
      if (!ciphertext || !iv) {
        return res.status(400).json({ error: 'Missing ciphertext or iv' })
      }

      const item = await VaultItem.findOneAndUpdate(
        { _id: itemId, userId: req.user.userId },
        { ciphertext, iv },
        { new: true }
      )

      if (!item) {
        return res.status(404).json({ error: 'Item not found' })
      }

      res.status(200).json({
        _id: item._id,
        ciphertext: item.ciphertext,
        iv: item.iv,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })
    } catch (error) {
      console.error('Update item error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const item = await VaultItem.findOneAndDelete({
        _id: itemId,
        userId: req.user.userId
      })

      if (!item) {
        return res.status(404).json({ error: 'Item not found' })
      }

      res.status(200).json({ message: 'Item deleted successfully' })
    } catch (error) {
      console.error('Delete item error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

export default withAuth(handler)