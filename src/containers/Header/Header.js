/**
 * Created by Yali on 2/26/17.
 */
import React from 'react'
import {IndexLink, Link} from 'react-router'
// import './Header.scss'

const headerStyle = {
  minHeight: '35px',
  height: '2%',
  backgroundColor: '#074563',
  color: 'white',
  overflow: 'hidden',
  position: 'relative'
};

const style1 = {
  margin: 0,
  height: '30px',
  display: 'inline-block',
  width: '500px',
  position: 'absolute',
  marginRight: '10px'
};

const h1Style = {
  margin: 0,
  height: '60px',
  padding: '10px',
  fontSize: '20px'
};

const spanStyle = {
  fontWeight: 'normal'
};

export const Header = () => (
    <div id="header"
         style={headerStyle}>
      <div style={style1}>
        <h1 style={h1Style}>
          <span style={spanStyle}>CrowdSPIRE</span>
        </h1>
      </div>
    </div>
)

export default Header
