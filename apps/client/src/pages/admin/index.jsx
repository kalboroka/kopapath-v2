import { Component } from 'inferno';
import { apiFetch, session, showModal, toggleLoader } from '@utils';
import '@styles/Admin.css';
import '@styles/LoanModal.css';

const fmt = x => new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 }).format(x);

const LoanModal = ({ loan, toggler }) => (
  loan ?
    <div class="loan-modal">
      <div class="loan-wrapper">
          <div class="user">
            <h5>User Details</h5>
            <div class="info">
              <div class=""><span>Name</span> <span>{loan.name}</span></div>
              <div class=""><span>Mobile</span> <span>+{loan.mobile}</span></div>
              <div class=""><span>Email</span> <span>{loan.email}</span></div>
            </div>
          </div>
          <div class="loan">
            <h5>Loan Details</h5>
            <div class="info">
              <div class=""><span>Amout</span> <span>{loan.amount}</span></div>
              <div class=""><span>Rate</span> <span>{loan.rate * 100}%</span></div>
              <div class=""><span>Term</span> <span>{loan.term} Day{loan.term > 1 ? 's' : ''}</span></div>
              <div class=""><span>Status</span> <span>{loan.status}</span></div>
              <div class=""><span>Total</span> <span>{loan.total_due}</span></div>
              <div class=""><span>Due On</span> <span>{loan.due_date.slice(0, 10)}</span></div>
              <div class=""><span>Applied</span> <span>{loan.applied_at.slice(0, 10)}</span></div>
              <div class=""><span>Disbursed</span> <span>{loan.disbursed_at?.slice(0, 10)}</span></div>
              <div class=""><span>Closed</span> <span>{loan.closed_at?.slice(0, 10)}</span></div>
            </div>
          </div>
        <div class="actions">
          {loan.status !== 'done' && <button class="patch" onClick={() => { }}>Mark {loan.status === 'pending' ? 'Active' : 'Done'}</button>}
          <button class="cancel" onClick={() => toggler()}>Cancel</button>
        </div>
      </div>
    </div> :
    null
);

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
      if (!ok) throw new Error(data?.msg);
      this.setState({ loans: data });
    } catch (err) {
      showModal(this.props, err.message);
    } finally {
      toggleLoader(this.props, 'off');
    }
    this.props.updateUser(null);
  }

  render() {
    const { user } = this.props;
    const { tabs, loans, loanModal } = this.state;
    return (
      <div class="admin-page">
        <div class="header">
          <div class="wrapper">
            <div class="logo">
              <h3 class="title">KopaPath</h3>
            </div>
            <div class="admin-user">
              <h5 class="info">Admin: {user.name}</h5>
            </div>
          </div>
        </div>
        <div class="admin-main">
          <details class="update-loan">
            <summary>Update Loan Amount</summary>
            <div class="details">
              <h6 class="warning">NOTE: Critical Action!</h6>
              <form>
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
              <form>
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
              <form>
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
              {loanModal && <LoanModal loan={loans.find(l => l.loan_id === this.state.loanId)} toggler={() => this.setState({ loanModal: false })} />}
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
                    <thead><tr><th>Ref</th><th>Amount</th><th>Term</th><th>Status</th><th>TotalDue</th></tr></thead>
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