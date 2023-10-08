import Link from 'next/link'

export default function ConstruirMenu ({ menu = [], submenu = [] }) {
  return (
    <div className='d-flex justify-content-between'>
      <div className='m-1 btn-group'>
        {menu.map((item, index) => (
          <Link href={item.path} key={index} className='btn btn-primary'>
            <i className={`bi ${item.icon}`} />
            <br />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>

      <div className='m-1 btn-group'>
        {submenu.map((item, index) => (
          <Link href={item.path} key={index} className='btn btn-primary'>
            <i className={`bi ${item.icon}`} />
            <br />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>

    </div>
  )
}
