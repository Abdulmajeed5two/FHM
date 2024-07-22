import React from 'react';

const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div className="loader"></div>
    <style jsx>{`
      .loader {
        border: 8px solid rgba(239, 68, 68, 0.2);
        border-left: 8px solid #ef4444;
        border-radius: 50%;
        width: 60px;
        height: 60px; 
        animation: spin 1.5s linear infinite;
        box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
        margin-bottom: 16px;
      }
      .loader-text {
        font-size: 1.2rem;
        font-weight: 600;
        color: #ef4444;
        animation: fadeInOut 2s ease-in-out infinite;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes fadeInOut {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }
    `}</style>
  </div>
);

export default Loader;
