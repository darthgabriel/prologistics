import { create } from 'zustand'
import { fetchCuestionario } from '../services'

export const cuestionariosStore = create((set) => ({
  cuestionarios: [],
  reloadService: () => {
    fetchCuestionario().then((data) => { cuestionariosStore.setState({ cuestionarios: data }) })
  }
}))

fetchCuestionario().then((data) => { cuestionariosStore.setState({ cuestionarios: data }) })
