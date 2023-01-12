export class Route {
  #path = null;
  #view = null;
  #name = null;

  constructor({ path, view, name }) {
    if (!(path && view && name)) throw new Error('Invalid route');

    this.#path = path;

    this.#view = view;

    this.#name = name;
  }

  get path() { return this.#path }

  get view() { return this.#view }

  get name() { return this.#name }

  static define(routeOptions) {
    if (!routeOptions || typeof routeOptions !== 'object') return null;

    return new Route(routeOptions) || null;
  }
}