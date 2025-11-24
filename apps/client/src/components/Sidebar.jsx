import { NavLink } from 'inferno-router';
import { LuCircleQuestionMark, LuCoins, LuHome, LuMessageCircle, LuInfo, LuCircleUser, LuLogOut } from './Icons';
import { apiFetch, session, showModal, toggleLoader } from '@utils';

import '@styles/Sidebar.css';

const links = [
  { icon: LuHome, label: 'Home', link: '/' },
  { icon: LuCoins, label: 'Loans', link: '/loans' },
  { icon: LuMessageCircle, label: 'Messages', link: '/messages' },
  { icon: LuCircleUser, label: 'Account', link: '/account' },
  { icon: LuCircleQuestionMark, label: 'FQAs', link: '/fqas' },
  { icon: LuInfo, label: 'About', link: '/about' }
];

const onClick = async (props) => {
  try {
    toggleLoader(props, 'on');
    props.toggleSidebar();
    const { ok, data } = await apiFetch('/api/v1/auth/logout', { method: 'POST', bearer: session.get() });
    if (!ok) throw new Error(data?.msg);
    session.clear();
    showModal(props, data?.msg)
    props.history.push('/auth/login');
  } catch (err) {
    showModal(props, err.message)
  } finally {
    toggleLoader(props, 'off');
  }
}

export default (props) => (
  props.sidebar ?
    <div className="sidebar">
      <div className="wrapper">
        <ul className="links">
          {links.map(({ icon: Icon, label, link }) => (
            <li key={label}><NavLink exact to={link}><Icon size={20} /> <span>{label}</span></NavLink></li>
          ))}
          <button onClick={()=>onClick(props)}><LuLogOut size={20} /> <span>Logout</span></button>
        </ul>
      </div>
    </div>
    : null
);