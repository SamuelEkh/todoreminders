import '../style/Task.css';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { taskState as IProps } from './List';
import { ISocket as socketProps } from '../App';
import { ISubtask } from '../types';

type Props = IProps & socketProps;

const Task: React.FC<Props> = (
  {
    task, socket, id, removeTask, lock, type,
  },
) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [mainTask, setMainTask] = useState<string>('');
  const [subTasks, setSubTasks] = useState<ISubtask[]>([{ title: '', completed: false }]);
  const [newSubTask, setNewSubTask] = useState<string>('');
  const [price, setPrice] = useState<string|undefined>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [deadline, setDeadline] = useState<string|undefined>('');

  const indexFinder = (title: string) => subTasks
    .findIndex((item: ISubtask) => item.title === title);

  const subTaskCompleteStyle = (subtask: ISubtask) => ({
    textDecoration: subtask.completed ? 'line-through' : 'none',
    backgroundColor: subtask.completed ? '#dbdbdb' : '#fafafa',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.className) {
      case 'edit__maintask':
        setMainTask(e.target.value);
        break;
      case 'edit__subtask': {
        const items = subTasks;
        const index = indexFinder(e.target.name);
        items[index].title = e.target.value;
        setSubTasks([...items]);
        break;
      }
      case 'edit__new-subtask':
        setNewSubTask(e.target.value);
        break;
      case 'edit__price': {
        const allowedNums = /^[0-9.\b]+$/;
        if (e.target.value === '' || allowedNums.test(e.target.value)) {
          setPrice(e.target.value);
        }
        break;
      }
      default:
        break;
    }
  };

  const setTaskComplete = async (value: boolean) => {
    try {
      setError('');
      setLoading(true);
      // const subTaskArr = subTasks;
      // if (value) {
      //   subTaskArr.forEach((item: ISubtask) => {
      //     const changeItem = item;
      //     changeItem.completed = true;
      //   });
      // }
      const response = await fetch(`${process.env.REACT_APP_API_BASE}/lists/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          task,
          complete: value,
        }),
      });

      if (response.status !== 200) throw new Error();

      socket.emit('list-update');
      setLoading(false);
    } catch {
      setError('Error updating task');
      setLoading(false);
    }
  };

  const allCompletedControll = (subtask: string) => {
    if (subTasks && subTasks.length > 0) {
      const index = indexFinder(subtask);
      if (!subTasks[index].completed && subTasks.length - 1 === subTasks
        .filter((item: ISubtask) => item.completed).length) {
        setTaskComplete(false);
        return true;
      }
      if (subTasks[index].completed && subTasks.length === subTasks
        .filter((item: ISubtask) => item.completed).length) {
        setTaskComplete(true);
        return true;
      }
    }
    return false;
  };

  const setSubTaskComplete = async (subtask: ISubtask) => {
    if (!loading && !lock) {
      try {
        setLoading(true);
        setError('');
        const subtaskArr = subTasks;
        const completedSubtask = subtask;
        completedSubtask.completed = !subtask.completed;
        subtaskArr.forEach((item: ISubtask) => {
          if (subtask.title === item.title) {
            const index = indexFinder(subtask.title);
            subtaskArr.splice(index, 1, completedSubtask);
          }
        });

        setSubTasks([...subtaskArr]);

        const response = await fetch(`${process.env.REACT_APP_API_BASE}/lists/tasks`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id,
            task,
            subtasks: subTasks,
          }),
        });

        if (response.status !== 200) throw new Error();

        setLoading(false);
        if (allCompletedControll(subtask.title)) {
          allCompletedControll(subtask.title);
        } else {
          socket.emit('list-update');
        }
      } catch {
        setError('Error updating list');
        setLoading(false);
      }
    }
  };

  const handleRemoveSubTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    // eslint-disable-next-line no-irregular-whitespace
    const target = e.target as Element;
    const targetElement = target.previousElementSibling as HTMLInputElement;
    const targetTitle = targetElement.value;
    // const targetTitle = target.previousElementSibling?.value;
    const subTaskArr = subTasks;
    subTaskArr.forEach((item: ISubtask) => {
      if (item.title === targetTitle) {
        const index = subTaskArr.findIndex((subitem: ISubtask) => subitem.title === targetTitle);
        subTaskArr.splice(index, 1);
      }
    });
    setSubTasks([...subTaskArr]);
  };

  const handleSubTaskKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, subtask: ISubtask) => {
    if (!loading && !lock && e.keyCode === 13) {
      setSubTaskComplete(subtask);
    }
  };

  const handleTaskKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!loading && !lock && e.keyCode === 13) {
      if (!task.completed) {
        return setTaskComplete(true);
      }
      return setTaskComplete(false);
    }
    return null;
  };

  const renderSubtasks = () => task.subTasks.map((subtask: ISubtask) => (
    <div className="subtask" role="button" tabIndex={0} onKeyDown={(e) => handleSubTaskKeyDown(e, subtask)} key={uuidv4()} style={subTaskCompleteStyle(subtask)} onClick={() => setSubTaskComplete(subtask)}>
      {subtask.title}
      {subtask.completed ? <div className="subtask__completed" /> : null}
    </div>
  ));

  const renderEditSubtasks = () => subTasks.map((subtask: ISubtask) => (
    <div className="edit__subtask-container" key={uuidv4()}>
      <input type="text" className="edit__subtask" name={subtask.title} value={subTasks[indexFinder(subtask.title)].title} onChange={handleChange} />
      <button type="button" className="edit__subtask-remove" onClick={handleRemoveSubTask}>X</button>
    </div>
  ));

  const handleNewSubtask = () => {
    setSubTasks([...subTasks, { completed: false, title: newSubTask }]);
    setNewSubTask('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      handleNewSubtask();
    }
  };

  const handleSaveList = async () => {
    try {
      setError('');
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_BASE}/lists/tasks`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          originalTask: task.mainTask,
          task: {
            mainTask,
            deadline,
            price,
            completed: false,
            subTasks,
          },
        }),
      });

      if (response.status !== 200) throw new Error();
    } catch {
      setLoading(false);
      setError('Error saving list');
    }

    setEdit(false);
    socket.emit('list-update');
    setLoading(false);
  };

  const taskCompleteHandler = () => {
    if (!loading && !lock) {
      if (!task.completed) {
        return setTaskComplete(true);
      }
      return setTaskComplete(false);
    }
    return null;
  };

  const taskCompleteStyle = {
    textDecoration: task.completed ? 'line-through' : 'none',
  };

  const taskCompleteContainerStyle = {
    backgroundColor: task.completed ? '#bdbdbd' : '#fafafa',
  };

  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(e.target.value);
  };

  const handleSetEdit = () => {
    if (!lock) {
      setEdit(true);
    }
  };

  const handleRemoveTask = () => {
    if (!lock) {
      removeTask(task.mainTask);
    }
  };

  useEffect(() => {
    setMainTask(task.mainTask);
    setSubTasks(task.subTasks);
    setDeadline(task.deadline);
    setPrice(task.price);

    // if (task.completed) {
    //   subTasks.forEach(async (item: ISubtask) => {
    //     await setSubTaskComplete(item);
    //   });
    // }
  }, [task]);

  return edit ? (
    <div className="edit">
      <div className="edit-container">
        <input type="text" className="edit__maintask" value={mainTask} onChange={handleChange} />
        {/* <button className="list__maintask-complete" >Done</button> */}
        <div className="subtask-container">
          {renderEditSubtasks()}
        </div>
        <input className="edit__new-subtask" type="text" placeholder="Add new subtask" value={newSubTask} onChange={handleChange} onKeyDown={handleKeyDown} />
        <button type="button" className="edit__new-subtask--btn" onClick={handleNewSubtask}>+</button>
      </div>
      {type === 'work' ? <input type="date" className="edit__deadline" value={deadline} onChange={handleDeadlineChange} /> : null}
      {type === 'shopping' ? <input type="text" placeholder="Price" className="edit__price" value={price} onChange={handleChange} /> : null}
      <button type="button" className="task__maintask-edit" onClick={handleSaveList}>Save</button>
    </div>
  )
    : (
      <div className="task" style={taskCompleteContainerStyle}>
        <div className="task-container">
          <div role="button" tabIndex={0} className="task__maintask" key={uuidv4()} onKeyDown={handleTaskKeyDown} onClick={taskCompleteHandler} style={taskCompleteStyle}>{task.mainTask}</div>
          <div className="subtask-container">
            {renderSubtasks()}
          </div>
          {task.completed
            ? <button type="button" className="task__maintask-edit task__maintask-edit--delete" onClick={handleRemoveTask}>Delete</button>
            : <button type="button" className="task__maintask-edit" onClick={handleSetEdit}>Edit</button>}
          {task.deadline ? (
            <div className="task__deadline">
              -
              {task.deadline}
              {' '}
              -
            </div>
          ) : null}
          {task.price ? (
            <div className="task__price">
              {task.price}
              :-
            </div>
          ) : null}
        </div>
        <div className="task__error">{error}</div>
      </div>
    );
};

export default Task;
