/**
 * Created by Yali on 2/26/17.
 */

import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as ListsActions from '../../actions/actions';
// import Vis from '../Vis/Vis'
import Visualization from '../Visualization/Visualization'
// import Controller from '../Controller/Controller'
import Header from "../Header/Header";

function mapStateToProps(state) {
    return {
        nodes: state.model.nodes,
        links: state.model.links,
        movementMode: state.model.movementMode,
        interaction: state.model.interaction,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ListsActions, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Workspace extends Component {
    static propTypes = {
        searchTerms: PropTypes.func.isRequired,
        highlightText: PropTypes.func.isRequired,
        clusterDocuments: PropTypes.func.isRequired,
        annotateDocument: PropTypes.func.isRequired,
        pinDocument: PropTypes.func.isRequired,
        changeMovementMode: PropTypes.func.isRequired,
        requireLayoutUpdate: PropTypes.func.isRequired,
        
        nodes: React.PropTypes.array,
        links: React.PropTypes.array,
        movementMode: PropTypes.string.isRequired,
        interaction: PropTypes.string,
    };
    
    constructor(props) {
        super(props);
        this.searchTerms = this.searchTerms.bind(this);
        this.highlightText = this.highlightText.bind(this);
        this.clusterDocuments = this.clusterDocuments.bind(this);
        this.annotateDocument = this.annotateDocument.bind(this);
        this.pinDocument = this.pinDocument.bind(this);
        this.changeMovementMode = this.changeMovementMode.bind(this);
        this.requireLayoutUpdate = this.requireLayoutUpdate.bind(this);
    }
    
    searchTerms(keywords) {
        this.props.searchTerms(keywords);
    }
    
    highlightText(text) {
        this.props.highlightText(text);
    }
    
    clusterDocuments(docs) {
        this.props.clusterDocuments(docs);
    }
    
    annotateDocument(text, doc) {
        this.props.annotateDocument(text, doc);
    }
    
    pinDocument(doc) {
        this.props.pinDocument(doc);
    }
    
    changeMovementMode(mode) {
        this.props.changeMovementMode(mode);
    }
    
    requireLayoutUpdate(nodes){
        this.props.requireLayoutUpdate(nodes);
    }
    
    render() {
        const {nodes, links} = this.props;
        
        const mainStyle = {
            position: 'relative',
            display: 'flex',
            alignSelf: 'stretch',
            flexGrow: 1,
            height: '100%'
        };
        
        const workspaceStyle = {
            flexDirection: 'column',
            position: 'relative',
            display: 'flex',
            alignSelf: 'stretch',
            flexGrow: 1,
            minHeight: '500px',
            height: '100%',
            width: '75%'
        };
        
        const visBarStyle = {
            fontWeight: 'normal',
            color: '#CCC',
            padding: '5px',
            fontSize: '20px',
            margin: 0,
            borderBottom: 'solid 1px #ccc'
        };
        
        return (
            <div id="main" style={mainStyle}>
                <div id="workspace"
                     style={workspaceStyle}>
                    <Header changeMovementMode={this.changeMovementMode} requireLayoutUpdate={this.requireLayoutUpdate}/>
                    <Visualization movementMode={this.props.movementMode} interaction={this.props.interaction}/>
                </div>
                {/*<Controller/>*/}
            </div>
        );
    }
}
