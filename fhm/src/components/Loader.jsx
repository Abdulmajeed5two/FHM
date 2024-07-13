import React from 'react';

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="loader"></div>
    <p className="ml-3">Welcome</p>
    <style jsx>{`
      .loader {
        border: 8px solid #ef4444;
        border-top: 8px solid #f87171;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 2s linear infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default Loader;
