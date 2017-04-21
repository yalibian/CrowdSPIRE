/**
 * Created by Yali on 3/2/17.
 */

import React, {Component, PropTypes} from 'react';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.
import * as ListsActions from '../../actions/actions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';


function mapStateToProps(state) {
    return {
        data: state.model.data,
        crowd: state.model.crowd
    };
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators(ListsActions, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class SearchTerms extends React.Component {
    
    static propTypes = {
        searchTerms: PropTypes.func,
    };
    
    constructor() {
        super();
        this.state = {tags: []};
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange(tags) {
        this.setState({tags});
        this.props.searchTerms(tags);
    };
    
    render() {
        return <TagsInput value={this.state.tags} onChange={this.handleChange}/>
    }
}
