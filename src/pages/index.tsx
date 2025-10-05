import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="Password Manager Logo"
            width={150}
            height={150}
            className="mx-auto"
            priority
          />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Password Manager</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Secure, client-side encrypted password storage</p>
        <div className="space-x-4">
          <a 
            href="/auth/login"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Login
          </a>
          <a 
            href="/auth/signup"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  )
}