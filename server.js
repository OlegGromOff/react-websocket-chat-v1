const express = require('express'); // import express for node.js

const app = express(); // initialize express
const server = require('http').Server(app); // создал server работающий через библиотеку http который будет работать через express благодаря .Server(app)
const io = require('socket.io')(server); // добавляем в сервер возможность работать с сокетами (в io будет инфо о сокетах и о сервере)

app.use(express.json()); // добавляем в express возможность работать с json

const rooms = new Map(); // map это псевдомассив, аналог объекта, но ключами могут быть любые типы данных и map имеет свои методы

app.get('/rooms/:id', (req, res) => {
   // create route for GET request  http://localhost:9999/rooms/123
  // req - запрос клиента, res - ответ клиенту, params - параметры запроса
  const { id: roomId } = req.params; // id: roomId - деструктуризация. Получаю id из params и присваиваю его в roomId
  const obj = rooms.has(roomId) // если в rooms есть такой ключ то вернуть его значение, иначе вернуть пустой объект
    ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()],
      }
    : { users: [], messages: [] };
  res.json(obj);  // отправляем ответ
});

app.post('/rooms', (req, res) => {
  // что будет при отправке POST запроса на http://localhost:9999/users
  const { roomId, userName } = req.body; // получаем инфу из тела запроса
  if (!rooms.has(roomId)) {
    // если в rooms нет такого ключа то создать его
    rooms.set(
      roomId,
      new Map([ // создаем в rooms ключ roomId и присваиваем ему map
        ['users', new Map()],
        ['messages', []],
      ]),
    );
  }
  res.send(); // отправляем ответ
});

io.on('connection', (socket) => { // событие connection срабатывает когда кто-то подключается к серверу
  socket.on('ROOM:JOIN', ({ roomId, userName }) => { // ROOM:JOIN - событие 
    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, userName); // добавляю пользователя в комнату. socket.id - уникальный идентификатор пользователя. userName - имя пользователя 
    const users = [...rooms.get(roomId).get('users').values()];
    socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);
  });

  socket.on('ROOM:NEW_MESSAGE', ({ roomId, userName, text }) => { // socket.on - событие которое срабатывает когда клиент отправляет сообщение на сервер
    const obj = {
      userName,
      text,
    };
    rooms.get(roomId).get('messages').push(obj);
    socket.to(roomId).broadcast.emit('ROOM:NEW_MESSAGE', obj); // отправляю сообщение всем пользователям в комнате кроме отправителя
  });

  socket.on('disconnect', () => { // событие disconnect срабатывает когда кто-то отключается от сервера. Удаляю пользователя из комнаты и отправляю всем остальным обновленный список пользователей в комнате
    rooms.forEach((value, roomId) => {
      if (value.get('users').delete(socket.id)) { // если пользователь удален из комнаты то отправляю всем остальным обновленный список пользователей в комнате
        const users = [...value.get('users').values()]; // получаю список пользователей в комнате
        socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users); // отправляю всем остальным обновленный список пользователей в комнате
      }
    });
  });

  console.log('user connected', socket.id);
});

server.listen(9999, (err) => { // запускаем сервер на 9999 порту
  if (err) {
    throw Error(err);
  }
  console.log('Сервер запущен!');
});
