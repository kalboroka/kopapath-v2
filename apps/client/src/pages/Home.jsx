import { Link } from 'inferno-router';
import LoMain from '../layouts/LoMain';
import { LuCircleQuestionMark, LuHandCoins, /*LuInfo*/ } from '../components/Icons';
import '../styles/Home.css'

const guideInfo = [
  ['Check Loan Offers', <span key='offer'>See what you qualify for. Borrowable up to <b>KES 25,000</b> with interest from <b>20%–35%</b>, depending on repay terms.</span>],
  ['Apply & Get Cash', <span key='apply'>Pick your amount and confirm — funds are sent to your M-Pesa in minutes.</span>],
  ['Repay Easily', <span key='repay'>Repay loan through M-Pesa <b>promptly</b>. Flexible, transparent, and no hidden fees.</span>]
]
const greeting = () => {
  const hrs = new Date().getHours();

  return (
    hrs >= 5 && hrs < 12 ? "Good Morning" :
      hrs >= 12 && hrs < 17 ? "Good Afternoon" :
        hrs >= 17 && hrs < 21 ? "Good Evening" :
          "Good Night"
  );
}

export default (props) => (
  <LoMain {...props}>
    <div class="home">
      <h4 class="greeting">{greeting()}, {props.user.name.split(' ')[0]}!</h4>

      <div class="cta">
        <h3>Get Fast & Reliable Credit</h3>
        <button><Link to='/loans/apply'>APPLY NOW</Link></button>
      </div>

      <div class="actions">
        <Link to='/loans/repay'><LuHandCoins /><span class='text'>Repay</span></Link>
        <Link to='/fqas'><LuCircleQuestionMark /><span class='text'>FQAs</span></Link>
      </div>

      <div class="guide">
        <h4>How it works</h4>
        <div class="guide-info">
          <ul>
            {guideInfo.map((gi, idx)=> (
              <li key={idx}>
                <span>{idx + 1}</span>
                <div class="card-info">
                  <h6>{gi[0]}</h6>
                  <p>{gi[1]}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div class="cta-2">
        <h5>Future is now!</h5>
        <button><Link to='/loans/apply'>Get Approved</Link></button>
      </div>
    </div>
  </LoMain>
);