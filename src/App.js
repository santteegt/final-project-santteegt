import React, { Component } from 'react'
import { Link } from 'react-router'
// import { Link } from 'react-router-dom'
import { HiddenOnlyAuth, VisibleOnlyAuth } from './util/wrappers.js'

// UI Components
import LoginButtonContainer from './user/ui/loginbutton/LoginButtonContainer'
import LogoutButtonContainer from './user/ui/logoutbutton/LogoutButtonContainer'
import AccountMenuContainer from './user/ui/account/AccountMenuContainer'

import { Blockie } from "dapparatus"
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {

  render() {

    // const OnlyAuthLinks = VisibleOnlyAuth(() =>
    //     <div>
    //         <li className="pure-menu-item">
    //             <Link to="/dashboard" className="pure-menu-link">Dashboard</Link>
    //         </li>
    //         <AccountMenuContainer />
    //     </div>
    // )
    const OnlyAuthLinks = VisibleOnlyAuth(() =>
        <div>
            <AccountMenuContainer />
        </div>
    )

    const OnlyGuestLinks = HiddenOnlyAuth(() =>
      <span>
        <LoginButtonContainer />
      </span>
    )

    // return (
    //   <div className="App">
    //     <nav className="navbar pure-menu pure-menu-horizontal">
    //       <Link to="/" className="pure-menu-heading pure-menu-link">SupportEth</Link>
    //       <ul className="pure-menu-list navbar-right">
    //         <OnlyGuestLinks />
    //         <OnlyAuthLinks />
    //       </ul>
    //     </nav>
    //
    //     {this.props.children}
    //   </div>
    // );
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <Link to="/" className="pure-menu-heading pure-menu-link">SupportEth</Link>
          <ul className="pure-menu-list navbar-right">
            <OnlyGuestLinks />
            <OnlyAuthLinks />
          </ul>
        </nav>

        {this.props.children}
      </div>
    );
  }
}

export default App
