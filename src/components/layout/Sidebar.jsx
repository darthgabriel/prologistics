import { useEffect, useState } from 'react'
import Link from 'next/link'
import useUser from '@/hooks/useUser'

const GUEST_MENU = [
  {
    name: 'Login',
    path: '/auth/login',
    icon: 'bi-person-fill-lock'
  }
]

const ADMIN_MENU = [
  {
    name: 'Home',
    path: '/auth/profile',
    icon: 'bi-house-fill'
  },
  {
    name: 'Encuestas',
    path: '/encuestas/read',
    icon: 'bi-cart-dash-fill'
  },
  {
    name: 'Preguntas',
    path: '/preguntas/read',
    icon: 'bi-cart-plus-fill'
  },
  {
    name: 'Clientes',
    path: '/clientes/read',
    icon: 'bi-inboxes-fill'
  }
]

export default function Sidebar () {
  const [isAuth, setIsAuth] = useState(false)
  const { user } = useUser()

  useEffect(() => {
    setIsAuth(false)
    if (!user) return
    if (!Object.keys(user).length) return
    setIsAuth(true)
  }, [user])

  return (
    <div className='d-print-none'>
      <div className='p-2 text-primary fw-bold'>
        <i className='bi bi bi-pen-fill my-2 mx-2 fs-4' />
        <span className='brand-name fs-5'>Formularios v1.0</span>
      </div>
      <hr className='text-primary' />
      <div className='list-group list-group-flush'>
        {!isAuth
          ? GUEST_MENU.map((item, index) => (
            <ItemMenu key={index} {...item} />
          ))
          : ADMIN_MENU.map((item, index) => (
            <ItemMenu key={index} {...item} />
          ))}
      </div>

    </div>
  )
}

function ItemMenu ({ name, path, icon }) {
  return (
    <Link href={path} className='list-group-item py-2'>
      <i className={'bi ' + icon + ' mx-2 fs-5'} />
      <span>{name}</span>
    </Link>
  )
}
