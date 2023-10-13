import React, { useCallback, useEffect, useState } from 'react'

import protectedRoute from '@/lib/auth/protectedRoute'
import ConstruirMenu from '@/components/ConstruirMenu'
import { menuEncuestas } from './read'
import InputControl from '@/components/formControls/InputControl'
import { ReactSwal, Swaly } from '@/lib/toastSwal'
import axios from 'axios'
export const getServerSideProps = protectedRoute()

export default function encuestasCreate () {
  return (
    <>
      <ConstruirMenu menu={menuEncuestas} />
      <div className='card'>
        <div className='card-header'>
          <h4 className='card-title'>Crear Cuestionario</h4>
        </div>
        <div className='card-body'>
          <FormCreateEncuestas />
        </div>
      </div>
    </>
  )
}

function FormCreateEncuestas () {
  const INITIAL_FORM = {
    titulo: ''
  }
  const [form, setForm] = useState(INITIAL_FORM)
  const [preguntas, setPreguntas] = useState([])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (form.titulo === '') return Swaly.fire({ icon: 'error', text: 'Ingrese el titulo del cuestionario' })
    if (preguntas.length === 0) return Swaly.fire({ icon: 'error', text: 'Ingrese al menos una pregunta' })
    try {
      await axios.post('/api/encuestas', {
        titulo: form.titulo,
        preguntas: preguntas.filter(p => p.isCadena === false)
      })
      Swaly.fire({
        icon: 'success',
        text: 'Cuestionario creado correctamente'
      })
      setForm(INITIAL_FORM)
      setPreguntas([])
    } catch (error) {
      console.log(error)
      Swaly.fire({
        icon: 'error',
        text: JSON.stringify(error?.response?.data) || JSON.stringify(error?.message) || 'Error al crear la encuesta'
      })
    }
  }, [form, preguntas])

  return (
    <form onSubmit={handleSubmit} autoComplete='off' className='d-flex flex-column gap-2'>
      <div className='row'>
        <div className='col-sm-2'>
          <InputControl
            label='Titulo para el Cuestionario'
            name='titulo'
            value={form.titulo}
            onChange={e => setForm({ ...form, titulo: e.target.value })}
          />
        </div>
      </div>
      <div className='row'>
        <div className='col-sm-12'>
          <h4>Preguntas</h4>
          <TablePreguntas preguntas={preguntas} setPreguntas={setPreguntas} />
        </div>
      </div>
      <div className='row'>
        <div className='col-sm-12'>
          <button type='submit' className='btn btn-primary'>Guardar</button>
        </div>
      </div>
    </form>

  )
}

