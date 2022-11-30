import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { utils } = ham;

export class Action {
  #type;
  #actionId;

  constructor(type, opts = {}) {
    Object.entries(opts).forEach(([k, v], i) => {
      Object.defineProperties(this, {
        [k]: {
          value: v,
          writable: false
        },
      });
    });

    this.#actionId = Action.#uuid();
  }

  static #uuid() { return 'a' + utils.uuid() }

  get type() { return this.#type }

  get actionId() { return this.#actionId }
}

const validateProps = (def, props) => {
  return Object.entries(props)
    .every(([k, v]) => def[k] && v.constructor.name === v)
};

export const defineAction = (type, propDefinition = {}) => {
  if ([!!type].includes(false)) return console.error('NO PROPS OR TYPE PASSED TO DEFINE ACTION')
  let validate;
  
  if (propDefinition) {
    validate = (props) => validateProps(propDefinition, props)
  }
  
  return (props) => {
    if (validate && !validate(props)) return console.error('INVALID PROPS ACTION: ' + type)
    return new Action(type, props)
  }
};
