import { PrismaClient } from '@prisma/client'
import { getAllPreguntas } from './preguntas'

const prisma = new PrismaClient()

export default function handler (req, res) {
  const { method } = req

  if (method === 'GET') return getEncuestas(req, res)
  if (method === 'POST') return createEncuesta(req, res)
  if (method === 'DELETE') return deleteEncuesta(req, res)

  return res.status(401).json({ error: 'NO PERMITIDO' })
}

export const getAllEncuestas = async () => {
  const encuestasBases = await prisma.prologistics_encuestasBase.findMany()
  const encuestasData = await prisma.prologistics_encuestasPreguntas.findMany()
  await prisma.$disconnect()
  const preguntas = await getAllPreguntas()
  const encuestas = encuestasBases.map((encuesta) => {
    const data = encuestasData.filter((item) => item.id_encuesta === encuesta.id)
    return {
      ...encuesta,
      data: data.map((item) => {
        const pregunta = preguntas.find((pregunta) => pregunta.id === item.id_pregunta)
        return {
          ...item,
          pregunta
        }
      })
    }
  })
  return encuestas
}

export const getEncuestas = async (req, res) => {
  try {
    const encuestas = await getAllEncuestas()
    return res.status(200).json(encuestas)
  } catch (error) {
    console.log('🚀 ~ error:', error)
    return res.status(401).json({ error: error.message })
  }
}

const createEncuesta = async (req, res) => {
  const { body: data } = req
  if (data.titulo === null || data?.titulo === '') return res.status(401).send('El titulo es requerido')
  if (data.preguntas === null || data?.preguntas?.length === 0) return res.status(401).send('Las preguntas son requeridas')

  const baseToInsert = {
    titulo: String(data.titulo).toLowerCase().trim()
  }

  if (data?.update) {
    const encuestas = await getAllEncuestas()
    const encuesta = encuestas.find((encuesta) => encuesta.titulo === baseToInsert.titulo && encuesta.id !== data.update)
    if (encuesta) return res.status(401).send('El titulo ya existe')

    try {
      await prisma.prologistics_encuestasPreguntas.deleteMany({
        where: {
          id_encuesta: data.update
        }
      }).then(async () => {
        await prisma.prologistics_encuestasPreguntas.createMany({
          data: data.preguntas.map((item) => ({
            id_encuesta: data.update,
            id_pregunta: item.id_pregunta
          }))
        })
      }).then(async () => {
        await prisma.prologistics_encuestasBase.update({
          where: {
            id: data.update
          },
          data: {
            titulo: baseToInsert.titulo
          }
        })
      })
      return res.status(200).json({ message: 'Encuesta actualizada correctamente' })
    } catch (error) {
      console.log('🚀 ~ error:', error)
      return res.status(401).json({ error: error.message })
    } finally {
      await prisma.$disconnect()
    }
  }

  try {
    const base = await prisma.prologistics_encuestasBase.create({
      data: baseToInsert
    })
    await prisma.prologistics_encuestasPreguntas.createMany({
      data: data.preguntas.map((item) => ({
        id_encuesta: base.id,
        id_pregunta: item.id_pregunta
      }))
    })
    return res.status(200).json({ message: 'Encuesta creada correctamente' })
  } catch (error) {
    console.log('🚀 ~ error:', error)
    return res.status(401).json({ error: error.message })
  } finally {
    await prisma.$disconnect()
  }
}

const deleteEncuesta = async (req, res) => {
  const { id } = req.query
  if (id === null || id === '') return res.status(401).send('El id es requerido')

  const encuestaTomada = await prisma.prologistics_cuestionarios.findMany({
    where: {
      id_encuesta: Number(id)
    }
  })

  if (encuestaTomada.length > 0) return res.status(401).send('Esta Encuesta Fue respondia por sus Clientes no puede ser eliminada')

  try {
    await prisma.prologistics_encuestasPreguntas.deleteMany({
      where: {
        id_encuesta: Number(id)
      }
    })
    await prisma.prologistics_encuestasBase.delete({
      where: {
        id: Number(id)
      }
    })
    return res.status(200).json({ message: 'Encuesta eliminada correctamente' })
  } catch (error) {
    console.log('🚀 ~ error:', error)
    return res.status(401).json({ error: error.message })
  } finally {
    await prisma.$disconnect()
  }
}
