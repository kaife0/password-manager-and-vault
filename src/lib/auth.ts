import { NextApiRequest, NextApiResponse } from 'next'
import { serialize, parse } from 'cookie'
import { verifyJWT, JWTPayload } from './jwt'

const COOKIE_NAME = process.env.COOKIE_NAME || 'token'

export interface AuthenticatedRequest extends NextApiRequest {
  user: JWTPayload
}

export function withAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const cookies = parse(req.headers.cookie || '')
      const token = cookies[COOKIE_NAME]

      if (!token) {
        return res.status(401).json({ error: 'No token provided' })
      }

      const decoded = verifyJWT(token)
      if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' })
      }

      const authenticatedReq = req as AuthenticatedRequest
      authenticatedReq.user = decoded

      return handler(authenticatedReq, res)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return res.status(401).json({ error: 'Authentication failed' })
    }
  }
}

export function setTokenCookie(res: NextApiResponse, token: string) {
  res.setHeader('Set-Cookie', serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  }))
}

export function clearTokenCookie(res: NextApiResponse) {
  res.setHeader('Set-Cookie', serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1,
    path: '/'
  }))
}