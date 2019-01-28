const initialState = {
  data: null,
  loginClient: null,
  web3: null
}

const userReducer = (state = initialState, action) => {
  if (action.type === 'USER_LOGGED_IN')
  {
    return Object.assign({}, state, {
      data: action.payload,
      loginClient: action.payload.loginClient,
      web3: action.payload.web3
    })
  }

  if (action.type === 'USER_LOGGED_OUT')
  {
    return Object.assign({}, state, {
      data: null,
      loginClient: null,
      web3: null
    })
  }

  return state
}

export default userReducer
