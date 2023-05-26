export default (state, action) => {
  switch (action.type) {
    case 'JOINED': // если пришел action с типом JOINED
      return {
        ...state, // возвращаем новый state
        joined: true,
        userName: action.payload.userName,
        roomId: action.payload.roomId, // с полем joined, которое равно значению payload
      };

    case 'SET_DATA':
      return {
        ...state,
        users: action.payload.users,
        messages: action.payload.messages,
      };

    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
      };

    case 'NEW_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload], // добавляем в массив messages новое сообщение
      };

    default:
      return state;
  }
};
