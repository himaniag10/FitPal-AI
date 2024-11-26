// src/components/SignUp.js
import React from 'react';

const SignUp = () => {
  return (
    <section id="sign-up" className="py-16 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">Sign Up Now</h2>
        <form className="max-w-lg mx-auto">
          <div className="mb-4">
            <input type="text" placeholder="Your Name" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="mb-4">
            <input type="email" placeholder="Your Email" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="mb-4">
            <input type="password" placeholder="Your Password" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <button type="submit" className="w-full bg-teal-500 text-white py-3 px-6 rounded-lg hover:bg-teal-600">Create Account</button>
        </form>
      </div>
    </section>
  );
};

export default SignUp;
