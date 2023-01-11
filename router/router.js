import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, utils } = ham;

export class Router extends EventEmitter {
  #routes = [];
  previousPathName = null;
  origin = null;

  constructor() {
    super();
this.install = this.#install.bind(this);
    this.handleRouterLinkClick = this.#handleRouterLinkClick.bind(this);
    // this.#init();


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
  // get previousPathName() { return location.pathname.replace('/router/', '') }

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
    console.warn('IN POP', { history, location, router: this });
  }

  push(...urlSegments) {
    const matchedRoute = this.#matchPath(urlSegments);
    const url = `${urlSegments.join('/')}`;

    if (url === this.currentPathName) return;

    this.previousPathName = this.currentPathName

    history.pushState({}, '', `${url}`);

    this.render();

    console.warn('[END OF PUSH]: this.currentPathName', this.currentPathName)
    console.warn({ history });
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
      this.push(routerLink.dataset.path);
    }
  }

 static #install(app, { routes, origin }) {
    this.#routes = routes;

    this.origin = origin;
    console.log('install', this)

    // app.addEventListener('click', this.handleRouterLinkClick);

    // this.replace('');
  }
}



export const router = new Router();