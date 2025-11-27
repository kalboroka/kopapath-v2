import { Switch, Route, withRouter } from 'inferno-router';
import Signup from './Signup';
import Login from './Login';
import ResetSecret from './ResetSecret';

const Auth = withRouter((p) => {
  const base = p.match.path;
  return (
    <Switch>
      <Route path={`${base}/signup`} render={(rp) => <Signup {...rp} {...p} />} />
      <Route path={`${base}/login`} render={(rp) => <Login {...rp} {...p} />} />
      <Route path={`${base}/reset`} render={(rp) => <ResetSecret {...rp} {...p} />} />
    </Switch>
  );
});

export default Auth;