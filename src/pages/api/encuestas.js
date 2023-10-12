import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default function (req, res) {
  const { method } = req

  return res.status(401).json({ error: 'NO PERMITIDO' })
}

export const getAllEncuestas = async () => {
  const encuestasBases = await prisma.encuestas_base.findMany()
  const encuestasData = await prisma.encuestas_data.findMany()
  const encuestas = encuestasBases.map((encuesta) => {
    const data = encuestasData.filter((item) => item.id_encuesta === encuesta.id)
    return {
      ...encuesta,
      data
    }
  })
  return encuestas
}
