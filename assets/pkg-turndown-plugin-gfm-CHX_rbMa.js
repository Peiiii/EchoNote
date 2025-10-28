var u=/highlight-(?:text|source)-([a-z0-9]+)/;function s(e){e.addRule("highlightedCodeBlock",{filter:function(t){var n=t.firstChild;return t.nodeName==="DIV"&&u.test(t.className)&&n&&n.nodeName==="PRE"},replacement:function(t,n,r){var i=n.className||"",l=(i.match(u)||[null,""])[1];return`

`+r.fence+l+`
`+n.firstChild.textContent+`
`+r.fence+`

`}})}function d(e){e.addRule("strikethrough",{filter:["del","s","strike"],replacement:function(t){return"~"+t+"~"}})}var h=Array.prototype.indexOf,m=Array.prototype.every,a={};a.tableCell={filter:["th","td"],replacement:function(e,t){return f(e,t)}};a.tableRow={filter:"tr",replacement:function(e,t){var n="",r={left:":--",right:"--:",center:":-:"};if(o(t))for(var i=0;i<t.childNodes.length;i++){var l="---",c=(t.childNodes[i].getAttribute("align")||"").toLowerCase();c&&(l=r[c]||l),n+=f(l,t.childNodes[i])}return`
`+e+(n?`
`+n:"")}};a.table={filter:function(e){return e.nodeName==="TABLE"&&o(e.rows[0])},replacement:function(e){return e=e.replace(`

`,`
`),`

`+e+`

`}};a.tableSection={filter:["thead","tbody","tfoot"],replacement:function(e){return e}};function o(e){var t=e.parentNode;return t.nodeName==="THEAD"||t.firstChild===e&&(t.nodeName==="TABLE"||p(t))&&m.call(e.childNodes,function(n){return n.nodeName==="TH"})}function p(e){var t=e.previousSibling;return e.nodeName==="TBODY"&&(!t||t.nodeName==="THEAD"&&/^\s*$/i.test(t.textContent))}function f(e,t){var n=h.call(t.parentNode.childNodes,t),r=" ";return n===0&&(r="| "),r+e+" |"}function g(e){e.keep(function(n){return n.nodeName==="TABLE"&&!o(n.rows[0])});for(var t in a)e.addRule(t,a[t])}function N(e){e.addRule("taskListItems",{filter:function(t){return t.type==="checkbox"&&t.parentNode.nodeName==="LI"},replacement:function(t,n){return(n.checked?"[x]":"[ ]")+" "}})}function v(e){e.use([s,d,g,N])}export{v as g};
