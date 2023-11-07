import { useEffect, useState } from 'react'

import protectedRoute from '@/lib/auth/protectedRoute'
import axios from 'axios'
import { ReactSwal, Swaly } from '@/lib/toastSwal'
import ConstruirMenu from '@/components/ConstruirMenu'
import { useRouter } from 'next/router'
import InputControl from '@/components/formControls/InputControl'
import { preguntasStore } from '@/lib/store/preguntas'
export const getServerSideProps = protectedRoute()

export const menuPreguntas = [
  {
    name: 'Preguntas',
    icon: 'bi-question-circle-fill',
    path: '/preguntas/read'
  }
]

const submenu = [
  {
    name: 'Crear',
    icon: 'bi-plus-circle-fill',
    path: '/preguntas/create'
  }
]

export default function preguntasRead () {
  const { preguntas, fetchPreguntas } = preguntasStore((state) => state)

  useEffect(() => {
    fetchPreguntas()
  }, [fetchPreguntas])

  return (
    <>
      <ConstruirMenu menu={menuPreguntas} submenu={submenu} />
      <div className='card'>
        <div className='card-body'>
          {preguntas.length > 0
            ? (
              <PreguntasTable preguntas={preguntas} />
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

function PreguntasTable ({ preguntas: preguntasState }) {
  const [preguntas, setPreguntas] = useState(preguntasState)
  return (
    <table className='table table-striped table-hover table-leidy'>
      <thead>
        <tr>
          <th>ID INTERNA</th>
          <th>Titulo</th>
          <th>Tipo</th>
          <th />
        </tr>
        <tr>
          <Buscador preguntasState={preguntasState} setPreguntas={setPreguntas} />
        </tr>
      </thead>
      <tbody>
        {preguntas.map((pregunta, index) => (
          <PreguntaRow key={index} pregunta={pregunta} />
        ))}
      </tbody>
    </table>
  )
}

function Buscador ({ preguntasState, setPreguntas }) {
  const [busqueda, setBusqueda] = useState({
    id: '',
    titulo: '',
    tipo: ''
  })

  const handleSearch = (e) => {
    e.preventDefault()
    const preguntasFiltradas = preguntasState.filter((pregunta) => {
      if (Number(busqueda.id) && pregunta.id !== busqueda.id) return false
      if (busqueda.titulo && !pregunta.titulo.toLowerCase().includes(busqueda.titulo.toLowerCase())) return false
      if (busqueda.tipo === 'TEXTO' && !pregunta.isTexto) return false
      if (busqueda.tipo === 'FECHA' && !pregunta.isFecha) return false
      if (busqueda.tipo === 'SELECCION' && !pregunta.isSeleccion) return false
      return true
    })
    setPreguntas(preguntasFiltradas)
  }

  return (
    <>
      <th>
        <InputControl name='id' value={busqueda.id} onChange={(e) => setBusqueda({ ...busqueda, id: e.target.value })} />
      </th>
      <th>
        <InputControl name='titulo' value={busqueda.titulo} onChange={(e) => setBusqueda({ ...busqueda, titulo: e.target.value })} />
      </th>
      <th>
        <select className='form-select form-select-sm' name='tipo' value={busqueda.tipo} onChange={(e) => setBusqueda({ ...busqueda, tipo: e.target.value })}>
          <option value=''>TODOS</option>
          <option>TEXTO</option>
          <option>FECHA</option>
          <option>SELECCION</option>
        </select>
      </th>
      <th className='text-center'>
        <div className='btn-group btn-group-sm'>
          <button
            type='button'
            className='btn btn-outline-secondary'
            onClick={handleSearch}
          >
            <i className='bi bi-search' />
          </button>
          <button
            type='button'
            className='btn btn-outline-secondary'
            onClick={() => setPreguntas(preguntasState)}
          >
            <i className='bi bi-arrow-counterclockwise' />
          </button>
        </div>
      </th>
    </>
  )
}

function PreguntaRow ({ pregunta }) {
  const [mostrarRow, setMostrarRow] = useState(true)
  const router = useRouter()

  const handleView = () => {
    ReactSwal.fire({
      html: <ReadPregunta pregunta={pregunta} />,
      showDenyButton: true,
      denyButtonText: 'Cerrar'
    })
  }

  const handleUpdate = () => {
    // enviarlo por query al create
    router.push({
      pathname: '/preguntas/create',
      query: {
        id: pregunta.id,
        titulo: pregunta.titulo,
        isTexto: pregunta.isTexto,
        isFecha: pregunta.isFecha,
        isSeleccion: pregunta.isSeleccion,
        obligatoria: pregunta.obligatoria,
        seleccion: pregunta.seleccion.map((item) => item.valor),
        id_pregCadena: pregunta.id_pregCadena,
        titulo_pregCadena: pregunta.titulo_pregCadena
      }
    })
  }

  const handleDelete = async () => {
    try {
      await axios.delete('/api/preguntas/', { data: { id: pregunta.id } })
      Swaly.fire({
        icon: 'success',
        text: 'Pregunta eliminada con exito'
      })
      setMostrarRow(false)
    } catch (error) {
      console.log(error)
      Swaly.fire({
        icon: 'error',
        text: JSON.stringify(error?.response?.data) || 'Error al eliminar la pregunta'
      })
    }
  }

  if (!mostrarRow) return null
  return (
    <tr>
      <th scope='row'>{pregunta.id}</th>
      <td>{pregunta.titulo}</td>
      <td>
        {pregunta.isTexto ? 'Texto' : ''}
        {pregunta.isFecha ? 'Fecha' : ''}
        {pregunta.isSeleccion ? 'Seleccion' : ''}
      </td>
      <td className='text-end'>
        <div className='btn-group'>
          <button
            className='btn btn-primary btn-sm'
            onClick={handleView}
          >
            <i className='bi bi-eye-fill' />
          </button>
          <button
            className='btn btn-primary btn-sm'
            onClick={handleUpdate}
          >
            <i className='bi bi-pencil-fill' />
          </button>
          <button
            className='btn btn-primary btn-sm'
            onClick={handleDelete}
          >
            <i className='bi bi-trash-fill' />
          </button>
        </div>
      </td>
    </tr>
  )
}

function ReadPregunta ({ pregunta }) {
  return (
    <div className='card text-uppercase text-start'>
      <div className='card-body'>
        <div className='mb-3'>
          <b>Titulo: </b>
          {pregunta.titulo}
        </div>
        <div className='mb-3'>
          <b>Tipo de Pregunta: </b>
          {pregunta.isTexto ? 'Texto' : ''}
          {pregunta.isFecha ? 'Fecha' : ''}
          {pregunta.isSeleccion ? 'Seleccion' : ''}
        </div>
        {pregunta.isSeleccion
          ? (
            <div className='mb-3 d-flex gap-2'>
              <div className='fw-bold'>Opciones: </div>
              <div>
                {pregunta.seleccion.map((opciones, index) => (
                  <div key={index}>
                    {opciones.valor}
                  </div>
                ))}
              </div>
            </div>
            )
          : null}
        <div className='mb-3'>
          <b>¿Obligatoria?</b>
          {pregunta.obligatoria ? 'Si' : 'No'}
        </div>
        {pregunta?.id_pregCadena
          ? (
            <div className='mb-3 d-flex gap-2'>
              <div className='fw-bold'>Encadenar con Pregunta: </div>
              <div>
                <div>
                  {pregunta.id_pregCadena} - {pregunta.titulo_pregCadena}
                </div>
                <div>
                  <span className='fw-bold'>Condicion:</span> {pregunta.condicion}
                </div>
              </div>
            </div>
            )
          : null}
      </div>
    </div>
  )
}
