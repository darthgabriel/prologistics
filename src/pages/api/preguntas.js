import { query } from '@/lib/mysql'
import { getAllEncuestas } from './encuestas'

export default function (req, res) {
  const { method } = req
  if (method === 'GET') return getPreguntas(req, res)
  if (method === 'POST') return createPregunta(req, res)
  if (method === 'PUT') return updatePregunta(req, res)
  if (method === 'DELETE') return deletePregunta(req, res)
  return res.status(401).json({ error: 'NO PERMITIDO' })
}

const getAllPreguntas = async () => {
  const preguntas = await query('SELECT * FROM preguntas_base')
  const preguntasSeleccion = await query('SELECT * FROM preguntas_seleccion')
  return preguntas.map((pregunta) => {
    const seleccion = preguntasSeleccion.filter((item) => item.id_pregunta === pregunta.id)
    const cadena = preguntas.find((item) => item.id === pregunta.id_pregCadena)
    const formatReturn = {
      ...pregunta,
      titulo_pregCadena: cadena ? cadena.titulo : null,
      seleccion
    }

    return formatReturn
  })
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
    id_pregCadena: data.id_pregCadena,
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
    if (baseToInsert.id_pregCadena) {
      baseToInsert.condicion = data.seleccion.at(0)
    }
    const { insertId } = await query('INSERT INTO preguntas_base SET ?', baseToInsert)
    let queryData = 'SELECT 1+1'
    if (baseToInsert.isSeleccion === true) {
      queryData = 'INSERT INTO preguntas_seleccion (id_pregunta, valor) VALUES '
      data.seleccion.forEach((item) => {
        queryData += `(${insertId}, '${item}'),`
      })
      queryData = queryData.slice(0, -1)
    }
    await query(queryData)
    return res.status(200).json({ message: 'Pregunta creada' })
  } catch (error) {
    return res.status(401).json({ error: error.message })
  }
}

async function updatePregunta (req, res) {
  const { body: data } = req

  const baseToInsert = {
    titulo: String(data.titulo).toLowerCase().trim(),
    isTexto: data.isTexto,
    isFecha: data.isFecha,
    isSeleccion: data.isSeleccion,
    id_pregCadena: data.id_pregCadena,
    condicion: data.condicion,
    obligatoria: data.obligatoria
  }

  try {
    const preguntas = await getAllPreguntas()
    const preguntaExist = preguntas.find((pregunta) => pregunta.id === data.id)
    if (!preguntaExist) throw new Error('La pregunta no existe')
    if (baseToInsert.titulo === null || baseToInsert.titulo === '') throw new Error('El titulo es requerido')
    const preguntaRepetida = preguntas.find((pregunta) => pregunta.titulo === baseToInsert.titulo && pregunta.id !== data.id)
    if (preguntaRepetida) throw new Error('La pregunta ya existe')
    if (baseToInsert.isTexto === null || baseToInsert.isTexto === '') throw new Error('Hubo un problema con el tipo de pregunta')
    if (baseToInsert.isFecha === null || baseToInsert.isFecha === '') throw new Error('Hubo un problema con el tipo de pregunta')
    if (baseToInsert.isSeleccion === null || baseToInsert.isSeleccion === '') throw new Error('Hubo un problema con el tipo de pregunta')
    if (baseToInsert.isSeleccion === true && data.seleccion.length <= 1) throw new Error('Debe tener mas de una seleccion')
    if (baseToInsert.obligatoria === null || baseToInsert.obligatoria === '') throw new Error('Hubo un problema con el tipo de pregunta')
    if (baseToInsert.id_pregCadena) {
      baseToInsert.condicion = data.seleccion.at(0)
    }

    await query('UPDATE preguntas_base SET ? WHERE id = ?', [baseToInsert, data.id])

    let queryData = 'SELECT 1+1'
    if (baseToInsert.isSeleccion === true) {
      await query('DELETE FROM preguntas_seleccion WHERE id_pregunta = ?', data.id)
      queryData = 'INSERT INTO preguntas_seleccion (id_pregunta, valor) VALUES '
      data.seleccion.forEach((item) => {
        queryData += `(${data.id}, '${item}'),`
      })
      queryData = queryData.slice(0, -1)
    }

    await query(queryData)
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
    const encuestas = await getAllEncuestas()
    const encuestaPreguntaTake = encuestas.find((encuesta) => {
      const pregunta = encuesta.data.find((item) => item.id_pregunta === data.id)
      if (pregunta) return pregunta
      return null
    })
    if (encuestaPreguntaTake) throw new Error('La pregunta esta asignada a una encuesta')
    await query('DELETE FROM preguntas_base WHERE id = ?', data.id)
    await query('DELETE FROM preguntas_seleccion WHERE id_pregunta = ?', data.id)
    return res.status(200).json({ message: 'Pregunta eliminada' })
  } catch (error) {
    return res.status(401).json({ error: error.message })
  }
}
