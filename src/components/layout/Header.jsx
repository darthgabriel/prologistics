import React from 'react'

export default function Header () {
  return (
    <nav className='navbar navbar-expand-lg navbar-primary bg-primary d-print-none'>
      <a href='#' data-bs-target='#sidebar' data-bs-toggle='collapse' className='navbar-brand'>
        <i className='bi bi-list fs-5 px-2 text-secondary' />
      </a>
    </nav>
  )
}
