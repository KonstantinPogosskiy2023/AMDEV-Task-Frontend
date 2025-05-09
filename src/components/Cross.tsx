import React from 'react';

const Cross = () => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '0',
          width: '100%',
          height: '1px',
          backgroundColor: 'red',
          transform: 'rotate(-45deg)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '0',
          width: '100%',
          height: '1px',
          backgroundColor: 'red',
          transform: 'rotate(45deg)',
        }}
      />
    </div>
  );
};

export default Cross;
