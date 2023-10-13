import React, { useEffect, useState } from 'react'
import axios from 'axios'

import protectedRoute from '@/lib/auth/protectedRoute'
import { useRouter } from 'next/router'
export const getServerSideProps = protectedRoute()

const fetchClientes = async () => {
  try {
    const { data } = await axios.get('/api/clientes/')
    return data
  } catch (error) {
    console.log(error)
    return []
  }
}

export default function clientesRead () {
  const [cliente, setCliente] = useState()
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (!id) return
    fetchClientes()
      .then((data) => {
        const clienteFind = data.find((cliente) => cliente.id === Number(router.query.id))
        setCliente(clienteFind)
      })
  }, [id])
  return (
    <>
      {cliente
        ? (
          <div>
            {JSON.stringify(cliente, null, 2)}
          </div>
          )
        : null}
    </>
  )
}
