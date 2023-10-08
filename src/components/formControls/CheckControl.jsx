export default function CheckControl (props) {
  return (
    <>
      <div className='form-check'>
        <input
          type='checkbox'
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
