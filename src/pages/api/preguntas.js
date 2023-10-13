import { getAllEncuestas } from './encuestas'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default function handler (req, res) {
  const { method } = req
  if (method === 'GET') return getPreguntas(req, res)
  if (method === 'POST') return createPregunta(req, res)
  if (method === 'PUT') return updatePregunta(req, res)
  if (method === 'DELETE') return deletePregunta(req, res)
  return res.status(401).json({ error: 'NO PERMITIDO' })
}

export const getAllPreguntas = async () => {
  const preguntas = await prisma.prologistics_preguntasBase.findMany()
  const preguntasSeleccion = await prisma.prologistics_preguntasSeleccion.findMany()
  return preguntas.map((pregunta) => {
    const seleccion = preguntasSeleccion.filter((item) => item.id_pregunta === pregunta.id)
    const cadena = preguntas.find((item) => item.id === pregunta.id_pregCadena)
    const seleccioncadena = preguntasSeleccion.filter((item) => item.id_pregunta === pregunta.id_pregCadena)
    const formatReturn = {
      ...pregunta,
      titulo_pregCadena: cadena ? cadena.titulo : null,
      preguntaCadena: {
        ...cadena,
        seleccion: seleccioncadena
      },
      seleccion
    }

    return formatReturn
  }).reverse()
}

export async function getPreguntas (req, res) {
  try {
    const preguntas = await getAllPreguntas()
    return res.status(200).json(preguntas)
  } catch (error) {
    return res.status(401).json({ error: error.message })
  }
}

async function createPregunta (req, res) {
  const { body: data } = req

  const baseToInsert = {
    titulo: String(data.titulo).toLowerCase().trim(),
    isTexto: data.isTexto,
    isFecha: data.isFecha,
    isSeleccion: data.isSeleccion,
    id_pregCadena: data?.id_pregCadena || null,
    condicion: data?.condicion || null,
    obligatoria: data.obligatoria
  }

  try {
    const preguntas = await getAllPreguntas()
    const preguntaExist = preguntas.find((pregunta) => pregunta.titulo === baseToInsert.titulo)
    if (preguntaExist) throw new Error('La pregunta ya existe')
    if (baseToInsert.titulo === null || baseToInsert.titulo === '') throw new Error('El titulo es requerido')
    if (baseToInsert.isTexto === null || baseToInsert.isTexto === '') throw new Error('Hubo un problema con el tipo de pregunta')
    if (baseToInsert.isFecha === null || baseToInsert.isFecha === '') throw new Error('Hubo un problema con el tipo de pregunta')
    if (baseToInsert.isSeleccion === null || baseToInsert.isSeleccion === '') throw new Error('Hubo un problema con el tipo de pregunta')
    if (baseToInsert.isSeleccion === true && data.seleccion.length <= 1) throw new Error('Debe tener mas de una seleccion')
    if (baseToInsert.obligatoria === null || baseToInsert.obligatoria === '') throw new Error('Hubo un problema con el tipo de pregunta')
    if (baseToInsert?.id_pregCadena) {
      baseToInsert.condicion = data.seleccion.at(0)
    }
    const preguntaBase = await prisma.prologistics_preguntasBase.create({
      data: baseToInsert
    })
    if (baseToInsert.isSeleccion === true) {
      await prisma.prologistics_preguntasSeleccion.createMany({
        data: data.seleccion.map((item) => ({
          id_pregunta: preguntaBase.id,
          valor: item
        }))
      })
    }
    return res.status(200).json({ message: 'Pregunta creada' })
  } catch (error) {
    return res.status(401).json({ error: error.message })
  }
}

async function updatePregunta (req, res) {
  const { body: data } = req

  const baseToUpdate = {
    titulo: String(data.titulo).toLowerCase().trim(),
    isTexto: data.isTexto,
    isFecha: data.isFecha,
    isSeleccion: data.isSeleccion,
    id_pregCadena: data?.id_pregCadena || null,
    condicion: data?.condicion || null,
    obligatoria: data.obligatoria
  }

  try {
    const preguntas = await getAllPreguntas()
    const preguntaExist = preguntas.find((pregunta) => pregunta.id === data.id)
    if (!preguntaExist) throw new Error('La pregunta no existe')
    if (baseToUpdate.titulo === null || baseToUpdate.titulo === '') throw new Error('El titulo es requerido')
    const preguntaRepetida = preguntas.find((pregunta) => pregunta.titulo === baseToUpdate.titulo && pregunta.id !== data.id)
    if (preguntaRepetida) throw new Error('La pregunta ya existe')
    if (baseToUpdate.isTexto === null || baseToUpdate.isTexto === '') throw new Error('Hubo un problema con el tipo de pregunta')
    if (baseToUpdate.isFecha === null || baseToUpdate.isFecha === '') throw new Error('Hubo un problema con el tipo de pregunta')
    if (baseToUpdate.isSeleccion === null || baseToUpdate.isSeleccion === '') throw new Error('Hubo un problema con el tipo de pregunta')
    if (baseToUpdate.isSeleccion === true && data.seleccion.length <= 1) throw new Error('Debe tener mas de una seleccion')
    if (baseToUpdate.obligatoria === null || baseToUpdate.obligatoria === '') throw new Error('Hubo un problema con el tipo de pregunta')
    if (baseToUpdate?.id_pregCadena) {
      baseToUpdate.condicion = data.seleccion.at(0)
    }

    await prisma.prologistics_preguntasBase.update({
      where: { id: data.id },
      data: baseToUpdate
    })

    if (baseToUpdate.isSeleccion === true) {
      await prisma.prologistics_preguntasSeleccion.deleteMany({
        where: { id_pregunta: data.id }
      })
      await prisma.prologistics_preguntasSeleccion.createMany({
        data: data.seleccion.map((item) => ({
          id_pregunta: data.id,
          valor: item
        }))
      })
    }
    return res.status(200).json({ message: 'Pregunta actualizada' })
  } catch (error) {
    return res.status(401).json({ error: error.message })
  }
}

async function deletePregunta (req, res) {
  const { body: data } = req
  try {
    const preguntas = await getAllPreguntas()
    const preguntaExist = preguntas.find((pregunta) => pregunta.id === data.id)
    if (!preguntaExist) throw new Error('La pregunta no existe')
    const preguntaCadena = preguntas.find((pregunta) => pregunta.id_pregCadena === data.id)
    if (preguntaCadena) throw new Error('La pregunta esta asignada a una pregunta cadena')
    const encuestas = await getAllEncuestas()
    const encuestaPreguntaTake = encuestas.find((encuesta) => {
      const pregunta = encuesta.data.find((item) => item.id_pregunta === data.id)
      if (pregunta) return pregunta
      return null
    })
    if (encuestaPreguntaTake) throw new Error('La pregunta esta asignada a una encuesta')
    await prisma.prologistics_preguntasBase.delete({
      where: { id: data.id }
    })
    await prisma.prologistics_preguntasSeleccion.deleteMany({
      where: { id_pregunta: data.id }
    })
    return res.status(200).json({ message: 'Pregunta eliminada' })
  } catch (error) {
    return res.status(401).json({ error: error.message })
  }
}
