export class DOMBuilder {
  constructor(parent = document.body, config) {
    this.plan = config
    this.parent = parent
  }


  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}