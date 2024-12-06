import React from 'react'
import Header from '../components/HeaderComponent/Header'
import Footer from '../components/FooterComponent/Footer'

const MainLayout = ({ children }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}

export default MainLayout
