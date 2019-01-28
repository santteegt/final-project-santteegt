import { connect } from 'react-redux'
import AccountMenu from './AccountMenu'
// import { loginUport, loginMetamask } from './LoginButtonActions'

const mapStateToProps = (state, ownProps) => {
    const client = state.user.data && state.user.data.loginClient
    return { account: client ? (client == 'uport' ? 'uport?':state.user.data.account):'undefined'}
}

const mapDispatchToProps = (dispatch) => {
  return {
    // onLoginUportClick: (event) => {
    //     event.preventDefault();
    //     // loginUport()
    //     dispatch(loginUport());
    // },
    // onLoginMetamaskClick: (event) => {
    //     event.preventDefault();
    //     // loginMetamask()
    //     dispatch(loginMetamask());
    // }

  }
}

const AccountMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountMenu)

export default AccountMenuContainer
