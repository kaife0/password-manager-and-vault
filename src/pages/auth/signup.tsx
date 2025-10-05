import { useRouter } from 'next/router'
import AuthForm from '../../components/AuthForm'
import { useAuth } from '../../hooks/useAuth'

export default function Signup() {
  const router = useRouter()
  const { signup } = useAuth()

  const handleSignup = async (email: string, password: string, confirmPassword?: string) => {
    const result = await signup(email, password)
    
    if (result.success) {
      // Redirect to login after successful signup
      router.push('/auth/login?message=Account created successfully. Please sign in.')
    }
    
    return result
  }

  return (
    <AuthForm mode="signup" onSubmit={handleSignup} />
  )
}