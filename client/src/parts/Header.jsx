
import '../index.css'
import { Link } from 'react-router-dom'
import LOGO from '../assets/image.jpg'

export default function Header() {
  return (
  	 <div id='header'>
  	   <img src={LOGO}  />
  	   <Link id='header-logo' to='/'>$KOL ATLAS</Link>
  	 </div>
  )
}
