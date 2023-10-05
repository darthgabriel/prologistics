import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

const ReactSwal = withReactContent(
  Swal.mixin({
    showConfirmButton: false,
    width: '90%'
  })
)

const Swaly = Swal.mixin()

export { ReactSwal, Swaly, Toast }
