import{C as h,a as B}from"./pkg-at-firebase-component-bbWpJtj_.js";import{L as P}from"./pkg-at-firebase-logger-CNz1B4Yj.js";import{E as N,e as S,d as D,f as y,a as F,v as O,F as A}from"./pkg-at-firebase-util-DvMNs22_.js";import{o as R}from"./pkg-idb-BXWtuYvb.js";/**
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
 */class M{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(T(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function T(a){return a.getComponent()?.type==="VERSION"}const m="@firebase/app",E="0.14.2";/**
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
 */const o=new P("@firebase/app"),k="@firebase/app-compat",U="@firebase/analytics-compat",j="@firebase/analytics",L="@firebase/app-check-compat",V="@firebase/app-check",G="@firebase/auth",z="@firebase/auth-compat",J="@firebase/database",Y="@firebase/data-connect",q="@firebase/database-compat",X="@firebase/functions",K="@firebase/functions-compat",W="@firebase/installations",Q="@firebase/installations-compat",Z="@firebase/messaging",ee="@firebase/messaging-compat",te="@firebase/performance",ae="@firebase/performance-compat",re="@firebase/remote-config",ne="@firebase/remote-config-compat",se="@firebase/storage",ie="@firebase/storage-compat",oe="@firebase/firestore",ce="@firebase/ai",pe="@firebase/firestore-compat",he="firebase",de="12.2.0";/**
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
 */const b="[DEFAULT]",le={[m]:"fire-core",[k]:"fire-core-compat",[j]:"fire-analytics",[U]:"fire-analytics-compat",[V]:"fire-app-check",[L]:"fire-app-check-compat",[G]:"fire-auth",[z]:"fire-auth-compat",[J]:"fire-rtdb",[Y]:"fire-data-connect",[q]:"fire-rtdb-compat",[X]:"fire-fn",[K]:"fire-fn-compat",[W]:"fire-iid",[Q]:"fire-iid-compat",[Z]:"fire-fcm",[ee]:"fire-fcm-compat",[te]:"fire-perf",[ae]:"fire-perf-compat",[re]:"fire-rc",[ne]:"fire-rc-compat",[se]:"fire-gcs",[ie]:"fire-gcs-compat",[oe]:"fire-fst",[pe]:"fire-fst-compat",[ce]:"fire-vertex","fire-js":"fire-js",[he]:"fire-js-all"};/**
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
 */const d=new Map,fe=new Map,g=new Map;function $(a,e){try{a.container.addComponent(e)}catch(t){o.debug(`Component ${e.name} failed to register with FirebaseApp ${a.name}`,t)}}function u(a){const e=a.name;if(g.has(e))return o.debug(`There were multiple attempts to register component ${e}.`),!1;g.set(e,a);for(const t of d.values())$(t,a);for(const t of fe.values())$(t,a);return!0}function Be(a,e){const t=a.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),a.container.getProvider(e)}function Pe(a){return a==null?!1:a.settings!==void 0}/**
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
 */const me={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},c=new N("app","Firebase",me);/**
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
 */class be{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new h("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw c.create("app-deleted",{appName:this._name})}}/**
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
 */const Ne=de;function ge(a,e={}){let t=a;typeof e!="object"&&(e={name:e});const r={name:b,automaticDataCollectionEnabled:!0,...e},n=r.name;if(typeof n!="string"||!n)throw c.create("bad-app-name",{appName:String(n)});if(t||(t=S()),!t)throw c.create("no-options");const s=d.get(n);if(s){if(D(t,s.options)&&D(r,s.config))return s;throw c.create("duplicate-app",{appName:n})}const i=new B(n);for(const w of g.values())i.addComponent(w);const _=new be(t,r,i);return d.set(n,_),_}function Fe(a=b){const e=d.get(a);if(!e&&a===b&&S())return ge();if(!e)throw c.create("no-app",{appName:a});return e}function l(a,e,t){let r=le[a]??a;t&&(r+=`-${t}`);const n=r.match(/\s|\//),s=e.match(/\s|\//);if(n||s){const i=[`Unable to register library "${r}" with version "${e}":`];n&&i.push(`library name "${r}" contains illegal characters (whitespace or "/")`),n&&s&&i.push("and"),s&&i.push(`version name "${e}" contains illegal characters (whitespace or "/")`),o.warn(i.join(" "));return}u(new h(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
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
 */const ue="firebase-heartbeat-database",_e=1,p="firebase-heartbeat-store";let f=null;function x(){return f||(f=R(ue,_e,{upgrade:(a,e)=>{switch(e){case 0:try{a.createObjectStore(p)}catch(t){console.warn(t)}}}}).catch(a=>{throw c.create("idb-open",{originalErrorMessage:a.message})})),f}async function we(a){try{const t=(await x()).transaction(p),r=await t.objectStore(p).get(H(a));return await t.done,r}catch(e){if(e instanceof A)o.warn(e.message);else{const t=c.create("idb-get",{originalErrorMessage:e?.message});o.warn(t.message)}}}async function v(a,e){try{const r=(await x()).transaction(p,"readwrite");await r.objectStore(p).put(e,H(a)),await r.done}catch(t){if(t instanceof A)o.warn(t.message);else{const r=c.create("idb-set",{originalErrorMessage:t?.message});o.warn(r.message)}}}function H(a){return`${a.name}!${a.options.appId}`}/**
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
 */const De=1024,Ee=30;class $e{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Ce(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){try{const t=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=C();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(n=>n.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:t}),this._heartbeatsCache.heartbeats.length>Ee){const n=Ie(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(n,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){o.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=C(),{heartbeatsToSend:t,unsentEntries:r}=ve(this._heartbeatsCache.heartbeats),n=y(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),n}catch(e){return o.warn(e),""}}}function C(){return new Date().toISOString().substring(0,10)}function ve(a,e=De){const t=[];let r=a.slice();for(const n of a){const s=t.find(i=>i.agent===n.agent);if(s){if(s.dates.push(n.date),I(t)>e){s.dates.pop();break}}else if(t.push({agent:n.agent,dates:[n.date]}),I(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class Ce{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return F()?O().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await we(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return v(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return v(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function I(a){return y(JSON.stringify({version:2,heartbeats:a})).length}function Ie(a){if(a.length===0)return-1;let e=0,t=a[0].date;for(let r=1;r<a.length;r++)a[r].date<t&&(t=a[r].date,e=r);return e}/**
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
 */function Se(a){u(new h("platform-logger",e=>new M(e),"PRIVATE")),u(new h("heartbeat",e=>new $e(e),"PRIVATE")),l(m,E,a),l(m,E,"esm2020"),l("fire-js","")}Se("");export{Ne as S,u as _,Be as a,Pe as b,Fe as g,ge as i,l as r};
