import { hashHistory } from 'react-router'
// import { browserHistory  as BH, hashHistory } from 'react-router'
// import { BrowserRouter } from 'react-router-dom'

// let browserHistory = process.env.NODE_ENV == 'development'? BH:hashHistory
// let browserHistory = hashHistory
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT'
function userLoggedOut(user) {
  return {
    type: USER_LOGGED_OUT,
    payload: user
  }
}

export function logoutUser() {
  return function(dispatch) {
    // Logout user.
    dispatch(userLoggedOut())

    // Redirect home.
    return hashHistory.push('/')
  }
}
