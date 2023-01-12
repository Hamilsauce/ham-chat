import { AppFooter } from './app-footer.view.js';
import { AppBody } from './app-body.view.js';
import { AppHeader } from './app-header.view.js';

export const AppShellOptions = {
  components: [
    {
      index: 0,
      name: 'app-footer',
      view: AppFooter,
    },
    {
      index: 1,
      name: 'app-body',
      view: AppBody,
    },
    {
      index: 2,
      name: 'app-header',
      view: AppHeader,
    },
  ]
};