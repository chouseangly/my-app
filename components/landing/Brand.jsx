import React from 'react'

const Brand = () => {
  return (
    <div className='w-full mx-auto mt-5'>
 
      <div className='flex justify-around items-center flex-wrap px-4'>
        <img src="/brand/ZandoNoBorder.jpg" alt="Zando logo" className='h-50 w-auto object-contain' />
        <img src="/brand/Ten11NoBorder.jpg" alt="Ten11 logo" className='h-50 w-auto object-contain' />
        <img src="/brand/gatoni.png" alt="Gotoni logo" className='h-50 w-auto object-contain' />
        <img src="/brand/RoutineNoBorder.jpg" alt="Routine logo" className='h-50 w-auto object-contain' />
        <img src="/brand/361NoBorder.jpg" alt="361 Degrees logo" className='h-50 w-auto object-contain' />
        <img src="/brand/SISBURMA.jpg" alt="Sis Burma logo" className='h-50 w-auto object-contain' />
      </div>
      <div className='flex justify-around items-center flex-wrap px-2 mt-5'>
        <img className='w-[30%] h-100' src="/ban1.jpg" alt="" />
        <img className='w-[30%] h-100' src="/ban2.jpg" alt="" />
        <img className='w-[30%] h-100' src="/ban3.jpg" alt="" />
      </div>
      <div className='flex justify-content-around gap-6 mt-5 px-8'>
        <img className='w-[50%] h-[90vh]' src="/ban4.jpg" alt="" />
        <img className='w-[50%] h-[90vh]' src="/ban5.jpg" alt="" />
      </div>

    
    </div>
  )
}

export default Brand