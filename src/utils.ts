export function getNodeType(node: Element) {
  // 일반 ELEMENT_NODE 의 경우 tagName을 반환
  if (node.nodeType === 1) return node.tagName.toLocaleLowerCase();
  else return node.nodeType;
}

// childNodes 를 추출하면 중간에 빈 문자열이나 줄바꿈(\n)이 포함되어 있기 때문에 
// 자식 노드 중 주석 노드(8)면 삭제하고 텍스트 노드(3)이면서 
// 빈 문자열이거나 줄바꿈이면 삭제하는 함수
export function removeEmptyTextNode(node: Element) {
  const children = node.childNodes;
  for (let i = 0; i < children.length; i++) {
    if (children[i].nodeType === 8 || (
      children[i].nodeType === 3 && !children[i].textContent?.trim()
    )) {
      node.removeChild(children[i]);
      i--;
    } else if (children[i].nodeType === 1) { // 재귀적으로 자식 노드 정리
      removeEmptyTextNode(children[i] as Element);
    }
  }
}

// 노드의 속성을 추출
export function getAttributes(node: Element) {
  const attributes = node.attributes;
  const attrs: {
    [key: string]: string
  } = {};

  for (let i = 0; i < attributes.length; i++) {
    attrs[attributes[i].name] = attributes[i].value;
  }

  return attrs;
}


// virtualDOM과 DOM을 비교하여 DOM을 업데이트
export function compareAndPatchAttributes(virtualDOM: Element, DOM: Element) {
  const virtualDOMAttributes = getAttributes(virtualDOM);
  const DOMAttributes = getAttributes(DOM);

  const attributes = Object.keys(virtualDOMAttributes);
  for (let i = 0; i < attributes.length; i++) {
    const attr = attributes[i];

    // virtualDOM의 속성이 DOM에 없다면 추가
    if (!DOMAttributes[attr]) {
      DOM.setAttribute(attr, virtualDOMAttributes[attr]);
    } else if (DOMAttributes[attr] !== virtualDOMAttributes[attr]) { // virtualDOM의 속성이 DOM에 있지만 값이 다르면 수정
      // style 속성은 객체로 변환하여 비교
      if (attr === 'style') {
        const virtualDOMStyle = virtualDOMAttributes[attr];
        const DOMStyle = DOMAttributes[attr];
        const virtualDOMStyleKeys = Object.keys(virtualDOMStyle);
        const DOMStyleKeys = Object.keys(DOMStyle);

        // virtualDOM에는 있지만 DOM에는 없는 속성 삭제
        for (let  i = 0; i < DOMStyleKeys.length; i++) {
          const styleKey: any = DOMStyleKeys[i];
          if (!virtualDOMStyle[styleKey]) {
            (DOM as HTMLElement).style[styleKey] = '';
          }
        }

        // virtualDOM에는 없지만 DOM에는 있는 속성은 추가
        for (let i = 0; i < virtualDOMStyleKeys.length; i++) {
          const styleKey: any = virtualDOMStyleKeys[i];
          if (!DOMStyle[styleKey]) {
            (DOM as HTMLElement).style[styleKey] = virtualDOMStyle[styleKey];
          }
        }

        // virtualDOM과 DOM 속성을 비교하여 다른 속성만 수정
        for (let i = 0; i < virtualDOMStyleKeys.length; i++) {
          const styleKey: any = virtualDOMStyleKeys[i];
          if (DOMStyle[styleKey] !== virtualDOMStyle[styleKey]) {
            (DOM as HTMLElement).style[styleKey] = virtualDOMStyle[styleKey];
          }
        }
      } else {
        DOM.setAttribute(attr, virtualDOMAttributes[attr]);
      }
    }
  }

  // DOM의 속성이 virtualDOM에 없다면 삭제
  const DOMAttributesKeys = Object.keys(DOMAttributes);
  for (let i = 0; i < DOMAttributesKeys.length; i++) {
    const attr = DOMAttributesKeys[i];
    if (!virtualDOMAttributes[attr]) {
      DOM.removeAttribute(attr);
    }
  }
}

export function diffing(virtualDOM: Element, DOM: Element) {
  // DOM이 비어있고, virtualDOM이 비어있지 않다면
  if (!DOM.hasChildNodes() && virtualDOM.hasChildNodes()) {
    // virtualDOM의 자식 노드를 순회하며 DOM에 추가
    for (let i = 0; i < virtualDOM.childNodes.length; i++) {
      DOM.append(virtualDOM.childNodes[i].cloneNode(true));
    }
  } else {
    // 만약 두 노드가 같다면 return -> 변경이 필요없다
    if (virtualDOM.isEqualNode(DOM)) return;

    // 만약 두 노드가 가지는 자식 노드의 개수가 다르다면 -> 노드를 추가하거나 삭제했다는 의미
    if (DOM.childNodes.length > virtualDOM.childNodes.length) {
      let count = DOM.childNodes.length - virtualDOM.childNodes.length;
      if (count > 0) {
        // 순서에 상관없이 뒤에서부터 제거
        for (; count> 0; count--) {
          DOM.childNodes[DOM.childNodes.length - count].remove();
        }
      }
    }

    // DOM의 길이를 virtualDOM의 길이로 맞춘 상태에서 순회
    for(let i = 0; i < virtualDOM.childNodes.length; i++) {
      // 만약 DOM의 자식 노드가 없다면
      if (DOM.childNodes[i] === undefined) {
        // 추가
        DOM.append(virtualDOM.childNodes[i].cloneNode(true));
      } else if (
        getNodeType(virtualDOM.childNodes[i] as Element) === 
        getNodeType(DOM.childNodes[i] as Element)
      ) {
        // 텍스트 노드라면
        if (virtualDOM.childNodes[i].nodeType === 3) {
          // 텍스트 노드의 값이 다르다면 변경
          if (virtualDOM.childNodes[i].textContent !== DOM.childNodes[i].textContent) {
            DOM.childNodes[i].textContent = virtualDOM.childNodes[i].textContent;
          }
        } else {
          compareAndPatchAttributes(virtualDOM.childNodes[i] as Element, DOM.childNodes[i] as Element);
        }
      } else {
        // 다른 노드 타입이라면
        DOM.childNodes[i].replaceWith(virtualDOM.childNodes[i].cloneNode(true));
      }

      // 3은 텍스트 노드이므로 제외 후 재귀적으로 수행
      if (virtualDOM.childNodes[i].nodeType !== 3) {
        diffing(virtualDOM.childNodes[i] as Element, DOM.childNodes[i] as Element);
      }
    }
  }
}