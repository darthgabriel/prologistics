import { create } from 'zustand'
import { fetchClientes } from '../services'

export const clientesStore = create((set) => ({
  clientes: []
}))

fetchClientes().then((data) => { clientesStore.setState({ clientes: data }) })
