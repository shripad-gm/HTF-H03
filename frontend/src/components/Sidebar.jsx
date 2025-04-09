// Sidebar.jsx
import { IconBulb, IconCheckbox, IconPlus, IconSearch, IconUser } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import './Style/Sidebar.css';

const links = [
  { icon: IconBulb, label: 'Home', notifications: 3 },
  { icon: IconCheckbox, label: 'Statistics', notifications: 4 },
  { icon: IconUser, label: 'report' },
];

// const collections = [
//   { emoji: '👍', label: 'Sales' },
//   { emoji: '🚚', label: 'Deliveries' },
//   { emoji: '💸', label: 'Discounts' },
//   { emoji: '💰', label: 'Profits' },
//   { emoji: '✨', label: 'Reports' },
//   { emoji: '🛒', label: 'Orders' },
//   { emoji: '📅', label: 'Events' },
//   { emoji: '🙈', label: 'Debts' },
//   { emoji: '💁‍♀️', label: 'Customers' },
// ];


const Sidebar = ({ onClose }) => {
 
const navigate=useNavigate();
const handleClick=(value)=> {
  navigate(`/${value}`);
 }
 
  return (
    <nav className="sidebar">
      <button className="close-btn" onClick={onClose}>×</button>

      {/* User Profile */}
      <div className="sidebar-section user-profile-top">
        <img src="https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png" alt="User" className="user-avatar" />
        <div className="user-info">
          <div className="user-name"> Username's <br/>dashboard</div>
          <div className="user-role">Admin</div>
          <div className="hospital-name">Hospital Name</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="sidebar-section">
        <div className="search-wrapper">
          <IconSearch size={14} />
          <input type="text" placeholder="Search" className="search-input" />
          <span className="search-code"><i className="fa-brands fa-searchengin"></i></span>
        </div>
      </div>

      {/* Main Links */}
      <div className="sidebar-section">
        <ul className="main-links">
          {links.map((link) => (
            <li className="main-link" key={link.label}>
              <Link to={`/${link.label.toLowerCase()}`} className="main-link-inner">
                <link.icon size={18} />
                <span onClick={()=>handleClick(link.label)}>{link.label}</span>
              </Link>
              {link.notifications && (
                <span className="main-link-badge">{link.notifications}</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Collections */}
      {/* <div className="sidebar-section">
        <div className="collections-header">
          <span className="collections-title">Collections</span>
          <button className="collection-add-btn">
            <IconPlus size={12} />
          </button>
        </div>
        <ul className="collections">
          {collections.map((collection) => (
            <li key={collection.label} className="collection-link">
              <span className="emoji">{collection.emoji}</span>
              {collection.label}
            </li>
          ))}
        </ul>
      </div> */}
    </nav>
  );
};

export default Sidebar;