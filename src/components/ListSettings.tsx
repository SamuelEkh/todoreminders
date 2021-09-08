import '../style/ListSettings.css';
import { useState, useEffect } from 'react';
import { ISocket as IProps } from '../App';
import { ListProps, IState as popopProps } from './List';

type Props = IProps & ListProps & popopProps

const ListSettings: React.FC<Props> = ({ socket, list, setPopupTrigger }) => {
  const [listName, setListName] = useState<string>('');
  const [collaborator, setCollaborator] = useState<string>('');
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [lock, setLock] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement> |
    React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setCollaborators([...collaborators, collaborator]);
    setCollaborator('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.className) {
      case 'settings__title':
        setListName(e.target.value);
        break;
      case 'settings__collaborators-input':
        setCollaborator(e.target.value);
        break;
      default:
        break;
    }
  };

  const removeClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const target = e.target as Element;
    const targetTitle = target.previousElementSibling?.textContent;
    const { parentElement } = target;
    parentElement?.remove();

    collaborators.forEach((person: string) => {
      if (person === targetTitle) {
        const index = collaborators.findIndex((email) => email === targetTitle);
        collaborators.splice(index, 1);
      }
    });
  };

  const handleLock = () => {
    setLock(!lock);
  };

  const allCollaborators = () => collaborators.map((email) => (
    <div key={email}>
      <div className="collaborator__settings">
        <div>{email}</div>
        <button type="button" className="collaborator__remove" onClick={removeClickHandler}>x</button>
      </div>
    </div>
  ));

  const handleAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      handleClick(e);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const newList = {
        _id: list._id,
        tasks: list.tasks,
        collaborators,
        title: listName,
        completed: list.completed,
        lock,
        owner: list.owner,
        listType: list.listType,
      };

      const response = await fetch(`${process.env.REACT_APP_API_BASE}/lists`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          list: newList,
        }),
      });

      if (response.status !== 204) throw new Error();

      setLoading(false);
      setPopupTrigger(false);
      socket.emit('list-update');
    } catch {
      setError('Error updating list');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_BASE}/lists`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: list._id,
        }),
      });

      if (response.status !== 204) throw new Error();

      setLoading(false);
      setPopupTrigger(false);
      socket.emit('list-delete');
    } catch {
      setLoading(false);
      setError('Error deleting list');
    }
  };

  useEffect(() => {
    setListName(list.title);
    setCollaborators(list.collaborators);
    setLock(list.lock);
  }, []);

  return (
    <section className="settings">
      <div className="settings__error">{error}</div>
      <input type="text" className="settings__title" value={listName} onChange={handleChange} />
      <div className="settings__collaborators-container">
        {allCollaborators()}
        <input className="settings__collaborators-input" type="text" placeholder="Add collaborator" value={collaborator} onChange={handleChange} onKeyDown={handleAddKeyDown} />
        <button type="button" className="settings__collaborators-add" onClick={handleClick}>+</button>
      </div>
      <div className="lock-container">
        <div className="settings__lock">Lock list</div>
        <button type="button" className="settings__checkbox" onClick={handleLock}>
          {lock ? <div className="settings__check" /> : null}
        </button>
      </div>
      <button type="button" className="settings__save" disabled={loading} onClick={handleSave}>Save</button>
      <button type="button" className="settings__delete" onClick={handleDelete}>Delete List</button>
    </section>
  );
};

export default ListSettings;
