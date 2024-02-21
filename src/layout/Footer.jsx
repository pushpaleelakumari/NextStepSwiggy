import React from 'react'
import HeaderSvg from './HeaderSvg'

function Footer() {
  return (
    <section className='bg-dark' style={{ height: '25vh' }}>
      <div className='container pt-5 px-5 '>
        <div className='d-flex gap-3 fs-2 align-items-center'>
          <HeaderSvg fill='white' />
          <b className='text-white'>Swiggy</b>
        </div>
        <div className='mt-3' style={{color:'#808080'}}>
          © 2023 Bundl Technologies Pvt Ltd
        </div>
      </div>
    </section>
  )
}

export default Footer