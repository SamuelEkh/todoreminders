import Login from './Login';
import { useAuth } from '../contexts/AuthContext';
import { ISocket as IProps } from '../App';
import ActiveBoard from './ActiveBoard';

const Dashboard: React.FC<IProps> = ({ socket }) => {
  const { currentUser } = useAuth();

  return (
    <>
      {currentUser
        ? (
          <>
            <ActiveBoard socket={socket} />
          </>
        )
        : <Login />}
    </>
  );
};

export default Dashboard;
