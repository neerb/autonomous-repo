import { Link } from 'react-router-dom'
import '../styles/Navigation.css'

function Navigation() {
  return (
    <nav className="navigation">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/settings" className="nav-link">Settings</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation