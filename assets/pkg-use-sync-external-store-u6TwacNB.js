import{c as M}from"./react-vendor-BmBsKbru.js";var R={exports:{}},b={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var D;function g(){if(D)return b;D=1;var n=M();function S(e,r){return e===r&&(e!==0||1/e===1/r)||e!==e&&r!==r}var m=typeof Object.is=="function"?Object.is:S,h=n.useState,p=n.useEffect,E=n.useLayoutEffect,y=n.useDebugValue;function w(e,r){var u=r(),o=h({inst:{value:u,getSnapshot:r}}),t=o[0].inst,f=o[1];return E(function(){t.value=u,t.getSnapshot=r,l(t)&&f({inst:t})},[e,u,r]),p(function(){return l(t)&&f({inst:t}),e(function(){l(t)&&f({inst:t})})},[e]),y(u),u}function l(e){var r=e.getSnapshot;e=e.value;try{var u=r();return!m(e,u)}catch{return!0}}function i(e,r){return r()}var a=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?i:w;return b.useSyncExternalStore=n.useSyncExternalStore!==void 0?n.useSyncExternalStore:a,b}var O;function U(){return O||(O=1,R.exports=g()),R.exports}var k=U(),x={exports:{}},V={};/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var z;function G(){if(z)return V;z=1;var n=M(),S=U();function m(i,a){return i===a&&(i!==0||1/i===1/a)||i!==i&&a!==a}var h=typeof Object.is=="function"?Object.is:m,p=S.useSyncExternalStore,E=n.useRef,y=n.useEffect,w=n.useMemo,l=n.useDebugValue;return V.useSyncExternalStoreWithSelector=function(i,a,e,r,u){var o=E(null);if(o.current===null){var t={hasValue:!1,value:null};o.current=t}else t=o.current;o=w(function(){function _(c){if(!j){if(j=!0,v=c,c=r(c),u!==void 0&&t.hasValue){var s=t.value;if(u(s,c))return d=s}return d=c}if(s=d,h(v,c))return s;var W=r(c);return u!==void 0&&u(s,W)?(v=c,s):(v=c,d=W)}var j=!1,v,d,q=e===void 0?null:e;return[function(){return _(a())},q===null?void 0:function(){return _(q())}]},[a,e,r,u]);var f=p(i,o[0],o[1]);return y(function(){t.hasValue=!0,t.value=f},[f]),l(f),f},V}var I;function L(){return I||(I=1,x.exports=G()),x.exports}var C=L();export{k as s,C as w};
