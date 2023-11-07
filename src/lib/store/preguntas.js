import { create } from 'zustand'
import { fetchPreguntas } from '../services'

export const preguntasStore = create((set) => ({
  preguntas: [],
  fetchPreguntas: async () => {
    const data = await fetchPreguntas()
    set({ preguntas: data })
  }
}))
