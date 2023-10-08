import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import userStore from '@/lib/store/userStore'

import protectedRoute from '@/lib/auth/protectedRoute'
export const getServerSideProps = protectedRoute()

const profilePage = ({ user }) => {
  const logoutState = userStore((state) => state.logout)
  const userState = userStore((state) => state.user)
  const router = useRouter()
  const logout = async () => {
    await fetch('/api/auth/logout')
      .then(() => logoutSuccess())
      .catch((err) => console.error(err))
  }

  const logoutSuccess = useCallback(
    () => {
      logoutState()
      router.push('/auth/login')
    },
    []
  )

  return (
    <div className='container d-flex align-items-center justify-content-center gradient'>
      <div className='d-flex flex-column'>
        <div className='d-flex flex-column align-items-center'>
          <i className='bi bi-file-person-fill' style={{ fontSize: '10rem' }} />
          <section className='d-flex justify-content-center mt-5 letra fs-1'>{user.fullname}</section>
          <div className='d-flex gap-3'>
            <section className=' letra fs-5 mt-2 '>user id:</section>
            <section className='fs-5 mt-2'>{user.id}</section>
          </div>
          <div className='d-flex gap-3'>
            <section className=' letra fs-5 mt-2 '>user name:</section>
            <section className='fs-5 mt-2'>{user.username}</section>
          </div>
          <div className='d-flex gap-3'>
            <section>{JSON.stringify(userState)}</section>
          </div>
          <div className='d-flex justify-content-center mt-3'>
            <button
              className='btn btn-outline-primary'
              onClick={logout}
            >Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default profilePage
