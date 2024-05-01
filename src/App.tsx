import React, { useEffect } from "react";
import { diffing, removeEmptyTextNode } from "./utils";



function App() {
  useEffect(() => {
    const fragment = `
    <div style="color:green">Virtual DOM의 헤드</div>
    <h3 style="color:red">Virtual DOM의 h3</h3>
    <p>몇 자 끄적여봅니다.</p>
    <div style="color:blue;font-size:20px;display:flex; justify-content:center; align-items:center; flex-direction:column;">
        <span>넘버링 1</span>
        <span>넘버링 2</span>
        <span>넘버링 3</span>
    </div>`;

    const virtualDOM = document.createElement('div');
    virtualDOM.innerHTML = fragment;

    // fragment를 VirtualDOM 파싱한 상태
    if (!virtualDOM) return;
    let DOM = document.getElementById('node');
    if (!DOM) return;

    // 정리된 DOM
    removeEmptyTextNode(DOM);

    // 버튼 클릭 시 diffing 함수 실행
    document.querySelector('button')?.addEventListener('click', function() {
      console.log('diffing 알고리즘을 실행합니다.');
      diffing(virtualDOM as unknown as HTMLElement, DOM as HTMLElement);
    })
  }, []);

  return (
    <div className="App" style={{ padding: '20px' }}>
      <div id="node"></div>
      <button>click</button>
    </div>
  )
}

export default App;