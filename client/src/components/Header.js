// src/components/Header.js
import React from 'react';

const Header = () => {
  return (
    <header className="bg-cover bg-center h-screen" style={{ backgroundImage: "url('YOUR_IMAGE_URL_HERE')" }}>
      <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white">Track Your Fitness Journey</h1>
          <p className="text-xl text-white mt-4">Achieve your goals with our easy-to-use tracking tool.</p>
          <a href="#features" className="mt-6 inline-block bg-teal-500 text-white py-3 px-6 rounded-lg hover:bg-teal-600">Get Started</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
