import { Component } from 'inferno';
import { Link } from 'inferno-router';
import AuthForm from '@components/AuthForm';

const RedirectLogin = () => (
  <Link className="login" to="/auth/login">Login</Link>
);

export default class ResetSecret extends Component {
  render() {
    return (
      <AuthForm
        afxLocal={{
          mode: 'reset',
          fields: ['secret'],
          url: 'confirm',
          formChild: RedirectLogin
        }}
        {...this.props}
      />
    );
  }
}