import { create } from 'zustand'
import axios from 'axios'
import { Swaly } from '../toastSwal'
import { useEffect } from 'react'

// store
const preguntasStore = create((set, get) => ({
  preguntas: [],
  setPreguntas: (preguntas) => set({ preguntas }),
  addPregunta: (pregunta) => set({ preguntas: [...get().preguntas, pregunta] }),
  getPregunta: (id) => {
    const pregunta = get().preguntas.find((item) => item.id === Number(id))
    return pregunta
  },
  deletePregunta: (id) => {
    const preguntasNew = get().preguntas.filter(item => item.id !== Number(id))
    set({ preguntas: preguntasNew })
  }
}))

// hook
export default function preguntasState () {
  const { preguntas, setPreguntas, getPregunta, deletePregunta } = preguntasStore(state => state)

  useEffect(() => {
    console.log('loop')
    if (preguntas.length > 0) return
    reloadService()
  }, [preguntas])

  const reloadService = () => {
    getPreguntasService().then((preguntas) => setPreguntas(preguntas))
  }

  return { preguntas, reloadService, getPregunta, deletePregunta }
}

// services
const getPreguntasService = async () => {
  try {
    const { data } = await axios.get('/api/preguntas/')
    console.log('fetching')
    return data
  } catch (error) {
    console.log(error)
    Swaly.fire({
      icon: 'error',
      text: JSON.stringify(error?.response?.data) || JSON.stringify(error?.message) || 'Error al cargar'
    })
  }
}
