import axios from 'axios'
import { Swaly } from '@/lib/toastSwal'
import ConstruirMenu from '@/components/ConstruirMenu'

import protectedRoute from '@/lib/auth/protectedRoute'
import { useRouter } from 'next/router'
import { cuestionariosStore } from '@/lib/store/cuestionarios'
import { useEffect } from 'react'
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
  const encuestas = cuestionariosStore((state) => state.cuestionarios)
  const { fetchCuestionarios } = cuestionariosStore((state) => state)

  useEffect(() => {
    fetchCuestionarios()
  }, [fetchCuestionarios])

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
  const reloadService = cuestionariosStore((state) => state.reloadService)
  const router = useRouter()

  const handleEliminar = (id) => {
    Swaly.fire({
      icon: 'warning',
      text: '¿Estas seguro de eliminar el cuestionario?',
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        eliminar(id)
      }
    })
  }

  const eliminar = async (id) => {
    try {
      await axios.delete('/api/encuestas/', {
        params: {
          id
        }
      })
      Swaly.fire({
        icon: 'success',
        text: 'Cuestionario eliminado correctamente'
      })
        .then((r) => {
          if (r.isDismissed || r.isConfirmed) {
            reloadService()
          }
        })
    } catch (error) {
      console.log(error)
      Swaly.fire({
        icon: 'error',
        text: JSON.stringify(error?.response?.data) || JSON.stringify(error?.message) || 'Error al eliminar el cuestionario'
      })
    }
  }

  const handleEditar = (id) => {
    router.push(`/encuestas/create?id=${id}`)
  }

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
                {/* <button className='btn btn-sm btn-primary'>
                  <i className='bi bi-eye-fill' />
                </button> */}
                <button
                  className='btn btn-sm btn-primary'
                  onClick={() => handleEditar(encuesta.id)}
                >
                  <i className='bi bi-pencil-fill' />
                </button>
                <button
                  className='btn btn-sm btn-danger'
                  type='button'
                  onClick={() => handleEliminar(encuesta.id)}
                >
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
