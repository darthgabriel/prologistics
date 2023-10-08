export default function RadioControl (props) {
  return (
    <>
      <div className='form-check'>
        <input
          type='radio'
          className='form-check-input'
          name={props.name}
          checked={props.checked}
          onChange={props.onChange}
        />
        <label className='form-check-label'>{props.label}</label>
      </div>
    </>
  )
}
