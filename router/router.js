import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils } = ham;

class Router extends EventEmitter {
  #routes = [];
  previousPathName = null;
  origin = null;

  constructor() {
    super();
    // this.install = this.#install.bind(this);
    this.handleRouterLinkClick = this.#handleRouterLinkClick.bind(this);
    this.#init();


    window.onpopstate = e => {
      console.warn('window.onpopstate', { e });
      e.preventDefault()
      e.stopPropagation();

      this.pop()
    }
  }

  get viewFrame() { return document.querySelector('#view-frame'); }

  get activeViewName() { return this.viewFrame.firstElementChild ? this.viewFrame.firstElementChild.dataset.viewName : null; }

  get activeView() { return this.viewFrame.firstElementChild }

  get routes() { return this.#routes }

  get historySize() { return history.length }

  get currentPathName() { return location.pathname.replace('/router/', '') }

  render() {
    if (this.activeView) {
      this.activeView.remove()
    }

    const temp = template('active-route');

    const boundEls = [...temp.querySelectorAll('[data-bind]')]

    boundEls.forEach((el, i) => {
      const [attr, valueName] = el.dataset.bind.split(':');
      console.log('attr, valueName', attr, valueName)

      if (attr === 'textContent') {
        el.textContent = this[valueName]
      }


      // el.setAttribute(attr, this[valueName])
    });

    this.viewFrame.append(temp);
  }

  onPopState(e) {

  }

  pop(e) {
    console.log('history.length before back', history.length)
    this.render();
    console.log('history.length after back', history.length)
  }

  push(...urlSegments) {
    const url = `${urlSegments.join('/')}`;

    if (url === this.currentPathName) return;

    const matchedRoute = this.#matchPath(urlSegments);
  
    this.previousPathName = this.currentPathName

    history.pushState({}, '', `${url}`);

    this.render();

    console.warn('[END OF PUSH]: this.currentPathName', this.currentPathName)
    console.warn({ history });
    console.log('history.length after back', history.length)
  }

  replace(...urlSegments) {
    const matchedRoute = this.#matchPath(urlSegments);
    const url = `${urlSegments.join('/')}`;

    if (url === this.currentPathName) return;

    history.replaceState({}, '', `${url}`)

    this.render();

    console.warn('[END OF REPLACE]: this.currentPathName', this.currentPathName)
    console.warn({ history });
  }

  #matchPath(urlSegments) {
    console.log('matchPath', this)
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
      console.warn('handleRouterLinkClick')
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