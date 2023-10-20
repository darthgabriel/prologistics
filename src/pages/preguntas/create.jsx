import InputControl from '@/components/formControls/InputControl'
import RadioControl from '@/components/formControls/RadioControl'
import { Swaly } from '@/lib/toastSwal'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'

import ConstruirMenu from '@/components/ConstruirMenu'
import { menuPreguntas } from './read'
import { useRouter } from 'next/router'
import CheckControl from '@/components/formControls/CheckControl'

import protectedRoute from '@/lib/auth/protectedRoute'
export const getServerSideProps = protectedRoute()

export default function preguntasCreate () {
  const router = useRouter()
  const { query } = router
  const [initialValues, setInitialValues] = useState({})

  useEffect(() => {
    if (!query?.id) return
    setInitialValues(query)
  }, [query])

  return (
    <>
      <ConstruirMenu menu={menuPreguntas} />
      <div className='card'>
        <div className='card-header'>
          <h4 className='card-title'>Crear Pregunta</h4>
        </div>
        <div className='card-body'>
          <FormCreatePregunta initialValues={initialValues} />
        </div>
      </div>
    </>
  )
}

function FormCreatePregunta ({ initialValues = {} }) {
  const router = useRouter()
  const INITIAL_FORM = {
    titulo: '',
    isTexto: true,
    isFecha: false,
    isSeleccion: false,
    obligatoria: true,
    seleccion: []
  }
  const [form, setForm] = useState(INITIAL_FORM)
  const [encadenarPreg, setEncadenarPreg] = useState(false)

  useEffect(() => {
    if (!initialValues?.id) return
    // este formulario se convierte en el formulario de edicion
    const { titulo, isTexto, isFecha, isSeleccion, obligatoria, seleccion } = initialValues
    setForm({
      titulo,
      isTexto: isTexto === 'true',
      isFecha: isFecha === 'true',
      isSeleccion: isSeleccion === 'true',
      obligatoria: obligatoria === 'true',
      seleccion: seleccion || [],
      id_pregCadena: initialValues?.id_pregCadena || null,
      titulo_pregCadena: initialValues?.titulo_pregCadena || null
    })
    setEncadenarPreg(initialValues?.id_pregCadena)
  }, [initialValues])

  useEffect(() => {
    // verifica los is si alguno esta true los demas van false convertir el string a booleano
    const isTexto = form.isTexto === 'on'
    const isFecha = form.isFecha === 'on'
    const isSeleccion = form.isSeleccion === 'on'
    // si alguno es true los demas van false
    if (isTexto) {
      setForm({ ...form, isTexto, isFecha: false, isSeleccion: false })
      setEncadenarPreg(false)
    }
    if (isFecha) {
      setForm({ ...form, isTexto: false, isFecha, isSeleccion: false })
      setEncadenarPreg(false)
    }
    if (isSeleccion) {
      setForm({ ...form, isTexto: false, isFecha: false, isSeleccion })
    }
  }, [form])

  const handleChange = (e) => {
    const { name, value, checked } = e.target
    if (name === 'obligatoria') {
      return setForm({ ...form, [name]: checked })
    }
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // si tiene id es una actualizacion form
    if (initialValues?.id) return updateFunction(form, initialValues.id)
    return createFunction(form)
  }

  const createFunction = useCallback(async (form) => {
    try {
      await axios.post('/api/preguntas', form)
      Swaly.fire({
        icon: 'success',
        title: 'Pregunta Creada!'
      })
      setForm(INITIAL_FORM)
      setEncadenarPreg(false)
    } catch (error) {
      console.log(error)
      Swaly.fire({
        icon: 'error',
        text: JSON.stringify(error?.response?.data) || 'Error al crear la pregunta'
      })
    }
  }, [])

  const updateFunction = useCallback(async (form, id) => {
    try {
      await axios.put('/api/preguntas', { ...form, id: Number(id) })
      Swaly.fire({
        icon: 'success',
        title: 'Pregunta Actualizada!'
      })
        .then(() => router.push('/preguntas/read'))
    } catch (error) {
      console.log(error)
      Swaly.fire({
        icon: 'error',
        text: JSON.stringify(error?.response?.data) || 'Error al actualizar la pregunta'
      })
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} autoComplete='off'>
      <div className='row'>
        <div className='col-sm-4'>
          <InputControl label='Titulo' name='titulo' value={form.titulo} onChange={handleChange} />
        </div>
        <div className='col-sm'>
          <label className='form-label'>Tipo de Pregunta</label>
          <RadioControl label='Texto' name='isTexto' checked={form.isTexto} onChange={handleChange} />
          <RadioControl label='Fecha' name='isFecha' checked={form.isFecha} onChange={handleChange} />
          <RadioControl label='Seleccion' name='isSeleccion' checked={form.isSeleccion} onChange={handleChange} />
        </div>
        <div className='col-sm-2'>
          <label className='form-label'>¿Obligatoria?</label>
          <CheckControl label='Obligatoria' name='obligatoria' checked={form.obligatoria} onChange={handleChange} />
        </div>
        {form.isSeleccion
          ? (
            <div className='col-sm-2'>
              <label className='form-label'>Encadenar Pregunta</label>
              <CheckControl label='encadenar' name='encadenar' checked={encadenarPreg} onChange={() => setEncadenarPreg(!encadenarPreg)} />
            </div>
            )
          : null}
      </div>
      <div className='row'>
        <div className='col-sm m-2'>
          {form.isSeleccion && <SeleccionesForm form={form} setForm={setForm} />}
        </div>
      </div>
      {encadenarPreg
        ? (
          <EncadenarPregunta setForm={setForm} form={form} />
          )
        : null}
      <div className='row'>
        <button className='btn btn-primary' type='submit'>
          Guardar
        </button>
      </div>
    </form>
  )
}

function SeleccionesForm ({ form, setForm }) {
  const [seleccion, setSeleccion] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (!seleccion) return
    setForm({ ...form, seleccion: [...form.seleccion, seleccion] })
    setSeleccion('')
  }

  const handleDelete = (index) => {
    setForm({ ...form, seleccion: form.seleccion.filter((_, i) => i !== index) })
  }

  return (
    <div className='row text-center'>
      <div className='col-sm-6'>
        <label className='form-label'>Opciones</label>
        <div className='input-group'>
          <InputControl name='seleccion' value={seleccion} onChange={(e) => setSeleccion(e.target.value)} />
          <button className='btn btn-primary' onClick={handleAdd}>
            Agregar
          </button>
        </div>
      </div>
      <div className='col-sm-6'>
        <label className='form-label'>Lista de Opciones</label>
        <ul className='list-group'>
          {form.seleccion?.map((item, index) => (
            <li className='list-group-item d-flex justify-content-between align-items-center' key={index}>
              {item}
              {index === 0 && form?.id_pregCadena ? (<span className='badge bg-primary rounded-pill'>Condicion para el Encadenamiento</span>) : null}
              <button
                type='button'
                className='btn btn-danger'
                onClick={() => handleDelete(index)}
              >
                <i className='bi bi-trash' />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function EncadenarPregunta ({ setForm, form }) {
  const handleBuscarPregunta = async (e) => {
    e.preventDefault()
    try {
      if (!form.titulo) {
        return Swaly.fire({
          icon: 'warning',
          text: 'Debe crear un titulo primero'
        })
      }
      if (!form.seleccion.length >= 2) {
        return Swaly.fire({
          icon: 'warning',
          text: 'Debe crear al menos dos opcion'
        })
      }
      const { data } = await axios.get('/api/preguntas')
      const preguntasDisp = data.filter((pregunta) => pregunta.titulo !== String(form.titulo).toLowerCase().trim())
      const pNoEncadenadas = preguntasDisp.filter((p) => p.id_pregCadena === null)
      // preguntas q no son cadenas
      const preguntasLibres = pNoEncadenadas.filter((p) => {
        const verfNoUsada = preguntasDisp.find((p2) => p2.id_pregCadena === p.id)
        if (verfNoUsada) return false
        return true
      })

      const { value: pregunta } = await Swaly.fire({
        title: 'Seleccione la pregunta a encadenar',
        input: 'select',
        inputOptions: preguntasLibres.reduce((acc, pregunta) => {
          acc[pregunta.id] = pregunta.titulo
          return acc
        }, {})
      })
      if (!pregunta) return
      const preguntaElegida = preguntasDisp.find((p) => p.id === Number(pregunta))
      setForm({ ...form, id_pregCadena: preguntaElegida.id, titulo_pregCadena: preguntaElegida.titulo })
    } catch (error) {
      console.log(error)
      Swaly.fire({
        icon: 'error',
        text: JSON.stringify(error?.response?.data) || 'Error al buscar las preguntas'
      })
    }
  }

  return (
    <div className='row my-3'>
      <div className='col-sm d-flex flex-column gap-2'>
        <label className='form-label'>Encadenar Pregunta</label>
        {!form?.id_pregCadena
          ? (
            <button
              type='button'
              className='btn btn-outline-primary btn-sm'
              onClick={handleBuscarPregunta}
            >
              <i className='bi bi-search mx-2' />
              <span>Buscar Pregunta a Encadenar</span>
            </button>
            )
          : (
            <div>
              <span className='fw-bold'>{form.id_pregCadena}</span>
              <span className='mx-2'>{form.titulo_pregCadena}</span>
              <button
                type='button'
                className='btn btn-outline-danger btn-sm'
                onClick={() => setForm({ ...form, id_pregCadena: null, titulo_pregCadena: null })}
              >
                <i className='bi bi-trash' />
              </button>
            </div>
            )}
      </div>
    </div>
  )
}
