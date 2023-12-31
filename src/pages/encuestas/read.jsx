import { Swaly } from '@/lib/toastSwal'
import ConstruirMenu from '@/components/ConstruirMenu'

import protectedRoute from '@/lib/auth/protectedRoute'
import { useRouter } from 'next/router'
import cuestionariosState, { useDeleteCuestionario } from '@/lib/store/cuestionarios'
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
  const { cuestionarios: encuestas } = cuestionariosState()

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
  const router = useRouter()
  const { deleteCuestionario, isLoading: isLoadingDelete } = useDeleteCuestionario()

  const handleEliminar = (id) => {
    Swaly.fire({
      icon: 'warning',
      text: '¿Estas seguro de eliminar el cuestionario?',
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCuestionario(id)
      }
    })
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
                  disabled={isLoadingDelete}
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
