// chouseangly/my-app/my-app-main/components/landing/Brand.jsx

import React from 'react'

const Brand = () => {
  return (
    <div className='w-full mx-auto mt-5'>
 
      {/* FIX: Responsive logo grid - Wraps logos and limits their height on mobile */}
      <div className='flex justify-around items-center px-4 gap-4 sm:gap-8 overflow-auto scroll-auto'>
        <img src="/brand/ZandoNoBorder.jpg" alt="Zando logo" className='h-20 sm:h-24 md:h-40 w-auto object-contain flex-grow' />
        <img src="/brand/Ten11NoBorder.jpg" alt="Ten11 logo" className='h-20 sm:h-24 md:h-40 w-auto object-contain flex-grow' />
        <img src="/brand/gatoni.png" alt="Gotoni logo" className='h-20 sm:h-24 md:h-40 w-auto object-contain flex-grow' />
        <img src="/brand/RoutineNoBorder.jpg" alt="Routine logo" className='h-20 sm:h-24 md:h-40 w-auto object-contain flex-grow' />
        <img src="/brand/361NoBorder.jpg" alt="361 Degrees logo" className='h-20 sm:h-24 md:h-40 w-auto object-contain flex-grow' />
        <img src="/brand/SISBURMA.jpg" alt="Sis Burma logo" className='h-20 sm:h-24 md:h-40 w-auto object-contain flex-grow' />
      </div>
      
      {/* FIX: Responsive 3-column image section - Stacks on mobile, splits into 3 columns on desktop */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 px-4'>
        <img className='w-full h-80 object-cover rounded-lg' src="/ban1.jpg" alt="Lifestyle" />
        <img className='w-full h-80 object-cover rounded-lg' src="/ban2.jpg" alt="Sportlife" />
        <img className='w-full h-80 object-cover rounded-lg' src="/ban3.jpg" alt="Smart Casual" />
      </div>

      {/* FIX: Responsive 2-column image section - Stacks on mobile, splits into 2 columns on desktop */}
      <div className='flex flex-col lg:flex-row justify-around gap-6 mt-5 px-4 lg:px-8'>
        <img className='w-full lg:w-[50%] h-[50vh] lg:h-[90vh] object-cover rounded-lg' src="/ban4.jpg" alt="Tops Collection" />
        <img className='w-full lg:w-[50%] h-[50vh] lg:h-[90vh] object-cover rounded-lg' src="/ban5.jpg" alt="Bottoms Collection" />
      </div>
    
    </div>
  )
}

export default Brand