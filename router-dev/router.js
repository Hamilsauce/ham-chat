import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { ViewFrame } from '../router/view-frame.js';

const { template, utils } = ham;

export class ViewHistory {
  #items = [];

  constructor() {}

  push(view) {
    this.#items.push(view);
  }

  pop() {
    return this.#items.pop();
  }

  get isEmpty() { return this.size <= 0 }

  get items() { return this.#items }

  get size() { return this.#items.length }

  get head() { return this.#items.length ? this.#items[this.#items.length - 1] : null }
}


console.log('{history, location}', { history, location })

class Router extends EventEmitter {
  #routes = [];
  previousPathName = null;
  origin = null;
  #viewHistory = new ViewHistory();
  #viewFrame = null;

  constructor(origin, routes) {
    super();
    this.#routes = routes;
    this.origin = origin;

    this.handleRouterLinkClick = this.#handleRouterLinkClick.bind(this);

    this.#viewFrame = new ViewFrame();

    this.#init();

    window.onpopstate = e => {
      this.pop();
    }
  }

  get routes() { return this.#routes }

  get activeRoute() { return this.#routes.find(r => r.path === this.currentPathName) }

  get historySize() { return history.length }

  get currentPathName() {
    return location.pathname
      .replace('router-dev', '')
      .replace('router', '')
      .replace('index.html', '')
      .replace('//', '/');
  }

  get currentViewName() { return history.state.view }

  render(_temp) {
    const temp = template(this.activeRoute.name);
    const boundEls = [...temp.querySelectorAll('[data-bind]')]

    boundEls.forEach((el, i) => {
      const [attr, valueName] = el.dataset.bind.split(':');

      if (attr === 'textContent') {
        el.textContent = this[valueName];
      }
    });
    this.#viewHistory.push(temp);

    this.#viewFrame.set(this.#viewHistory.head);
  }

  onPopState(e) {}

  go(delta) {
    history.go(delta);
  }

  flip(back = 1, duration = 100) {
    back = back > 0 ? -(back) : back;
    history.go(back);

    setTimeout(() => {
      history.go(-(back));
    }, duration);
  }

  pop(e) {
    this.previousPathName = this.currentPathName;

    this.#viewHistory.pop();

    this.render();
  }

  push(...urlSegments) {
    const url = `${urlSegments.join('/')}`;

    if (url === this.currentPathName) return;

    const matchedRoute = this.#matchPath(urlSegments);

    this.previousPathName = this.currentPathName

    history.pushState({ view: matchedRoute.name }, '', `${url}`);

    this.render();
  }

  replace(...urlSegments) {
    const matchedRoute = this.#matchPath(urlSegments);
    const url = `${urlSegments.join('/')}`;

    if (url === this.currentPathName) return;

    history.replaceState({ view: matchedRoute.name }, '', `${url}`);

    this.render();
  }

  #matchPath(urlSegments) {
    if (urlSegments.length === 1 && urlSegments[0] === '/' || urlSegments[0] === '') {
      return this.#routes.find(_ => _.path === '/')
    }

    const matchedRoute = this.#routes.find(route => {
      const routePathSegments = route.path.split('/').slice(1);

      if (routePathSegments.length !== urlSegments.length) {
        return false;
      }

      return routePathSegments.every((routePathSegment, i) => routePathSegment === urlSegments[i]);
    });

    return matchedRoute;
  }

  #init() { this.replace(''); }

  #handleRouterLinkClick(e) {
    const { target } = e;
    const routerLink = e.target.closest('[data-router-link]');

    if (routerLink) {
      this.push(routerLink.dataset.path);
    }
  }
}



let router = null;

export const useRouter = (app, options) => {
  const { routes, origin } = options;

  if (router === null) {
    router = new Router(origin, routes);

    app.on('click', router.handleRouterLinkClick);
  }

  return router;
}