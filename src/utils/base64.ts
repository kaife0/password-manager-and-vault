// Base64 utility functions for consistent encoding/decoding

export function toBase64(data: Uint8Array): string {
  return btoa(String.fromCharCode(...data))
}

export function fromBase64(base64: string): Uint8Array {
  return new Uint8Array(atob(base64).split('').map(c => c.charCodeAt(0)))
}

export function isValidBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str
  } catch {
    return false
  }
}