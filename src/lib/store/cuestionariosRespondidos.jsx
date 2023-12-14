import axios from 'axios'
import { Swaly, Toast } from '../toastSwal'
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import emailjs from '@emailjs/browser'
import { useRouter } from 'next/router'

// hooks
export default function cuestionariosRespondidos () {
  const { isLoading, data: cuestionariosRespondidos } = useQuery({ queryKey: ['cuestionariosRespondidos'], queryFn: fetchCuestionariosRespondidos })

  return {
    cuestionariosRespondidos: isLoading ? [] : cuestionariosRespondidos
  }
}

export function useCuestionarioRespondidoCreate () {
  const queryClient = new QueryClient()
  const router = useRouter()
  const { mutate: createCuestionarioRespondido, isLoading } = useMutation({
    mutationFn: async (data) => {
      const { data: cuestionarioRespondido } = await axios.post('/api/cuestionarios/', data)
      return cuestionarioRespondido
    },
    onMutate: async () => {
      Swaly.fire({
        icon: 'info',
        text: 'Guardando Cuestionario, por favor espere...',
        showConfirmButton: false
      })
    },
    onSuccess: async (data) => {
      Toast.fire({
        icon: 'success',
        text: 'Cuestionario Guardado'
      })

      await emailjs.send(
        'service_t35i9ew',
        'template_1zfgevj',
        {
          primerNombre: data.cliente.primerNombre,
          primerApellido: data.cliente.primerApellido
        },
        'Llr5MWaAAKTsVNvc5'
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cuestionariosRespondidos'] })
      router.push('/')
    },
    onError: (error) => {
      console.log(error)
      Swaly.fire({
        icon: 'error',
        text: JSON.stringify(error?.response?.data) || JSON.stringify(error?.message) || 'Error al crear'
      })
    }
  })

  return {
    createCuestionarioRespondido,
    isLoading
  }
}

export function useCuestionarioRespondidoDelete () {
  const router = useRouter()
  const queryClient = new QueryClient()
  const { mutate: deleteCuestionario, isLoading } = useMutation({
    mutationFn: async (data) => {
      await axios.delete('/api/cuestionarios/', { data })
    },
    onMutate: async () => {
      Swaly.fire({
        icon: 'info',
        text: 'Eliminando Cuestionario, por favor espere...',
        showConfirmButton: false
      })
    },
    onSuccess: () => {
      Toast.fire({
        icon: 'success',
        text: 'Cuestionario Eliminado'
      })
      router.back()
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cuestionariosRespondidos'] })
    },
    onError: (error) => {
      console.log(error)
      Swaly.fire({
        icon: 'error',
        text: JSON.stringify(error?.response?.data) || JSON.stringify(error?.message) || 'Error al eliminar'
      })
    }
  })

  return {
    deleteCuestionario,
    isLoading
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
