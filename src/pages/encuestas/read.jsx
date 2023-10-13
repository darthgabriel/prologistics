import { useEffect, useState } from 'react'
import axios from 'axios'
import { Swaly } from '@/lib/toastSwal'
import ConstruirMenu from '@/components/ConstruirMenu'

import protectedRoute from '@/lib/auth/protectedRoute'
export const getServerSideProps = protectedRoute()

export const menuEncuestas = [
  {
    name: 'Cuestionarios',
    icon: 'bi-file-earmark-bar-graph-fill',
    path: '/encuestas/read'
  }
]

const submenu = [
  {
    name: 'Crear',
    icon: 'bi-plus-circle-fill',
    path: '/encuestas/create'
  }
]

export default function encuestasRead () {
  const [encuestas, setEncuestas] = useState([])

  useEffect(() => {
    getEncuestas()
  }, [])

  const getEncuestas = async () => {
    try {
      const { data } = await axios.get('/api/encuestas')
      if (data.length === 0) throw new Error('No hay cuestionarios creados')
      setEncuestas(data)
    } catch (error) {
      console.log(error)
      Swaly.fire({
        icon: 'error',
        text: JSON.stringify(error?.response?.data) || JSON.stringify(error?.message) || 'Error al cargar la pregunta'
      })
    }
  }

  return (
    <>
      <ConstruirMenu menu={menuEncuestas} submenu={submenu} />
      <div className='card'>
        <div className='card-body'>
          {encuestas.length > 0
            ? (
              <EncuestasTable encuestas={encuestas} />
              )
            : (
              <div className='d-flex justify-content-center'>
                <div className='spinner-border text-primary' role='status' />
              </div>
              )}
        </div>
      </div>
    </>
  )
}

function EncuestasTable ({ encuestas }) {
  return (
    <table className='table table-sm table-bordered table-leidy text-center'>
      <thead>
        <tr>
          <th className='col-sm-2'>#ID</th>
          <th>Titulo</th>
          <th className='col-sm-2' />
        </tr>
      </thead>
      <tbody>
        {encuestas.map((encuesta, index) => (
          <tr key={index}>
            <td>{encuesta.id}</td>
            <td>{encuesta.titulo}</td>
            <td>
              <div className='btn-group'>
                <button className='btn btn-sm btn-primary'>
                  <i className='bi bi-eye-fill' />
                </button>
                <button className='btn btn-sm btn-primary'>
                  <i className='bi bi-pencil-fill' />
                </button>
                <button className='btn btn-sm btn-danger'>
                  <i className='bi bi-trash-fill' />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
