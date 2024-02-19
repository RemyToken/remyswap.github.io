
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const AppHeader: React.FC<{}> = () => {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const handleToggleMenu = () => setOpenMobileMenu(!openMobileMenu);

  useEffect(() => {
    const body = document.querySelector('body');
    if (openMobileMenu) {
      body!.style.overflow = 'hidden';
    } else {
      body!.style.overflow = '';
    }
  }, [openMobileMenu]);

  return (
    <>
      
      <div className="flex items-center justify-between w-full bg-white">
        <div className="flex items-center flex-1 p-4">
          <a href="/" className="flex-1">
            <h1 className="flex items-center text-lg font-semibold text-white">
              <img src={'/remyswap.png'} width={250} height='auto' alt="Jupiter aggregator" />
            </h1>
          </a>
        </div>

        <div className="flex-1" />
      </div>
    </>
    
  );
};

export default AppHeader;
