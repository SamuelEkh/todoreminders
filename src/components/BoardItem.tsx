import { useState } from 'react';
import workBlue from '../icons/workBlue.png';
import workWhite from '../icons/workWhite.png';
import shoppingWhite from '../icons/shoppingWhite.png';
import shoppingBlue from '../icons/shoppingBlue.png';
import collaborativeWhite from '../icons/collaborativeWhite.png';
import collaborativeBlue from '../icons/collaborativeBlue.png';
import { ListProps } from './List';
import { ITask } from '../types';

const BoardItem: React.FC<ListProps> = ({ list }) => {
  const [workIcon, setWorkIcon] = useState(workBlue);
  const [shoppingIcon, setShoppingIcon] = useState(shoppingBlue);
  const [collaborativeIcon, setCollaborativeIcon] = useState(collaborativeBlue);

  const listIcon = (type: string) => {
    if (type === 'work') {
      return <img className="list-item__icon" src={workIcon} alt="work-icon" />;
    }
    if (type === 'shopping') {
      return <img className="list-item__icon" src={shoppingIcon} alt="shopping-icon" />;
    }
    return null;
  };

  const handleMouseEnter = (type: string) => {
    if (type === 'work') {
      setWorkIcon(workWhite);
    }
    if (type === 'shopping') {
      setShoppingIcon(shoppingWhite);
    }
    setCollaborativeIcon(collaborativeWhite);
  };

  const handleMouseLeave = (type: string) => {
    if (type === 'work') {
      setWorkIcon(workBlue);
    }
    if (type === 'shopping') {
      setShoppingIcon(shoppingBlue);
    }
    setCollaborativeIcon(collaborativeBlue);
  };

  return (
    <div className="list-item" onMouseEnter={() => handleMouseEnter(list.listType)} onMouseLeave={() => handleMouseLeave(list.listType)}>
      {listIcon(list.listType)}
      {list.collaborators.length > 0
        ? <img className="list-item__collaborative" src={collaborativeIcon} alt="Collaborative Icon" />
        : null}
      {list.tasks.length > 0
        ? (
          <p className="list-item__tasks">
            {list.tasks.filter((task: ITask) => task.completed).length}
            /
            {list.tasks.length}
          </p>
        )
        : <p className="list-item__tasks">0</p>}
      <div className="list-item__title-container">
        <p className="list-item__title">{list.title}</p>
      </div>
    </div>
  );
};

export default BoardItem;
