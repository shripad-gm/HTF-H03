import "./Style/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo" contentEditable={false}>  SDoHSense</h2>
      <input type="text" placeholder="Search" className="search-bar" />
      <div className="nav-icons">
        <i className="fas fa-bell"></i>
        <i className="fas fa-user-circle"></i>
      </div>
    </nav>
  );
};

export default Navbar;
  