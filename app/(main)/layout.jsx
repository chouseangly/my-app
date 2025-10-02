import React from 'react'
import AuthNavbar from "@/components/navbar/AuthNavbar"
import Footer from '@/components/landing/Footer'

const MainLayout = ({children}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <AuthNavbar />
      <main className="flex-grow pt-[2px] md:pt-[7px] lg:pt-0"> 
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout