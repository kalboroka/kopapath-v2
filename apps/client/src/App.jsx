import { Component } from 'inferno';
import { Switch, Route } from 'inferno-router';

import Auth from '@pages/auth'
import Admin from '@pages/admin'
import Home from '@pages/Home';
import Messages from '@pages/Messages';
import Loans from '@pages/loans';
import FQAs from '@pages/FQAs';
import Account from '@pages/Account';
import About from '@pages/About';

import GuardRoute from '@components/GuardRoute';
import Modal from '@components/Modal';
import Loader from '@components/Loader';

import { appReducer, session } from '@utils';

const modalMounted = (_domNode) => {
  const meta = window.document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  meta.setAttribute('content', '#606060')

}

const modalUnmounted = (_domNode) => {
  const meta = window.document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  meta.setAttribute('content', '#FFEFD5')

}

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: { on: false, msg: '', icon: null },
      user: { name: '...', mobile: '...', email: '...' },
      loader: false
    };
  }

  dispatch = (action) => this.setState(appReducer(this.state, action));

  updateUser = (_domNode) => {
    const user = session.get('User');
    if (user) this.setState({ user })
  }

  render() {
    return (
      <>
        <Switch>
          <GuardRoute exact path="/" render={(rp) => <Home {...rp} user={this.state.user} dispatch={this.dispatch} onComponentDidMount={this.updateUser} />} />
          <Route path="/auth" render={(rp) => <Auth {...rp} dispatch={this.dispatch} />} />
          <GuardRoute path="/admin" render={(rp) => <Admin {...rp} dispatch={this.dispatch} user={this.state.user} updateUser={this.updateUser}/>} />
          <GuardRoute path="/messages" render={(rp) => <Messages {...rp} user={this.state.user} dispatch={this.dispatch} />} />
          <GuardRoute path="/loans" render={(rp) => <Loans {...rp} user={this.state.user} dispatch={this.dispatch} />} />
          <GuardRoute path="/fqas" render={(rp) => <FQAs {...rp} />} dispatch={this.dispatch} />
          <GuardRoute path="/account" render={(rp) => <Account {...rp} user={this.state.user} dispatch={this.dispatch} onComponentDidMount={this.updateUser} />} />
          <GuardRoute path="/about" render={(rp) => <About {...rp} dispatch={this.dispatch} />} />
        </Switch>
        {!this.state.modal.on && this.state.loader && <Loader />}
        {this.state.modal.on && <Modal {...this.state.modal} onComponentDidMount={modalMounted} onComponentWillUnmount={modalUnmounted} close={() => this.setState({ modal: { ...this.state.modal, on: false } })} />}
      </>
    );
  }
}