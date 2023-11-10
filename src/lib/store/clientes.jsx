import { create } from 'zustand'
import axios from 'axios'
import { Swaly } from '../toastSwal'
import { useEffect } from 'react'

// store
const clientesStore = create((set) => ({
  clientes: [],
  setClientes: (clientes) => set({ clientes })
}))

// hook
export default function clientesState () {
  const { clientes, setClientes } = clientesStore(state => state)

  useEffect(() => {
    console.log('loop')
    fetchClientes().then((clientes) => setClientes(clientes))
  }, [setClientes])

  return { clientes }
}

// services
const fetchClientes = async () => {
  try {
    const { data } = await axios.get('/api/clientes/')
    return data
  } catch (error) {
    console.log(error)
    Swaly.fire({
      icon: 'error',
      text: JSON.stringify(error?.response?.data) || JSON.stringify(error?.message) || 'Error al cargar'
    })
  }
  return []
}
