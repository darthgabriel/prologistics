import { create } from 'zustand'
import { fetchCuestionario } from '../services'

export const cuestionariosStore = create((set, get) => ({
  cuestionarios: [],
  fetchCuestionarios: async () => {
    const data = await fetchCuestionario()
    set({ cuestionarios: data })
  },
  reloadService: async () => {
    const data = await fetchCuestionario()
    set({ cuestionarios: data })
  }
}))
