import '../style/CreateList.css';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ISocket as IProps } from '../App';

const CreateList: React.FC<IProps> = ({ socket }) => {
  const { currentUser } = useAuth();
  const history = useHistory();
  const [title, setTitle] = useState<string>('');
  const [collaborator, setCollaborator] = useState<string>('');
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [listType, setListType] = useState<string>('regular');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleClick = (e:
    React.MouseEvent<HTMLButtonElement> |
    React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setCollaborators([...collaborators, collaborator]);
    setCollaborator('');
  };

  const handleSubmit = async (e:
    React.FormEvent<HTMLFormElement> |
    React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      if (title.length > 30) return setError('Only 30 characters allowed in title');
      setError('');
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_BASE}/lists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          tasks: [],
          completed: false,
          lock: false,
          owner: currentUser?.email,
          collaborators,
          listType,
        }),
      });

      const returnedValue = await response.json();

      if (response.status !== 201) throw new Error();

      setCollaborators([]);
      setTitle('');
      setLoading(false);
      socket.emit('board-update');
      history.push(`/lists/${returnedValue._id}`);
    } catch {
      setLoading(false);
      return setError('Failed to create list');
    }

    return null;
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.className) {
      case 'create-list__title':
        setTitle(e.target.value);
        break;
      case 'create-list__collaborators-input':
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
        const index = collaborators.findIndex((item) => item === targetTitle);
        collaborators.splice(index, 1);
      }
    });
  };

  const allCollaborators = () => collaborators.map((email) => (
    <div key={email}>
      <div className="collaborator">
        <div>{email}</div>
        <button type="button" className="collaborator__remove" onClick={removeClickHandler}>x</button>
      </div>
    </div>
  ));

  const handleRadioClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const target = e.target as Element;

    switch (target.className) {
      case 'radio-buttons__input radio-buttons__input--regular':
        setListType('regular');
        break;
      case 'radio-buttons__input radio-buttons__input--work':
        setListType('work');
        break;
      case 'radio-buttons__input radio-buttons__input--shopping':
        setListType('shopping');
        break;
      default:
        break;
    }
  };

  // const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setListType(e.target.value);
  // }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  const handleAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      handleClick(e);
    }
  };

  const regularStyle = {
    background: listType === 'regular' ? 'linear-gradient(0.12turn, #4d88e8, #6ea5ff, #abcbff)' : 'white',
    color: listType === 'regular' ? 'white' : '#4a4a4a',
  };

  const workStyle = {
    background: listType === 'work' ? 'linear-gradient(0.12turn, #4d88e8, #6ea5ff, #abcbff)' : 'white',
    color: listType === 'work' ? 'white' : '#4a4a4a',
  };

  const shoppingStyle = {
    background: listType === 'shopping' ? 'linear-gradient(0.12turn, #4d88e8, #6ea5ff, #abcbff)' : 'white',
    color: listType === 'shopping' ? 'white' : '#4a4a4a',
  };

  return (
    <section className="create-list">
      <h2 className="create-list__header">Create new list</h2>
      <h3 className="create-list__subheader">Additional tasks can be added after list is created</h3>
      <form className="create-list__form" onSubmit={handleSubmit}>
        <div className="create-list__error">{error}</div>
        <div className="create-list__required">*</div>
        <input className="create-list__title" type="text" placeholder="Title" value={title} onChange={changeHandler} onKeyDown={handleKeyDown} />
        <div className="create-list__collaborators-container">
          <div className="create-list__collaborators">{allCollaborators()}</div>
          <input className="create-list__collaborators-input" type="text" placeholder="Add collaborator" value={collaborator} onChange={changeHandler} onKeyDown={handleAddKeyDown} />
          <button type="button" className="create-list__collaborators-add" onClick={handleClick}>+</button>
        </div>
        <p className="radio-buttons__header">Select List Type</p>
        <div className="radio-buttons">
          <button type="button" className="radio-buttons__input radio-buttons__input--regular" style={regularStyle} onClick={handleRadioClick}>Regular</button>
          <button type="button" className="radio-buttons__input radio-buttons__input--work" style={workStyle} onClick={handleRadioClick}>Work</button>
          <button type="button" className="radio-buttons__input radio-buttons__input--shopping" style={shoppingStyle} onClick={handleRadioClick}>Shopping</button>
        </div>
        <input className="create-list__submit" type="submit" value="Create" disabled={loading} />
      </form>
    </section>
  );
};

export default CreateList;
