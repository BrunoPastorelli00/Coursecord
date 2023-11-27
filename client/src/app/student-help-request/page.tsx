"use client";

import React from 'react';
import Header from "../student-syllabus/components/Header";
import HelpRequestForm from './components/HelpRequestForm';

const Home = () => {
  return (
    <div className="bg-gray-100 h-screen">
      <Header />
      <div className="flex justify-center items-center h-screen">
        <HelpRequestForm />
      </div>
    </div>
  );
};

export default Home;
