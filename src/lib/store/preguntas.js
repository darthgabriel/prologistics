import { create } from 'zustand'
import { fetchPreguntas } from '../services'

export const preguntasStore = create((set) => ({
  preguntas: []
}))

fetchPreguntas().then((data) => { preguntasStore.setState({ preguntas: data }) })
