import{_ as v,r as T,a as S}from"./pkg-at-firebase-app-BIK-kTny.js";import{L}from"./pkg-at-firebase-logger-CNz1B4Yj.js";import{E as O,g as I,i as k,a as U,v as z,c as A,F as G,d as j,b as B}from"./pkg-at-firebase-util-BkZ7B19c.js";import{C as E}from"./pkg-at-firebase-component-VBiwi6I0.js";import"./pkg-at-firebase-installations-E2mrg3vu.js";/**
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
 */const w="analytics",K="firebase_id",W="origin",Y=60*1e3,q="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",b="https://www.googletagmanager.com/gtag/js";/**
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
 */const l=new L("@firebase/analytics");/**
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
 */const N={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},f=new O("analytics","Analytics",N);/**
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
 */function H(e){if(!e.startsWith(b)){const t=f.create("invalid-gtag-resource",{gtagURL:e});return l.warn(t.message),""}return e}function P(e){return Promise.all(e.map(t=>t.catch(n=>n)))}function V(e,t){let n;return window.trustedTypes&&(n=window.trustedTypes.createPolicy(e,t)),n}function J(e,t){const n=V("firebase-js-sdk-policy",{createScriptURL:H}),a=document.createElement("script"),i=`${b}?l=${e}&id=${t}`;a.src=n?n?.createScriptURL(i):i,a.async=!0,document.head.appendChild(a)}function Q(e){let t=[];return Array.isArray(window[e])?t=window[e]:window[e]=t,t}async function X(e,t,n,a,i,s){const o=a[i];try{if(o)await t[o];else{const c=(await P(n)).find(d=>d.measurementId===i);c&&await t[c.appId]}}catch(r){l.error(r)}e("config",i,s)}async function Z(e,t,n,a,i){try{let s=[];if(i&&i.send_to){let o=i.send_to;Array.isArray(o)||(o=[o]);const r=await P(n);for(const c of o){const d=r.find(h=>h.measurementId===c),p=d&&t[d.appId];if(p)s.push(p);else{s=[];break}}}s.length===0&&(s=Object.values(t)),await Promise.all(s),e("event",a,i||{})}catch(s){l.error(s)}}function ee(e,t,n,a){async function i(s,...o){try{if(s==="event"){const[r,c]=o;await Z(e,t,n,r,c)}else if(s==="config"){const[r,c]=o;await X(e,t,n,a,r,c)}else if(s==="consent"){const[r,c]=o;e("consent",r,c)}else if(s==="get"){const[r,c,d]=o;e("get",r,c,d)}else if(s==="set"){const[r]=o;e("set",r)}else e(s,...o)}catch(r){l.error(r)}}return i}function te(e,t,n,a,i){let s=function(...o){window[a].push(arguments)};return window[i]&&typeof window[i]=="function"&&(s=window[i]),window[i]=ee(s,e,t,n),{gtagCore:s,wrappedGtag:window[i]}}function ne(e){const t=window.document.getElementsByTagName("script");for(const n of Object.values(t))if(n.src&&n.src.includes(b)&&n.src.includes(e))return n;return null}/**
 * @license
 * Copyright 2020 Google LLC
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
 */const ie=30,ae=1e3;class se{constructor(t={},n=ae){this.throttleMetadata=t,this.intervalMillis=n}getThrottleMetadata(t){return this.throttleMetadata[t]}setThrottleMetadata(t,n){this.throttleMetadata[t]=n}deleteThrottleMetadata(t){delete this.throttleMetadata[t]}}const $=new se;function re(e){return new Headers({Accept:"application/json","x-goog-api-key":e})}async function oe(e){const{appId:t,apiKey:n}=e,a={method:"GET",headers:re(n)},i=q.replace("{app-id}",t),s=await fetch(i,a);if(s.status!==200&&s.status!==304){let o="";try{const r=await s.json();r.error?.message&&(o=r.error.message)}catch{}throw f.create("config-fetch-failed",{httpStatus:s.status,responseMessage:o})}return s.json()}async function ce(e,t=$,n){const{appId:a,apiKey:i,measurementId:s}=e.options;if(!a)throw f.create("no-app-id");if(!i){if(s)return{measurementId:s,appId:a};throw f.create("no-api-key")}const o=t.getThrottleMetadata(a)||{backoffCount:0,throttleEndTimeMillis:Date.now()},r=new fe;return setTimeout(async()=>{r.abort()},Y),x({appId:a,apiKey:i,measurementId:s},o,r,t)}async function x(e,{throttleEndTimeMillis:t,backoffCount:n},a,i=$){const{appId:s,measurementId:o}=e;try{await le(a,t)}catch(r){if(o)return l.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${r?.message}]`),{appId:s,measurementId:o};throw r}try{const r=await oe(e);return i.deleteThrottleMetadata(s),r}catch(r){const c=r;if(!de(c)){if(i.deleteThrottleMetadata(s),o)return l.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${c?.message}]`),{appId:s,measurementId:o};throw r}const d=Number(c?.customData?.httpStatus)===503?A(n,i.intervalMillis,ie):A(n,i.intervalMillis),p={throttleEndTimeMillis:Date.now()+d,backoffCount:n+1};return i.setThrottleMetadata(s,p),l.debug(`Calling attemptFetch again in ${d} millis`),x(e,p,a,i)}}function le(e,t){return new Promise((n,a)=>{const i=Math.max(t-Date.now(),0),s=setTimeout(n,i);e.addEventListener(()=>{clearTimeout(s),a(f.create("fetch-throttle",{throttleEndTimeMillis:t}))})})}function de(e){if(!(e instanceof G)||!e.customData)return!1;const t=Number(e.customData.httpStatus);return t===429||t===500||t===503||t===504}class fe{constructor(){this.listeners=[]}addEventListener(t){this.listeners.push(t)}abort(){this.listeners.forEach(t=>t())}}async function pe(e,t,n,a,i){if(i&&i.global){e("event",n,a);return}else{const s=await t,o={...a,send_to:s};e("event",n,o)}}async function ue(e,t,n,a){{const i=await t;e("config",i,{update:!0,user_id:n})}}async function me(e,t,n,a){{const i=await t;e("config",i,{update:!0,user_properties:n})}}/**
 * @license
 * Copyright 2020 Google LLC
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
 */async function he(){if(U())try{await z()}catch(e){return l.warn(f.create("indexeddb-unavailable",{errorInfo:e?.toString()}).message),!1}else return l.warn(f.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function ge(e,t,n,a,i,s,o){const r=ce(e);r.then(u=>{n[u.measurementId]=u.appId,e.options.measurementId&&u.measurementId!==e.options.measurementId&&l.warn(`The measurement ID in the local Firebase config (${e.options.measurementId}) does not match the measurement ID fetched from the server (${u.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(u=>l.error(u)),t.push(r);const c=he().then(u=>{if(u)return a.getId()}),[d,p]=await Promise.all([r,c]);ne(s)||J(s,d.measurementId),i("js",new Date);const h=o?.config??{};return h[W]="firebase",h.update=!0,p!=null&&(h[K]=p),i("config",d.measurementId,h),d.measurementId}/**
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
 */class ye{constructor(t){this.app=t}_delete(){return delete m[this.app.options.appId],Promise.resolve()}}let m={},M=[];const R={};let y="dataLayer",we="gtag",D,g,F=!1;function Ie(){const e=[];if(k()&&e.push("This is a browser extension environment."),B()||e.push("Cookies are not available."),e.length>0){const t=e.map((a,i)=>`(${i+1}) ${a}`).join(" "),n=f.create("invalid-analytics-context",{errorInfo:t});l.warn(n.message)}}function be(e,t,n){Ie();const a=e.options.appId;if(!a)throw f.create("no-app-id");if(!e.options.apiKey)if(e.options.measurementId)l.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${e.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw f.create("no-api-key");if(m[a]!=null)throw f.create("already-exists",{id:a});if(!F){Q(y);const{wrappedGtag:s,gtagCore:o}=te(m,M,R,y,we);g=s,D=o,F=!0}return m[a]=ge(e,M,R,t,D,y,n),new ye(e)}function Fe(e,t={}){const n=S(e,w);if(n.isInitialized()){const i=n.getImmediate();if(j(t,n.getOptions()))return i;throw f.create("already-initialized")}return n.initialize({options:t})}function _e(e,t,n){e=I(e),ue(g,m[e.app.options.appId],t).catch(a=>l.error(a))}function Ce(e,t,n){e=I(e),me(g,m[e.app.options.appId],t).catch(a=>l.error(a))}function ve(e,t,n,a){e=I(e),pe(g,m[e.app.options.appId],t,n,a).catch(i=>l.error(i))}const _="@firebase/analytics",C="0.10.18";function Te(){v(new E(w,(t,{options:n})=>{const a=t.getProvider("app").getImmediate(),i=t.getProvider("installations-internal").getImmediate();return be(a,i,n)},"PUBLIC")),v(new E("analytics-internal",e,"PRIVATE")),T(_,C),T(_,C,"esm2020");function e(t){try{const n=t.getProvider(w).getImmediate();return{logEvent:(a,i,s)=>ve(n,a,i,s)}}catch(n){throw f.create("interop-component-reg-failed",{reason:n})}}}Te();export{Ce as a,Fe as i,ve as l,_e as s};
