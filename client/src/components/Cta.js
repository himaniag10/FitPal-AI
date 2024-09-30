// src/components/Cta.js
import React from 'react';

const Cta = () => {
  return (
    <section id="cta" className="py-16 bg-teal-500 text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">Start Your Fitness Journey Today!</h2>
        <p className="text-xl mb-6">Join thousands of users who are already tracking their fitness goals.</p>
        <a href="#sign-up" className="bg-white text-teal-500 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100">Sign Up Now</a>
      </div>
    </section>
  );
};

export default Cta;
