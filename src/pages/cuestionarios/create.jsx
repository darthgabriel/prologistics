import InputControl from '@/components/formControls/InputControl'
import { Swaly } from '@/lib/toastSwal'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useCuestionario } from '@/lib/store/cuestionarios'
import preguntasState from '@/lib/store/preguntas'
import clientesState from '@/lib/store/clientes'
import { useCuestionarioRespondidoCreate } from '@/lib/store/cuestionariosRespondidos'

export default function cuestionariosCreate () {
  const router = useRouter()
  const { id } = router.query

  const { cuestionario: getCuestionario } = useCuestionario(id)
  const { preguntas, isLoading: isPreguntas } = preguntasState()
  const [cuestionario, setCuestionario] = useState()
  const [cliente, setCliente] = useState()
  const [cuestResp, setcuestResp] = useState([])
  const { createCuestionarioRespondido, isLoading: isLoadingCreate } = useCuestionarioRespondidoCreate()

  useEffect(() => {
    console.log('loop')
    if (!id) return
    setcuestResp([])
    setCuestionario(getCuestionario)
  }, [id, getCuestionario])

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
      const preguntaFind = preguntas.find(item => item.id === respuestasObligatorias[0].id_pregunta)
      return Swaly.fire({
        icon: 'error',
        text: preguntaFind.titulo + ' es obligatoria'
      })
    }

    createCuestionarioRespondido({ id, cliente, cuestResp })
  }

  return (
    <>
      {cuestionario
        ? (
          <div className='d-flex flex-column gap-3'>
            <FormCliente setCliente={setCliente} />
            {!isPreguntas && <FormCuestionario cuestionario={cuestionario} setcuestResp={setcuestResp} preguntasState={preguntas} />}
            <button
              type='button'
              className='btn btn-primary'
              onClick={handleSubmit}
              disabled={isLoadingCreate}
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
  const { clientes } = clientesState()
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

  const changeCedula = (e) => {
    const cliente = clientes?.find(item => item.cedula === e.target.value)
    if (!cliente) return
    setDatos({
      ...datos,
      primerNombre: cliente.primerNombre,
      segundoNombre: cliente.segundoNombre,
      primerApellido: cliente.primerApellido,
      segundoApellido: cliente.segundoApellido,
      telefono: cliente.telefono,
      email: cliente.email
    })
  }

  useEffect(() => {
    console.log('loop')
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
            <InputControl label='ALIEN / SOCIAL / PASSSPORT' name='cedula' type='number' onChange={handleChange} onBlur={changeCedula} />
          </div>
          <div className='col'>
            <InputControl label='Primer Nombre' name='primerNombre' type='text' onChange={handleChange} value={datos.primerNombre} />
          </div>
          <div className='col'>
            <InputControl label='Segundo Nombre' name='segundoNombre' type='text' onChange={handleChange} value={datos.segundoNombre} />
          </div>
          <div className='col'>
            <InputControl label='Primer Apellido' name='primerApellido' type='text' onChange={handleChange} value={datos.primerApellido} />
          </div>
          <div className='col'>
            <InputControl label='Segundo Apellido' name='segundoApellido' type='text' onChange={handleChange} value={datos.segundoApellido} />
          </div>
          <div className='col'>
            <InputControl label='Telefono' name='telefono' type='text' onChange={handleChange} value={datos.telefono} />
          </div>
          <div className='col'>
            <InputControl label='Email' name='email' type='email' onChange={handleChange} value={datos.email} />
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
          {cuestionario.data.map((pregunta, index) => (
            <div className='col' key={index}>
              <PreguntaRender idPregunta={pregunta.id_pregunta} setcuestResp={setcuestResp} preguntasState={preguntasState} />
            </div>
          )
          )}
        </div>
      </div>
    </div>
  )
}

export function PreguntaRender ({ idPregunta, setcuestResp, preguntasState }) {
  const [respuesta, setRespuesta] = useState('')
  const [pregunta, setPregunta] = useState(null)

  useEffect(() => {
    if (idPregunta) {
      const preguntaFind = preguntasState.find(item => item.id === idPregunta)
      setPregunta(preguntaFind)
    }
  }, [idPregunta, preguntasState])

  useEffect(() => {
    if (pregunta) {
      setcuestResp(prev => {
        const updatedResp = [...prev]
        const index = updatedResp.findIndex(item => item.id_pregunta === pregunta.id)
        if (index === -1) {
          updatedResp.push({ id_pregunta: pregunta.id, obligatoria: pregunta.obligatoria, respuesta: '' })
        }
        return updatedResp
      })
    }
  }, [pregunta, setcuestResp])

  useEffect(() => {
    if (respuesta && pregunta) {
      const toForm = { id_pregunta: pregunta.id, respuesta }
      setcuestResp(prev => {
        const updatedResp = [...prev]
        const index = updatedResp.findIndex(item => item.id_pregunta === pregunta.id)
        if (index === -1) {
          updatedResp.push(toForm)
        } else {
          updatedResp[index] = toForm
        }
        return updatedResp
      })

      if (pregunta.id_pregCadena && respuesta !== pregunta.condicion) {
        setcuestResp(prev => {
          const updatedResp = [...prev]
          const index = updatedResp.findIndex(item => item.id_pregunta === pregunta.id_pregCadena)
          if (index !== -1) {
            updatedResp.splice(index, 1)
          }
          return updatedResp
        })
      }
    }
  }, [respuesta, pregunta, setcuestResp])

  if (!pregunta) return null

  const renderInput = () => {
    switch (true) {
      case pregunta.isTexto:
        return (
          <input
            type='text'
            className='form-control form-control-sm'
            name={pregunta.pregunta}
            value={respuesta}
            onChange={e => setRespuesta(e.target.value)}
          />
        )
      case pregunta.isSeleccion:
        return (
          <>
            <select
              className='form-select'
              name={pregunta.pregunta}
              value={respuesta}
              onChange={e => setRespuesta(e.target.value)}
            >
              <option value='' disabled>
                Seleccione
              </option>
              {pregunta.seleccion?.map((item, index) => (
                <option key={index} value={item.valor}>
                  {item.valor}
                </option>
              ))}
            </select>
            {pregunta.id_pregCadena && respuesta === pregunta.condicion && (
              <PreguntaRender
                idPregunta={pregunta.id_pregCadena}
                setcuestResp={setcuestResp}
                preguntasState={preguntasState}
              />
            )}
          </>
        )
      case pregunta.isFecha:
        return (
          <input
            type='date'
            className='form-control form-control-sm'
            name={pregunta.pregunta}
            value={respuesta}
            onChange={e => setRespuesta(e.target.value)}
          />
        )
      default:
        return null
    }
  }

  return (
    <>
      <label className='form-label'>{pregunta.titulo}</label>
      {renderInput()}
    </>
  )
}
