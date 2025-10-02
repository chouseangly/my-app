import Brand from '@/components/landing/Brand'
import LandingPage from '../../components/landing/LandingPage'
import ProductGrid from '@/components/landing/ProductGrid'
import React from 'react'


const page = () => {
  return (
    <div className='w-full mx-auto px-[3%]'>
      <LandingPage  />
      <Brand />
      <ProductGrid />
    </div>
  )
}

export default page
