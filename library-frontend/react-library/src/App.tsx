import React from 'react';
import './App.css';
import { Navbar } from './layout/navbar/Navbar'
import { Footer } from './layout/footer/Footer';
import { Homepage } from './layout/homepage/Homepage';
import { SearchBooksPage } from './layout/searchBooksPage/SearchBooksPage';

export const App = () => {
  return (
    <div>
    <Navbar />
    {/* <Homepage /> */}
    <SearchBooksPage />
    <Footer />
    </div>
  );
}

