import { PrismaClient } from '@prisma/client'
import { getAllPreguntas } from './preguntas'

const prisma = new PrismaClient()

export default function handler (req, res) {
  const { method } = req

  if (method === 'GET') return getEncuestas(req, res)
  if (method === 'POST') return createEncuesta(req, res)

  return res.status(401).json({ error: 'NO PERMITIDO' })
}

export const getAllEncuestas = async () => {
  const encuestasBases = await prisma.prologistics_encuestasBase.findMany()
  const encuestasData = await prisma.prologistics_encuestasPreguntas.findMany()
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

export const createEncuesta = async (req, res) => {
  const { body: data } = req
  if (data.titulo === null || data?.titulo === '') return res.status(401).send('El titulo es requerido')
  if (data.preguntas === null || data?.preguntas?.length === 0) return res.status(401).send('Las preguntas son requeridas')

  const baseToInsert = {
    titulo: String(data.titulo).toLowerCase().trim()
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
  }
}
