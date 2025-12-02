import { createFileRoute, useNavigate } from '@tanstack/react-router'
import React from 'react'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})

function SignupPage() {
  const navigate = useNavigate()
  React.useEffect(() => {
    navigate({ to: '/' })
  }, [navigate])

  return null
}


