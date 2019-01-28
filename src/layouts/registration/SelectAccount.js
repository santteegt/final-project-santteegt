import React, {Component} from 'react'
import { hashHistory } from 'react-router'
import { connect } from "react-redux";
import { Link } from 'react-router'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import { Address } from "dapparatus"

import relayerImg from '../../img/relayer.png'
import fanImg from '../../img/fan.jpg'
import publisherImg from '../../img/publisher.jpg'

// import {getSupportEth, newPublisher} from '../../util/smartcontracts.js';

const mapStateToProps = state => {
  return {
      networkId: state.user.data.networkId,
      account: state.user.data.account,
      web3: state.user.web3
  };
};

class SelectAccount extends Component {
    state = {
        courses: [],
        searchString: '',
        web3: null,
        networkId: null,
        account: null
    }

    componentWillReceiveProps(props){
       //in your case this.props.storeCopy is redux state.
      //this function will be called every time state changes
      this.setState({
          networkId: props.networkId,
          web3: props.web3,
          account: props.account})
     }

    constructor() {
        super()
    }

    createPublisher = () => {
        // newPublisher(this.state.web3, this.state.account, this.state.networkId)
        //     .then(rs => console.log(`NEW PUB ${rs}`))
        // getSupportEth(this.state.web3, this.state.networkId).then((contract) => {
        //     console.log(`FOUND ${contract}`)
        // })
        hashHistory.push('/publisher')


    }

    // getCourses = () => {
    //     client.getEntries({
    //         content_type: 'course',
    //         query: this.state.searchString
    //     })
    //     .then((response) => {
    //         this.setState({courses: response.items})
    //     })
    //     .catch((error) => {
    //         console.log("Error occured while fetching data")
    //         console.log(error)
    //     })
    // }
    //
    // onSearchInputChange = (event) => {
    //     if (event.target.value) {
    //         this.setState({searchString: event.target.value})
    //     } else {
    //         this.setState({searchString: ''})
    //     }
    //     this.getCourses()
    // }

    render() {
        return (
            <div className="main-container">
                <Address
                  {...this.state}
                  address={this.props.account.toLowerCase()}
                />
                <div>
                    <Grid container spacing={24} style={{padding: 24}}>
                            <Grid item xs={12} sm={6} lg={4} xl={3}>
                                <Card>
                                    <CardMedia style={{height: 0, paddingTop: '56.25%'}}
                                        image={publisherImg}
                                        title="Publisher"
                                        />
                                    <CardContent>
                                        <Typography gutterBottom variant="headline" component="h2">
                                            Publisher: Earn for creating your amazing content
                                        </Typography>
                                        <Typography component="p">
                                            Accept subscriptions to your decentralized content
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Link to="" onClick={(event) => this.createPublisher(event)} className="pure-menu-link">Register as a Publisher</Link>
                                    </CardActions>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} lg={4} xl={3}>
                                <Card>
                                    <CardMedia style={{height: 0, paddingTop: '56.25%'}}
                                        image={relayerImg}
                                        title="Relayer"
                                        />
                                    <CardContent>
                                        <Typography gutterBottom variant="headline" component="h2">
                                            Relayer Support: Process subscription transactions
                                        </Typography>
                                        <Typography component="p">
                                            Register as a relayer to process subscription transactions
                                            and get full access to Publisher content as well as SupportEth tokens
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Link to="/relayer" className="pure-menu-link">Register as a Relayer</Link>
                                    </CardActions>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} lg={4} xl={3}>
                                <Card>
                                    <CardMedia style={{height: 0, paddingTop: '56.25%'}}
                                        image={fanImg}
                                        title="Fan Supporter"
                                        />
                                    <CardContent>
                                        <Typography gutterBottom variant="headline" component="h2">
                                            Fan Support: Subscribe and support Publisher content
                                        </Typography>
                                        <Typography component="p">
                                            Subscribe to Publishers content
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Link to="/fan" className="pure-menu-link">Register as a Fan</Link>
                                    </CardActions>
                                </Card>
                            </Grid>
                    </Grid>
                </div>
            </div>
        )
    }
}
const comp = connect(mapStateToProps)(SelectAccount);
export default comp;
