import { linkEvent } from 'inferno';
import '@styles/LoanModal.css';

const LoanModal = ({ loan, onMark, onExit }) => (
  loan
    ? (
      <div class="loan-modal">
        <div class="loan-wrapper">
          <div class="user">
            <h5>User Details</h5>
            <div class="info">
              <div><span>Name</span> <span>{loan.name}</span></div>
              <div><span>Mobile</span> <span>+{loan.mobile}</span></div>
              <div><span>Email</span> <span>{loan.email}</span></div>
            </div>
          </div>
          <div class="loan">
            <h5>Loan Details</h5>
            <div class="info">
              <div><span>Amout</span> <span>{loan.amount}</span></div>
              <div><span>Rate</span> <span>{loan.rate * 100}%</span></div>
              <div><span>Term</span> <span>{loan.term} Day{loan.term > 1 ? 's' : ''}</span></div>
              <div><span>Status</span> <span>{loan.status}</span></div>
              <div><span>Total</span> <span>{loan.total_due}</span></div>
              <div><span>Due On</span> <span>{loan.due_date.slice(0, 10)}</span></div>
              <div><span>Applied</span> <span>{loan.applied_at.slice(0, 10)}</span></div>
              <div><span>Disbursed</span> <span>{loan.disbursed_at?.slice(0, 10)}</span></div>
              <div><span>Closed</span> <span>{loan.closed_at?.slice(0, 10)}</span></div>
            </div>
          </div>
          <div class="actions">
            <form onSubmit={linkEvent(loan, onMark)}>
              <button type="submit">Mark</button>
              <div class="pending"><input name="mark" type="radio" value="pending" required/></div>
              <div class="active"><input name="mark" type="radio" value="active" required/></div>
              <div class="done"><input name="mark" type="radio" value="done" required/></div>
            </form>
            <button class="exit" onClick={() => onExit()}>Exit</button>
          </div>
        </div>
      </div>
    )
    : null
);

export default LoanModal;