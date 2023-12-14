import React, { useCallback, useEffect, useState } from 'react'

import protectedRoute from '@/lib/auth/protectedRoute'
import ConstruirMenu from '@/components/ConstruirMenu'
import { menuEncuestas } from './read'
import InputControl from '@/components/formControls/InputControl'
import { ReactSwal, Swaly } from '@/lib/toastSwal'
import { useRouter } from 'next/router'
import preguntasState from '@/lib/store/preguntas'
import { useCuestionario, useCuestionarioCreate } from '@/lib/store/cuestionarios'

export const getServerSideProps = protectedRoute()

export default function encuestasCreate () {
  const router = useRouter()
  const { id } = router.query
  const [initialCuestionario, setInitialCuestionario] = useState()
  const { cuestionario } = useCuestionario(id)

  useEffect(() => {
    if (!cuestionario) return
    setInitialCuestionario(cuestionario)
  }, [cuestionario])

  return (
    <>
      <ConstruirMenu menu={menuEncuestas} />
      <div className='card'>
        <div className='card-header'>
          <h4 className='card-title'>Crear Cuestionario</h4>
        </div>
        <div className='card-body'>
          <FormCreateEncuestas initialCuestionario={initialCuestionario} />
        </div>
      </div>
    </>
  )
}

function FormCreateEncuestas ({ initialCuestionario }) {
  const INITIAL_FORM = {
    titulo: ''
  }
  const { preguntas: preguntasDisponibles } = preguntasState()
  const [form, setForm] = useState(INITIAL_FORM)
  const [preguntas, setPreguntas] = useState([])
  const [preguntasComponent, setPreguntasState] = useState([])
  const router = useRouter()
  const { createCuestionario, isLoading: isLoadingCreate } = useCuestionarioCreate()

  useEffect(() => {
    if (!preguntasDisponibles.length) return
    setPreguntasState(preguntasDisponibles)
  }, [preguntasDisponibles])

  useEffect(() => {
    if (!initialCuestionario) return
    if (preguntasDisponibles.length === 0) return
    setForm({ titulo: initialCuestionario.titulo })
    const formatPreguntas = initialCuestionario.data.map(e => {
      const pregunta = preguntasDisponibles.find(pregunta => pregunta.id === e.id_pregunta)
      let cadena = []
      if (pregunta.id_pregCadena) {
        cadena = agregarPreguntasCadenas(pregunta.id_pregCadena, cadena)
      }
      return {
        id_pregunta: pregunta.id,
        pregunta: pregunta.titulo,
        isCadena: false,
        cadena
      }
    })
    setPreguntas(formatPreguntas)
  }, [initialCuestionario, preguntasDisponibles])

  useEffect(() => {
    if (preguntas.length === 0) return
    // eliminar de disponibles preguntas ya usadas
    const preguntasUsadas = preguntas.map(pregunta => pregunta.id_pregunta)
    const preguntasDisponiblesNew = preguntasComponent.filter(pregunta => !preguntasUsadas.includes(pregunta.id))
    setPreguntasState(preguntasDisponiblesNew)
  }, [preguntas])

  const agregarPreguntasCadenas = (id_pregunta, cadena) => {
    const preguntaCadena = preguntasDisponibles.find(preguntaF => preguntaF.id === id_pregunta)
    if (preguntaCadena) {
      cadena.push(preguntaCadena.titulo)
      if (preguntaCadena.id_pregCadena) {
        cadena = agregarPreguntasCadenas(preguntaCadena.id_pregCadena, cadena)
      }
    }
    return cadena
  }

  // const fetchPreguntas = useCallback(async () => {
  //   try {
  //     const { data } = await axios.get('/api/preguntas')
  //     if (data.length === 0) throw new Error('No hay preguntas disponibles')
  //     setPreguntasDisponibles(data)
  //     setPreguntasState(data)
  //   } catch (error) {
  //     console.log(error)
  //     ReactSwal.fire({
  //       icon: 'error',
  //       text: JSON.stringify(error?.response?.data) || JSON.stringify(error?.message) || 'Error al cargar las preguntas'
  //     })
  //   }
  // }, [])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (form.titulo === '') return Swaly.fire({ icon: 'error', text: 'Ingrese el titulo del cuestionario' })
    if (preguntas.length === 0) return Swaly.fire({ icon: 'error', text: 'Ingrese al menos una pregunta' })

    createCuestionario({
      titulo: form.titulo,
      preguntas: preguntas.filter(p => p.isCadena === false),
      update: initialCuestionario ? initialCuestionario.id : null
    })
    router.push('/encuestas/read')

    // try {
    //   await axios.post('/api/encuestas', {
    //     titulo: form.titulo,
    //     preguntas: preguntas.filter(p => p.isCadena === false),
    //     update: initialCuestionario ? initialCuestionario.id : null
    //   })
    //   Swaly.fire({
    //     icon: 'success',
    //     text: initialCuestionario ? 'Cuestionario actualizado' : 'Cuestionario creado'
    //   })
    //     .then((r) => {
    //       if (r.isDismissed || r.isConfirmed) {
    //         // reloadService()
    //         router.push('/encuestas/read')
    //       }
    //     })
    // } catch (error) {
    //   console.log(error)
    //   Swaly.fire({
    //     icon: 'error',
    //     text: JSON.stringify(error?.response?.data) || JSON.stringify(error?.message) || 'Error al crear la encuesta'
    //   })
    // }
  }, [form, preguntas])

  return (
    <form onSubmit={handleSubmit} autoComplete='off' className='d-flex flex-column gap-2'>
      <div className='row'>
        <div className='col-sm-6 col-2'>
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
          <TablePreguntas preguntas={preguntas} setPreguntas={setPreguntas} preguntasDisponibles={preguntasDisponibles} preguntasState={preguntasComponent} />
        </div>
      </div>
      <div className='row'>
        <div className='col-sm-12'>
          <button
            type='submit' className='btn btn-primary'
            disabled={isLoadingCreate}
          >Guardar
          </button>
        </div>
      </div>
    </form>

  )
}

