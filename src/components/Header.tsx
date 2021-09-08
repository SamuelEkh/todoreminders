import '../style/Header.css';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import accountIcon from '../icons/accountBlue.png';
import { useAuth } from '../contexts/AuthContext';

const urlPath = window.location.pathname;

const linkStyle = {
  textDecoration: 'none',
};

const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeColor, setActiveColor] = useState<string>('');
  const [finishedColor, setFinishedColor] = useState<string>('');

  const activeStyle = {
    color: activeColor,
    textDecoration: 'none',
  };

  const finishedStyle = {
    color: finishedColor,
    textDecoration: 'none',
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.target as Element;
    switch (target.className) {
      case 'header__logo' || 'header__active':
        setActiveColor('#2b62bc');
        setFinishedColor('#6e6e6e');
        break;
      case 'header__finished':
        setActiveColor('#6e6e6e');
        setFinishedColor('#2b62bc');
        break;
      default:
        setActiveColor('#2b62bc');
        setFinishedColor('#6e6e6e');
        break;
    }
  };

  useEffect(() => {
    switch (urlPath) {
      case '/':
        setActiveColor('#2b62bc');
        setFinishedColor('#6e6e6e');
        break;
      case '/finished':
        setActiveColor('#6e6e6e');
        setFinishedColor('#2b62bc');
        break;
      default:
        setActiveColor('#2b62bc');
        setFinishedColor('#6e6e6e');
        break;
    }
  }, []);

  return (
    <header className="header">
      <Link to="/" style={linkStyle} className="header__logo" onClick={handleClick}>
        <h1>
          R
        </h1>
      </Link>
      {currentUser
        ? (
          <>
            <Link to="/" style={activeStyle} onClick={handleClick}>
              <h2 className="header__active">
                Active
              </h2>
            </Link>
            <Link to="/finished" style={finishedStyle} onClick={handleClick}>
              <h2 className="header__finished">
                Finished
              </h2>
            </Link>
            <Link to="/account" style={linkStyle}>
              <img className="header__account" src={accountIcon} alt="account-icon" />
            </Link>
          </>
        ) : null }
    </header>
  );
};

export default Header;
