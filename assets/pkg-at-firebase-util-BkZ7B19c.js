/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const L=()=>{};var S={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const w=function(e){const t=[];let r=0;for(let o=0;o<e.length;o++){let n=e.charCodeAt(o);n<128?t[r++]=n:n<2048?(t[r++]=n>>6|192,t[r++]=n&63|128):(n&64512)===55296&&o+1<e.length&&(e.charCodeAt(o+1)&64512)===56320?(n=65536+((n&1023)<<10)+(e.charCodeAt(++o)&1023),t[r++]=n>>18|240,t[r++]=n>>12&63|128,t[r++]=n>>6&63|128,t[r++]=n&63|128):(t[r++]=n>>12|224,t[r++]=n>>6&63|128,t[r++]=n&63|128)}return t},I=function(e){const t=[];let r=0,o=0;for(;r<e.length;){const n=e[r++];if(n<128)t[o++]=String.fromCharCode(n);else if(n>191&&n<224){const i=e[r++];t[o++]=String.fromCharCode((n&31)<<6|i&63)}else if(n>239&&n<365){const i=e[r++],a=e[r++],c=e[r++],l=((n&7)<<18|(i&63)<<12|(a&63)<<6|c&63)-65536;t[o++]=String.fromCharCode(55296+(l>>10)),t[o++]=String.fromCharCode(56320+(l&1023))}else{const i=e[r++],a=e[r++];t[o++]=String.fromCharCode((n&15)<<12|(i&63)<<6|a&63)}}return t.join("")},T={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const r=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,o=[];for(let n=0;n<e.length;n+=3){const i=e[n],a=n+1<e.length,c=a?e[n+1]:0,l=n+2<e.length,f=l?e[n+2]:0,y=i>>2,d=(i&3)<<4|c>>4;let s=(c&15)<<2|f>>6,u=f&63;l||(u=64,a||(s=64)),o.push(r[y],r[d],r[s],r[u])}return o.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(w(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):I(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const r=t?this.charToByteMapWebSafe_:this.charToByteMap_,o=[];for(let n=0;n<e.length;){const i=r[e.charAt(n++)],c=n<e.length?r[e.charAt(n)]:0;++n;const f=n<e.length?r[e.charAt(n)]:64;++n;const d=n<e.length?r[e.charAt(n)]:64;if(++n,i==null||c==null||f==null||d==null)throw new k;const s=i<<2|c>>4;if(o.push(s),f!==64){const u=c<<4&240|f>>2;if(o.push(u),d!==64){const h=f<<6&192|d;o.push(h)}}}return o},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class k extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const N=function(e){const t=w(e);return T.encodeByteArray(t,!0)},te=function(e){return N(e).replace(/\./g,"")},F=function(e){try{return T.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function P(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const R=()=>P().__FIREBASE_DEFAULTS__,W=()=>{if(typeof process>"u"||typeof S>"u")return;const e=S.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},V=()=>{if(typeof document>"u")return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=e&&F(e[1]);return t&&JSON.parse(t)},b=()=>{try{return L()||R()||W()||V()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},re=e=>b()?.emulatorHosts?.[e],ne=()=>b()?.config,oe=e=>b()?.[`_${e}`];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class se{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,r)=>{this.resolve=t,this.reject=r})}wrapCallback(t){return(r,o)=>{r?this.reject(r):this.resolve(o),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(r):t(r,o))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function j(e){try{return(e.startsWith("http://")||e.startsWith("https://")?new URL(e).hostname:e).endsWith(".cloudworkstations.dev")}catch{return!1}}async function ie(e){return(await fetch(e,{credentials:"include"})).ok}const p={};function U(){const e={prod:[],emulator:[]};for(const t of Object.keys(p))p[t]?e.emulator.push(t):e.prod.push(t);return e}function H(e){let t=document.getElementById(e),r=!1;return t||(t=document.createElement("div"),t.setAttribute("id",e),r=!0),{created:r,element:t}}let B=!1;function ae(e,t){if(typeof window>"u"||typeof document>"u"||!j(window.location.host)||p[e]===t||p[e]||B)return;p[e]=t;function r(s){return`__firebase__banner__${s}`}const o="__firebase__banner",i=U().prod.length>0;function a(){const s=document.getElementById(o);s&&s.remove()}function c(s){s.style.display="flex",s.style.background="#7faaf0",s.style.position="fixed",s.style.bottom="5px",s.style.left="5px",s.style.padding=".5em",s.style.borderRadius="5px",s.style.alignItems="center"}function l(s,u){s.setAttribute("width","24"),s.setAttribute("id",u),s.setAttribute("height","24"),s.setAttribute("viewBox","0 0 24 24"),s.setAttribute("fill","none"),s.style.marginLeft="-6px"}function f(){const s=document.createElement("span");return s.style.cursor="pointer",s.style.marginLeft="16px",s.style.fontSize="24px",s.innerHTML=" &times;",s.onclick=()=>{B=!0,a()},s}function y(s,u){s.setAttribute("id",u),s.innerText="Learn more",s.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",s.setAttribute("target","__blank"),s.style.paddingLeft="5px",s.style.textDecoration="underline"}function d(){const s=H(o),u=r("text"),h=document.getElementById(u)||document.createElement("span"),E=r("learnmore"),v=document.getElementById(E)||document.createElement("a"),A=r("preprendIcon"),g=document.getElementById(A)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(s.created){const m=s.element;c(m),y(v,E);const x=f();l(g,A),m.append(g,h,v,x),document.body.appendChild(m)}i?(h.innerText="Preview backend disconnected.",g.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(g.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,h.innerText="Preview backend running in this workspace."),h.setAttribute("id",u)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",d):d()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function M(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function ce(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(M())}function O(){const e=b()?.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function ue(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function le(){const e=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof e=="object"&&e.id!==void 0}function fe(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function de(){const e=M();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0}function he(){return!O()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function pe(){return!O()&&!!navigator.userAgent&&(navigator.userAgent.includes("Safari")||navigator.userAgent.includes("WebKit"))&&!navigator.userAgent.includes("Chrome")}function ye(){try{return typeof indexedDB=="object"}catch{return!1}}function ge(){return new Promise((e,t)=>{try{let r=!0;const o="validate-browser-context-for-indexeddb-analytics-module",n=self.indexedDB.open(o);n.onsuccess=()=>{n.result.close(),r||self.indexedDB.deleteDatabase(o),e(!0)},n.onupgradeneeded=()=>{r=!1},n.onerror=()=>{t(n.error?.message||"")}}catch(r){t(r)}})}function be(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $="FirebaseError";class _ extends Error{constructor(t,r,o){super(r),this.code=t,this.customData=o,this.name=$,Object.setPrototypeOf(this,_.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Z.prototype.create)}}class Z{constructor(t,r,o){this.service=t,this.serviceName=r,this.errors=o}create(t,...r){const o=r[0]||{},n=`${this.service}/${t}`,i=this.errors[t],a=i?z(i,o):"Error",c=`${this.serviceName}: ${a} (${n}).`;return new _(n,c,o)}}function z(e,t){return e.replace(q,(r,o)=>{const n=t[o];return n!=null?String(n):`<${o}?>`})}const q=/\{\$([^}]+)}/g;function me(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}function K(e,t){if(e===t)return!0;const r=Object.keys(e),o=Object.keys(t);for(const n of r){if(!o.includes(n))return!1;const i=e[n],a=t[n];if(D(i)&&D(a)){if(!K(i,a))return!1}else if(i!==a)return!1}for(const n of o)if(!r.includes(n))return!1;return!0}function D(e){return e!==null&&typeof e=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ce(e){const t=[];for(const[r,o]of Object.entries(e))Array.isArray(o)?o.forEach(n=>{t.push(encodeURIComponent(r)+"="+encodeURIComponent(n))}):t.push(encodeURIComponent(r)+"="+encodeURIComponent(o));return t.length?"&"+t.join("&"):""}function _e(e){const t={};return e.replace(/^\?/,"").split("&").forEach(o=>{if(o){const[n,i]=o.split("=");t[decodeURIComponent(n)]=decodeURIComponent(i)}}),t}function Ee(e){const t=e.indexOf("?");if(!t)return"";const r=e.indexOf("#",t);return e.substring(t,r>0?r:void 0)}function ve(e,t){const r=new G(e,t);return r.subscribe.bind(r)}class G{constructor(t,r){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=r,this.task.then(()=>{t(this)}).catch(o=>{this.error(o)})}next(t){this.forEachObserver(r=>{r.next(t)})}error(t){this.forEachObserver(r=>{r.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,r,o){let n;if(t===void 0&&r===void 0&&o===void 0)throw new Error("Missing Observer.");J(t,["next","error","complete"])?n=t:n={next:t,error:r,complete:o},n.next===void 0&&(n.next=C),n.error===void 0&&(n.error=C),n.complete===void 0&&(n.complete=C);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?n.error(this.finalError):n.complete()}catch{}}),this.observers.push(n),i}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let r=0;r<this.observers.length;r++)this.sendOne(r,t)}sendOne(t,r){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{r(this.observers[t])}catch(o){typeof console<"u"&&console.error&&console.error(o)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function J(e,t){if(typeof e!="object"||e===null)return!1;for(const r of t)if(r in e&&typeof e[r]=="function")return!0;return!1}function C(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Q=1e3,X=2,Y=14400*1e3,ee=.5;function Ae(e,t=Q,r=X){const o=t*Math.pow(r,e),n=Math.round(ee*o*(Math.random()-.5)*2);return Math.min(Y,o+n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Se(e){return e&&e._delegate?e._delegate:e}export{P as A,pe as B,se as D,Z as E,_ as F,ye as a,be as b,Ae as c,K as d,ne as e,te as f,Se as g,oe as h,le as i,ce as j,fe as k,M as l,ve as m,F as n,j as o,ie as p,Ce as q,re as r,de as s,me as t,ae as u,ge as v,_e as w,Ee as x,ue as y,he as z};
