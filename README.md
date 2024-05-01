React 의 Virtual DOM의 핵심 알고리즘인 Diffing 알고리즘을 구현하고 Virtual DOM을 이해한다.

### Diffing 알고리즘 이해하기
Virtual DOM에서는 실제 DOM과 Virtual DOM을 비교하여 변경된 부분만을 실제 DOM에 반영하는데, 이때 변경된 부분을 찾아내는 알고리즘이 Diffing 알고리즘이다.

#### 노드
노드는 HTML 문서의 요소를 의미하며 크게 3가지로 나뉜다.
- 요소 노드
- 텍스트 노드
- 주석 노드


##### Node Type
노드 타입을 알아내기 위해서는 `nodeType`을 사용한다.
```javascript
const node  = document.createElement('div');
console.log(node.nodeType); // 1
```
`ELEMENT_NODE (1)`
- 용도: HTML 요소를 나타낸다. (예: div, p, span 등)
- 구분: 문서의 구조적 요소를 구성하며, 속성과 자식 노드(텍스트, 다른 엘리먼트 등)을 가질 수 있다.

`TEXT_NODE (3)`
- 용도: 요소의 텍스트 콘텐츠를 나타낸다.
- 구분: 순수한 텍스트를 가지며, 자식 노드를 가질 수 없다.

`COMMENT_NODE (8)`
- 용도: 주석을 나타낸다. (예: <!-- 주석내용 -->)
- 구분: 주석 텍스트를 담고있으며, 렌더링되지 않는다.

`DOCUMENT_NODE (9)`
- 용도: 문서 전체를 나타내며 DOM 트리의 최상위에 존재한다.
- 구분: document 객체를 통해 참조되며, 요소, 텍스트, 주석 등 다양한 자식 노드를 가질 수 있다.


#### 노드의 속성
`node.attributes`를 사용하여 노드의 속성을 알아낸다.
여기서 `attributes`는 NamedNodeMap 이라는 객체이다
```javascript
const node = document.createElement('div');
node.setAttribute('id', 'app');
console.log(node.attributes); // NamedNodeMap { 0: id, id: id, length: 1 }
```

#### 노드의 자식 노드
`node.childNodes`를 사용하여 노드의 자식 노드를 알아낸다.
```javascript
const node = document.createElement('div');
const textNode = document.createTextNode('hello');
node.appendChild(textNode);
console.log(node.childNodes); // NodeList[text]
```

---
출처

[Virtual DOM - Diffing 알고리즘을 구현하고 이해하기(1)
](https://devocean.sk.com/blog/techBoardDetail.do?ID=165601&boardType=techBlog
)

[Virtual DOM - Diffing 알고리즘을 구현하고 이해하기(2)
](https://devocean.sk.com/blog/techBoardDetail.do?ID=165611&boardType=techBlog&searchData=&page=&subIndex=%EC%B5%9C%EC%8B%A0+%EA%B8%B0%EC%88%A0+%EB%B8%94%EB%A1%9C%EA%B7%B8)