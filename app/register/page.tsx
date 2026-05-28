'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

import {
  Shield,
  Lock,
  User,
  UserPlus,
} from 'lucide-react'

import { GlassCard } from '@/components/ui/glass-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  const router = useRouter()

  const [username, setUsername] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const handleRegister = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(
        'http://127.0.0.1:8000/auth/register',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            username,
            password,
          }),
        }
      )

      const data =
        await response.json()

      console.log(data)

      if (!response.ok) {
        throw new Error(
          data.detail ||
            'Registration failed'
        )
      }

      router.push('/login')

    } catch (err: any) {
      console.error(err)

      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="w-full max-w-md"
      >
        <GlassCard>

          {/* HEADER */}
          <div className="flex flex-col items-center mb-8">

            <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>

            <h1 className="text-3xl font-bold text-white">
              Sentinel-X
            </h1>

            <p className="text-muted-foreground mt-2 text-center">
              Create your analyst account
            </p>
          </div>

          {/* FORM */}
          <div className="space-y-4">

            {/* USERNAME */}
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
                className="pl-10 h-12"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRegister()
                  }
                }}
                className="pl-10 h-12"
              />
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-red-500 text-sm">
                {error}
              </p>
            )}

            {/* REGISTER BUTTON */}
            <Button
              onClick={handleRegister}
              disabled={loading}
              className="w-full h-12 text-black font-bold"
            >
              <UserPlus className="mr-2 h-4 w-4" />

              {loading
                ? 'Creating Account...'
                : 'Create Account'}
            </Button>

            {/* LOGIN LINK */}
            <div className="text-center pt-4">
              <p className="text-zinc-400 text-sm">
                Already have an account?
              </p>

              <Link
                href="/login"
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-all"
              >
                Sign In
              </Link>
            </div>

          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
}