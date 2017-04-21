/**
 * Created by Yali on 4/19/17.
 */

// Header: CrowdSPIRE ICON and controller
import React, {Component, PropTypes} from 'react';
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
        requireLayoutUpdate: PropTypes.func.isRequired,
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
                    <RadioButtonGroup name="shipSpeed" defaultSelected="exploratory" onChange={(event, value) => {
                        this.props.changeMovementMode(value);
                    }}>
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
                    <RaisedButton label="Update Layout" onClick={()=>{
                        this.props.requireLayoutUpdate();
                    }}/>
                    <ToolbarSeparator />
                    <RaisedButton
                        href="https://github.com/yalibian/CrowdSPIRE"
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
