import React from 'react';

const JupiterLogo: React.FC<{ width?: number; height?: number }> = ({ width = 800, height = 279 }) => {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={'./remyswap.png'} width={width} height={height} alt="Jupiter aggregator" />;
};

export default JupiterLogo;
