function newElement(tag = 'div', attrs = {}, children = [], template = '') {
  const el = attrs.namespaceURI ? document.createElementNS(attrs.namespaceURI, tag) : document.createElement(tag);

  el.innerHTML = template;

  for (let attr of Object.keys(attrs)) {
    if (attr === 'data') {
      Object.entries(attrs[attr]).forEach(([prop, val]) => el.dataset[prop] = val)
    } else if (attr === 'classList') {
      el.classList.add(...attrs[attr])
    } else if (attr === 'style') {
      if (typeof attrs[attr] === 'string') el.style = `${el.style} ${attrs[attr]}`
      else Object.entries(attrs[attr]).forEach(([prop, val]) => el.style[prop] = val);
    } else el.setAttribute(attr, attrs[attr])
  }
  children.forEach(child => el.appendChild(child));
  return el;
}

export class PlanNode {
  constructor(type = 'div', attrs) {
    this.self = document.createElement(type);
    this.type = type
  }

  append(node) {
    this.self.appendChild(this.create(node.type, node.attrs));

    return this;
  }
  create(tag = 'div', attrs = {}, children = [], template = '') {
    const el = attrs.namespaceURI ? document.createElementNS(attrs.namespaceURI, tag) : document.createElement(tag);

    el.innerHTML = template;

    for (let attr of Object.keys(attrs)) {
      if (attr === 'data') {
        Object.entries(attrs[attr]).forEach(([prop, val]) => el.dataset[prop] = val)
      } else if (attr === 'classList') {
        el.classList.add(...attrs[attr])
      } else if (attr === 'style') {
        if (typeof attrs[attr] === 'string') el.style = `${el.style} ${attrs[attr]}`
        else Object.entries(attrs[attr]).forEach(([prop, val]) => el.style[prop] = val);
      } else el.setAttribute(attr, attrs[attr])
    }

    children.forEach(child => el.appendChild(child));

    return el;
  }


  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}

export default {

}