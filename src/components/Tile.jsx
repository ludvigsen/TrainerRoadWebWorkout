import React from 'react';

import Global from '../styles/Global'

const style = {
  cursor: 'pointer',
  fontSize: '1vw'
}

function isDisabled(value) {
  return (value && !isNaN(value) && value >= 0) || value && value.length > 0;
}

const Tile = ({title, value, width, onClick = () => {} }) => (
  <div style={{...style, width}} onClick={onClick}>
    <h3>{title}</h3>
    <h2 style={{fontSize: '5vw', color: isDisabled(value)? Global.foreground : Global.disabled}}>{isDisabled(value) ? value : '---'}</h2>
  </div>
)

export default Tile;
