// src/app/admin/transactions/page.jsx

import { Suspense } from 'react';
import TransactionClient from './TransactionClient';

// This is a Server Component. It receives search parameters directly.
// We wrap TransactionClient in a Suspense boundary because it uses useSearchParams
// which is a client-side hook and would otherwise cause errors in a server component.
const TransactionsPage = ({ searchParams }) => {
    // searchParams are automatically populated by Next.js for server components
    // Example: /admin/transactions?status=Delivered&q=smartwatch&dateFrom=2023-09-01
    
    // Pass searchParams directly to the client component
    return (
        <Suspense fallback={<div className="text-center py-10 text-lg text-gray-600">Loading transactions...</div>}>
            <TransactionClient initialSearchParams={searchParams} />
        </Suspense>
    );
};

export default TransactionsPage;