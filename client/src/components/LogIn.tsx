import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div style={{ textAlign: 'center', display: 'flex-column', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, 50%)', width: '100%' }}>
        <h1 style={{ fontSize: '5rem' }}>Welcome to MovieQ</h1>
        <h2 style={{ fontSize: '2rem' }}>Save your favorite movie into your list. Easy!</h2>
        <Button onClick={this.onLogin} size="massive" color="linkedin" style={{  }}>
          Log in
        </Button>
      </div>
    )
  }
}
