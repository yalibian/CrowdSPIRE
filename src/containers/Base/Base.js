import React, { PropTypes } from 'react';

const propTypes = {
  children: PropTypes.element.isRequired
};


const style = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column'
};


const BaseContainer = (props) => (
  <div style={style}>
    {props.children}
  </div>
);

BaseContainer.propTypes = propTypes;

export default BaseContainer;
