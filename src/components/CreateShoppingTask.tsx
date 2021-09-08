import '../style/CreateTask.css';
import { useState } from 'react';
import { ISocket as IProps } from '../App';
import { IState as popopProps } from './List';
import { ISubtask } from '../types';

type Props = IProps & popopProps;

const CreateShoppingTask: React.FC<Props> = ({ socket, setPopupTrigger }) => {
  const [mainTask, setMainTask] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [subTask, setSubTask] = useState<ISubtask>({ title: '', completed: false });
  const [allSubTasks, setAllSubTasks] = useState<ISubtask[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleClick = (e:
    React.MouseEvent<HTMLButtonElement> |
    React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setAllSubTasks([...allSubTasks, subTask]);
    setSubTask({ title: '', completed: false });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!mainTask) {
      return setError('Main task required');
    }
    const urlPath = window.location.pathname;
    const linkMatch = urlPath.match(/\/[a-zA-Z0-9]+$/g);
    const listId = linkMatch?.toString().replace('/', '');
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${process.env.REACT_APP_API_BASE}/lists/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: listId,
          task: {
            mainTask,
            price,
            completed: false,
            editing: false,
            subTasks: allSubTasks,
          },
        }),
      });

      if (response.status !== 201) throw new Error();

      setPopupTrigger(false);
      setLoading(false);
      socket.emit('list-update');
    } catch {
      setLoading(false);
      setError('Error creating task');
    }
    return null;
  };

  const removeClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const target = e.target as Element;
    const targetTitle = target.parentElement?.textContent?.slice(0, -1);
    const allSubTasksArr = allSubTasks;
    allSubTasksArr.forEach((task: ISubtask) => {
      if (task.title === targetTitle) {
        const index = allSubTasksArr.findIndex((item: ISubtask) => item.title === targetTitle);
        allSubTasksArr.splice(index, 1);
      }
    });
    setAllSubTasks([...allSubTasksArr]);
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.className) {
      case 'create-task__main-task':
        setMainTask(e.target.value);
        break;
      case 'subtask-form__input':
        setSubTask({ ...subTask, [e.target.name]: e.target.value });
        break;
      case 'create-task__price': {
        const re = /^[0-9.\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
          setPrice(e.target.value);
        }
        break;
      }
      default:
        break;
    }
  };

  const allSubTaskElements = () => allSubTasks.map((task: ISubtask) => (
    <div className="subtask" key={task.title}>
      <div className="subtask__text">
        {task.title}
        <button type="button" className="subtask__remove" onClick={removeClickHandler}>X</button>
      </div>
    </div>
  ));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      handleClick(e);
    }
  };

  return (
    <>
      <form className="create-task" onSubmit={handleSubmit}>
        <div className="create-task__title">Create task</div>
        <div className="create-task__error">{error}</div>
        <input className="create-task__main-task" type="text" placeholder="Main task" value={mainTask} onChange={changeHandler} />
        {allSubTaskElements()}
        <div className="subtask-form">
          <input className="subtask-form__input" type="text" placeholder="Sub task" value={subTask.title} name="title" onChange={changeHandler} onKeyDown={handleKeyDown} />
          <button type="button" className="subtask-form__add" onClick={handleClick}>+</button>
        </div>
        <input className="create-task__price" type="text" placeholder="Price" onChange={changeHandler} value={price} />
        <input className="create-task__submit" disabled={loading} type="submit" value="Create" />
      </form>
    </>
  );
};

export default CreateShoppingTask;
