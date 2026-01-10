import{r as R,_ as b,a as N}from"./pkg-at-firebase-app-B774rL7t.js";import{C as y}from"./pkg-at-firebase-component-NyYCnxMN.js";import{E as z,F as W}from"./pkg-at-firebase-util-DAkXPjHn.js";import{o as X}from"./pkg-idb-BXWtuYvb.js";const P="@firebase/installations",T="0.6.19";/**
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
 */const q=1e4,_=`w:${T}`,v="FIS_v2",Y="https://firebaseinstallations.googleapis.com/v1",Q=3600*1e3,Z="installations",tt="Installations";/**
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
 */const et={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},d=new z(Z,tt,et);function O(t){return t instanceof W&&t.code.includes("request-failed")}/**
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
 */function F({projectId:t}){return`${Y}/projects/${t}/installations`}function D(t){return{token:t.token,requestStatus:2,expiresIn:rt(t.expiresIn),creationTime:Date.now()}}async function V(t,e){const r=(await e.json()).error;return d.create("request-failed",{requestName:t,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function j({apiKey:t}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":t})}function nt(t,{refreshToken:e}){const n=j(t);return n.append("Authorization",ot(e)),n}async function $(t){const e=await t();return e.status>=500&&e.status<600?t():e}function rt(t){return Number(t.replace("s","000"))}function ot(t){return`${v} ${t}`}/**
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
 */async function at({appConfig:t,heartbeatServiceProvider:e},{fid:n}){const r=F(t),a=j(t),o=e.getImmediate({optional:!0});if(o){const c=await o.getHeartbeatsHeader();c&&a.append("x-firebase-client",c)}const s={fid:n,authVersion:v,appId:t.appId,sdkVersion:_},i={method:"POST",headers:a,body:JSON.stringify(s)},u=await $(()=>fetch(r,i));if(u.ok){const c=await u.json();return{fid:c.fid||n,registrationStatus:2,refreshToken:c.refreshToken,authToken:D(c.authToken)}}else throw await V("Create Installation",u)}/**
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
 */function x(t){return new Promise(e=>{setTimeout(e,t)})}/**
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
 */function st(t){return btoa(String.fromCharCode(...t)).replace(/\+/g,"-").replace(/\//g,"_")}/**
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
 */const it=/^[cdef][\w-]{21}$/,I="";function ct(){try{const t=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(t),t[0]=112+t[0]%16;const n=ut(t);return it.test(n)?n:I}catch{return I}}function ut(t){return st(t).substr(0,22)}/**
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
 */function g(t){return`${t.appName}!${t.appId}`}/**
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
 */const L=new Map;function M(t,e){const n=g(t);B(n,e),ft(n,e)}function B(t,e){const n=L.get(t);if(n)for(const r of n)r(e)}function ft(t,e){const n=dt();n&&n.postMessage({key:t,fid:e}),lt()}let f=null;function dt(){return!f&&"BroadcastChannel"in self&&(f=new BroadcastChannel("[Firebase] FID Change"),f.onmessage=t=>{B(t.data.key,t.data.fid)}),f}function lt(){L.size===0&&f&&(f.close(),f=null)}/**
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
 */const pt="firebase-installations-database",gt=1,l="firebase-installations-store";let m=null;function A(){return m||(m=X(pt,gt,{upgrade:(t,e)=>{switch(e){case 0:t.createObjectStore(l)}}})),m}async function p(t,e){const n=g(t),a=(await A()).transaction(l,"readwrite"),o=a.objectStore(l),s=await o.get(n);return await o.put(e,n),await a.done,(!s||s.fid!==e.fid)&&M(t,e.fid),e}async function H(t){const e=g(t),r=(await A()).transaction(l,"readwrite");await r.objectStore(l).delete(e),await r.done}async function h(t,e){const n=g(t),a=(await A()).transaction(l,"readwrite"),o=a.objectStore(l),s=await o.get(n),i=e(s);return i===void 0?await o.delete(n):await o.put(i,n),await a.done,i&&(!s||s.fid!==i.fid)&&M(t,i.fid),i}/**
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
 */async function S(t){let e;const n=await h(t.appConfig,r=>{const a=ht(r),o=mt(t,a);return e=o.registrationPromise,o.installationEntry});return n.fid===I?{installationEntry:await e}:{installationEntry:n,registrationPromise:e}}function ht(t){const e=t||{fid:ct(),registrationStatus:0};return U(e)}function mt(t,e){if(e.registrationStatus===0){if(!navigator.onLine){const a=Promise.reject(d.create("app-offline"));return{installationEntry:e,registrationPromise:a}}const n={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=wt(t,n);return{installationEntry:n,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:It(t)}:{installationEntry:e}}async function wt(t,e){try{const n=await at(t,e);return p(t.appConfig,n)}catch(n){throw O(n)&&n.customData.serverCode===409?await H(t.appConfig):await p(t.appConfig,{fid:e.fid,registrationStatus:0}),n}}async function It(t){let e=await C(t.appConfig);for(;e.registrationStatus===1;)await x(100),e=await C(t.appConfig);if(e.registrationStatus===0){const{installationEntry:n,registrationPromise:r}=await S(t);return r||n}return e}function C(t){return h(t,e=>{if(!e)throw d.create("installation-not-found");return U(e)})}function U(t){return Tt(t)?{fid:t.fid,registrationStatus:0}:t}function Tt(t){return t.registrationStatus===1&&t.registrationTime+q<Date.now()}/**
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
 */async function At({appConfig:t,heartbeatServiceProvider:e},n){const r=St(t,n),a=nt(t,n),o=e.getImmediate({optional:!0});if(o){const c=await o.getHeartbeatsHeader();c&&a.append("x-firebase-client",c)}const s={installation:{sdkVersion:_,appId:t.appId}},i={method:"POST",headers:a,body:JSON.stringify(s)},u=await $(()=>fetch(r,i));if(u.ok){const c=await u.json();return D(c)}else throw await V("Generate Auth Token",u)}function St(t,{fid:e}){return`${F(t)}/${e}/authTokens:generate`}/**
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
 */async function k(t,e=!1){let n;const r=await h(t.appConfig,o=>{if(!K(o))throw d.create("not-registered");const s=o.authToken;if(!e&&yt(s))return o;if(s.requestStatus===1)return n=kt(t,e),o;{if(!navigator.onLine)throw d.create("app-offline");const i=Et(o);return n=bt(t,i),i}});return n?await n:r.authToken}async function kt(t,e){let n=await E(t.appConfig);for(;n.authToken.requestStatus===1;)await x(100),n=await E(t.appConfig);const r=n.authToken;return r.requestStatus===0?k(t,e):r}function E(t){return h(t,e=>{if(!K(e))throw d.create("not-registered");const n=e.authToken;return Rt(n)?{...e,authToken:{requestStatus:0}}:e})}async function bt(t,e){try{const n=await At(t,e),r={...e,authToken:n};return await p(t.appConfig,r),n}catch(n){if(O(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await H(t.appConfig);else{const r={...e,authToken:{requestStatus:0}};await p(t.appConfig,r)}throw n}}function K(t){return t!==void 0&&t.registrationStatus===2}function yt(t){return t.requestStatus===2&&!Ct(t)}function Ct(t){const e=Date.now();return e<t.creationTime||t.creationTime+t.expiresIn<e+Q}function Et(t){const e={requestStatus:1,requestTime:Date.now()};return{...t,authToken:e}}function Rt(t){return t.requestStatus===1&&t.requestTime+q<Date.now()}/**
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
 */async function Nt(t){const e=t,{installationEntry:n,registrationPromise:r}=await S(e);return r?r.catch(console.error):k(e).catch(console.error),n.fid}/**
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
 */async function Pt(t,e=!1){const n=t;return await qt(n),(await k(n,e)).token}async function qt(t){const{registrationPromise:e}=await S(t);e&&await e}/**
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
 */function _t(t){if(!t||!t.options)throw w("App Configuration");if(!t.name)throw w("App Name");const e=["projectId","apiKey","appId"];for(const n of e)if(!t.options[n])throw w(n);return{appName:t.name,projectId:t.options.projectId,apiKey:t.options.apiKey,appId:t.options.appId}}function w(t){return d.create("missing-app-config-values",{valueName:t})}/**
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
 */const J="installations",vt="installations-internal",Ot=t=>{const e=t.getProvider("app").getImmediate(),n=_t(e),r=N(e,"heartbeat");return{app:e,appConfig:n,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},Ft=t=>{const e=t.getProvider("app").getImmediate(),n=N(e,J).getImmediate();return{getId:()=>Nt(n),getToken:a=>Pt(n,a)}};function Dt(){b(new y(J,Ot,"PUBLIC")),b(new y(vt,Ft,"PRIVATE"))}Dt();R(P,T);R(P,T,"esm2020");
