import { useState, useEffect } from 'react'

export function useRuntimeConfig() {
  const [config, setConfig] = useState<{
    apiBase: string
    apiVersion: string
  } | null>(null)

  useEffect(() => {
    // Get config from environment
    const config = {
      apiBase: process.env.NEXT_PUBLIC_API_BASE_URL || '',
      apiVersion: process.env.NEXT_PUBLIC_API_VERSION || 'v1'
    }
    setConfig(config)
  }, [])

  return config || {
    apiBase: '',
    apiVersion: 'v1'
  }
}
