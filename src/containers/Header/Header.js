/**
 * Created by Yali on 4/19/17.
 */

// Header: CrowdSPIRE ICON and controller
import React, {Component, PropTypes} from 'react';
// import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import SearchTerms from "./SearchTerms";

const styles = {
    block: {
        maxWidth: 2530,
    },
    radioButton: {
        marginBottom: 0,
    },
};

export default class Header extends React.Component {
    
    static propTypes = {
        changeMovementMode: PropTypes.func.isRequired,
    };
    
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <Toolbar>
                <ToolbarGroup>
                    <ToolbarTitle text="CrowdSPIRE"/>
                    <ToolbarSeparator />
                    <SearchTerms/>
                </ToolbarGroup>
                
                <ToolbarGroup>
                    <RadioButtonGroup name="shipSpeed" defaultSelected="exploratory" onChange={(event, value)=>{this.props.changeMovementMode(value);}}>
                        <RadioButton
                            // value="not_light"
                            value="exploratory"
                            label="Exploratory"
                            style={styles.radioButton}
                        />
                        <RadioButton
                            value="expressive"
                            label="Expressive"
                            style={styles.radioButton}
                        />
                    </RadioButtonGroup>
                    <RaisedButton label="Update Layout"/>
                    <ToolbarSeparator />
                    <RaisedButton
                        href="https://github.com/callemall/material-ui"
                        target="_blank"
                        secondary={true}
                        label="GITHUB"
                        style={{
                            margin: 12,
                        }}
                    />
                </ToolbarGroup>
            </Toolbar>
        );
    }
}
