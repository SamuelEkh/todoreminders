import React from 'react';
import { render } from '@testing-library/react';
import BoardItem from '../components/BoardItem';

const testList0task = {
  _id: '1',
  tasks: [],
  collaborators: [],
  title: 'TestList 1',
  completed: false,
  lock: false,
  owner: 'testOwner@gmail.com',
  listType: 'regular',
};

const testWorkList = {
  _id: '1',
  tasks: [],
  collaborators: ['testCollaborator@gmail.com'],
  title: 'TestList 1',
  completed: false,
  lock: false,
  owner: 'testOwner@gmail.com',
  listType: 'work',
};

const testShoppingList = {
  _id: '1',
  tasks: [],
  collaborators: ['testCollaborator@gmail.com'],
  title: 'TestList 1',
  completed: false,
  lock: false,
  owner: 'testOwner@gmail.com',
  listType: 'shopping',
};

const testList1task = {
  _id: '1',
  tasks: [{
    mainTask: 'testTask 1',
    completed: false,
    editing: false,
    subTasks: [{
      title: 'testSubtask 1',
      completed: false,
    }],
  }],
  collaborators: ['testCollaborator@gmail.com'],
  title: 'TestList 1',
  completed: false,
  lock: false,
  owner: 'testOwner@gmail.com',
  listType: 'regular',
};

describe('BoardItem', () => {
  it('renders without crashing', () => {
    render(<BoardItem list={testList1task} />);
  });
  it('renders name and amount of tasks', () => {
    const display = render(<BoardItem list={testList1task} />);
    const { getByText } = display;
    getByText(/TestList 1/);
    getByText(/0\/1/);
  });
  it('renders a 0 when theres no tasks', () => {
    const display = render(<BoardItem list={testList0task} />);
    const { getByText } = display;
    getByText(/TestList 1/);
    getByText(/\b0\b/);
  });
  it('renders icon when worklist', () => {
    const { container } = render(<BoardItem list={testWorkList} />);
    expect(container.firstChild?.firstChild).toHaveClass('list-item__icon');
  });
  it('renders icon when shoppinglist', () => {
    const { container } = render(<BoardItem list={testShoppingList} />);
    expect(container.firstChild?.firstChild).toHaveClass('list-item__icon');
  });
  it('renders collaboratorsicon when theres collaborators', () => {
    const { container } = render(<BoardItem list={testWorkList} />);
    expect(container.firstChild?.firstChild?.nextSibling).toHaveClass('list-item__collaborative');
  });
  it('doesnt render any icons without collaborators or if regular', () => {
    const { container } = render(<BoardItem list={testList0task} />);
    expect(container.firstChild?.firstChild?.nextSibling).toHaveClass('list-item__title-container');
  });
});
