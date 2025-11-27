import { Component } from 'inferno';
import { Link } from 'inferno-router';
import FormField from './FormField';
import SecretField from './SecretField';
import { LuInfo } from './Icons';
import { apiFetch, regex, session, showModal, toggleLoader } from '@utils';
import '@styles/AuthForm.css';

const FIELD_META = {
  name: ['Name', 'text', 'Full Name'],
  userid: ['UserId', 'text', 'email or mobile'],
  mobile: ['Mobile', 'tel', '254X-XX-XXX-XXX'],
  email: ['Email', 'email', 'user@org.com'],
};

const validate = (name, val) =>
  regex[name] ? (regex[name].test(val) ? '' : `invalid ${name}`) : '';

export default class AuthForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.buildInitialState(props);
  }

  buildInitialState = (props) => ({
    fields: props.afxLocal.fields.map(n => ({
      name: n,
      value: '',
      error: ''
    })),
    showSecret: {}
  });

  componentDidUpdate(prevProps) {
    if (prevProps.afxLocal.fields !== this.props.afxLocal.fields) {
      this.setState(this.buildInitialState(this.props));
    }
  }

  onInput = (e) => {
    const { name, value } = e.target;
    this.setState({
      fields: this.state.fields.map(f =>
        f.name === name
          ? { ...f, value, error: validate(name, value) }
          : f
      )
    });
  };

  toggleSecret = (field) => {
    this.setState({
      showSecret: {
        ...this.state.showSecret,
        [field]: !this.state.showSecret[field]
      }
    });
  };

  serializeFields = () => {
    const body = {};
    this.state.fields.forEach(f => body[f.name] = f.value);
    return body;
  };

  submit = async (e) => {
    e.preventDefault();

    const invalid = this.state.fields.find(f => f.error);
    if (invalid) return showModal(this.props, invalid.error);

    const { mode, url } = this.props.afxLocal;
    const body = this.serializeFields();
    if (mode === 'reset') {
      body.token = new URLSearchParams(this.props.location.search).get('token') || '';
    }
    try {
      toggleLoader(this.props, 'on');
      const { ok, data } = await apiFetch(`/api/v1/auth/${url}`, {
        method: 'POST',
        body
      });
      if (!ok) throw new Error(data.err);
      showModal(this.props, data.msg, 'teal', LuInfo);
      if (mode === 'signup' || mode === 'reset') {
        return this.props.history.push('/auth/login');
      }
      // login
      session.set(data.accessToken);
      session.set(data.user, 'User');
      this.props.history.push('/');
    } catch (err) {
      showModal(this.props, err.message);
    } finally {
      toggleLoader(this.props, 'off');
    }
  };

  renderField = (f) => {
    if (f.name === 'secret') {
      return (
        <SecretField
          key="secret"
          name="secret"
          value={f.value}
          error={f.error}
          label="Secret"
          placeholder="enter secret"
          show={!!this.state.showSecret.secret}
          onToggle={() => this.toggleSecret('secret')}
          onInput={this.onInput}
        />
      );
    }

    const md = FIELD_META[f.name];
    if (!md) return null;

    return (
      <FormField
        key={f.name}
        name={f.name}
        value={f.value}
        error={f.error}
        label={md[0]}
        type={md[1]}
        placeholder={md[2]}
        onInput={this.onInput}
      />
    );
  };

  render() {
    const { mode, formChild: Child } = this.props.afxLocal;
    const isReset = mode === 'reset';
    const isSignup = mode === 'signup';

    return (
      <div class="form-container">
        <div class="form-wrapper">
          <div class="logo">
            <h1 class="title">KopaPath</h1>
            <small class="slogan">Future is now!</small>
          </div>

          <form onSubmit={this.submit}>
            {this.state.fields.map(this.renderField)}

            {!isReset && (
              <small class="cta">
                {isSignup
                  ? <>Have an account? <Link to="/auth/login">Login</Link></>
                  : <>New here? <Link to="/auth/signup">Signup</Link></>
                }
              </small>
            )}

            <div class="submit">
              {Child && <Child {...this.props} />}
              <button class="btn-submit">
                {isSignup ? 'Signup' : isReset ? 'Reset' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}