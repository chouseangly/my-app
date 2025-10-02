import React, { Suspense } from 'react';
import CustomerClient from './customerClient';


const CustomersPage = () => {
    return (
        <div>
            <Suspense fallback={<div className="text-center py-10">Loading Customers...</div>}>
                <CustomerClient />
            </Suspense>
        </div>
    );
};

export default CustomersPage;