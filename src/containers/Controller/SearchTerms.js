/**
 * Created by Yali on 3/2/17.
 */

import React, {Component, PropTypes} from 'react';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.

export default class SearchTerms extends React.Component {
    
    static propTypes = {
        searchTerms: PropTypes.func,
    };
    
    constructor() {
        super();
        this.state = {tags: ['hello', 'world']}
        this.handleChange = this.handleChange.bind(this);
    }
    
    handleChange (tags) {
        this.setState({tags});
        this.props.searchTerms(tags);
    };
    
    render() {
        return <TagsInput value={this.state.tags} onChange={this.handleChange}/>
    }
}