function TablePreguntas ({ preguntas, setPreguntas, preguntasDisponibles, preguntasState }) {
  const INITIAL_VALUE = {
    id_pregunta: '',
    pregunta: ''
  }
  const [form, setForm] = useState(INITIAL_VALUE)

  const handleBuscarPregunta = useCallback((e) => {
    e.preventDefault()
    if (preguntasState.length === 0) {
      return ReactSwal.fire({
        icon: 'error',
        text: 'No hay preguntas disponibles'
      })
    }
    ReactSwal.fire({
      html: <BuscarPreguntas preguntas={preguntasDisponibles} setForm={setForm} preguntasState={preguntasState} />
    })
  }, [preguntasState])

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
    const newPregunta = {
      id_pregunta: pregunta.id,
      pregunta: pregunta.titulo,
      isCadena: false,
      cadena: []
    }
    let cadena = []
    if (pregunta.id_pregCadena) {
      cadena = agregarPreguntasCadenas(pregunta.id_pregCadena, cadena)
    }
    newPregunta.cadena = cadena
    setPreguntas([...preguntas, newPregunta])

    setForm(INITIAL_VALUE)
  }, [form, preguntas])

  const agregarPreguntasCadenas = (id_pregunta, cadena) => {
    const preguntaCadena = preguntasDisponibles.find(preguntaF => preguntaF.id === id_pregunta)
    if (preguntaCadena) {
      cadena.push(preguntaCadena.titulo)
      if (preguntaCadena.id_pregCadena) {
        cadena = agregarPreguntasCadenas(preguntaCadena.id_pregCadena, cadena)
      }
    }
    return cadena
  }

  const handleEliminarPregunta = (id_pregunta) => {
    let newPreguntas = preguntas.filter(pregunta => pregunta.id_pregunta !== id_pregunta)
    const preguntaFind = preguntasDisponibles.find(preguntaF => preguntaF.id === id_pregunta)
    if (preguntaFind.id_pregCadena) {
      newPreguntas = quitarPreguntasCadenas(preguntaFind.id_pregCadena, newPreguntas)
    }
    setPreguntas(newPreguntas)
  }

  const quitarPreguntasCadenas = (id_pregunta, newPreguntas) => {
    const preguntaCadena = preguntasDisponibles.find(preguntaF => preguntaF.id === id_pregunta)
    if (preguntaCadena) {
      newPreguntas = newPreguntas.filter(pregunta => pregunta.id_pregunta !== preguntaCadena.id)
      if (preguntaCadena.id_pregCadena) {
        newPreguntas = quitarPreguntasCadenas(preguntaCadena.id_pregCadena, newPreguntas)
      }
    }
    return newPreguntas
  }

  const handleSubirPregunta = (id_pregunta) => {
    const index = preguntas.findIndex(pregunta => pregunta.id_pregunta === id_pregunta)
    if (index === 0) return
    const pregunta = preguntas[index]
    const newPreguntas = preguntas.filter(pregunta => pregunta.id_pregunta !== id_pregunta)
    newPreguntas.splice(index - 1, 0, pregunta)
    setPreguntas(newPreguntas)
  }

  const handleBajarPregunta = (id_pregunta) => {
    const index = preguntas.findIndex(pregunta => pregunta.id_pregunta === id_pregunta)
    if (index === preguntas.length - 1) return
    const pregunta = preguntas[index]
    const newPreguntas = preguntas.filter(pregunta => pregunta.id_pregunta !== id_pregunta)
    newPreguntas.splice(index + 1, 0, pregunta)
    setPreguntas(newPreguntas)
  }

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
            <td className='d-flex flex-column'>
              <div>
                {pregunta.pregunta} {' '}
                <span className='badge bg-success'>
                  <i className='bi bi-question-circle-fill' />
                </span>
              </div>
              {pregunta.cadena.map((preguntaCadena, index) => (
                <div key={index}>
                  <span className='badge bg-warning'>
                    <i className='bi bi-link' />
                  </span>
                  {' '}{preguntaCadena}
                </div>
              ))}
            </td>
            <td>
              <div className='btn-group'>
                <button
                  type='button'
                  className='btn btn-sm btn-danger'
                  onClick={() => handleEliminarPregunta(pregunta.id_pregunta)}
                >
                  <i className='bi bi-trash-fill' />
                </button>
                {/* Subir Pregunta */}
                <button
                  type='button'
                  className='btn btn-sm btn-secondary'
                  onClick={() => handleSubirPregunta(pregunta.id_pregunta)}
                >
                  <i className='bi bi-arrow-up-circle-fill' />
                </button>
                {/* Bajar Pregunta */}
                <button
                  type='button'
                  className='btn btn-sm btn-secondary'
                  onClick={() => handleBajarPregunta(pregunta.id_pregunta)}
                >
                  <i className='bi bi-arrow-down-circle-fill' />
                </button>
              </div>
            </td>

          </tr>
        ))}
      </tbody>
    </table>
  )
}

function BuscarPreguntas ({ preguntas: preguntasState, setForm, preguntasState: preguntasStateAll }) {
  const [preguntas, setPreguntas] = useState([])
  const [buscador, setBuscador] = useState('')

  useEffect(() => {
    const preguntasPrincipales = preguntasStateAll.filter(pregunta => {
      const isCadena = preguntasState.find(preguntaCadena => preguntaCadena.id_pregCadena === pregunta.id)
      if (isCadena) {
        return false
      }
      return pregunta
    }).reverse()
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
