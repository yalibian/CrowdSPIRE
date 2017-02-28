/**
 * Created by Yali on 2/26/17.
 */

import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as ListsActions from '../../actions/lists';
import Header from '../Header/Header'
import Vis from '../Vis/Vis'
import Controller from '../Controller/Controller'


function mapStateToProps(state) {
  return {
    data: state.lists.data,
    crowd: state.lists.crowd
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ListsActions, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Workspace extends Component {
  static propTypes = {
    getLists: PropTypes.func.isRequired,
    data: React.PropTypes.object,
    crowd: React.PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  componentWillMount(){
    this.props.getLists();
  }


  render() {
    const {data, crowd} = this.props;

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
            <Vis data={data} crowd={crowd}/>
          </div>
          <Controller/>
        </div>
    );
  }
}
