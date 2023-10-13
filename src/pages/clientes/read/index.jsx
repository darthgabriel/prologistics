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
  const [clientes, setClientes] = useState([])
  useEffect(() => {
    fetchClientes()
      .then((data) => setClientes(data))
  }, [])
  return (
    <>
      {clientes.length > 0
        ? (
          <ClientesTables clientes={clientes} />
          )
        : null}
    </>
  )
}

function ClientesTables ({ clientes }) {
  const router = useRouter()
  return (
    <table className='table table-sm table-bordered table-leidy text-center'>
      <thead>
        <tr>
          <th>DOCUMENTO</th>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Telefono</th>
          <th>Email</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {clientes.map((cliente) => (
          <tr key={cliente.id}>
            <td>{cliente.cedula}</td>
            <td>{cliente.primerNombre} {cliente.segundoNombre}</td>
            <td>{cliente.primerApellido} {cliente.segundoApellido}</td>
            <td>{cliente.telefono}</td>
            <td>{cliente.email}</td>
            <td>
              <div className='btn-group'>
                <button
                  type='button'
                  className='btn btn-primary btn-sm'
                  onClick={() => router.push(`/clientes/read/${cliente.id}`)}
                >
                  <i className='bi bi-eye' />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
