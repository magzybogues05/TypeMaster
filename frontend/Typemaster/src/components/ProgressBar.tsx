import React from 'react';

const ProgressBar = ({ progress }:{progress:number}) => {
  return (
    <div style={styles.container}>
      <div style={{ ...styles.bar, width: `${progress}%` }}>
        {progress}%
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '30px',
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#76c7c0',
    lineHeight: '30px',
    color: '#fff',
    textAlign: 'center',
    transition: 'width 0.5s ease-in-out',  // Smooth transition for width change
  },
};

export default ProgressBar;
