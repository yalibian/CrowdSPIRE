import React, { PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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
  <MuiThemeProvider>
  <div style={style}>
    {props.children}
  </div>
  </MuiThemeProvider>
);

BaseContainer.propTypes = propTypes;

export default BaseContainer;
