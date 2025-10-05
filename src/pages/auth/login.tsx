import { useEffect } from 'react'
import { useRouter } from 'next/router'
import AuthForm from '../../components/AuthForm'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password)
    
    if (result.success) {
      router.push('/dashboard')
    }
    
    return result
  }

  return (
    <AuthForm mode="login" onSubmit={handleLogin} />
  )
}