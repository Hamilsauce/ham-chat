import { LoginView } from '../view/login.view.js';
import { ChatroomView } from '../view/chatroom.view.js';
import { ChatList } from '../view/chat-list.view.js';

export const routes = [
  {
    path: '/',
    name: 'login-view',
    view: () => new LoginView(),
  },
  {
    path: '/chats',
    name: 'chat-list-view',
    view: () => new ChatList(),
  },
  {
    path: '/chatroom',
    name: 'chatroom-view',
    view: () => new ChatroomView(),
  },
];