// AdminLayout.js
import React from 'react'
import { Outlet } from 'react-router-dom'
import Headre from './Header'
import Footer from './Footer'

const AdminLayout = () => {
    return (
        <div>
            <div className='sticky'>
                <Headre />
            </div>
            <Outlet />
            <Footer />
        </div>
    )
}

export default AdminLayout
