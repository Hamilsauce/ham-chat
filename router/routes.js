import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils } = ham;

export const routes = [
  {
    path: '/',
    template: template('login-view')
  },
  {
    path: '/about',
    // template: '<h1 data-view-name="about">About</h1>',
    template: template('about-view')
  },
  {
    path: '/contact',
    // template: '<h1 data-view-name="contact">Contact</h1>',
    template: template('contact-view')
  },
];