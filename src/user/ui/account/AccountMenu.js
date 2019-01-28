import React from 'react'
import LogoutButtonContainer from '../logoutbutton/LogoutButtonContainer'

import { Link } from 'react-router'
import { Blockie } from 'dapparatus'
// <li className="pure-menu-item"><a href="#" className="pure-menu-link">Twitter</a></li>
const AccountMenu = ({ account }) => {
  return(
      <li className="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
          <Link to="/profile" className="pure-menu-link">
          <div className="blockie">
          <Blockie
            address={account}
            config={{size:4}}
          />
          </div>
          </Link>
          <ul className="pure-menu-children">
              <li className="pure-menu-item">
                  <Link to="/profile" className="pure-menu-link">
                  {account}
                  </Link>
              </li>
              <LogoutButtonContainer />
          </ul>
      </li>
  )
}

export default AccountMenu
