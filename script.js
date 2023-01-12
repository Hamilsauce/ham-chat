import { router } from './router/router.js';
import { App } from './view/app.js';
import { routes } from './router/routes.js';

const app = new App({
  templateName: 'app',
  elementProperties: {},
});


app.use(router, { routes, origin: 'router' });