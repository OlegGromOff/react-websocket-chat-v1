npx create-react-app chat-websocket-v1
Создай файл server.js внутри папки с проектом.
Используй фреймворк express для создания(запуска) сервера - npm i express

Чтобы запустить нашу серверную часть надо использовать команду - node server.js
Добавил в package.json "server": "node server.js" и теперь могу запускать сервер командой npm run server
Запустить client - npm run start в другом терминале

Websockets - npm i socket.io (библиотека для бекенда)
https://my-js.org/docs/guide/socket/

npm i socket.io-client - (библиотека для фронтенда) чтобы соединить фронт и бек с помощью сокетов

В файле package.json пишу "proxy": "http://localhost:9999" это значит что каждый запрос на localhost:3000 будет так же проксироваться на http://localhost:9999 и тогда в файле soclet.js в строке const socket = io(); в скобочках можно ничего не писать\

nodemon - следит за изменениями в коде сервера (чтобы каждый раз после внесения изменений в код сервера не перезапускать сервер)
npm i nodemon
В файле package.json пишем "server": "nodemon server.js" вместо "server": "node server.js"

устанавливаю axios - npm i axios

socket.on - событие которое срабатывает когда клиент отправляет сообщение на сервер
socket.on(eventName, listener) - добавляет обработчик для события под названием eventName
disconnect - происходит при отключении сокета:
disconnecting - происходит перед disconnect, может использоваться для регистрации выхода пользователя из непустой комнаты
socket.to(roomId) - отпавить сообщение в комнату roomId
socket.emit - отправляем сообщение на сервер. позволяет создавать пользовательские события на сервере и клиенте.
socket.emit('ROOM:NEW_MESSAGE', {obj}) // отправляем сообщение на сервер с помощью сокета и указываем тип события и данные которые хотим передать на сервер (в данном случае это объект с данными), ROOM:NEW_MESSAGE - тип события (событие которое мы сами придумали), создали в server.js  
     