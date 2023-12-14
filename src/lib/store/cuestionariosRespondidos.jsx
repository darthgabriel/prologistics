import axios from 'axios'
import { Swaly } from '../toastSwal'
import { useQuery } from '@tanstack/react-query'

// hook
export default function cuestionariosRespondidos () {
  const { isLoading, data: cuestionariosRespondidos } = useQuery({ queryKey: ['cuestionariosRespondidos'], queryFn: fetchCuestionariosRespondidos })

  return {
    cuestionariosRespondidos: isLoading ? [] : cuestionariosRespondidos
  }
}

// services
const fetchCuestionariosRespondidos = async () => {
  try {
    const { data } = await axios.get('/api/cuestionarios/')
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
