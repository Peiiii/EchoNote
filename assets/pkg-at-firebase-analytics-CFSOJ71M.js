import{_ as b,r as v,a as L}from"./pkg-at-firebase-app-B-jb69A0.js";import{L as P}from"./pkg-at-firebase-logger-CNz1B4Yj.js";import{E as O,g as _,i as k,a as z,v as G,c as T,F as U,d as j,b as B}from"./pkg-at-firebase-util-DEf2dHJc.js";import{C as A}from"./pkg-at-firebase-component-uLb4jufn.js";import"./pkg-at-firebase-installations-BMfcZu_0.js";/**
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
 */const y="analytics",K="firebase_id",W="origin",Y=60*1e3,q="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",w="https://www.googletagmanager.com/gtag/js";/**
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
 */const l=new P("@firebase/analytics");/**
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
 */function H(e){if(!e.startsWith(w)){const t=f.create("invalid-gtag-resource",{gtagURL:e});return l.warn(t.message),""}return e}function x(e){return Promise.all(e.map(t=>t.catch(n=>n)))}function V(e,t){let n;return window.trustedTypes&&(n=window.trustedTypes.createPolicy(e,t)),n}function J(e,t){const n=V("firebase-js-sdk-policy",{createScriptURL:H}),s=document.createElement("script"),i=`${w}?l=${e}&id=${t}`;s.src=n?n?.createScriptURL(i):i,s.async=!0,document.head.appendChild(s)}function Q(e){let t=[];return Array.isArray(window[e])?t=window[e]:window[e]=t,t}async function X(e,t,n,s,i,a){const o=s[i];try{if(o)await t[o];else{const c=(await x(n)).find(d=>d.measurementId===i);c&&await t[c.appId]}}catch(r){l.error(r)}e("config",i,a)}async function Z(e,t,n,s,i){try{let a=[];if(i&&i.send_to){let o=i.send_to;Array.isArray(o)||(o=[o]);const r=await x(n);for(const c of o){const d=r.find(m=>m.measurementId===c),u=d&&t[d.appId];if(u)a.push(u);else{a=[];break}}}a.length===0&&(a=Object.values(t)),await Promise.all(a),e("event",s,i||{})}catch(a){l.error(a)}}function ee(e,t,n,s){async function i(a,...o){try{if(a==="event"){const[r,c]=o;await Z(e,t,n,r,c)}else if(a==="config"){const[r,c]=o;await X(e,t,n,s,r,c)}else if(a==="consent"){const[r,c]=o;e("consent",r,c)}else if(a==="get"){const[r,c,d]=o;e("get",r,c,d)}else if(a==="set"){const[r]=o;e("set",r)}else e(a,...o)}catch(r){l.error(r)}}return i}function te(e,t,n,s,i){let a=function(...o){window[s].push(arguments)};return window[i]&&typeof window[i]=="function"&&(a=window[i]),window[i]=ee(a,e,t,n),{gtagCore:a,wrappedGtag:window[i]}}function ne(e){const t=window.document.getElementsByTagName("script");for(const n of Object.values(t))if(n.src&&n.src.includes(w)&&n.src.includes(e))return n;return null}/**
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
 */const ie=30,ae=1e3;class se{constructor(t={},n=ae){this.throttleMetadata=t,this.intervalMillis=n}getThrottleMetadata(t){return this.throttleMetadata[t]}setThrottleMetadata(t,n){this.throttleMetadata[t]=n}deleteThrottleMetadata(t){delete this.throttleMetadata[t]}}const S=new se;function re(e){return new Headers({Accept:"application/json","x-goog-api-key":e})}async function oe(e){const{appId:t,apiKey:n}=e,s={method:"GET",headers:re(n)},i=q.replace("{app-id}",t),a=await fetch(i,s);if(a.status!==200&&a.status!==304){let o="";try{const r=await a.json();r.error?.message&&(o=r.error.message)}catch{}throw f.create("config-fetch-failed",{httpStatus:a.status,responseMessage:o})}return a.json()}async function ce(e,t=S,n){const{appId:s,apiKey:i,measurementId:a}=e.options;if(!s)throw f.create("no-app-id");if(!i){if(a)return{measurementId:a,appId:s};throw f.create("no-api-key")}const o=t.getThrottleMetadata(s)||{backoffCount:0,throttleEndTimeMillis:Date.now()},r=new fe;return setTimeout(async()=>{r.abort()},Y),$({appId:s,apiKey:i,measurementId:a},o,r,t)}async function $(e,{throttleEndTimeMillis:t,backoffCount:n},s,i=S){const{appId:a,measurementId:o}=e;try{await le(s,t)}catch(r){if(o)return l.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${r?.message}]`),{appId:a,measurementId:o};throw r}try{const r=await oe(e);return i.deleteThrottleMetadata(a),r}catch(r){const c=r;if(!de(c)){if(i.deleteThrottleMetadata(a),o)return l.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${c?.message}]`),{appId:a,measurementId:o};throw r}const d=Number(c?.customData?.httpStatus)===503?T(n,i.intervalMillis,ie):T(n,i.intervalMillis),u={throttleEndTimeMillis:Date.now()+d,backoffCount:n+1};return i.setThrottleMetadata(a,u),l.debug(`Calling attemptFetch again in ${d} millis`),$(e,u,s,i)}}function le(e,t){return new Promise((n,s)=>{const i=Math.max(t-Date.now(),0),a=setTimeout(n,i);e.addEventListener(()=>{clearTimeout(a),s(f.create("fetch-throttle",{throttleEndTimeMillis:t}))})})}function de(e){if(!(e instanceof U)||!e.customData)return!1;const t=Number(e.customData.httpStatus);return t===429||t===500||t===503||t===504}class fe{constructor(){this.listeners=[]}addEventListener(t){this.listeners.push(t)}abort(){this.listeners.forEach(t=>t())}}async function ue(e,t,n,s,i){if(i&&i.global){e("event",n,s);return}else{const a=await t,o={...s,send_to:a};e("event",n,o)}}async function pe(e,t,n,s){{const i=await t;e("config",i,{update:!0,user_id:n})}}/**
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
 */async function me(){if(z())try{await G()}catch(e){return l.warn(f.create("indexeddb-unavailable",{errorInfo:e?.toString()}).message),!1}else return l.warn(f.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function he(e,t,n,s,i,a,o){const r=ce(e);r.then(p=>{n[p.measurementId]=p.appId,e.options.measurementId&&p.measurementId!==e.options.measurementId&&l.warn(`The measurement ID in the local Firebase config (${e.options.measurementId}) does not match the measurement ID fetched from the server (${p.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(p=>l.error(p)),t.push(r);const c=me().then(p=>{if(p)return s.getId()}),[d,u]=await Promise.all([r,c]);ne(a)||J(a,d.measurementId),i("js",new Date);const m=o?.config??{};return m[W]="firebase",m.update=!0,u!=null&&(m[K]=u),i("config",d.measurementId,m),d.measurementId}/**
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
 */class ge{constructor(t){this.app=t}_delete(){return delete h[this.app.options.appId],Promise.resolve()}}let h={},E=[];const M={};let g="dataLayer",ye="gtag",R,I,D=!1;function we(){const e=[];if(k()&&e.push("This is a browser extension environment."),B()||e.push("Cookies are not available."),e.length>0){const t=e.map((s,i)=>`(${i+1}) ${s}`).join(" "),n=f.create("invalid-analytics-context",{errorInfo:t});l.warn(n.message)}}function Ie(e,t,n){we();const s=e.options.appId;if(!s)throw f.create("no-app-id");if(!e.options.apiKey)if(e.options.measurementId)l.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${e.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw f.create("no-api-key");if(h[s]!=null)throw f.create("already-exists",{id:s});if(!D){Q(g);const{wrappedGtag:a,gtagCore:o}=te(h,E,M,g,ye);I=a,R=o,D=!0}return h[s]=he(e,E,M,t,R,g,n),new ge(e)}function De(e,t={}){const n=L(e,y);if(n.isInitialized()){const i=n.getImmediate();if(j(t,n.getOptions()))return i;throw f.create("already-initialized")}return n.initialize({options:t})}function Fe(e,t,n){e=_(e),pe(I,h[e.app.options.appId],t).catch(s=>l.error(s))}function be(e,t,n,s){e=_(e),ue(I,h[e.app.options.appId],t,n,s).catch(i=>l.error(i))}const F="@firebase/analytics",C="0.10.18";function ve(){b(new A(y,(t,{options:n})=>{const s=t.getProvider("app").getImmediate(),i=t.getProvider("installations-internal").getImmediate();return Ie(s,i,n)},"PUBLIC")),b(new A("analytics-internal",e,"PRIVATE")),v(F,C),v(F,C,"esm2020");function e(t){try{const n=t.getProvider(y).getImmediate();return{logEvent:(s,i,a)=>be(n,s,i,a)}}catch(n){throw f.create("interop-component-reg-failed",{reason:n})}}}ve();export{De as i,Fe as s};
