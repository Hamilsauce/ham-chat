import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template } = ham;

import { LoginView } from '../view/login.view.js';
import { ChatroomView } from '../view/chatroom.view.js';
import { ChatList } from '../view/chat-list.view.js';

export const routes = [
  {
    path: '/',
    name: 'login-view',
    view: ()=> new LoginView() //template('login-view')
  },
  {
    path: '/chats',
    name: 'chat-list-view',
    view: ()=> new ChatList() //template('chat-list-view')
  },
  {
    path: '/chatroom',
    name: 'chatroom-view',
    view: ()=> new ChatroomView() //template('chatroom-view')
  },
];

// export const routes = [
//   {
//     path: '/',
//     name: 'login-view',
//     template: template('login-view')
//   },
//   {
//     path: '/chats',
//     name: 'chat-list-view',
//     template: template('chat-list-view')
//   },
//   {
//     path: '/chatroom',
//     name: 'chatroom-view',
//     template: template('chatroom-view')
//     },
// ];