import { create } from 'zustand'
import { fetchClientes } from '../services'

export const clientesStore = create((set) => ({
  clientes: [],
  fetchClientes: async () => {
    const data = await fetchClientes()
    set({ clientes: data })
  }
}))
