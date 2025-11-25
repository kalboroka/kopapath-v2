import { Link } from 'inferno-router';
import { LuCircleUser, LuMessageCircle, LuMenu } from './Icons';

export default (props) => (
  <div class="header">
    <div class="wrapper">
      <div class="logo">
        <h3 class="title"><Link to='/'>KopaPath</Link></h3>
      </div>
      <div class="utils">
        <Link to='/account'><LuCircleUser size={20} color='darkslateblue' /></Link>
        <Link to='/messages'><LuMessageCircle size={20} color='darkslateblue' /></Link>
        <span
          onClick={() => props.toggleSidebar()}
        ><LuMenu size={20} color='darkslateblue' /></span>
      </div>
    </div>
  </div>
);