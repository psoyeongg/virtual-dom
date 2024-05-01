
import { diffing } from '../src/utils';

  test('diffing', () => {
    const virtualDOM = document.createElement('div');
    virtualDOM.setAttribute('id', 'app');
    virtualDOM.setAttribute('class', 'container');
    const textNode = document.createTextNode('hello');
    virtualDOM.appendChild(textNode);

    const DOM = document.createElement('div');
    DOM.setAttribute('id', 'app');
    const textNode2 = document.createTextNode('hello');
    DOM.append(textNode);

    diffing(virtualDOM, DOM);

    expect(virtualDOM.isEqualNode(DOM)).toBe(true);
  });