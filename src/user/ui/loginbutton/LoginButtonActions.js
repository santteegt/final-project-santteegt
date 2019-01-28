// import { uport } from './../../../util/connectors.js'
// import { browserHistory as BH, hashHistory } from 'react-router'
import { hashHistory } from 'react-router'
// import { Credentials } from 'uport-connect'
import getWeb3 from '../../../util/web3.js';
import { getAdminAccount } from '../../../util/smartcontracts.js';

// let browserHistory = process.env.NODE_ENV == 'development'? BH:hashHistory
let browserHistory = hashHistory
export const USER_LOGGED_IN = 'USER_LOGGED_IN'

function userLoggedIn(login) {
    console.log(`LOGIN`)
    console.log(login)
    return {
        type: USER_LOGGED_IN,
        payload: login.payload
    }
}

async function manageRedirect(account, web3, networkId) {

    const admin = await getAdminAccount(web3, networkId)
    console.log(`ADMIN ${admin}`)

    if(account == admin) {
        let currentLocation = browserHistory.getCurrentLocation()
        console.log(currentLocation)
        if ('redirect' in currentLocation.query) {
          return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
        }
        return browserHistory.push('/dashboard')
    } else {
        return browserHistory.push('/register')
    }

}

export function loginMetamask() {
    return async function(dispatch) {
        try {

            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            console.log(accounts);
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            console.log(networkId);
            // const deployedNetwork = SimpleStorageContract.networks[networkId];
            // console.log(deployedNetwork);
            dispatch(userLoggedIn({
                payload: {
                    loginClient: 'metamask',
                    account: accounts[0],
                    networkId: networkId,
                    web3: web3
                }
            }))

            if(parseInt(networkId) != 4 && parseInt(networkId) < 100) {
                alert('Please connect to a local testnet or Rinkeby')
            } else {
                manageRedirect(accounts[0], web3, networkId)
            }
            // Used a manual redirect here as opposed to a wrapper.
            // This way, once logged in a user can still access the home page.
            // let currentLocation = browserHistory.getCurrentLocation()
            //
            // console.log(currentLocation)
            //
            // if ('redirect' in currentLocation.query)
            // {
            //   return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
            // }
            //
            // return browserHistory.push('/dashboard')
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
            `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    }

}

export function loginUport() {
  return function(dispatch) {
      alert('uport')
    // // UPort and its web3 instance are defined in ./../../../util/wrappers.
    // // Request uPort persona of account passed via QR
    // const req = {
    //             requested: ['name', 'phone', 'country'],
    //             notifications: true }
    // const reqID = 'disclosureReq'
    // uport.requestDisclosure(req, reqID)
    // uport.onResponse(reqID).then(credentials => {
    //   console.log(credentials)
    //   // let cred = new Credentials({
    //   //     did: uport.credentials.did,
    //   //     signer: uport.credentials.signer
    //   // })
    //   // console.log(cred)
    //   dispatch(userLoggedIn({
    //       payload: {
    //           loginClient: 'uport',
    //           credentials: credentials
    //       }
    //   }))
    //
    //   // Used a manual redirect here as opposed to a wrapper.
    //   // This way, once logged in a user can still access the home page.
    //   // var currentLocation = browserHistory.getCurrentLocation()
    //
    //   // if ('redirect' in currentLocation.query)
    //   // {
    //   //   return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
    //   // }
    //
    //   // return browserHistory.push('/dashboard')
    // }).catch(err => console.log(err))


    // uport.requestCredentials({
    //     requested: ["name", "phone", "country"],
    //     notifications: true // We want this if we want to recieve credentials
    //   }).then((credentials) => {
    //   dispatch(userLoggedIn(credentials))

    //   // Used a manual redirect here as opposed to a wrapper.
    //   // This way, once logged in a user can still access the home page.
      var currentLocation = browserHistory.getCurrentLocation()

      if ('redirect' in currentLocation.query)
      {
        return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
      }

      return browserHistory.push('/dashboard')
    // }).catch(err => console.log(err))
  }
}
