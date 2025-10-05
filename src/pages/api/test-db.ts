import type { NextApiRequest, NextApiResponse } from 'next'
import connectDB from '../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test MongoDB connection
    await connectDB()
    
    return res.status(200).json({
      success: true,
      message: 'MongoDB connection successful',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('MongoDB test error:', error)
    return res.status(500).json({
      success: false,
      error: 'MongoDB connection failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set'
    })
  }
}