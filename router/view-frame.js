import { View } from '../view/view.js';

export class ViewFrame {
  constructor() {
    // super('view-frame');
    this.dom = document.querySelector('#view-frame');
  }

  get activeView() { return (this.dom||{}).firstElementChild || null }

  set(renderedView) {
    if (!renderedView) return;

    if (this.activeView) {
      const prev = this.dom.replaceChild(renderedView, this.activeView);

      return prev;
    }

    else this.dom.append(renderedView);
  }


  render() {
    return this.dom;
  }
}