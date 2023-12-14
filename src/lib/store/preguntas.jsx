import axios from 'axios'
import { Swaly, Toast } from '../toastSwal'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// hook
export default function preguntasState () {
  const { isLoading, data: preguntas } = useQuery({ queryKey: ['preguntas'], queryFn: getPreguntasService })

  return {
    preguntas: isLoading ? [] : preguntas
  }
}

export function usePreguntaCreate () {
  const queryClient = useQueryClient()
  const { mutate: createPregunta, isLoading } = useMutation({
    mutationFn: async (data) => {
      const { data: pregunta } = await axios.post('/api/preguntas/', data)
      return pregunta
    },
    onMutate: async () => {
      Swaly.fire({
        icon: 'info',
        text: 'Creando pregunta, por favor espere...',
        showConfirmButton: false
      })
    },
    onSuccess: () => {
      Toast.fire({
        icon: 'success',
        text: 'Pregunta Creada'
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries('preguntas')
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
    createPregunta,
    isLoading
  }
}

export function usePreguntaDelete () {
  const queryClient = useQueryClient()
  const { mutate: deletePregunta, isLoading } = useMutation({
    mutationFn: async (data) => {
      await axios.delete('/api/preguntas/', { data })
    },
    onMutate: async () => {
      Swaly.fire({
        icon: 'info',
        text: 'Eliminando pregunta, por favor espere...',
        showConfirmButton: false
      })
    },
    onSuccess: () => {
      Toast.fire({
        icon: 'success',
        text: 'Pregunta eliminada'
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries('preguntas')
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
    deletePregunta,
    isLoading
  }
}

export function usePreguntaUpdate () {
  const queryClient = useQueryClient()
  const { mutate: updatePregunta, isLoading } = useMutation({
    mutationFn: async (data) => {
      const { data: pregunta } = await axios.put('/api/preguntas/', data)
      return pregunta
    },
    onMutate: async () => {
      Swaly.fire({
        icon: 'info',
        text: 'Actualizando pregunta, por favor espere...',
        showConfirmButton: false
      })
    },
    onSuccess: () => {
      Toast.fire({
        icon: 'success',
        text: 'Pregunta actualizada'
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries('preguntas')
    },
    onError: (error) => {
      console.log(error)
      Swaly.fire({
        icon: 'error',
        text: JSON.stringify(error?.response?.data) || JSON.stringify(error?.message) || 'Error al actualizar'
      })
    }
  })

  return {
    updatePregunta,
    isLoading
  }
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
