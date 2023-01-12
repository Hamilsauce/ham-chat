// export const routes = [
//   {
//     path: '/',
//     template: '<h1 data-view-name="home">Home</h1>'
//   },
//   {
//     path: '/about',
//     template: '<h1 data-view-name="about">About</h1>',
//   },
//   {
//     path: '/contact',
//     template: '<h1 data-view-name="contact">Contact</h1>',
//   },
// ];

import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils } = ham;

export const routes = [
  {
    path: '/',
    name: 'login-view',
    template: template('login-view')
  },
  {
    path: '/about',
    // template: '<h1 data-view-name="about">About</h1>',
    name: 'about-view',
    template: template('about-view')
  },
  {
    path: '/contact',
    // template: '<h1 data-view-name="contact">Contact</h1>',
    name: 'contact-view',
    template: template('contact-view')
  },
];