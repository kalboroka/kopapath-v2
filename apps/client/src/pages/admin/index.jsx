import { Component, linkEvent } from 'inferno';
import { Link } from 'inferno-router';
import LoanModal from './LoanModal';
import { LuInfo } from '@components/Icons';
import { apiFetch, session, showModal, toggleLoader } from '@utils';
import '@styles/Admin.css';

const fmt = x => new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 }).format(x);

export default class Admin extends Component {
  state = {
    loans: [],
    tabs: {
      all: true,
      pending: false,
      active: false,
      done: false
    },
    loanModal: false,
    loanId: '' // for controlling LoanModal content
  }

  async componentDidMount() {
    try {
      toggleLoader(this.props, 'on');
      const { ok, data } = await apiFetch('/api/v1/loans/joined', { bearer: session.get() });
      if (!ok) throw new Error(data.err);
      this.setState({ loans: data });
    } catch (err) {
      showModal(this.props, err.message);
    } finally {
      toggleLoader(this.props, 'off');
    }
    this.props.updateUser(null);
  }

  onSubmit = async (ctx, event) => {
    event.preventDefault();
    const form = event.currentTarget.closest('form');
    if (!form) return;
    const fields = ctx[0].split(';');
    const body = Object.fromEntries(fields.map(f => [f, form[f]?.value]));
    try {
      toggleLoader(this.props, 'on');
      const { ok, data } = await apiFetch(
        `/api/v1/admin/${ctx[1]}`,
        { method: 'POST', bearer: session.get(), body }
      );
      if (!ok) throw new Error(data.err);
      fields.forEach(f => form[f].value = '');
      showModal(this.props, data?.msg, 'teal', LuInfo);
    } catch (err) {
      showModal(this.props, err.message);
    } finally {
      toggleLoader(this.props, 'off');
    }
  };

  markLoanStatus = async (loan, event) => {
    event.preventDefault();
    const elm = event.target.closest('form');
    let status = null;
    if (!elm || !(status = elm?.mark.value) || loan.status === status) return;
    toggleLoader(this.props, 'on');
    try {
      const { ok, data } = await apiFetch(`/api/v1/admin/loans/mark/${loan.loan_id}`, {
        method: 'PATCH',
        bearer: session.get(),
        body: { status }
      });
      if (!ok) throw new Error(data.err);

      // update local list
      const loans = this.state.loans.map(l =>
        l.loan_id === loan.loan_id ? { ...l, status } : l
      );

      this.setState({ loans, loanModal: false });
      showModal(this.props, data.msg, 'teal', LuInfo);
    } catch (err) {
      showModal(this.props, err.message);
    }
    toggleLoader(this.props, 'off');
  };

  render() {
    const { tabs, loans, loanModal } = this.state;
    return (
      <div class="admin-page">
        <div class="header">
          <div class="wrapper">
            <div class="logo">
              <h3 class="title"><Link to='/'>KopaPath</Link></h3>
            </div>
            <div class="admin-user">
              <h5 class="info">Admin: {this.props.user.name}</h5>
            </div>
          </div>
        </div>
        <div class="admin-main">
          <details class="update-loan">
            <summary>Update Loan Amount</summary>
            <div class="details">
              <h6 class="warning">NOTE: Critical Action!</h6>
              <form onSubmit={linkEvent(['amount', 'bucket/update'], this.onSubmit)}>
                <div class="input-info">
                  <label for="amount">Amount</label>
                  <input name="amount" type="number" placeholder="KES 10,000" />
                </div>
                <div class="submit">
                  <button class="btn-submit" type="submit">Update</button>
                </div>
              </form>
            </div>
          </details>
          <details class="send-msg">
            <summary>Send Message</summary>
            <div class="details">
              <h6 class="warning">NOTE: Irreversible Action!</h6>
              <form onSubmit={linkEvent(['receiver;message', 'messages/send'], this.onSubmit)}>
                <div class="input-info">
                  <label for="receiver">Receiver</label>
                  <input name="receiver" type="text" placeholder="email or mobile" />
                </div>
                <div class="input-info">
                  <label for="message">Message</label>
                  <input name="message" type="text" placeholder="Message Text" />
                </div>
                <div class="submit">
                  <button class="btn-submit" type="submit">Send</button>
                </div>
              </form>
            </div>
          </details>
          <details class="broadcast-msg">
            <summary>Broadcast Message</summary>
            <div class="details">
              <h6 class="warning">NOTE: Irreversible Action!</h6>
              <form onSubmit={linkEvent(['message', 'messages/broadcast'], this.onSubmit)}>
                <div class="input-info">
                  <label for="message">Message</label>
                  <input name="message" type="text" placeholder="Message Text" />
                </div>
                <div class="submit">
                  <button class="btn-submit" type="submit">Broadcast</button>
                </div>
              </form>
            </div>
          </details>
          <details class="view-loans">
            <summary>View Loans</summary>
            <div class="details">
              {loanModal && <LoanModal loan={loans.find(l => l.loan_id === this.state.loanId)} onExit={() => this.setState({ loanModal: false })} onMark={this.markLoanStatus} />}
              <h6 class="warning">NOTE: Update Cautiously!</h6>
              <div
                class="tabs"
                onClick={(event) => {
                  const el = event.target.closest('span');
                  if (!el) return;
                  const key = el.textContent.toLowerCase();
                  const tks = Object.keys(tabs);
                  if (!tks.includes(key)) return;
                  const newTabs = { ...tabs };
                  tks.forEach(t => newTabs[t] = t === key);
                  this.setState({ tabs: newTabs });
                }}
              >
                <div class="wrapper">
                  <span class={tabs.all ? 'active' : ''}>All</span>
                  <span class={tabs.pending ? 'active' : ''}>Pending</span>
                  <span class={tabs.active ? 'active' : ''}>Active</span>
                  <span class={tabs.done ? 'active' : ''}>Done</span>
                  <span class="not-tab"></span>
                </div>
              </div>
              <div class="content">
                {loans.some(l => tabs.all || tabs[l.status]) ? (<>
                  <table>
                    <thead><tr><th>Ref</th><th>Amount</th><th>Term</th><th>Status</th><th>Total Due</th></tr></thead>
                    <tbody
                      onClick={(event) => {
                        let row = null;
                        const cell = event.target.closest('td');
                        if (cell && (row = cell.parentElement)) {
                          this.setState({ loanModal: true, loanId: row.cells[0].textContent })
                        }
                      }}
                    >{loans.filter(l => tabs.all || tabs[l.status]).map(l =>
                      <tr key={l.loan_id}><td>{l.loan_id}</td><td>{fmt(l.amount)}</td><td>{l.term}</td><td>{l.status}</td><td>{fmt(l.total_due)}</td></tr>
                    )}</tbody>
                  </table>
                </>
                ) : <p>Oops! No loans here yet!</p>}
              </div>
              <div class="page-ctrl">
                <button class="prev">Prev</button>
                <button class="next">Next</button>
              </div>
            </div>
          </details>
        </div>
      </div>
    )
  }
}