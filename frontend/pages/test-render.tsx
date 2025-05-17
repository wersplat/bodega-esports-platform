import React from 'react';
import { Button } from "@/components/ui/button";

const TestRender: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ fontSize: '2rem', color: '#fff' }}>Test Render Page</h1>
      <p style={{ fontSize: '1.2rem', color: '#fff' }}>
        This is a simple landing page to test rendering.
      </p>
      <Button
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '1rem',
        }}
        onClick={() => alert('Rendering works!')}
      >
        Test Button
      </Button>
    </div>
  );
};

export default TestRender;
