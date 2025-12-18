import React from 'react';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-brand-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold gradient-text mb-8">
          Aspire AI - Styling Test
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">Test Card 1</h2>
            <p className="text-gray-300 mb-4">
              This card should have the dark background with gold accents.
            </p>
            <button className="btn-primary">Primary Button</button>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">Test Card 2</h2>
            <p className="text-gray-300 mb-4">
              This card should have the dark background with gold accents.
            </p>
            <button className="btn-secondary">Secondary Button</button>
          </div>
          
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">Test Card 3</h2>
            <p className="text-gray-300 mb-4">
              This card should have the dark background with gold accents.
            </p>
            <div className="gradient-text text-2xl font-bold">Gradient Text</div>
          </div>
        </div>
        
        <div className="constellation-bg p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-center mb-4">
            Constellation Background Test
          </h2>
          <p className="text-center text-gray-300">
            This section should have the animated constellation background.
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <a href="/" className="btn-primary mr-4">
            Back to Home
          </a>
          <a href="/admin" className="btn-secondary">
            Go to Admin
          </a>
        </div>
      </div>
    </div>
  );
}
