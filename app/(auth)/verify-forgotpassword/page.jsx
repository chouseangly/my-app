import { Suspense } from 'react';
import VerifyForgotPasswordClient from './VerifyForgotPasswordClient';

export default function VerifyForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyForgotPasswordClient />
    </Suspense>
  );
}