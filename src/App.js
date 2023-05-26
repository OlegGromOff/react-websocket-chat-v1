import React from 'react';
import axios from 'axios';

import socket from './socket';

import reducer from './reducer';
import JoinBlock from './components/JoinBlock';
import Chat from './components/Chat';

function App() {
  const [state, dispatch] = React.useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
  });

  const onLogin = async (obj) => { // (когда вошли в комнату/авторизовались) функция которая вызывается при нажатии на кнопку отправки запроса на сервер
    dispatch({ // вызываем dispatch с action типом JOINED и значением payload true
      type: 'JOINED',
      payload: obj,
    });
    socket.emit('ROOM:JOIN', obj); // (подключился к сокету комнаты)отправляем событие ROOM:JOIN на сервер с инфой о obj 
    const { data } = await axios.get(`/rooms/${obj.roomId}`); // получаем инфу о комнате с сервера (await ждет результата запроса)
    dispatch({
      type: 'SET_DATA',
      payload: data,
    });
  };

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users,
    });
  };

  const addMessage = (message) => { // добавляем сообщение в state messages  и рендерим его в компоненте Chat
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message,
    });
  };

  React.useEffect(() => {
    socket.on('ROOM:SET_USERS', setUsers); // подписываемся на событие ROOM:SET_USERS и вызываем функцию setUsers
    socket.on('ROOM:NEW_MESSAGE', addMessage);  // как только от сервера мы получим сокет запрос ROOM:NEW_MESSAGE вызываем функцию addMessage
  }, []);

  window.socket = socket;

  return (
    <div className="wrapper">
      {!state.joined ? ( // если state.joined false(не авторизован) то рендерим компонент JoinBlock иначе Chat
        <JoinBlock onLogin={onLogin} />
      ) : (
        <Chat {...state} onAddMessage={addMessage} />
      )}
    </div>
  );
}

export default App;
