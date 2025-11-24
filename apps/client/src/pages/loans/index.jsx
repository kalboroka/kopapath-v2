import { Switch, withRouter } from 'inferno-router';
import GuardRoute from '@components/GuardRoute';
import List from './List';
import Apply from './Apply';
import Repay from './Repay';

import '@styles/Loans.css';

export default withRouter((p) => (
  <Switch>
    <GuardRoute exact path={p.match.path}
      render={rp => <List {...p} {...rp} />} />
    <GuardRoute path={`${p.match.path}/apply`}
      render={rp => <Apply {...p} {...rp} />} />
    <GuardRoute path={`${p.match.path}/repay`}
      render={rp => <Repay {...p} {...rp} />} />
  </Switch>
));
