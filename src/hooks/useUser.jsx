import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import userStore from '@/lib/store/userStore'

export default function useUser () {
  const [user, setUserLocal] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const userState = userStore((state) => state.user)

  useEffect(() => {
    if (Object.keys(userState).length > 0) {
      console.log('🚀 ~ userState:', userState)
      setUserLocal(userState)
      setLoading(false)
    } else {
      fetchData()
    }
  }, [userState])

  const fetchData = useCallback(() => {
    setTimeout(() => {
      axios.get('/api/auth/user')
        .then((res) => {
          setUserLocal(res.data)
        })
        .catch((err) => {
          console.error(error)
          setError(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }, Math.round(Math.random() * 1000))
  }, [])

  return { user, loading, error }
}
