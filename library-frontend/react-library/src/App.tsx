import React from 'react';
import './App.css';
import { Navbar } from './layout/navbar/Navbar'
import { Footer } from './layout/footer/Footer';
import { Homepage } from './layout/homepage/Homepage';

export const App = () => {
  return (
    <div>
    <Navbar />
    <Homepage />
    <Footer />
    </div>
  );
}

