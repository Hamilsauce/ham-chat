import { LoginView } from '../view/login.view.js';
import { ChatroomView } from '../view/chatroom.view.js';
import { ChatList } from '../view/chat-list.view.js';

import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template } = ham;

import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template } = ham;

export const routes = [
  {
    path: '/',
    name: 'login-view',
    template: LoginView //template('login-view')
  },
  {
    path: '/chats',
    name: 'chat-list-view',
    template: ChatList //template('chat-list-view')
  },
  {
    path: '/chatroom',
    name: 'chatroom-view',
    template: ChatroomView //template('chatroom-view')
  },
];