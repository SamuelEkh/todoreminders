import '../style/Register.css';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const linkStyle = {
  color: '#4a4a4a',
  textDecoration: 'underline',
  marginLeft: '3px',
};

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConf, setPasswordConf] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { signup } = useAuth();
  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== passwordConf) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      setLoading(false);
      history.push('/todoreminders');
    } catch {
      setError('Failed to create an account');
    }

    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.className === 'register__email') {
      setEmail(e.target.value);
    }
    if (e.target.className === 'register__password') {
      setPassword(e.target.value);
    }
    if (e.target.className === 'register__password register__password--conf') {
      setPasswordConf(e.target.value);
    }
  };

  return (
    <section className="register">
      <h2 className="register__title">Register</h2>
      <div>{error}</div>
      <form className="register__form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Email" className="register__email" value={email} onChange={handleChange} />
        <input type="password" placeholder="Password" className="register__password" value={password} onChange={handleChange} />
        <input type="password" placeholder="Confirm password" className="register__password register__password--conf" value={passwordConf} onChange={handleChange} />
        <input type="submit" value="Register" className="register__submit" disabled={loading} />
      </form>
      <div className="login__register">
        Already have an account?
        <Link style={linkStyle} to="/todoreminders">Log in here!</Link>
      </div>
    </section>
  );
};

export default Register;
