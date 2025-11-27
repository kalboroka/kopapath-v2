import { Component } from 'inferno';
import { LuInfo } from '@components/Icons';
import AuthForm from '@components/AuthForm';
import { showModal, apiFetch, toggleLoader } from '@utils';

const handleForgot = async (props, e) => {
  const form = e.currentTarget.closest('form');
  const uid = form?.userid?.value.trim();
  if (!uid) return showModal(props, 'enter email or mobile');

  try {
    toggleLoader(props, 'on');
    const { ok, data } = await apiFetch('/api/v1/auth/reset', {
      method: 'POST',
      body: { userid: uid }
    });
    if (!ok) throw new Error(data.err);
    showModal(props, 'Reset link sent', 'teal', LuInfo);
  } catch (err) {
    showModal(props, err.message);
  } finally {
    toggleLoader(props, 'off');
  }
};

const ForgotSecret = (props) => (
  <button type="button" class="btn-forgot-secret"
    onClick={(e) => handleForgot(props, e)}
  >
    Forgot Secret?
  </button>
);

export default class Login extends Component {
  render() {
    return (
      <AuthForm
        afxLocal={{
          mode: 'login',
          fields: ['userid', 'secret'],
          url: 'login',
          formChild: ForgotSecret
        }}
        {...this.props}
      />
    );
  }
}