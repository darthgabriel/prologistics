import InputControl from '@/components/formControls/InputControl'
import { cuestionariosStore } from '@/lib/store/cuestionarios'
import { preguntasStore } from '@/lib/store/preguntas'
import { Swaly } from '@/lib/toastSwal'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'

export default function cuestionariosCreate () {
  const router = useRouter()
  const { id } = router.query

  const cuestionarios = cuestionariosStore((state) => state.cuestionarios)
  const preguntas = preguntasStore((state) => state.preguntas)
  const [cuestionario, setCuestionario] = useState()
  const [cliente, setCliente] = useState()
  const [cuestResp, setcuestResp] = useState([])
  const [preguntasState, setPreguntasState] = useState()

  useEffect(() => {
    if (!id) return
    if (cuestionarios.length === 0) return
    if (preguntas.length === 0) return
    setcuestResp([])
    setCuestionario(cuestionarios.find((item) => item.id === Number(id)))
    setPreguntasState(preguntas)
  }, [id, cuestionarios, preguntas])

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
      const preguntaFind = preguntasState.find(item => item.id === respuestasObligatorias[0].id_pregunta)
      return Swaly.fire({
        icon: 'error',
        text: preguntaFind.titulo + ' es obligatoria'
      })
    }

    try {
      await axios.post('/api/cuestionarios/', { id, cliente, cuestResp })
      Swaly.fire({
        icon: 'success',
        text: 'Cuestionario guardado, nos contactaremos con ud pronto'
      })
        .then(async (r) => {
          if (r.isDismissed || r.isConfirmed) {
            router.push('/')
          }
        })

      await emailjs.send(
        'service_t35i9ew',
        'template_1zfgevj',
        {
          primerNombre: cliente.primerNombre,
          primerApellido: cliente.primerApellido
        },
        'Llr5MWaAAKTsVNvc5'
      )
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
            <FormCuestionario cuestionario={cuestionario} setcuestResp={setcuestResp} preguntasState={preguntasState} />
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

function FormCuestionario ({ cuestionario, setcuestResp, preguntasState }) {
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
  const [pregCadena, setPregCadena] = useState(false)
  const [respuesta, setRespuesta] = useState()
  const [pregunta, setPregunta] = useState()

  useEffect(() => {
    if (!idPregunta) return
    const preguntaFind = preguntasState.find(item => item.id === idPregunta)
    setPregunta(preguntaFind)
  }, [idPregunta])

  useEffect(() => {
    if (!pregunta) return
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
      // si la respuesta es no es el de la condicion eliminar del array
      if (pregCadena && respuesta !== pregunta.condicion) {
        setcuestResp(prev => {
          const resp = [...prev]
          const index = resp.findIndex(item => item.id_pregunta === pregunta.id_pregCadena)
          if (index !== -1) {
            resp.splice(index, 1)
          }
          return resp
        })
      }
    }
  }, [respuesta])

  if (!pregunta) return <></>

  if (pregunta.isTexto) {
    return (
      <>
        <label className='form-label'>{pregunta.titulo}</label>
        <input
          type='text'
          className='form-control form-control-sm'
          name={pregunta.pregunta}
          value={respuesta || ''}
          onChange={e => setRespuesta(e.target.value)}
        />
      </>
    )
  }

  if (pregunta.isSeleccion) {
    return (
      <>
        <label className='form-label'>{pregunta.titulo}</label>
        <select
          className='form-select'
          name={pregunta.pregunta}
          value={respuesta || ''}
          onChange={e => setRespuesta(e.target.value)}
        >
          <option value='' disabled>Seleccione</option>
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
      <>
        <label className='form-label'>{pregunta.titulo}</label>
        <input
          type='date'
          className='form-control form-control-sm'
          name={pregunta.pregunta}
          value={respuesta || ''}
          onChange={e => setRespuesta(e.target.value)}
        />
      </>
    )
  }

  return (
    <></>
  )
}
