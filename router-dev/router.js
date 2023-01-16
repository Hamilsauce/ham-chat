import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { ViewFrame } from '../router/view-frame.js';

const { template, utils } = ham;

export class ViewHistory {
  #items = [];

  constructor() {
    this.pop = this.#pop.bind(this)
  }

  push(view) {
    this.#items.push(view);
  }

  #pop() {
    // const poppedItem = this.#items.pop();
    this.#items = [...this.#items].slice(1, this.#items.length - 1);
  }

  get isEmpty() { return this.size <= 0 }

  get items() { return this.#items }

  get size() { return this.#items.length }

  get head() { return this.#items.length ? this.#items[this.#items.length - 1] : null }
}


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

  render() {
    const route = this.#routes.find(r => r.name == this.activeRoute.name);
    const view = route.view();

    console.log('view', view)
    // const temp = template(this.activeRoute.name);
    

    this.#viewHistory.push(view.dom);


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
    const url = `${urlSegments.join('/')}`;

    if (url === this.currentPathName) return;

    const matchedRoute = this.#matchPath(urlSegments);

    history.replaceState({ view: matchedRoute.name }, '', `${url}`);

    this.render();
  }

  #matchPath(urlSegments) {
    if (urlSegments.length === 1 && urlSegments[0] === '/' || urlSegments[0] === '') {
      return this.#routes.find(_ => _.path === '/');
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

  init({ routes, origin }) {
    this.#routes = routes;
    this.origin = origin;

    this.replace('');
  }

  install(app, options) {
    app.on('click', this.handleRouterLinkClick);

    this.init(options);
    console.log('ROUTER INSTALL', this, this.#routes);
    console.log('ACTIVE ROUTE', this.activeRoute);
    return this;
  }

  #handleRouterLinkClick(e) {
    const { target } = e;
    const routerLink = e.target.closest('[data-router-link]');

    if (routerLink) {
      this.push(routerLink.dataset.path);
    }
  }
}



export const router = new Router()


// export const useRouter = (app, options) => {
//   const { routes, origin } = options;

//   if (router === null) {
//     router = new Router(origin, routes);

//     app.on('click', router.handleRouterLinkClick);
//   }

//   return router;
// }