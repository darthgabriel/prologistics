import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout ({ children }) {
  return (
    <div className='container-fluid bg-white'>
      <div className='row flex-nowrap'>
        <div id='sidebar' className='col-md-2 bg-secondary min-vh-100 collapse collapse-horizontal'>
          <Sidebar />
        </div>
        <div className='col-md mx-0 px-0 '>
          <Header />
          <div className='container-fluid text-uppercase p-2'>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
