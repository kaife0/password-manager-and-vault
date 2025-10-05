import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test environment variables
    const mongoUri = process.env.MONGODB_URI
    const jwtSecret = process.env.JWT_SECRET
    
    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasMongoUri: !!mongoUri,
      hasJwtSecret: !!jwtSecret,
      mongoUriLength: mongoUri ? mongoUri.length : 0,
      jwtSecretLength: jwtSecret ? jwtSecret.length : 0
    })
  } catch (error) {
    console.error('Test API error:', error)
    return res.status(500).json({
      error: 'Test API failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}