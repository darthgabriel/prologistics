import axios from 'axios'
import { Swaly, Toast } from '../toastSwal'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// hooks
export default function cuestionariosState () {
  const { isLoading, data: cuestionarios } = useQuery({ queryKey: ['cuestionarios'], queryFn: getCuestionariosService })

  return {
    cuestionarios: isLoading ? [] : cuestionarios
  }
}

export function useCuestionario (id) {
  const { isLoading, data: cuestionarios } = useQuery({ queryKey: ['cuestionarios'], queryFn: getCuestionariosService })

  return {
    cuestionario: isLoading ? undefined : cuestionarios.find((cuestionario) => cuestionario.id === Number(id))
  }
}

export function useCuestionarioCreate () {
  const queryClient = useQueryClient()
  const { mutate: createCuestionario, isLoading } = useMutation({
    mutationFn: async (data) => {
      const { data: cuestionario } = await axios.post('/api/encuestas/', data)
      return cuestionario
    },
    onMutate: async () => {
      Swaly.fire({
        icon: 'info',
        text: 'Guardando Cuestionario, por favor espere...',
        showConfirmButton: false
      })
    },
    onSuccess: () => {
      Toast.fire({
        icon: 'success',
        text: 'Cuestionario Guardado'
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cuestionarios'] })
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
    createCuestionario,
    isLoading
  }
}

export function useDeleteCuestionario () {
  const queryClient = useQueryClient()
  const { mutate: deleteCuestionario, isLoading } = useMutation({
    mutationFn: deleteCuestionarioService,
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
        text: 'Cuestionario eliminada'
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cuestionarios'] })
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
