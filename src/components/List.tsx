import '../style/List.css';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Popup from './Popup';
import CreateWorkTask from './CreateWorkTask';
import CreateShoppingTask from './CreateShoppingTask';
import CreateRegularTask from './CreateRegularTask';
import { ISocket as IProps } from '../App';
import { ITask, IList } from '../types';
import Lock from '../icons/lock.png';
import Task from './Task';
import ListSettings from './ListSettings';
import { useAuth } from '../contexts/AuthContext';

export interface ListProps {
  list: IList
}

export interface IState {
  popupTrigger: boolean,
  setPopupTrigger: React.Dispatch<React.SetStateAction<boolean>>
}

export interface taskState {
  removeTask: (task: string) => void,
  task: ITask,
  lock: boolean,
  id: string,
  type: string
}

const List: React.FC<IProps> = ({ socket }) => {
  const [error, setError] = useState<string>('');
  const [list, setList] = useState<IList[]>([
    {
      _id: '',
      tasks: [],
      collaborators: [],
      title: '',
      completed: false,
      lock: false,
      owner: '',
      listType: '',
    },
  ]);
  const [popupTrigger, setPopupTrigger] = useState<IState['popupTrigger']>(false);
  const [tasks, setTasks] = useState<ITask[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [editList, setEditList] = useState<boolean>(false);
  const history = useHistory();
  const { currentUser } = useAuth();

  let listId = '';
  const urlPath = window.location.pathname;
  const linkMatch = urlPath.match(/\/[a-zA-Z0-9]+$/g);
  if (linkMatch) {
    listId = linkMatch.toString().replace('/', '');
  }

  const totalPrice = () => {
    if (list[0].listType === 'shopping') {
      const taskArr: ITask[] = [];
      tasks?.forEach((task: ITask) => {
        if (task.price !== '') {
          taskArr.push(task);
        }
      });
      return taskArr.reduce((total, task) => total + (parseFloat(task.price!)), 0);
    }
    return 0;
  };

  const fetchList = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE}/lists/${listId}`); // CHANGE TO REQ.BODY
      const result = await response.json();

      if (response.status !== 200) throw new Error();

      setList(result);
      setTasks(result[0].tasks);
    } catch {
      setError('Error loading list');
    }
  };

  const setComplete = async (value: boolean) => {
    if (!list[0].lock) {
      try {
        setError('');
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_BASE}/lists`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: listId,
            complete: value,
          }),
        });

        if (response.status !== 200) throw new Error();

        setLoading(false);
        history.push('/todoreminders');
        socket.emit('list-update');
      } catch {
        setLoading(false);
        setError('Error updating list');
      }
    }
    return null;
  };

  const createTask = () => {
    switch (list[0].listType) {
      case 'regular':
        return (
          <CreateRegularTask
            socket={socket}
            setPopupTrigger={setPopupTrigger}
            popupTrigger={popupTrigger}
          />
        );
      case 'shopping':
        return (
          <CreateShoppingTask
            socket={socket}
            setPopupTrigger={setPopupTrigger}
            popupTrigger={popupTrigger}
          />
        );
      case 'work':
        return (
          <CreateWorkTask
            socket={socket}
            setPopupTrigger={setPopupTrigger}
            popupTrigger={popupTrigger}
          />
        );
      default:
        break;
    }
    return null;
  };

  const removeTask = async (task: string) => {
    try {
      setLoading(true);
      setError('');
      const activeTasks = list[0].tasks;
      activeTasks.forEach((item: ITask) => {
        if (item.mainTask === task) {
          const index = activeTasks.findIndex((mainTask: ITask) => mainTask.mainTask === task);
          activeTasks.splice(index, 1);
        }
      });
      setTasks([...activeTasks]);

      const response = await fetch(`${process.env.REACT_APP_API_BASE}/lists/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: list[0]._id,
          tasks,
        }),
      });

      if (response.status !== 204) throw new Error();

      setLoading(false);
      setError('');
      socket.emit('list-update');
    } catch (err) {
      setError('Error deleting task');
      setLoading(false);
    }
  };

  const renderCompleteButton = () => {
    if (list[0].completed) {
      return <button type="button" className="list__complete" disabled={loading} onClick={() => setComplete(false)}>Move to active</button>;
    }
    return <button type="button" className="list__complete" disabled={loading} onClick={() => setComplete(true)}>Move to finished</button>;
  };

  const handleSettings = () => {
    setEditList(true);
    setPopupTrigger(true);
  };

  const handleAddTask = () => {
    if (!list[0].lock) {
      setEditList(false);
      setPopupTrigger(true);
    }
  };

  useEffect(() => {
    fetchList();
    socket.on('update-list', () => {
      fetchList();
    });
    socket.on('delete-list', () => {
      history.push('/todoreminders');
    });

    return () => socket.removeAllListeners();
  }, []);

  const notCompletedTasks = tasks?.filter((task) => task.completed === false);
  const completedTasks = tasks?.filter((task) => task.completed);

  return (
    <>
      {list
        ? (
          <section className="list">
            <h2 className="list__title">
              {list[0].lock ? <img className="list__lock-icon" src={Lock} alt="A lock" /> : null}
              {list[0].title}
              {totalPrice() > 0 ? (
                <div className="list__price">
                  {totalPrice()}
                  :-
                </div>
              ) : null}
            </h2>
            <div className="list__error">{error}</div>
            {currentUser?.email === list[0].owner
              ? <button type="button" className="list__settings" onClick={handleSettings}>Settings</button>
              : null}
            <button type="button" className="list__add-task" onClick={handleAddTask}>+</button>
            <div className="list__task-container">
              {list && tasks
                ? notCompletedTasks?.map((task: ITask) => (
                  <Task
                    key={uuidv4()}
                    socket={socket}
                    lock={list[0].lock}
                    task={task}
                    id={listId}
                    removeTask={removeTask}
                    type={list[0].listType}
                  />
                ))
                : null }
              {list && tasks
                ? completedTasks?.map((task: ITask) => (
                  <Task
                    key={uuidv4()}
                    socket={socket}
                    lock={list[0].lock}
                    task={task}
                    id={listId}
                    removeTask={removeTask}
                    type={list[0].listType}
                  />
                ))
                : null }
            </div>
            {renderCompleteButton()}
            <Popup trigger={popupTrigger} setPopupTrigger={setPopupTrigger}>
              {editList
                ? (
                  <ListSettings
                    socket={socket}
                    list={list[0]}
                    setPopupTrigger={setPopupTrigger}
                    popupTrigger={popupTrigger}
                  />
                )
                : createTask()}
            </Popup>
          </section>
        )
        : <div>Loading...</div>}
    </>
  );
};

export default List;
