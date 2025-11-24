import { Component } from 'inferno';
import { Link } from 'inferno-router';
import LoMain from '@layouts/LoMain';
import { apiFetch, session, showModal, toggleLoader } from '@utils';

const fmt = x => new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 }).format(x);

export default class List extends Component {
  state = { loans: [] };

  async componentDidMount() {
    try {
      toggleLoader(this.props, 'on');
      const { ok, data } = await apiFetch('/api/v1/loans', { bearer: session.get() });
      if (!ok) throw new Error(data?.msg);
      this.setState({ loans: data });
    } catch (err) {
      showModal(this.props, err.message);
    } finally {
      toggleLoader(this.props, 'off');
    }
  }

  render() {
    const { loans } = this.state;
    return (
      <LoMain {...this.props}>
        <div class="loan-summary">
          <div class="lead">
            <h4>Loans Summary</h4>
            <div class="actions">
              <Link to={`${this.props.match.url}/apply`}>Apply</Link>
              <Link to={`${this.props.match.url}/repay`}>Repay</Link>
            </div>
          </div>
          <div class="info">
            {loans.length ? (<>
              <h5>Your recent loans:</h5>
              <table>
                <thead><tr><th>Ref</th><th>Amount</th><th>Term</th><th>TotalDue</th><th>Status</th></tr></thead>
                <tbody>{loans.map(l =>
                  <tr key={l.id}><td>{l.id}</td><td>{fmt(l.amount)}</td><td>{l.term}</td><td>{l.total_due}</td><td>{l.status}</td></tr>
                )}</tbody>
              </table>
            </>
            ) : <p>Oops! No past loans!</p>}
          </div>
        </div>
      </LoMain>
    );
  }
};