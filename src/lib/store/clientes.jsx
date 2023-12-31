import axios from 'axios'
import { Swaly } from '../toastSwal'
import { useQuery } from '@tanstack/react-query'

// hook
export default function clientesState () {
  const { isLoading, data: clientes } = useQuery({ queryKey: ['clientes'], queryFn: fetchClientes })

  return {
    clientes: isLoading ? [] : clientes
  }
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
