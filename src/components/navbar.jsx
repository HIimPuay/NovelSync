import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import "./styles/navbar.css";

function Navbar({ isLoggedIn, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo"><Link to="/">Logo</Link></div>

      <div className="search-container">
        <input type="text" placeholder="ค้นหา..." className="search-input" />
        <Search className="search-icon" size={20} />
      </div>

      {!isLoggedIn ? (
        <>
                    <div className="signin-icon">
                        <Link to="/login">Sign In</Link>
                    </div>
                        
                        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                          {menuOpen ? <X size={28} /> : <Menu size={28} />}
                        </div>
                        <div className={`menu-dropdown ${menuOpen ? "open" : ""}`}>
                          <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/edit">Create</Link></li>
                            <li><Link to="/profile">Account</Link></li>
                            <li><a href="#">Help</a></li>
                          </ul>
                        </div>
        </>
                    
                ) : (
                    <>
                        
                        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                          {menuOpen ? <X size={28} /> : <Menu size={28} />}
                        </div>
                        <div className={`menu-dropdown ${menuOpen ? "open" : ""}`}>
                          <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/edit">Create</Link></li>
                            <li><Link to="/profile">Account</Link></li>
                            <li><a href="#">Help</a></li>
                            <li><button onClick={onLogout}>Logout</button></li>
                          </ul>
                        </div>
                    </>
                )}
      
   
    </nav>
  );
}

export default Navbar;
