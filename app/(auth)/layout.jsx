// src/app/(auth)/layout.js


export const metadata = {
  title: 'Login / Register - Zando',
};

export default function AuthLayout({ children }) {
  return (
   <div>
    {children}
   </div>
  );
}