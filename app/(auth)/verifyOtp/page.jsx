import { Suspense } from 'react'; 
import VerifyOTPClient from './VerifyOTPClient'; 

export default function VerifyOTPPage() { 
  return ( 
    <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}> 
      <VerifyOTPClient /> 
    </Suspense> 
  ); 
}