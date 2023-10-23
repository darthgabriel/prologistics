const { default: axios } = require('axios')
const { Swaly } = require('./toastSwal')

export const fetchCuestionario = async () => {
  try {
    const { data } = await axios.get('/api/encuestas/')
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

export const fetchPreguntas = async () => {
  try {
    const { data } = await axios.get('/api/preguntas/')
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
