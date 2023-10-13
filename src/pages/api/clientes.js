import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default function handler (req, res) {
  const { method } = req

  if (method === 'GET') return getClientes(req, res)

  return res.status(401).json({ error: 'NO PERMITIDO' })
}

export const getAllClientes = async () => {
  try {
    const clientes = await prisma.prologistics_infoClientes.findMany()
    return clientes
  } catch (error) {
    console.error('🚀 ~ error:', error)
    return []
  }
}

export const getClientes = async (req, res) => {
  try {
    const clientes = await getAllClientes()
    return res.status(200).json(clientes)
  } catch (error) {
    console.error('🚀 ~ error:', error)
    return res.status(500).json({ error })
  }
}
