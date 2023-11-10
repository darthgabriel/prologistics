import { create } from 'zustand'
import axios from 'axios'
import { Swaly } from '../toastSwal'
import { useEffect } from 'react'

// store
const cuestionariosStore = create((set, get) => ({
  cuestionarios: [],
  setCuestionarios: (cuestionarios) => set({ cuestionarios }),
  getCuestionario: (id) => {
    const cuestionario = get().cuestionarios.find((item) => item.id === Number(id))
    return cuestionario
  },
  deleteCuestionario: (id) => {
    const cuestionariosNew = get().cuestionarios.filter(item => item.id !== Number(id))
    set({ cuestionarios: cuestionariosNew })
  }
}))

// hook
export default function cuestionariosState () {
  const { cuestionarios, setCuestionarios, deleteCuestionario, getCuestionario } = cuestionariosStore(state => state)

  useEffect(() => {
    console.log('loop')
    if (cuestionarios.length > 0) return
    reloadService()
  }, [])

  const reloadService = () => {
    getCuestionariosService().then((cuestionarios) => setCuestionarios(cuestionarios))
  }

  const eliminarCuestionario = async (id) => {
    const resp = await deleteCuestionarioService(id)
    if (resp) {
      deleteCuestionario(id)
      Swaly.fire({
        icon: 'success',
        text: 'Cuestionario eliminado correctamente'
      })
    }
  }

  return { cuestionarios, reloadService, eliminarCuestionario, getCuestionario }
}

// services
const getCuestionariosService = async () => {
  try {
    const { data } = await axios.get('/api/encuestas/')
    console.log('fetching')
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

const deleteCuestionarioService = async (id) => {
  try {
    await axios.delete('/api/encuestas/', {
      params: {
        id
      }
    })
    Swaly.fire({
      icon: 'success',
      text: 'Cuestionario eliminado correctamente'
    })
    return true
  } catch (error) {
    console.log(error)
    Swaly.fire({
      icon: 'error',
      text: JSON.stringify(error?.response?.data) || JSON.stringify(error?.message) || 'Error al eliminar el cuestionario'
    })
  }
  return false
}
