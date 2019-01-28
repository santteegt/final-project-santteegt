import React, { Component } from 'react'
import { connect } from "react-redux";

import { getIPFS, encodeData } from '../../util/ipfs'

import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const mapStateToProps = state => {
  return { };
};

class Relayer extends Component {
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
              <h1>Publisher ( NOT YED IMPLEMENTED :'( )</h1>
              <Tabs value={tab} onChange={this.handleChange}>
                  <Tab label="Settings" />
                  <Tab label="Transactions" />
              </Tabs>
              {tab === 0 ? (
                  <h2>Settings</h2>
              ):null}
              {tab === 1 ? (
                  <h2>Transactions</h2>
              ):null}
          </div>
      )
  }
}

const relayer = connect(mapStateToProps)(Relayer);
export default relayer;
