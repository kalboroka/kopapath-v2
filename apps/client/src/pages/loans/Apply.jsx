import { Component } from 'inferno'
import FormField from '@components/FormField';
import LoMain from '@layouts/LoMain';
import {  LuInfo } from '@components/Icons';
import { apiFetch, session, showModal, toggleLoader } from '@utils';

const fmt = x => new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 }).format(x);
const cap = s => s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s;
const calcRate = t => t ? (t > 21 ? 0.35 : t > 14 ? 0.3 : t > 7 ? 0.25 : 0.2) : 0;
const calcDue = (a, t) => a ? ((t ? 1 : 0) + calcRate(t)) * a : 0;

export default class Apply extends Component {
  state = {
    fields: [
      { name: 'amount', value: '', error: '' },
      { name: 'term', value: '', error: '' }
    ],
    loanable: 0
  };

  validate(name, val) {
    const v = Number(val), m = this.state.loanable;
    if (name === 'amount') return v >= 150 && v <= m ? '' : `Amount must be 150 - ${fmt(m)}`;
    if (name === 'term') return v >= 1 && v <= 30 ? '' : 'Term must be within 30 days';
    return '';
  }

  onInput = e => {
    const { name, value } = e.target;
    this.setState({
      fields: this.state.fields.map(f =>
        f.name === name ? { ...f, value, error: this.validate(name, value) } : f)
    });
  };

  onSubmit = async e => {
    e.preventDefault();
    const invalid = this.state.fields.find(f => f.error);
    if (invalid) return showModal(this.props, invalid.error);
    
    const body = Object.fromEntries(this.state.fields.map(f => [f.name, Number(f.value)]));
    const due = calcDue(body.amount, body.term);

    try {
      toggleLoader(this.props, 'on');
      const { ok, data } = await apiFetch('/api/v1/loans', {
        method: 'POST',
        body: { ...body, rate: calcRate(body.term), total_due: due },
        bearer: session.get()
      });
      if(!ok) throw new Error(data?.msg);
      showModal(this.props, 'Loan application success', 'teal', LuInfo)
    } catch (err) {
      showModal(this.props, err.message);
    } finally {
      toggleLoader(this.props, 'off');
    }
    this.props.history.push('/')
  };

  async componentDidMount() {
    try {
      toggleLoader(this.props, 'on');
      const { ok, data } = await apiFetch('/api/v1/loans/bucket', { bearer: session.get() });
      if (!ok) throw new Error(data?.msg);
      this.setState({ loanable: data.amount});
    } catch (err) {
      showModal(this.props, err.message);
    } finally {
      toggleLoader(this.props, 'off');
    }
  }

  render() {
    const { loanable, fields } = this.state;
    const term = (() => { const t = Number(fields[1].value); return t ? (t > 21 ? 30 : t > 14 ? 21 : t > 7 ? 14 : 7) : null; })();
    return (
      <LoMain {...this.props}>
        <div class="loan-apply">
          <h4 class="lead">Loan Application</h4>
          <div class="info">
            {loanable >= 150 ? (
              <>
                <h5 style={{ color: 'teal' }}>Available for you:</h5>
                <div class="loan-offers">
                  <span style={{ '--idx': 3 }}>KES<br />150</span>
                  {loanable > 150 && <><small>UP TO</small><span style={{ '--idx': 5 }}>KES<br />{fmt(loanable)}</span></>}
                </div>
                <div class="loan-form">
                  <h4>Loan Form:</h4>
                  <form onSubmit={this.onSubmit}>
                    {fields.map(f => (
                      <FormField key={f.name} label={cap(f.name)} name={f.name}
                        type="number" placeholder={f.name === 'term' ? '7 Days' : '10000'}
                        value={f.value} onInput={this.onInput} error={f.error} />
                    ))}
                    <div class="due">
                      <h5>
                        Amount Due: KES{" "}
                        {fields.every(f => !f.error) ?
                          fmt(calcDue(+fields[0].value, +fields[1].value)) : 0}
                        {fields.every(f => !f.error) && term && (
                          <small> in {term} days</small>
                        )}
                      </h5>
                    </div>
                    <button type="submit">Apply</button>
                  </form>
                  <div class="reminder">
                    <small><p><strong>Note:</strong> Late repayment after 7 days adds 5% interest.</p></small>
                  </div>
                </div>
              </>
            ) : <p class="alt">Oops! No offers available!</p>}
          </div>
        </div>
      </LoMain>
    );
  }
}