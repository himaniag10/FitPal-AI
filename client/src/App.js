// src/App.js
import React from 'react';
import Header from './components/Header';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Cta from './components/Cta';
import SignUp from './components/SignUp';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Header />
      <Features />
      <Testimonials />
      <Cta />
      <SignUp />
      <Footer />
    </div>
  );
}

export default App;
