import type { NextApiResponse } from 'next'
import connectDB from '../../../lib/mongodb'
import VaultItem from '../../../models/VaultItem'
import { withAuth, AuthenticatedRequest } from '../../../lib/auth'

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  await connectDB()

  if (req.method === 'GET') {
    try {
      const items = await VaultItem.find({ userId: req.user.userId })
        .select('_id ciphertext iv createdAt updatedAt')
        .sort({ updatedAt: -1 })

      res.status(200).json(items)
    } catch (error) {
      console.error('Get items error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const { ciphertext, iv } = req.body

      // Validation
      if (!ciphertext || !iv) {
        return res.status(400).json({ error: 'Missing ciphertext or iv' })
      }

      const item = new VaultItem({
        userId: req.user.userId,
        ciphertext,
        iv
      })

      await item.save()

      res.status(201).json({
        _id: item._id,
        ciphertext: item.ciphertext,
        iv: item.iv,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })
    } catch (error) {
      console.error('Create item error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}

export default withAuth(handler)