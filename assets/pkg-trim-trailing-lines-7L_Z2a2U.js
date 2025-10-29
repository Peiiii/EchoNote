function o(i){const n=String(i);let e=n.length;for(;e>0;){const t=n.codePointAt(e-1);if(t!==void 0&&(t===10||t===13))e--;else break}return n.slice(0,e)}export{o as t};
