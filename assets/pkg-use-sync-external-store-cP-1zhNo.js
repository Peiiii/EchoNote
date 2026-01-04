import{c as q}from"./react-vendor-BmBsKbru.js";var x={exports:{}},R={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var g;function k(){if(g)return R;g=1;var n=q();function S(e,r){return e===r&&(e!==0||1/e===1/r)||e!==e&&r!==r}var v=typeof Object.is=="function"?Object.is:S,d=n.useState,h=n.useEffect,m=n.useLayoutEffect,p=n.useDebugValue;function E(e,r){var u=r(),o=d({inst:{value:u,getSnapshot:r}}),t=o[0].inst,i=o[1];return m(function(){t.value=u,t.getSnapshot=r,f(t)&&i({inst:t})},[e,u,r]),h(function(){return f(t)&&i({inst:t}),e(function(){f(t)&&i({inst:t})})},[e]),p(u),u}function f(e){var r=e.getSnapshot;e=e.value;try{var u=r();return!v(e,u)}catch{return!0}}function a(e,r){return r()}var c=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?a:E;return R.useSyncExternalStore=n.useSyncExternalStore!==void 0?n.useSyncExternalStore:c,R}var I;function M(){return I||(I=1,x.exports=k()),x.exports}var J=M(),b={exports:{}},_={};/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var W;function C(){if(W)return _;W=1;var n=q();function S(e,r){return e===r&&(e!==0||1/e===1/r)||e!==e&&r!==r}var v=typeof Object.is=="function"?Object.is:S,d=n.useState,h=n.useEffect,m=n.useLayoutEffect,p=n.useDebugValue;function E(e,r){var u=r(),o=d({inst:{value:u,getSnapshot:r}}),t=o[0].inst,i=o[1];return m(function(){t.value=u,t.getSnapshot=r,f(t)&&i({inst:t})},[e,u,r]),h(function(){return f(t)&&i({inst:t}),e(function(){f(t)&&i({inst:t})})},[e]),p(u),u}function f(e){var r=e.getSnapshot;e=e.value;try{var u=r();return!v(e,u)}catch{return!0}}function a(e,r){return r()}var c=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?a:E;return _.useSyncExternalStore=n.useSyncExternalStore!==void 0?n.useSyncExternalStore:c,_}var L;function A(){return L||(L=1,b.exports=C()),b.exports}var K=A(),$={exports:{}},j={};/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var z;function B(){if(z)return j;z=1;var n=q(),S=M();function v(a,c){return a===c&&(a!==0||1/a===1/c)||a!==a&&c!==c}var d=typeof Object.is=="function"?Object.is:v,h=S.useSyncExternalStore,m=n.useRef,p=n.useEffect,E=n.useMemo,f=n.useDebugValue;return j.useSyncExternalStoreWithSelector=function(a,c,e,r,u){var o=m(null);if(o.current===null){var t={hasValue:!1,value:null};o.current=t}else t=o.current;o=E(function(){function V(s){if(!D){if(D=!0,y=s,s=r(s),u!==void 0&&t.hasValue){var l=t.value;if(u(l,s))return w=l}return w=s}if(l=w,d(y,s))return l;var U=r(s);return u!==void 0&&u(l,U)?(y=s,l):(y=s,w=U)}var D=!1,y,w,O=e===void 0?null:e;return[function(){return V(c())},O===null?void 0:function(){return V(O())}]},[c,e,r,u]);var i=h(a,o[0],o[1]);return p(function(){t.hasValue=!0,t.value=i},[i]),f(i),i},j}var G;function F(){return G||(G=1,$.exports=B()),$.exports}var N=F();export{K as a,J as s,N as w};
