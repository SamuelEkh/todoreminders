import '../style/Login.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();

  const linkStyle = {
    color: '#4a4a4a',
    textDecoration: 'underline',
    marginLeft: '3px',
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
    } catch (err) {
      setLoading(false);
      setEmail('');
      setPassword('');
      setError('Failed to sign in');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.className === 'login__email') {
      setEmail(e.target.value);
    }
    if (e.target.className === 'login__password') {
      setPassword(e.target.value);
    }
  };

  return (
    <section className="login">
      <h2 className="login__header">Welcome to Reminders!</h2>
      <h3 className="login__subheader">Please log in or create an account</h3>
      <h2 className="login__title">Log in</h2>
      <div>{error}</div>
      <form className="login__form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Email" className="login__email" value={email} onChange={handleChange} />
        <input type="password" placeholder="Password" className="login__password" value={password} onChange={handleChange} />
        <input type="submit" value="login" disabled={loading} className="login__btn" />
      </form>
      <div className="login__register">
        Not a member?
        <Link style={linkStyle} to="/register">Sign up here!</Link>
      </div>
    </section>
  );
};

export default Login;
