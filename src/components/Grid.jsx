import React from 'react';

const style = {
  display: 'flex',
  flexWrap: 'wrap'
};

const Grid = ({children}) => (<div style={{...style}}>
  {children}
</div>) 

export default Grid;
