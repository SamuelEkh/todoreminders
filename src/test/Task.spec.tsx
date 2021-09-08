import React from 'react';
import { render } from '@testing-library/react';
import { io } from 'socket.io-client';
import Task from '../components/Task';

const testTask = {
  mainTask: 'testTask 1',
  completed: false,
  editing: false,
  subTasks: [
    {
      title: 'testSubtask 1',
      completed: false,
    },
    {
      title: 'testSubtask 2',
      completed: false,
    }],
};

const testShoppingTask = {
  mainTask: 'testTask 2',
  completed: false,
  editing: false,
  subTasks: [
    {
      title: 'testSubtask 1',
      completed: false,
    },
    {
      title: 'testSubtask 2',
      completed: false,
    }],
  price: '125',
};

const testWorkTask = {
  mainTask: 'testTask 2',
  completed: false,
  editing: false,
  subTasks: [
    {
      title: 'testSubtask 1',
      completed: false,
    },
    {
      title: 'testSubtask 2',
      completed: false,
    }],
  deadline: '2021-12-31',
};

describe('Task', () => {
  it('renders without crashing', () => {
    render(<Task task={testTask} socket={io('')} id="1234" removeTask={() => 'nofunction'} lock={false} type="regular" />);
  });
  it('displays taskname', () => {
    const { getByText } = render(<Task task={testTask} socket={io('')} id="1234" removeTask={() => 'nofunction'} lock={false} type="regular" />);
    getByText(/testTask 1/);
  });
  it('renders subtasks', () => {
    const { getByText } = render(<Task task={testTask} socket={io('')} id="1234" removeTask={() => 'nofunction'} lock={false} type="regular" />);
    getByText(/testSubtask 1/);
    getByText(/testSubtask 2/);
  });
  it('renders price', () => {
    const { getByText } = render(<Task task={testShoppingTask} socket={io('')} id="1234" removeTask={() => 'nofunction'} lock={false} type="regular" />);
    getByText(/125/);
  });
  it('renders deadline', () => {
    const { getByText } = render(<Task task={testWorkTask} socket={io('')} id="1234" removeTask={() => 'nofunction'} lock={false} type="regular" />);
    getByText(/2021-12-31/);
  });
});
