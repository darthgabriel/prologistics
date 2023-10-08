import { query } from '@/lib/mysql'

export default function (req, res) {
  const { method } = req

  return res.status(401).json({ error: 'NO PERMITIDO' })
}

export const getAllEncuestas = async () => {
  const encuestasBases = await query('SELECT * FROM encuestas_base')
  const encuestasData = await query('SELECT * FROM encuestas_data')
  const encuestas = encuestasBases.map((encuesta) => {
    const data = encuestasData.filter((item) => item.id_encuesta === encuesta.id)
    return {
      ...encuesta,
      data
    }
  })
  return encuestas
}
