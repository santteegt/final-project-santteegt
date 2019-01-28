import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'

import relayerImg from '../../img/relayer.png'
import fanImg from '../../img/fan.jpg'
import publisherImg from '../../img/publisher.jpg'


class Home extends Component {
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>SupportEth - A Decentralized Patreon</h1>
            <br />
            <p>SupportEth is a dApp which aims to serve as a decentralized Patreon platform where Publishers can share their contents and earn money with recurring payment subscriptions in any ERC20 token, and without any kind censorship from a central authority.</p>
            <br />
          </div>
        </div>
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
                        </Card>
                    </Grid>
            </Grid>
        </div>
      </main>
    )
  }
}

export default Home
