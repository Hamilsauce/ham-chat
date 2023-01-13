// import {
//   ChatList,
//   ChatroomView,
//   LoginView,
//   InputBar
// } from './index.js';

const ViewRegistery = new Map();

const register = (name, View) => {
  ViewRegistery.set(name, View);
};

const get = (name) => { return ViewRegistery.get(name) };

const load = (name, options) => {
  return ViewRegistery.has(name) ? new(ViewRegistery.get(name))(options) : null;
};

export const viewRegistery = {
  register,
  get,
  load,
  get entries() { return [...ViewRegistery] }
}