import React, { useEffect, useState } from 'react'
import axios from 'axios'

import protectedRoute from '@/lib/auth/protectedRoute'
import { useRouter } from 'next/router'
import moment from 'moment/moment'
import clientesState from '@/lib/store/clientes'
import preguntasState from '@/lib/store/preguntas'
export const getServerSideProps = protectedRoute()

const getCuestionarios = async () => {
  try {
    const { data } = await axios.get('/api/cuestionarios/')
    return data
  } catch (error) {
    console.log(error)
  }
  return []
}

export default function clientesRead () {
  const router = useRouter()
  const { id } = router.query
  const [cliente, setCliente] = useState()
  const { clientes } = clientesState()
  const [cuestionarioSelected, setCuestionarioSelected] = useState()
  const [cuestionariosState, setCuestionariosState] = useState([])

  if (!id) return null

  useEffect(() => {
    if (!clientes.length === 0) return
    const clienteFind = clientes.find((cliente) => cliente.id === Number(router.query.id))
    if (!clienteFind) return router.push('/clientes/read')
    setCliente(clienteFind)
  }, [clientes])

  useEffect(() => {
    if (!cliente) return
    getCuestionarios()
      .then((data) => {
        setCuestionariosState(data)
      })
  }, [cliente])

  return (
    <>
      {cliente
        ? (
          <div className='card'>
            <div className='card-body'>
              <ClienteInfo cliente={cliente} />
              {!cuestionarioSelected
                ? (<CuestionariosRespondidos idCliente={cliente.id} cuestionariosState={cuestionariosState} setCuestionarioSelected={setCuestionarioSelected} />)
                : (<CuestionarioInfo cuestionario={cuestionarioSelected} setCuestionarioSelected={setCuestionarioSelected} />)}
            </div>
          </div>
          )
        : null}
    </>
  )
}

function ClienteInfo ({ cliente }) {
  return (
    <div className='table-responsive'>
      <table className='table table-sm table-bordered table-leidy text-center'>
        <thead>
          <tr>
            <th>DOCUMENTO</th>
            <th>Primer Nombre</th>
            <th>Segundo Nombre</th>
            <th>Primer Apellido</th>
            <th>Segundo Apellido</th>
            <th>Telefono</th>
            <th>E-mail</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{cliente.cedula}</td>
            <td>{cliente.primerNombre}</td>
            <td>{cliente.segundoNombre}</td>
            <td>{cliente.primerApellido}</td>
            <td>{cliente.segundoApellido}</td>
            <td>{cliente.telefono}</td>
            <td>{cliente.email}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function CuestionariosRespondidos ({ idCliente, cuestionariosState, setCuestionarioSelected }) {
  const [cuestionarios, setCuestionarios] = useState([])

  useEffect(() => {
    if (!idCliente) return
    if (cuestionariosState.length === 0) return

    const cuestionariosRespondidos = cuestionariosState.filter((cuestionario) => cuestionario.id_cliente === idCliente)
    // unificar por id_encuesta
    const cuestionariosUnificados = cuestionariosRespondidos.reduce((acc, cuestionario) => {
      const index = acc.findIndex((item) => item.id_encuesta === cuestionario.id_encuesta)
      if (index === -1) {
        acc.push(cuestionario)
      }
      return acc
    }, [])
    setCuestionarios(cuestionariosUnificados)
  }, [idCliente, cuestionariosState])

  const handleVer = (id_encuesta) => {
    const cuestionario = cuestionariosState.filter((cuestionario) => cuestionario.id_encuesta === id_encuesta && cuestionario.id_cliente === idCliente)
    setCuestionarioSelected(cuestionario)
  }

  return (
    <div className='table-responsive'>
      <table className='table table-sm table-bordered table-leidy text-center mt-2'>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Cuestionario</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {cuestionarios.map((cuestionario) => (
            <tr key={cuestionario.id}>
              <td>{moment(cuestionario.createdAt).format('DD/MM/YYYY')}</td>
              <td>{cuestionario.tituloCuestionario}</td>
              <td>
                <div className='btn-group'>
                  <button
                    type='button'
                    className='btn btn-sm btn-outline-primary'
                    onClick={() => handleVer(cuestionario.id_encuesta)}
                  >
                    <i className='bi bi-eye-fill' />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CuestionarioInfo ({ cuestionario, setCuestionarioSelected }) {
  const [tituloCuestionario, setTituloCuestionario] = useState('')

  useEffect(() => {
    if (!cuestionario.length === 0) return
    setTituloCuestionario(cuestionario[0].tituloCuestionario)
  }, [cuestionario])
  return (
    <>
      <div className='d-flex justify-content-between'>
        <h4>
          {tituloCuestionario}
        </h4>
        <button
          type='button'
          className='btn btn-sm btn-outline-primary d-print-none'
          onClick={() => setCuestionarioSelected(null)}
        >
          <i className='bi bi-arrow-left-circle-fill' />
        </button>
      </div>

      <hr />

      <table className='table table-sm table-bordered table-leidy text-center'>
        <thead>
          <tr>
            <td>Pregunta</td>
            <td>Respuesta</td>
          </tr>
        </thead>
        <tbody>
          {cuestionario.map((cuestionario) => <CuestionarioItem key={cuestionario.id} cuestionario={cuestionario} />)}
        </tbody>
      </table>

      {/* imprimir button centrado */}
      <div className='d-flex justify-content-center d-print-none'>
        <button
          type='button'
          className='btn btn-warning'
          onClick={() => window.print()}
        >
          <i className='bi bi-printer-fill' />
        </button>
      </div>
    </>
  )
}

function CuestionarioItem ({ cuestionario }) {
  const { preguntas } = preguntasState()
  const [formatRrespuesta, setFormatRespuesta] = useState('')

  useEffect(() => {
    if (!cuestionario) return
    const pregunta = preguntas.find((pregunta) => pregunta.id === cuestionario.id_pregunta)
    if (pregunta.isFecha) {
      return setFormatRespuesta(moment(cuestionario.respuesta).format('MM/DD/YYYY'))
    }
    return setFormatRespuesta(cuestionario.respuesta)
  }, [cuestionario])

  return (
    <tr>
      <td>{cuestionario.pregunta}</td>
      <td>{formatRrespuesta}</td>
    </tr>
  )
}
