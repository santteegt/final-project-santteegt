import React, { Component } from 'react'
import { connect } from "react-redux";

import { getIPFS, encodeData } from '../../util/ipfs'

import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const mapStateToProps = state => {
  return { };
};

class Fan extends Component {

    state = { tab: 0 };

    handleChange = (event, tab) => {
        this.setState({ tab });
    };

  constructor(props, { authData }) {
    super(props)
    authData = this.props
  }

  render() {
      const { tab } = this.state;
      return(
          <div className="main-container">
              <h1>Fan</h1>
              <Tabs value={tab} onChange={this.handleChange}>
                  <Tab label="Following" />
                  <Tab label="Subscriptions" />
              </Tabs>
              {tab === 0 ? (
                  <h2>Following</h2>
              ):null}
              {tab === 1 ? (
                  <h2>Subscriptions</h2>
              ):null}
          </div>
      )
  }
}

const fan = connect(mapStateToProps)(Fan);
export default fan;
