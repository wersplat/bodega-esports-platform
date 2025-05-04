import React from 'react';

export default function TestRender() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ fontSize: '2rem', color: '#fff' }}>Test Render Page</h1>
      <p style={{ fontSize: '1.2rem', color: '#fff' }}>
        This is a simple landing page to test rendering.
      </p>
      <button
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '1rem',
          color: '#fff',
          backgroundColor: '#007BFF',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={() => alert('Rendering works!')}
      >
        Test Button
      </button>
    </div>
  );
}
