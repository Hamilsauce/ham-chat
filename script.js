import { router } from './router/router.js';
import { App } from './view/app.js';
import { routes } from './router/routes.js';
import { viewRegistery } from './view/view-registery.js';

const app = new App({
  templateName: 'app',
  elementProperties: {},
});

// const app = viewRegistery.load('app', {
//   templateName: 'app',
//   elementProperties: {},
// })

setTimeout(() => {
console.log('viewRegistery', viewRegistery.entries);

console.log('app', app)

app.use(router, { routes, origin: 'router' });
}, 1000)

