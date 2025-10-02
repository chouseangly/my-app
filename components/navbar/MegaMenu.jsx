import React from 'react';
import Link from 'next/link';

// FIX: Accept the 'onClose' prop
const MegaMenu = ({ category, onClose }) => {
  if (!category || !category.children) {
    return null;
  }

  const subCategoriesWithItems = category.children.filter(
    (subCat) => subCat.children && subCat.children.length > 0
  );

  return (
    <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-6 gap-x-8 py-6 px-10 max-w-7xl mx-auto">
        {subCategoriesWithItems.map((subCategory) => (
          <div key={subCategory.id}>
            <h3 className="font-bold text-red-600 uppercase text-sm mb-3 tracking-wider">
              {/* FIX: Add onClick to the Link */}
              <Link href={`/category/${subCategory.id}`} onClick={onClose} className="hover:underline">
                {subCategory.name}
              </Link>
            </h3>
            <ul className="space-y-2">
              {subCategory.children.map((child) => (
                <li key={child.id}>
                  {/* FIX: Add onClick to the Link */}
                  <Link href={`/category/${child.id}`} onClick={onClose} className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white text-sm">
                    {child.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MegaMenu;
