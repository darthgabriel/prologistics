import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import userStore from '@/lib/store/userStore'

export default function Login () {
  const router = useRouter()
  const userNameInput = useRef()
  const passwordInput = useRef()
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const loginState = userStore((state) => state.login)

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const username = userNameInput.current.value
    const password = passwordInput.current.value
    axios.post('/api/auth/login', {
      username, password
    })
      .then((r) => loginSuccess(r.data))
      .catch((e) => setError(true) & console.error(e))
      .finally(() => setLoading(false))
  }, [])

  const loginSuccess = useCallback(
    (user) => {
      delete user.routes
      loginState(user)
      router.push('/auth/profile')
    },
    []
  )

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='container d-flex align-items-center justify-content-center gradient'>
          <div className='d-flex flex-column'>
            <div className='d-flex flex-column align-items-center'>
              <i className='bi bi-file-person-fill' style={{ fontSize: '10rem' }} />
              <div className='input-group mb-3 mt-4'>
                <span className='input-group-text' id='basic-addon1'>
                  <i className='bi bi-person-fill' />
                </span>
                <input className='form-control' type='text' ref={userNameInput} placeholder='Username' />
              </div>
              <div className='input-group mb-3'>
                <span className='input-group-text' id='basic-addon1'>
                  <i className='bi bi-key-fill' />
                </span>
                <input className='form-control' type='password' ref={passwordInput} placeholder='Password' />
              </div>
            </div>
            <div className='d-flex justify-content-center mt-3'>
              {!loading && <button className='btn btn-outline-primary' type='submit'>Login</button>}
              {loading && <div className='spinner-border text-primary' role='status' />}
            </div>
            {error && <div className='d-flex justify-content-center mt-2'>Invalid username or password</div>}
          </div>
        </div>
      </form>
    </>
  )
}
