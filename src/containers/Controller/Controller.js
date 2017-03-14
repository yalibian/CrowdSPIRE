/**
 * Created by Yali on 2/27/17.
 */

// import React from 'react'
import React, {Component, PropTypes} from 'react';
import ControllerTabs from './ControllerTabs'

const controllerStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '500px',
    top: '0',
    minWidth: '300px',
    width: '25%',
    borderLeft: 'solid 1px #ccc'
};

const style1 = {
    fontWeight: 'normal',
    color: '#CCC',
    padding: '5px',
    fontSize: '20px',
    margin: 0,
    borderBottom: 'solid 1px #ccc'
};


export default class Controller extends Component {
    
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div id="controller" style={controllerStyle}>
                <h1 style={style1}>Controller</h1>
                <ControllerTabs/>
            </div>
        );
    }
}

