import React from 'react'

export default function InputControl (props) {
  return (
    <>
      {props?.label && (
        <label className='form-label'>{props.label}</label>
      )}
      <input
        type={props.type}
        className='form-control form-control-sm'
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        {...props}
      />
    </>
  )
}
