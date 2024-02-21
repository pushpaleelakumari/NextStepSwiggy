import React from 'react'
import HeaderSvg from './HeaderSvg'

function Header() {
  return (
    <div>
      <header className="header navbar border-0 navbar-expand-lg bg-white"
        style={{ boxShadow: "0px 2px 4px rgba(0,0,0,0.1)" }}
      >
        <div className="container">
          <a href="/" className="navbar-brand pe-3 d-flex gap-2 justify-content-center align-items-center">
            <HeaderSvg />
            <b className='color-orange'>SWIGGY</b>
          </a>
          <div id="navbarNav" className="offcanvas offcanvas-end">
            <div className="offcanvas-header border-bottom">
              <h5 className="offcanvas-title">Menu</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item contact-new-item">
                  <input
                    className="form-control"
                    type="search"
                    placeholder="search"
                  />
                </li>
              </ul>
            </div>
          </div>
          <button
            type="button"
            className="navbar-toggler"
            data-bs-toggle="offcanvas"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <b>
              <i className='fe fe-list'></i>
            </b>
          </button>
        </div>
      </header>
    </div>
  )
}

export default Header