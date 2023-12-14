import { PrismaClient } from '@prisma/client'
import { getAllClientes } from './clientes'
import { getAllEncuestas } from './encuestas'
import { getAllPreguntas } from './preguntas'

const prisma = new PrismaClient()

export default function (req, res) {
  const { method } = req

  if (method === 'GET') return getAllCuestionariosRespondidos(req, res)
  if (method === 'POST') return createRepuestas(req, res)
  if (method === 'DELETE') return deleteCuestionario(req, res)

  return res.status(401).json({ error: 'NO PERMITIDO' })
}

const getAllCuestionariosRespondidos = async (req, res) => {
  const cuestionarios = await prisma.prologistics_cuestionarios.findMany()
  await prisma.$disconnect()
  const encuestas = await getAllEncuestas()
  const preguntas = await getAllPreguntas()
  const cuestionariosFormat = cuestionarios.map((cuestionario) => {
    const encuesta = encuestas.find((encuesta) => encuesta.id === cuestionario.id_encuesta)
    const pregunta = preguntas.find((pregunta) => pregunta.id === cuestionario.id_pregunta)
    return {
      ...cuestionario,
      tituloCuestionario: encuesta.titulo,
      pregunta: pregunta.titulo
    }
  })
  return res.status(200).json(cuestionariosFormat.sort((a, b) => a.id_pregunta - b.id_pregunta))
}

const createRepuestas = async (req, res) => {
  const { body: data } = req

  if (data?.id === null || data?.id === '') return res.status(401).send('NO SE QUE CUESTIONARIO ESTAS LLENANDO')
  if (Object.values(data?.cliente).includes('')) return res.status(401).send('FALTAN DATOS DEL CLIENTE')
  if (data?.cuestResp.length === 0) return res.status(401).send('NO SE CONTESTO NINGUNA PREGUNTA')

  const encuestasRespondidas = await getAllEncuestasRespondidas()

  const clientesState = await getAllClientes()
  try {
    const existCliente = clientesState.find((cliente) => cliente.cedula === data.cliente.cedula)
    let cliente = existCliente
    if (!existCliente) {
      cliente = await prisma.prologistics_infoClientes.create({
        data: {
          cedula: data.cliente.cedula,
          primerNombre: data.cliente.primerNombre,
          segundoNombre: data.cliente.segundoNombre,
          primerApellido: data.cliente.primerApellido,
          segundoApellido: data.cliente.segundoApellido,
          telefono: data.cliente.telefono,
          email: data.cliente.email
        }
      })
    }
    // verificar si ya este cliente respondio esta encuesta
    const existEncuesta = encuestasRespondidas.find(
      (encuesta) => encuesta.id_cliente === cliente.id && encuesta.id_encuesta === Number(data.id)
    )
    if (existEncuesta) throw new Error('YA UD CONTESTO ESTE CUESTIONARIO')

    await prisma.prologistics_cuestionarios.createMany({
      data: data.cuestResp.map((e) => ({
        id_cliente: cliente.id,
        id_encuesta: Number(data.id),
        id_pregunta: e.id_pregunta,
        respuesta: e.respuesta
      }))
    })

    return res.status(200).json({ status: 'OK', cliente })
  } catch (error) {
    console.error('🚀 ~ error:', error)
    return res.status(401).json({ error: error.message })
  } finally {
    await prisma.$disconnect()
  }
}

export const getAllEncuestasRespondidas = async () => {
  const encuestasRespondidas = await prisma.prologistics_cuestionarios.findMany({
    select: {
      id_encuesta: true,
      id_cliente: true
    }
  })
  await prisma.$disconnect()
  return encuestasRespondidas
}

const deleteCuestionario = async (req, res) => {
  const { body: data } = req
  try {
    await prisma.prologistics_cuestionarios.deleteMany({
      where: {
        id_cliente: Number(data.id_cliente),
        id_encuesta: Number(data.id_encuesta)
      }
    })
    return res.status(200).json({ status: 'OK' })
  } catch (error) {
    console.error('🚀 ~ error:', error)
    return res.status(401).json({ error: error.message })
  } finally {
    await prisma.$disconnect()
  }
}
