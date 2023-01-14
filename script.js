import { router } from './router/router.js';
import { App } from './view/app.js';
import { routes } from './router/routes.js';
import { viewRegistery } from './view/view-registery.js';
import { store} from './models/store.js';


const app = new App({
  templateName: 'app',
  elementProperties: {},
});

app.use(router, { routes, origin: 'router' });

window.onbeforeunload = (e) => {
  store.unsubscribeMessages()
};