// Crypto constants
const PBKDF2_ITERATIONS = 200000
const SALT_SIZE = 16 // bytes
const IV_SIZE = 12 // bytes for AES-GCM

// Client-side crypto functions using Web Crypto API
export async function generateSaltBase64(): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('Crypto operations must run in browser')
  }
  
  const salt = new Uint8Array(SALT_SIZE)
  crypto.getRandomValues(salt)
  return btoa(String.fromCharCode(...salt))
}

export async function deriveKeyFromPassword(
  password: string, 
  saltBase64: string
): Promise<CryptoKey> {
  if (typeof window === 'undefined') {
    throw new Error('Crypto operations must run in browser')
  }

  const encoder = new TextEncoder()
  const saltBytes = new Uint8Array(atob(saltBase64).split('').map(c => c.charCodeAt(0)))
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptJson(
  obj: object, 
  password: string, 
  saltBase64?: string
): Promise<{ ciphertext: string; iv: string; salt?: string }> {
  if (typeof window === 'undefined') {
    throw new Error('Crypto operations must run in browser')
  }

  const salt = saltBase64 || await generateSaltBase64()
  const key = await deriveKeyFromPassword(password, salt)
  
  const encoder = new TextEncoder()
  const plaintext = encoder.encode(JSON.stringify(obj))
  
  const iv = new Uint8Array(IV_SIZE)
  crypto.getRandomValues(iv)
  
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    plaintext
  )

  const result: { ciphertext: string; iv: string; salt?: string } = {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv))
  }

  if (!saltBase64) {
    result.salt = salt
  }

  return result
}

export async function decryptJson<T>(
  ciphertextBase64: string,
  ivBase64: string, 
  password: string,
  saltBase64: string
): Promise<T> {
  if (typeof window === 'undefined') {
    throw new Error('Crypto operations must run in browser')
  }

  const key = await deriveKeyFromPassword(password, saltBase64)
  
  const ciphertext = new Uint8Array(atob(ciphertextBase64).split('').map(c => c.charCodeAt(0)))
  const iv = new Uint8Array(atob(ivBase64).split('').map(c => c.charCodeAt(0)))
  
  try {
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      ciphertext
    )

    const decoder = new TextDecoder()
    const plaintext = decoder.decode(decrypted)
    return JSON.parse(plaintext) as T
  } catch (error) {
    throw new Error('Decryption failed. Invalid password or corrupted data.')
  }
}