
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">Pencak Silat Tournament Manager</h3>
            <p className="text-sm text-gray-400">Manage your tournaments with ease</p>
          </div>
          
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Pencak Silat Federation. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
