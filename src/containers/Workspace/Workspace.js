/**
 * Created by Yali on 2/26/17.
 */

import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as ListsActions from '../../actions/actions';
// import Vis from '../Vis/Vis'
import Visualization from '../Visualization/Visualization'
import Controller from '../Controller/Controller'


function mapStateToProps(state) {
    return {
        data: state.model.data,
        crowd: state.model.crowd,
        nodes: state.model.nodes,
        links: state.model.links,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ListsActions, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Workspace extends Component {
    static propTypes = {
        // getLists: PropTypes.func.isRequired,
        getData: PropTypes.func.isRequired,
        searchTerms: PropTypes.func.isRequired,
        highlightText: PropTypes.func.isRequired,
        clusterDocuments: PropTypes.func.isRequired,
        annotateDocument: PropTypes.func.isRequired,
        pinDocument: PropTypes.func.isRequired,
        
        nodes: React.PropTypes.array,
        links: React.PropTypes.array,
    };
    
    constructor(props) {
        super(props);
        this.searchTerms = this.searchTerms.bind(this);
        this.highlightText = this.highlightText.bind(this);
        this.clusterDocuments = this.clusterDocuments.bind(this);
        this.annotateDocument = this.annotateDocument.bind(this);
        this.pinDocument = this.pinDocument.bind(this);
    }
    
    componentWillMount() {
        this.props.getData();
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
    
    render() {
        const {data, crowd, nodes, links} = this.props;
        
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
                    <h1 id="vis-bar" style={visBarStyle}>WorkSpace</h1>
                    <Visualization nodes={nodes} links={links}/>
                </div>
                {/*<ControllerTabs/>*/}
                <Controller/>
            </div>
        );
    }
}
