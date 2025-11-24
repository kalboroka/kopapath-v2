import { Component } from 'inferno';
import AuthForm from '@components/AuthForm';

export default class Signup extends Component {
  render() {
    return (
      <AuthForm
        afxLocal={{
          mode: 'signup',
          fields: ['name', 'mobile', 'email', 'secret'],
          url: 'signup',
          formChild: null
        }}
        {...this.props}
      />
    );
  }
}