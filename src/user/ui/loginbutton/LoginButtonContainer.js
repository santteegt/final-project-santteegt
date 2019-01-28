import { connect } from 'react-redux'
import LoginButton from './LoginButton'
import { loginUport, loginMetamask } from './LoginButtonActions'

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginUportClick: (event) => {
        event.preventDefault();
        // loginUport()
        dispatch(loginUport());
    },
    onLoginMetamaskClick: (event) => {
        event.preventDefault();
        // loginMetamask()
        dispatch(loginMetamask());
    }

  }
}

const LoginButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginButton)

export default LoginButtonContainer
