import InputControl from '@/components/formControls/InputControl'
import { Swaly } from '@/lib/toastSwal'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

export default function cuestionariosCreate () {
  const router = useRouter()
  const { id } = router.query

  const [cuestionario, setCuestionario] = useState()
  const [cliente, setCliente] = useState()
  const [cuestResp, setcuestResp] = useState([])

  useEffect(() => {
    if (!id) return
    fetchCuestionario()
  }, [id])

  const fetchCuestionario = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/encuestas/')
      setCuestionario(data.find((item) => item.id === Number(id)))
    } catch (error) {
      console.log(error)
      Swaly.fire({
        icon: 'error',
        text: JSON.stringify(error?.response?.data) || JSON.stringify(error?.message) || 'Error al cargar'
      })
    }
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    // verificar que todos los campos de clientes esten llenos
    if (Object.values(cliente).includes('')) {
      return Swaly.fire({
        icon: 'error',
        text: 'Todos los campos del cliente son obligatorios'
      })
    }

    // verificar que todos los campos de cuestionario esten llenos
    const respuestasObligatorias = cuestResp.filter(item => item.obligatoria === true && item.respuesta === '')
    if (respuestasObligatorias.length > 0) {
      return Swaly.fire({
        icon: 'error',
        text: 'Todos los campos del cuestionario son obligatorios'
      })
    }

    try {
      await axios.post('/api/cuestionarios/', { id, cliente, cuestResp })
      Swaly.fire({
        icon: 'success',
        text: 'Cuestionario guardado, nos contactaremos con ud pronto'
      })
        .then((r) => {
          if (r.isDismissed || r.isConfirmed) {
            router.push('/')
          }
        })
    } catch (error) {
      console.log(error)
      Swaly.fire({
        icon: 'error',
        text: JSON.stringify(error?.response?.data) || JSON.stringify(error?.message) || 'Error al guardar'
      })
    }
  }

  return (
    <>
      {cuestionario
        ? (
          <div className='d-flex flex-column gap-3'>
            <FormCliente setCliente={setCliente} />
            <FormCuestionario cuestionario={cuestionario} setcuestResp={setcuestResp} />
            <button
              type='button'
              className='btn btn-primary'
              onClick={handleSubmit}
            >
              Guardar Cuestionario {' '}
              <i className='bi bi-save' />
            </button>
          </div>
          )
        : null}
    </>
  )
}

export function FormCliente ({ setCliente }) {
  const [datos, setDatos] = useState({
    cedula: '',
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    telefono: '',
    email: ''
  })

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    setCliente(datos)
  }, [datos])

  return (
    <div className='card'>
      <div className='card-header'>
        Datos del cliente
      </div>
      <div className='card-body'>
        <div className='row row-cols-1 row-cols-lg-4 g-2 g-lg-3'>
          <div className='col'>
            <InputControl label='ALIEN / SOCIAL / PASSSPORT' name='cedula' type='number' onChange={handleChange} />
          </div>
          <div className='col'>
            <InputControl label='Primer Nombre' name='primerNombre' type='text' onChange={handleChange} />
          </div>
          <div className='col'>
            <InputControl label='Segundo Nombre' name='segundoNombre' type='text' onChange={handleChange} />
          </div>
          <div className='col'>
            <InputControl label='Primer Apellido' name='primerApellido' type='text' onChange={handleChange} />
          </div>
          <div className='col'>
            <InputControl label='Segundo Apellido' name='segundoApellido' type='text' onChange={handleChange} />
          </div>
          <div className='col'>
            <InputControl label='Telefono' name='telefono' type='text' onChange={handleChange} />
          </div>
          <div className='col'>
            <InputControl label='Email' name='email' type='email' onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  )
}

function FormCuestionario ({ cuestionario, setcuestResp }) {
  const [preguntasState, setPreguntasState] = useState()

  useEffect(() => {
    fetchPreguntas()
  }, [])

  const fetchPreguntas = async () => {
    try {
      const { data } = await axios.get('/api/preguntas/')
      setPreguntasState(data)
    } catch (error) {
      console.log(error)
      Swaly.fire({
        icon: 'error',
        text: JSON.stringify(error?.response?.data) || JSON.stringify(error?.message) || 'Error al cargar'
      })
    }
  }

  if (preguntasState === undefined) return null

  return (
    <div className='card'>
      <div className='card-header'>
        {cuestionario.titulo}
      </div>
      <div className='card-body'>
        <div className='row row-cols-1 row-cols-lg-4 g-2 g-lg-3'>
          {cuestionario.data.map((pregunta, index) => {
            return (
              <div className='col' key={index}>
                <PreguntaRender idPregunta={pregunta.id_pregunta} setcuestResp={setcuestResp} preguntasState={preguntasState} />
              </div>
            )
          }
          )}
        </div>
      </div>
    </div>
  )
}

export function PreguntaRender ({ idPregunta, setcuestResp, preguntasState }) {
  const pregunta = preguntasState.find(item => item.id === idPregunta)
  const [pregCadena, setPregCadena] = useState(false)
  const [respuesta, setRespuesta] = useState()

  useEffect(() => {
    if (pregunta.id_pregCadena) {
      setPregCadena(true)
    }
    setcuestResp(prev => {
      const resp = [...prev]
      const index = resp.findIndex(item => item.id_pregunta === pregunta.id)
      if (index === -1) {
        resp.push({ id_pregunta: pregunta.id, obligatoria: pregunta.obligatoria, respuesta: '' })
      }
      return resp
    })
  }, [pregunta])

  useEffect(() => {
    if (respuesta) {
      const toForm = {
        id_pregunta: pregunta.id,
        respuesta
      }
      setcuestResp(prev => {
        const resp = [...prev]
        const index = resp.findIndex(item => item.id_pregunta === pregunta.id)
        if (index === -1) {
          resp.push(toForm)
        } else {
          resp[index] = toForm
        }
        return resp
      })
    }
  }, [respuesta])

  if (pregunta.isTexto) {
    return (
      <InputControl
        label={pregunta.titulo}
        name={pregunta.pregunta}
        type='text'
        value={respuesta}
        onChange={e => setRespuesta(e.target.value)}
      />
    )
  }

  if (pregunta.isSeleccion) {
    return (
      <>
        <label className='form-label'>{pregunta.titulo}</label>
        <select
          className='form-select'
          name={pregunta.pregunta}
          value={respuesta}
          onChange={e => setRespuesta(e.target.value)}
        >
          <option value='' disabled selected>Seleccione</option>
          {pregunta.seleccion?.map((item, index) => (
            <option key={index}>{item.valor}</option>
          ))}
        </select>
        {pregCadena && respuesta === pregunta.condicion && <PreguntaRender idPregunta={pregunta.id_pregCadena} setcuestResp={setcuestResp} preguntasState={preguntasState} />}
      </>
    )
  }

  if (pregunta.isFecha) {
    return (
      <InputControl
        label={pregunta.titulo}
        name={pregunta.pregunta}
        type='date'
        value={respuesta}
        onChange={e => setRespuesta(e.target.value)}
      />
    )
  }

  return (
    <></>
  )
}
