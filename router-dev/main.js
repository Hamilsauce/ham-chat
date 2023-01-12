import { useRouter } from './router.js';
import { RouterTestApp } from './RouterApp.js';
import { routes } from './routes.js';
// window.history.pushState({ data: new Map([['dododk', { suck: 'me' }]]) }, 'Some history entry title', '/some-path');

// console.log('history', history)

const appEl = document.querySelector('#app');
const nav = document.querySelector('#nav');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')

const app = new RouterTestApp()
const router = useRouter(app, { routes, origin: 'router' })
// app.use(router, {routes, origin: 'router'})

// setTimeout(() => {
//   setInterval(() => {
//     router.flip(1)
//     console.log(' ', );
//   }, 1000)
// }, 2000)



// nav.addEventListener('click', e => {
//   const targ = e.target.closest('[data-router-link]')

//   if (targ) {
//     const path = targ.dataset.path
//     console.log('path', path)
//     router.push(path)
//   }

// });