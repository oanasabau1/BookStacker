import React from 'react';
import './App.css';
import { Navbar } from './layout/navbar/Navbar'
import { ExploreTopBooks } from './layout/homepage/ExploreTopBooks';
import { Carousel } from './layout/homepage/Carousel';

function App() {
  return (
    <div>
    <Navbar />
    <ExploreTopBooks />
    <Carousel />
    </div>
  );
}

export default App;