function TablePreguntas ({ preguntas, setPreguntas }) {
  const INITIAL_VALUE = {
    id_pregunta: '',
    pregunta: ''
  }
  const [form, setForm] = useState(INITIAL_VALUE)
  const [preguntasDisponibles, setPreguntasDisponibles] = useState([])

  useEffect(() => {
    fetchPreguntas()
  }, [])

  const fetchPreguntas = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/preguntas')
      if (data.length === 0) throw new Error('No hay preguntas disponibles')
      setPreguntasDisponibles(data)
    } catch (error) {
      console.log(error)
      ReactSwal.fire({
        icon: 'error',
        text: JSON.stringify(error?.response?.data) || JSON.stringify(error?.message) || 'Error al cargar las preguntas'
      })
    }
  }, [])

  const handleBuscarPregunta = useCallback((e) => {
    e.preventDefault()
    if (preguntasDisponibles.length === 0) {
      return ReactSwal.fire({
        icon: 'error',
        text: 'No hay preguntas disponibles'
      })
    }
    ReactSwal.fire({
      html: <BuscarPreguntas preguntas={preguntasDisponibles} setForm={setForm} />
    })
  }, [preguntasDisponibles])

  const handleAddPregunta = useCallback(() => {
    if (form.id_pregunta === null) {
      return ReactSwal.fire({
        icon: 'error',
        text: 'Seleccione una pregunta'
      })
    }
    if (preguntas.find(pregunta => pregunta.id_pregunta === form.id_pregunta)) {
      return ReactSwal.fire({
        icon: 'error',
        text: 'La pregunta ya fue agregada'
      })
    }
    const pregunta = preguntasDisponibles.find(pregunta => pregunta.id === form.id_pregunta)
    if (pregunta.id_pregCadena) {
      const preguntaCadena = preguntasDisponibles.find(preguntaF => preguntaF.id === pregunta.id_pregCadena)
      setPreguntas([...preguntas, {
        id_pregunta: pregunta.id,
        pregunta: pregunta.titulo,
        isCadena: false
      }, {
        id_pregunta: preguntaCadena.id,
        pregunta: preguntaCadena.titulo,
        isCadena: true
      }])
    } else {
      setPreguntas([...preguntas, {
        id_pregunta: pregunta.id,
        pregunta: pregunta.titulo,
        isCadena: false
      }])
    }
    setForm(INITIAL_VALUE)
  }, [form, preguntas])

  const handleEliminarPregunta = useCallback((id_pregunta) => {
    const preguntaFind = preguntasDisponibles.find(preguntaF => preguntaF.id === id_pregunta)
    const preguntaCadena = preguntasDisponibles.find(preguntaF => preguntaF.id === preguntaFind.id_pregCadena)
    const newPreguntas = preguntas.filter(pregunta => pregunta.id_pregunta !== id_pregunta && pregunta.id_pregunta !== preguntaCadena?.id)
    setPreguntas(newPreguntas)
  }, [preguntas])

  return (
    <table className='table table-sm table-bordered table-leidy text-center'>
      <thead>
        <tr>
          <th className='col-sm-1'># ID Pregunta</th>
          <th>Pregunta</th>
          <th className='col-sm-2' />
        </tr>
        <tr>
          <th>
            <input type='text' className='form-control' value={form.id_pregunta} readOnly />
          </th>
          <th>
            <input type='text' className='form-control' value={form.pregunta} readOnly onClick={handleBuscarPregunta} />
          </th>
          <th>
            <button
              type='button' className='btn btn-sm btn-outline-secondary'
              onClick={handleAddPregunta}
            >
              <i className='bi bi-plus-circle-fill' />
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {preguntas.map((pregunta, index) => (
          <tr key={index}>
            <td>{pregunta.id_pregunta}</td>
            <td>{pregunta.pregunta} {' '}
              {!pregunta.isCadena
                ? (
                  <span className='badge bg-success'>
                    <i className='bi bi-question-circle-fill' />
                  </span>
                  )
                : (
                  <span className='badge bg-warning'>
                    <i className='bi bi-link' />
                  </span>
                  )}
            </td>
            <td>
              <div className='btn-group'>
                {pregunta.isCadena
                  ? ''
                  : (
                    <button
                      type='button'
                      className='btn btn-sm btn-danger' onClick={() => handleEliminarPregunta(pregunta.id_pregunta)}
                    >
                      <i className='bi bi-trash-fill' />
                    </button>
                    )}
              </div>
            </td>

          </tr>
        ))}
      </tbody>
    </table>
  )
}

function BuscarPreguntas ({ preguntas: preguntasState, setForm }) {
  const [preguntas, setPreguntas] = useState([])
  const [buscador, setBuscador] = useState('')

  useEffect(() => {
    const preguntasPrincipales = preguntasState.filter(pregunta => {
      const isCadena = preguntasState.find(preguntaCadena => preguntaCadena.id_pregCadena === pregunta.id)
      if (isCadena) {
        return false
      }
      return pregunta
    })
    setPreguntas(preguntasPrincipales)
  }, [preguntasState])

  const handleSelectPregunta = useCallback((pregunta) => {
    setForm({
      id_pregunta: pregunta.id,
      pregunta: pregunta.titulo
    })
    ReactSwal.close()
  }, [])

  return (
    <table className='table table-sm table-bordered table-leidy text-center'>
      <thead>
        <tr>
          <th className='col-sm-1'># ID Pregunta</th>
          <th>Pregunta</th>
          <th className='col-sm-2' />
        </tr>
        <tr>
          <th>
            <input type='text' className='form-control' readOnly />
          </th>
          <th>
            <input type='text' className='form-control' value={buscador} onChange={e => setBuscador(e.target.value)} />
          </th>
          <th>
            <div className='btn-group'>

              <button
                type='button' className='btn btn-sm btn-outline-secondary'
                onClick={() => setPreguntas(preguntasState.filter(pregunta => pregunta.titulo.includes(buscador)))}
              >
                <i className='bi bi-search' />
              </button>
              <button
                type='button' className='btn btn-sm btn-outline-secondary'
                onClick={() => setPreguntas(preguntasState)}
              >
                <i className='bi bi-arrow-counterclockwise' />
              </button>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {preguntas.map((pregunta, index) => (
          <tr key={index}>
            <td>{pregunta.id}</td>
            <td>{pregunta.titulo}</td>
            <td>
              <div className='btn-group'>
                <button
                  className='btn btn-sm btn-outline-secondary' onClick={() => handleSelectPregunta(pregunta)}
                >
                  <i className='bi bi-check-circle-fill' />
                </button>

              </div>
            </td>

          </tr>
        ))}
      </tbody>
    </table>
  )
}
