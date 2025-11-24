import { Component } from 'inferno';
import AuthForm from '@components/AuthForm';

export default class Login extends Component {
  render() {
    return (
      <AuthForm
        afxLocal={{
          mode: 'admin',
          fields: ['userid', 'pxsign', 'secret'],
          url: 'login',
          formChild: null
        }}
        {...this.props}
      />
    );
  }
}