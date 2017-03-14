/**
 * Created by Yali on 2/28/17.
 */

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as ListsActions from '../../actions/actions';

import {Tabs, Tab} from 'material-ui/Tabs';
import SearchTerms from './SearchTerms'

function mapStateToProps(state) {
    return {
        nodes: state.model.nodes,
        links: state.model.links
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ListsActions, dispatch);
}

const styles = {
    headline: {
        fontSize: 24,
        // fontSize: 24,
        // paddingTop: 16,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
    },
};

const controllerStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '500px',
    top: '0',
    minWidth: '300px',
    width: '100%',
    // height: '24px',
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

const buttonStyle = {
    height: '30px'
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ControllerTabs extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            value: 'a',
        };
    }
    
    handleChange = (value) => {
        this.setState({
            value: value,
        });
    };
    
    
    render() {
        return (
            <Tabs
                value={this.state.value}
                onChange={this.handleChange}
                style={controllerStyle}>
                <Tab label="Entity" buttonStyle={buttonStyle} value="a">
                    {/*<SearchTerms searchTerms={this.props.searchTerms}/>*/}
                    <SearchTerms />
                    <div>
                        <h2 style={styles.headline}>Controllable Tab A</h2>
                        <p>
                            Tabs are also controllable if you want to programmatically pass them their values.
                            This allows for more functionality in Tabs such as not
                            having any Tab selected or assigning them different values.
                        </p>
                    </div>
                </Tab>
                <Tab label="Document" buttonStyle={buttonStyle} value="b">
                    <div>
                        <h2 style={styles.headline}>Controllable Tab B</h2>
                        <p>
                            This is another example of a controllable tab. Remember, if you
                            use controllable Tabs, you need to give all of your tabs values or else
                            you wont be able to select them.
                        </p>
                    </div>
                </Tab>
                <Tab label="Cluster" buttonStyle={buttonStyle} value="c">
                    <div>
                        <h2 style={styles.headline}>Controllable Tab C</h2>
                        <p>
                            This is another example of a controllable tab. Remember, if you
                            use controllable Tabs, you need to give all of your tabs values or else
                            you wont be able to select them.
                        </p>
                    </div>
                </Tab>
            
            </Tabs>
        );
    }
}
