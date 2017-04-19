/**
 * Created by Yali on 4/19/17.
 */

// Header: CrowdSPIRE ICON and controller
import React from 'react';
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
    
    constructor(props) {
        super(props);
        this.state = {
            value: 3,
        };
    }
    
    handleChange = (event, index, value) => this.setState({value});
    
    render() {
        return (
            <Toolbar>
                <ToolbarGroup>
                    <ToolbarTitle text="CrowdSPIRE" />
                    <ToolbarSeparator />
                    <SearchTerms/>
                </ToolbarGroup>
    
                <ToolbarGroup>
                        <RadioButtonGroup name="shipSpeed" defaultSelected="not_light">
                        <RadioButton
                            value="not_light"
                            label="Exploratory"
                            style={styles.radioButton}
                        />
                        <RadioButton
                            value="light"
                            label="Expressive"
                            style={styles.radioButton}
                        />
                        
                    </RadioButtonGroup>
                    <RaisedButton label="Update Layout" />
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
