import React, { useEffect, useState } from 'react'

import protectedRoute from '@/lib/auth/protectedRoute'
import { useRouter } from 'next/router'
import { clientesStore } from '@/lib/store/clientes'
export const getServerSideProps = protectedRoute()

export default function clientesRead () {
  const { clientes, fetchClientes } = clientesStore((state) => state)

  useEffect(() => {
    fetchClientes()
  }, [fetchClientes])

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

function ClientesTables ({ clientes: clientesState }) {
  const [clientes, setClientes] = useState(clientesState)
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
        <BuscadorClientesForm setClientes={setClientes} clientesState={clientesState} />
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

function BuscadorClientesForm ({ setClientes, clientesState }) {
  const [buscador, setBuscador] = useState('')
  const handleBuscador = (e) => {
    setBuscador(e.target.value)
    const clientes = clientesState.filter((cliente) => {
      const { cedula, primerNombre, segundoNombre, primerApellido, segundoApellido } = cliente
      const busqueda = `${cedula} ${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`
      return busqueda.toLowerCase().includes(e.target.value.toLowerCase())
    })
    setClientes(clientes)
  }
  return (
    <tr>
      <td colSpan='12'>
        <div className='input-group'>
          <input
            type='text'
            className='form-control form-control-sm'
            placeholder='Buscar cliente'
            value={buscador}
            onChange={handleBuscador}
          />
        </div>
      </td>
    </tr>
  )
}
