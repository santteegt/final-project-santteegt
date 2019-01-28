import React, { Component } from 'react'
import { connect } from "react-redux";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { getIPFS, encodeData, getBytes32FromMultiash, getMultihashFromBytes32 } from '../../util/ipfs'

const mapStateToProps = state => {
    console.log('dashboard')
    console.log(state)
  return { something: state.user.something };
};

class Dashboard extends Component {

    state = {
        multihash: "Qmb4PLZgD6FfGTvGiWkCgRqzZEvH1A5h9L4vDaYVq31Cyk"
    };

  constructor(props, { authData }) {
    super(props)
    authData = this.props
    this.testContractCall = this.testContractCall.bind(this)
  }

  testContractCall(event) {
      event.preventDefault()
      console.log('entra')

      const mh = getBytes32FromMultiash(this.state.multihash)
      console.log(mh)

      const hash = getMultihashFromBytes32(mh)
      console.log(hash)

      // const ipfs = getIPFS()
      // let content = encodeData(ipfs, 'ABC')
      // ipfs.add(content, (err, res) => {
      //     console.log(err)
      //     console.log(res)
      // })


  }

  render() {

    const { multihash } = this.state

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Dashboard (IF YOU SEE THIS. YOU ARE IN THE WRONG NETWORK. PLEASE CONNECT TO YOUR LOCAL TESTNET)</h1>
            <p><strong>Congratulations {this.props.authData.name}!</strong> If you're seeing this page, you've logged in with UPort successfully.</p>
            <TextField
              id="standard-name"
              label="Head Image URL"
              value={multihash}
              margin="normal"
            />
            <Button variant="contained" onClick={(event) => this.testContractCall(event)}>
            Default
            </Button>
          </div>
        </div>
      </main>
    )
  }
}

// export default Dashboard
const dashboard = connect(mapStateToProps)(Dashboard);
export default dashboard;
