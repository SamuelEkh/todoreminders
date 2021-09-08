import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Header from './components/Header';
import Account from './components/Account';
import FinishedBoard from './components/FinishedBoard';
import CreateList from './components/CreateList';
import List from './components/List';

declare module 'socket.io-client' {
  interface Socket {
    removeAllListeners: () => void;
  }
}

export type ISocket = {
  socket: Socket
}

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket>(io);

  useEffect(() => {
    const iosocket = io(`${process.env.REACT_APP_SERVER}/`);
    setSocket(iosocket);

    return () => {
      iosocket.disconnect();
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <main className="main-content">
          <Header />
          <Route exact path="/" render={() => (<Dashboard socket={socket} />)} />
          <Route path="/lists/:id" render={() => (<List socket={socket} />)} />
          <Route path="/register" component={Register} />
          <Route path="/finished" render={() => (<FinishedBoard socket={socket} />)} />
          <Route path="/account" component={Account} />
          <Route path="/create-list" render={() => (<CreateList socket={socket} />)} />
        </main>
      </AuthProvider>
    </Router>
  );
};

export default App;
