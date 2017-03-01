/**
 * Created by Yali on 2/28/17.
 */

import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
// Needed for onTouchTap
// var injectTapEventPlugin = require("react-tap-event-plugin");
// injectTapEventPlugin();




const styles = {
  headline: {
    fontSize: 24,
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
  borderLeft: 'solid 1px #ccc'
};


const style1 = {
  fontWeight: 'normal',
  color: '#CCC',
  padding: '5px',
  fontSize: '20px',
  margin:0,
  borderBottom: 'solid 1px #ccc'
};


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
        style={controllerStyle}
      >
        <Tab label="Tab A" value="a">
          <div>
            <h2 style={styles.headline}>Controllable Tab A</h2>
            <p>
              Tabs are also controllable if you want to programmatically pass them their values.
              This allows for more functionality in Tabs such as not
              having any Tab selected or assigning them different values.
            </p>
          </div>
        </Tab>
        <Tab label="Tab B" value="b">
          <div>
            <h2 style={styles.headline}>Controllable Tab B</h2>
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
