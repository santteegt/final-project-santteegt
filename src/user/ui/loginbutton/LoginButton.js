import React from 'react'

// Images
import uPortLogo from '../../../img/uport-logo.svg'
import metamaskLogo from '../../../img/metamask-fox.svg'

const LoginButton = ({ onLoginUportClick, onLoginMetamaskClick }) => {
  return(
    <span>
        <li className="pure-menu-item">
          <a href="#" className="pure-menu-link" onClick={(event) => onLoginUportClick(event)}><img className="uport-logo" src={uPortLogo} alt="UPort Logo" />Login with UPort</a>
        </li>
        <li className="pure-menu-item">
          <a href="#" className="pure-menu-link" onClick={(event) => onLoginMetamaskClick(event)}><img className="uport-logo" src={metamaskLogo} alt="Metamask Logo" />Login with Metamask</a>
        </li>
    </span>
  )
}

export default LoginButton
