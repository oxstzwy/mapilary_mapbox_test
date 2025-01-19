import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Bem vindos ao Teste utilizando Mapillary e Mapbox de Matheus</h1>
        <p className="text-xl text-gray-600">Testes executados no âmbito do Campus Map UFAM e FAEXP</p>
      </div>
      <Link
        to="/map"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        Open Map
      </Link>
    </div>
  );
};

export default Index;
