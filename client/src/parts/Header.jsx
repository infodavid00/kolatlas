import { useEffect, useState } from 'react';
import '../index.css';
import { Link, useLocation } from 'react-router-dom';
import LOGO from '../assets/image.jpg';

export default function Header() {
  const location = useLocation();
  const [active, setActive] = useState('/')

  useEffect(() => {
    setActive(location.pathname);
  }, [location]);

  return (
    <div id='header'>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6em' }}>
        <img src={LOGO} alt="KOL Atlas Logo" />
        <Link id='header-logo' to='/'>$KOL ATLAS</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5em' }}>
        <Link className='header-link'  style={{
      		color: active === '/' ? 'dodgerblue' : 'rgba(10,10,10,1)'
        }} to='/'>KOLs</Link>
        <Link className='header-link' style={{
        	color: active === '/tokens' ? 'dodgerblue' : 'rgba(10,10,10,1)'
        }} to='/tokens'>Tokens</Link>
      </div>
    </div>
  );
}
