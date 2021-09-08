import '../style/ListBoard.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ISocket as IProps } from '../App';
import { IList } from '../types';
import BoardItem from './BoardItem';

const ActiveBoard: React.FC<IProps> = ({ socket }) => {
  const [lists, setLists] = useState<IList[]>([]);
  const [error, setError] = useState<string>('');
  const { currentUser } = useAuth();

  const linkStyle = {
    color: 'black',
    textDecoration: 'none',
  };

  const listFetcher = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE}/lists/${currentUser?.email}`);
      const result = await response.json();

      if (response.status !== 200) throw new Error();

      setLists(result);
    } catch {
      setError('No lists found...');
    }
  };

  const myLists = () => lists.filter((list: IList) => !list.completed)
    .map((list: IList) => (
      <Link to={`/todoreminders/lists/${list._id}`} style={linkStyle} className="list-container" key={list._id}>
        <BoardItem list={list} />
      </Link>
    ));

  useEffect(() => {
    setError('');
    listFetcher();
    socket.on('update-board', () => {
      listFetcher();
    });
  }, []);

  return (
    <>
      <Link to="/todoreminders/create-list" style={linkStyle}><button type="button" className="create-list__btn">Create List</button></Link>
      <section className="lists">
        {myLists()}
        <div className="lists__error">{error}</div>
      </section>

    </>
  );
};

export default ActiveBoard;
