import '../style/Account.css';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Account: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  const handleLogout = async () => {
    try {
      setError('');
      setLoading(true);
      await logout();
      setLoading(false);
    } catch {
      setError('Failed to log out');
      setLoading(false);
    }

    history.push('/todoreminders');
  };

  return currentUser ? (
    <section className="account">
      <h3 className="account__email-title">Email</h3>
      <p className="account__email">{currentUser.email}</p>
      <div>{error}</div>
      <button className="account__logout" type="button" disabled={loading} onClick={handleLogout}>Log out</button>
    </section>
  ) : null;
};

export default Account;
