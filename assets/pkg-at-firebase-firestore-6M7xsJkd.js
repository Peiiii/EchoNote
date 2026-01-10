import{_ as Nc,r as Ki,b as kc,a as Mc,S as Fc}from"./pkg-at-firebase-app-B774rL7t.js";import{C as Oc}from"./pkg-at-firebase-component-NyYCnxMN.js";import{L as Lc,a as Ve}from"./pkg-at-firebase-logger-CNz1B4Yj.js";import{F as qc,d as Uc,o as _a,p as Bc,z as ga,l as dr,A as zc,a as Gc,B as pa,g as de}from"./pkg-at-firebase-util-DAkXPjHn.js";import{I as st,X as Kc,E as $c,a as ns,c as jc,g as Qc,W as Wn,b as Wc,S as $i,M as Hc}from"./pkg-at-firebase-webchannel-wrapper-QS5lB7L3.js";const ji="@firebase/firestore",Qi="4.9.1";/**
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
 */class ee{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}ee.UNAUTHENTICATED=new ee(null),ee.GOOGLE_CREDENTIALS=new ee("google-credentials-uid"),ee.FIRST_PARTY=new ee("first-party-uid"),ee.MOCK_USER=new ee("mock-user");/**
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
 */let Jt="12.2.0";/**
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
 */const lt=new Lc("@firebase/firestore");function Rt(){return lt.logLevel}function g(r,...e){if(lt.logLevel<=Ve.DEBUG){const t=e.map(qs);lt.debug(`Firestore (${Jt}): ${r}`,...t)}}function K(r,...e){if(lt.logLevel<=Ve.ERROR){const t=e.map(qs);lt.error(`Firestore (${Jt}): ${r}`,...t)}}function Tn(r,...e){if(lt.logLevel<=Ve.WARN){const t=e.map(qs);lt.warn(`Firestore (${Jt}): ${r}`,...t)}}function qs(r){if(typeof r=="string")return r;try{/**
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
*/return(function(t){return JSON.stringify(t)})(r)}catch{return r}}/**
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
 */function E(r,e,t){let n="Unexpected state";typeof e=="string"?n=e:t=e,ya(r,n,t)}function ya(r,e,t){let n=`FIRESTORE (${Jt}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{n+=" CONTEXT: "+JSON.stringify(t)}catch{n+=" CONTEXT: "+t}throw K(n),new Error(n)}function v(r,e,t,n){let s="Unexpected state";typeof t=="string"?s=t:n=t,r||ya(e,s,n)}function w(r,e){return r}/**
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
 */const m={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class p extends qc{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class Ee{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
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
 */class Jc{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Yc{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(ee.UNAUTHENTICATED)))}shutdown(){}}class Xc{constructor(e){this.t=e,this.currentUser=ee.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){v(this.o===void 0,42304);let n=this.i;const s=u=>this.i!==n?(n=this.i,t(u)):Promise.resolve();let i=new Ee;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new Ee,e.enqueueRetryable((()=>s(this.currentUser)))};const o=()=>{const u=i;e.enqueueRetryable((async()=>{await u.promise,await s(this.currentUser)}))},a=u=>{g("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit((u=>a(u))),setTimeout((()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?a(u):(g("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Ee)}}),0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((n=>this.i!==e?(g("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(v(typeof n.accessToken=="string",31837,{l:n}),new Jc(n.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return v(e===null||typeof e=="string",2055,{h:e}),new ee(e)}}class Zc{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type="FirstParty",this.user=ee.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class el{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new Zc(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(ee.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Wi{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class tl{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,kc(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){v(this.o===void 0,3512);const n=i=>{i.error!=null&&g("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.m;return this.m=i.token,g("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable((()=>n(i)))};const s=i=>{g("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.V.getImmediate({optional:!0});i?s(i):g("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Wi(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(v(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Wi(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function nl(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
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
 */class Us{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=nl(40);for(let i=0;i<s.length;++i)n.length<20&&s[i]<t&&(n+=e.charAt(s[i]%62))}return n}}function V(r,e){return r<e?-1:r>e?1:0}function fs(r,e){const t=Math.min(r.length,e.length);for(let n=0;n<t;n++){const s=r.charAt(n),i=e.charAt(n);if(s!==i)return rs(s)===rs(i)?V(s,i):rs(s)?1:-1}return V(r.length,e.length)}const rl=55296,sl=57343;function rs(r){const e=r.charCodeAt(0);return e>=rl&&e<=sl}function xt(r,e,t){return r.length===e.length&&r.every(((n,s)=>t(n,e[s])))}function Ia(r){return r+"\0"}/**
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
 */const Hi="__name__";class pe{constructor(e,t,n){t===void 0?t=0:t>e.length&&E(637,{offset:t,range:e.length}),n===void 0?n=e.length-t:n>e.length-t&&E(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return pe.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof pe?e.forEach((n=>{t.push(n)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let s=0;s<n;s++){const i=pe.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return V(e.length,t.length)}static compareSegments(e,t){const n=pe.isNumericId(e),s=pe.isNumericId(t);return n&&!s?-1:!n&&s?1:n&&s?pe.extractNumericId(e).compare(pe.extractNumericId(t)):fs(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return st.fromString(e.substring(4,e.length-2))}}class x extends pe{construct(e,t,n){return new x(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new p(m.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter((s=>s.length>0)))}return new x(t)}static emptyPath(){return new x([])}}const il=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class q extends pe{construct(e,t,n){return new q(e,t,n)}static isValidIdentifier(e){return il.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),q.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Hi}static keyField(){return new q([Hi])}static fromServerFormat(e){const t=[];let n="",s=0;const i=()=>{if(n.length===0)throw new p(m.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let o=!1;for(;s<e.length;){const a=e[s];if(a==="\\"){if(s+1===e.length)throw new p(m.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new p(m.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=u,s+=2}else a==="`"?(o=!o,s++):a!=="."||o?(n+=a,s++):(i(),s++)}if(i(),o)throw new p(m.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new q(t)}static emptyPath(){return new q([])}}/**
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
 */class y{constructor(e){this.path=e}static fromPath(e){return new y(x.fromString(e))}static fromName(e){return new y(x.fromString(e).popFirst(5))}static empty(){return new y(x.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&x.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return x.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new y(new x(e.slice()))}}/**
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
 */function Bs(r,e,t){if(!t)throw new p(m.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function ol(r,e,t,n){if(e===!0&&n===!0)throw new p(m.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function Ji(r){if(!y.isDocumentKey(r))throw new p(m.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Yi(r){if(y.isDocumentKey(r))throw new p(m.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function Ta(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function Nr(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(n){return n.constructor?n.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":E(12329,{type:typeof r})}function se(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new p(m.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Nr(r);throw new p(m.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}function Ea(r,e){if(e<=0)throw new p(m.INVALID_ARGUMENT,`Function ${r}() requires a positive number, but it was: ${e}.`)}/**
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
 */function Q(r,e){const t={typeString:r};return e&&(t.value=e),t}function xn(r,e){if(!Ta(r))throw new p(m.INVALID_ARGUMENT,"JSON must be an object");let t;for(const n in e)if(e[n]){const s=e[n].typeString,i="value"in e[n]?{value:e[n].value}:void 0;if(!(n in r)){t=`JSON missing required field: '${n}'`;break}const o=r[n];if(s&&typeof o!==s){t=`JSON field '${n}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){t=`Expected '${n}' field to equal '${i.value}'`;break}}if(t)throw new p(m.INVALID_ARGUMENT,t);return!0}/**
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
 */const Xi=-62135596800,Zi=1e6;class k{static now(){return k.fromMillis(Date.now())}static fromDate(e){return k.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*Zi);return new k(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new p(m.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new p(m.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Xi)throw new p(m.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new p(m.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Zi}_compareTo(e){return this.seconds===e.seconds?V(this.nanoseconds,e.nanoseconds):V(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:k._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(xn(e,k._jsonSchema))return new k(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Xi;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}k._jsonSchemaVersion="firestore/timestamp/1.0",k._jsonSchema={type:Q("string",k._jsonSchemaVersion),seconds:Q("number"),nanoseconds:Q("number")};/**
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
 */class R{static fromTimestamp(e){return new R(e)}static min(){return new R(new k(0,0))}static max(){return new R(new k(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */const Nt=-1;class fr{constructor(e,t,n,s){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=s}}function ms(r){return r.fields.find((e=>e.kind===2))}function Ye(r){return r.fields.filter((e=>e.kind!==2))}fr.UNKNOWN_ID=-1;class tr{constructor(e,t){this.fieldPath=e,this.kind=t}}class En{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new En(0,fe.min())}}function Aa(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=R.fromTimestamp(n===1e9?new k(t+1,0):new k(t,n));return new fe(s,y.empty(),e)}function wa(r){return new fe(r.readTime,r.key,Nt)}class fe{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new fe(R.min(),y.empty(),Nt)}static max(){return new fe(R.max(),y.empty(),Nt)}}function zs(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=y.comparator(r.documentKey,e.documentKey),t!==0?t:V(r.largestBatchId,e.largestBatchId))}/**
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
 */const va="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class Ra{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
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
 */async function $e(r){if(r.code!==m.FAILED_PRECONDITION||r.message!==va)throw r;g("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class d{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&E(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new d(((n,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(n,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(n,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof d?t:d.resolve(t)}catch(t){return d.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):d.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):d.reject(t)}static resolve(e){return new d(((t,n)=>{t(e)}))}static reject(e){return new d(((t,n)=>{n(e)}))}static waitFor(e){return new d(((t,n)=>{let s=0,i=0,o=!1;e.forEach((a=>{++s,a.next((()=>{++i,o&&i===s&&t()}),(u=>n(u)))})),o=!0,i===s&&t()}))}static or(e){let t=d.resolve(!1);for(const n of e)t=t.next((s=>s?d.resolve(s):n()));return t}static forEach(e,t){const n=[];return e.forEach(((s,i)=>{n.push(t.call(this,s,i))})),this.waitFor(n)}static mapArray(e,t){return new d(((n,s)=>{const i=e.length,o=new Array(i);let a=0;for(let u=0;u<i;u++){const c=u;t(e[c]).next((l=>{o[c]=l,++a,a===i&&n(o)}),(l=>s(l)))}}))}static doWhile(e,t){return new d(((n,s)=>{const i=()=>{e()===!0?t().next((()=>{i()}),s):n()};i()}))}}/**
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
 */const ce="SimpleDb";class kr{static open(e,t,n,s){try{return new kr(t,e.transaction(s,n))}catch(i){throw new dn(t,i)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.S=new Ee,this.transaction.oncomplete=()=>{this.S.resolve()},this.transaction.onabort=()=>{t.error?this.S.reject(new dn(e,t.error)):this.S.resolve()},this.transaction.onerror=n=>{const s=Gs(n.target.error);this.S.reject(new dn(e,s))}}get D(){return this.S.promise}abort(e){e&&this.S.reject(e),this.aborted||(g(ce,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}C(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const t=this.transaction.objectStore(e);return new ul(t)}}class Le{static delete(e){return g(ce,"Removing database:",e),Ze(zc().indexedDB.deleteDatabase(e)).toPromise()}static v(){if(!Gc())return!1;if(Le.F())return!0;const e=dr(),t=Le.M(e),n=0<t&&t<10,s=Va(e),i=0<s&&s<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||i)}static F(){return typeof process<"u"&&process.__PRIVATE_env?.__PRIVATE_USE_MOCK_PERSISTENCE==="YES"}static O(e,t){return e.store(t)}static M(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(e,t,n){this.name=e,this.version=t,this.N=n,this.B=null,Le.M(dr())===12.2&&K("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async L(e){return this.db||(g(ce,"Opening database:",this.name),this.db=await new Promise(((t,n)=>{const s=indexedDB.open(this.name,this.version);s.onsuccess=i=>{const o=i.target.result;t(o)},s.onblocked=()=>{n(new dn(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},s.onerror=i=>{const o=i.target.error;o.name==="VersionError"?n(new p(m.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o.name==="InvalidStateError"?n(new p(m.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+o)):n(new dn(e,o))},s.onupgradeneeded=i=>{g(ce,'Database "'+this.name+'" requires upgrade from version:',i.oldVersion);const o=i.target.result;this.N.k(o,s.transaction,i.oldVersion,this.version).next((()=>{g(ce,"Database upgrade to version "+this.version+" complete")}))}}))),this.q&&(this.db.onversionchange=t=>this.q(t)),this.db}$(e){this.q=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,s){const i=t==="readonly";let o=0;for(;;){++o;try{this.db=await this.L(e);const a=kr.open(this.db,e,i?"readonly":"readwrite",n),u=s(a).next((c=>(a.C(),c))).catch((c=>(a.abort(c),d.reject(c)))).toPromise();return u.catch((()=>{})),await a.D,u}catch(a){const u=a,c=u.name!=="FirebaseError"&&o<3;if(g(ce,"Transaction failed with error:",u.message,"Retrying:",c),this.close(),!c)return Promise.reject(u)}}}close(){this.db&&this.db.close(),this.db=void 0}}function Va(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}class al{constructor(e){this.U=e,this.K=!1,this.W=null}get isDone(){return this.K}get G(){return this.W}set cursor(e){this.U=e}done(){this.K=!0}j(e){this.W=e}delete(){return Ze(this.U.delete())}}class dn extends p{constructor(e,t){super(m.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function je(r){return r.name==="IndexedDbTransactionError"}class ul{constructor(e){this.store=e}put(e,t){let n;return t!==void 0?(g(ce,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(g(ce,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),Ze(n)}add(e){return g(ce,"ADD",this.store.name,e,e),Ze(this.store.add(e))}get(e){return Ze(this.store.get(e)).next((t=>(t===void 0&&(t=null),g(ce,"GET",this.store.name,e,t),t)))}delete(e){return g(ce,"DELETE",this.store.name,e),Ze(this.store.delete(e))}count(){return g(ce,"COUNT",this.store.name),Ze(this.store.count())}J(e,t){const n=this.options(e,t),s=n.index?this.store.index(n.index):this.store;if(typeof s.getAll=="function"){const i=s.getAll(n.range);return new d(((o,a)=>{i.onerror=u=>{a(u.target.error)},i.onsuccess=u=>{o(u.target.result)}}))}{const i=this.cursor(n),o=[];return this.H(i,((a,u)=>{o.push(u)})).next((()=>o))}}Y(e,t){const n=this.store.getAll(e,t===null?void 0:t);return new d(((s,i)=>{n.onerror=o=>{i(o.target.error)},n.onsuccess=o=>{s(o.target.result)}}))}Z(e,t){g(ce,"DELETE ALL",this.store.name);const n=this.options(e,t);n.X=!1;const s=this.cursor(n);return this.H(s,((i,o,a)=>a.delete()))}ee(e,t){let n;t?n=e:(n={},t=e);const s=this.cursor(n);return this.H(s,t)}te(e){const t=this.cursor({});return new d(((n,s)=>{t.onerror=i=>{const o=Gs(i.target.error);s(o)},t.onsuccess=i=>{const o=i.target.result;o?e(o.primaryKey,o.value).next((a=>{a?o.continue():n()})):n()}}))}H(e,t){const n=[];return new d(((s,i)=>{e.onerror=o=>{i(o.target.error)},e.onsuccess=o=>{const a=o.target.result;if(!a)return void s();const u=new al(a),c=t(a.primaryKey,a.value,u);if(c instanceof d){const l=c.catch((h=>(u.done(),d.reject(h))));n.push(l)}u.isDone?s():u.G===null?a.continue():a.continue(u.G)}})).next((()=>d.waitFor(n)))}options(e,t){let n;return e!==void 0&&(typeof e=="string"?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.X?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function Ze(r){return new d(((e,t)=>{r.onsuccess=n=>{const s=n.target.result;e(s)},r.onerror=n=>{const s=Gs(n.target.error);t(s)}}))}let eo=!1;function Gs(r){const e=Le.M(dr());if(e>=12.2&&e<13){const t="An internal error was encountered in the Indexed Database server";if(r.message.indexOf(t)>=0){const n=new p("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return eo||(eo=!0,setTimeout((()=>{throw n}),0)),n}}return r}const fn="IndexBackfiller";class cl{constructor(e,t){this.asyncQueue=e,this.ne=t,this.task=null}start(){this.re(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}re(e){g(fn,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,(async()=>{this.task=null;try{const t=await this.ne.ie();g(fn,`Documents written: ${t}`)}catch(t){je(t)?g(fn,"Ignoring IndexedDB error during index backfill: ",t):await $e(t)}await this.re(6e4)}))}}class ll{constructor(e,t){this.localStore=e,this.persistence=t}async ie(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",(t=>this.se(t,e)))}se(e,t){const n=new Set;let s=t,i=!0;return d.doWhile((()=>i===!0&&s>0),(()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next((o=>{if(o!==null&&!n.has(o))return g(fn,`Processing collection: ${o}`),this.oe(e,o,s).next((a=>{s-=a,n.add(o)}));i=!1})))).next((()=>t-s))}oe(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next((s=>this.localStore.localDocuments.getNextDocuments(e,t,s,n).next((i=>{const o=i.changes;return this.localStore.indexManager.updateIndexEntries(e,o).next((()=>this._e(s,i))).next((a=>(g(fn,`Updating offset: ${a}`),this.localStore.indexManager.updateCollectionGroup(e,t,a)))).next((()=>o.size))}))))}_e(e,t){let n=e;return t.changes.forEach(((s,i)=>{const o=wa(i);zs(o,n)>0&&(n=o)})),new fe(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
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
 */class ae{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.ae(n),this.ue=n=>t.writeSequenceNumber(n))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}ae.ce=-1;/**
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
 */const it=-1;function Mr(r){return r==null}function An(r){return r===0&&1/r==-1/0}function Pa(r){return typeof r=="number"&&Number.isInteger(r)&&!An(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
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
 */const mr="";function re(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=to(e)),e=hl(r.get(t),e);return to(e)}function hl(r,e){let t=e;const n=r.length;for(let s=0;s<n;s++){const i=r.charAt(s);switch(i){case"\0":t+="";break;case mr:t+="";break;default:t+=i}}return t}function to(r){return r+mr+""}function Ie(r){const e=r.length;if(v(e>=2,64408,{path:r}),e===2)return v(r.charAt(0)===mr&&r.charAt(1)==="",56145,{path:r}),x.emptyPath();const t=e-2,n=[];let s="";for(let i=0;i<e;){const o=r.indexOf(mr,i);switch((o<0||o>t)&&E(50515,{path:r}),r.charAt(o+1)){case"":const a=r.substring(i,o);let u;s.length===0?u=a:(s+=a,u=s,s=""),n.push(u);break;case"":s+=r.substring(i,o),s+="\0";break;case"":s+=r.substring(i,o+1);break;default:E(61167,{path:r})}i=o+2}return new x(n)}/**
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
 */const Xe="remoteDocuments",Nn="owner",It="owner",wn="mutationQueues",dl="userId",ge="mutations",no="batchId",rt="userMutationsIndex",ro=["userId","batchId"];/**
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
 */function nr(r,e){return[r,re(e)]}function Sa(r,e,t){return[r,re(e),t]}const fl={},kt="documentMutations",_r="remoteDocumentsV14",ml=["prefixPath","collectionGroup","readTime","documentId"],rr="documentKeyIndex",_l=["prefixPath","collectionGroup","documentId"],ba="collectionGroupIndex",gl=["collectionGroup","readTime","prefixPath","documentId"],vn="remoteDocumentGlobal",_s="remoteDocumentGlobalKey",Mt="targets",Ca="queryTargetsIndex",pl=["canonicalId","targetId"],Ft="targetDocuments",yl=["targetId","path"],Ks="documentTargetsIndex",Il=["path","targetId"],gr="targetGlobalKey",ot="targetGlobal",Rn="collectionParents",Tl=["collectionId","parent"],Ot="clientMetadata",El="clientId",Fr="bundles",Al="bundleId",Or="namedQueries",wl="name",$s="indexConfiguration",vl="indexId",gs="collectionGroupIndex",Rl="collectionGroup",mn="indexState",Vl=["indexId","uid"],Da="sequenceNumberIndex",Pl=["uid","sequenceNumber"],_n="indexEntries",Sl=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],xa="documentKeyIndex",bl=["indexId","uid","orderedDocumentKey"],Lr="documentOverlays",Cl=["userId","collectionPath","documentId"],ps="collectionPathOverlayIndex",Dl=["userId","collectionPath","largestBatchId"],Na="collectionGroupOverlayIndex",xl=["userId","collectionGroup","largestBatchId"],js="globals",Nl="name",ka=[wn,ge,kt,Xe,Mt,Nn,ot,Ft,Ot,vn,Rn,Fr,Or],kl=[...ka,Lr],Ma=[wn,ge,kt,_r,Mt,Nn,ot,Ft,Ot,vn,Rn,Fr,Or,Lr],Fa=Ma,Qs=[...Fa,$s,mn,_n],Ml=Qs,Oa=[...Qs,js],Fl=Oa;/**
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
 */class ys extends Ra{constructor(e,t){super(),this.le=e,this.currentSequenceNumber=t}}function J(r,e){const t=w(r);return Le.O(t.le,e)}/**
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
 */function so(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function Qe(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function La(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
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
 */class O{constructor(e,t){this.comparator=e,this.root=t||X.EMPTY}insert(e,t){return new O(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,X.BLACK,null,null))}remove(e){return new O(this.comparator,this.root.remove(e,this.comparator).copy(null,null,X.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return t+n.left.size;s<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,n)=>(e(t,n),!1)))}toString(){const e=[];return this.inorderTraversal(((t,n)=>(e.push(`${t}:${n}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Hn(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Hn(this.root,e,this.comparator,!1)}getReverseIterator(){return new Hn(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Hn(this.root,e,this.comparator,!0)}}class Hn{constructor(e,t,n,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class X{constructor(e,t,n,s,i){this.key=e,this.value=t,this.color=n??X.RED,this.left=s??X.EMPTY,this.right=i??X.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,s,i){return new X(e??this.key,t??this.value,n??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let s=this;const i=n(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,n),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return X.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return X.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,X.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,X.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw E(43730,{key:this.key,value:this.value});if(this.right.isRed())throw E(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw E(27949);return e+(this.isRed()?0:1)}}X.EMPTY=null,X.RED=!0,X.BLACK=!1;X.EMPTY=new class{constructor(){this.size=0}get key(){throw E(57766)}get value(){throw E(16141)}get color(){throw E(16727)}get left(){throw E(29726)}get right(){throw E(36894)}copy(e,t,n,s,i){return this}insert(e,t,n){return new X(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class F{constructor(e){this.comparator=e,this.data=new O(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,n)=>(e(t),!1)))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new io(this.data.getIterator())}getIteratorFrom(e){return new io(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((n=>{t=t.add(n)})),t}isEqual(e){if(!(e instanceof F)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new F(this.comparator);return t.data=e,t}}class io{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function Tt(r){return r.hasNext()?r.getNext():void 0}/**
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
 */class ue{constructor(e){this.fields=e,e.sort(q.comparator)}static empty(){return new ue([])}unionWith(e){let t=new F(q.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new ue(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return xt(this.fields,e.fields,((t,n)=>t.isEqual(n)))}}/**
 * @license
 * Copyright 2023 Google LLC
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
 */class qa extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class ${constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new qa("Invalid base64 string: "+i):i}})(e);return new $(t)}static fromUint8Array(e){const t=(function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i})(e);return new $(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return V(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}$.EMPTY_BYTE_STRING=new $("");const Ol=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Se(r){if(v(!!r,39018),typeof r=="string"){let e=0;const t=Ol.exec(r);if(v(!!t,46558,{timestamp:r}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:L(r.seconds),nanos:L(r.nanos)}}function L(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function be(r){return typeof r=="string"?$.fromBase64String(r):$.fromUint8Array(r)}/**
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
 */const Ua="server_timestamp",Ba="__type__",za="__previous_value__",Ga="__local_write_time__";function qr(r){return(r?.mapValue?.fields||{})[Ba]?.stringValue===Ua}function Ur(r){const e=r.mapValue.fields[za];return qr(e)?Ur(e):e}function Vn(r){const e=Se(r.mapValue.fields[Ga].timestampValue);return new k(e.seconds,e.nanos)}/**
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
 */class Ll{constructor(e,t,n,s,i,o,a,u,c,l){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=u,this.useFetchStreams=c,this.isUsingEmulator=l}}const pr="(default)";class ht{constructor(e,t){this.projectId=e,this.database=t||pr}static empty(){return new ht("","")}get isDefaultDatabase(){return this.database===pr}isEqual(e){return e instanceof ht&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const Ws="__type__",Ka="__max__",Oe={mapValue:{fields:{__type__:{stringValue:Ka}}}},Hs="__vector__",Lt="value",sr={nullValue:"NULL_VALUE"};function Ue(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?qr(r)?4:$a(r)?9007199254740991:Br(r)?10:11:E(28295,{value:r})}function ve(r,e){if(r===e)return!0;const t=Ue(r);if(t!==Ue(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return Vn(r).isEqual(Vn(e));case 3:return(function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const o=Se(s.timestampValue),a=Se(i.timestampValue);return o.seconds===a.seconds&&o.nanos===a.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(s,i){return be(s.bytesValue).isEqual(be(i.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(s,i){return L(s.geoPointValue.latitude)===L(i.geoPointValue.latitude)&&L(s.geoPointValue.longitude)===L(i.geoPointValue.longitude)})(r,e);case 2:return(function(s,i){if("integerValue"in s&&"integerValue"in i)return L(s.integerValue)===L(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const o=L(s.doubleValue),a=L(i.doubleValue);return o===a?An(o)===An(a):isNaN(o)&&isNaN(a)}return!1})(r,e);case 9:return xt(r.arrayValue.values||[],e.arrayValue.values||[],ve);case 10:case 11:return(function(s,i){const o=s.mapValue.fields||{},a=i.mapValue.fields||{};if(so(o)!==so(a))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(a[u]===void 0||!ve(o[u],a[u])))return!1;return!0})(r,e);default:return E(52216,{left:r})}}function Pn(r,e){return(r.values||[]).find((t=>ve(t,e)))!==void 0}function Be(r,e){if(r===e)return 0;const t=Ue(r),n=Ue(e);if(t!==n)return V(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return V(r.booleanValue,e.booleanValue);case 2:return(function(i,o){const a=L(i.integerValue||i.doubleValue),u=L(o.integerValue||o.doubleValue);return a<u?-1:a>u?1:a===u?0:isNaN(a)?isNaN(u)?0:-1:1})(r,e);case 3:return oo(r.timestampValue,e.timestampValue);case 4:return oo(Vn(r),Vn(e));case 5:return fs(r.stringValue,e.stringValue);case 6:return(function(i,o){const a=be(i),u=be(o);return a.compareTo(u)})(r.bytesValue,e.bytesValue);case 7:return(function(i,o){const a=i.split("/"),u=o.split("/");for(let c=0;c<a.length&&c<u.length;c++){const l=V(a[c],u[c]);if(l!==0)return l}return V(a.length,u.length)})(r.referenceValue,e.referenceValue);case 8:return(function(i,o){const a=V(L(i.latitude),L(o.latitude));return a!==0?a:V(L(i.longitude),L(o.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return ao(r.arrayValue,e.arrayValue);case 10:return(function(i,o){const a=i.fields||{},u=o.fields||{},c=a[Lt]?.arrayValue,l=u[Lt]?.arrayValue,h=V(c?.values?.length||0,l?.values?.length||0);return h!==0?h:ao(c,l)})(r.mapValue,e.mapValue);case 11:return(function(i,o){if(i===Oe.mapValue&&o===Oe.mapValue)return 0;if(i===Oe.mapValue)return 1;if(o===Oe.mapValue)return-1;const a=i.fields||{},u=Object.keys(a),c=o.fields||{},l=Object.keys(c);u.sort(),l.sort();for(let h=0;h<u.length&&h<l.length;++h){const f=fs(u[h],l[h]);if(f!==0)return f;const _=Be(a[u[h]],c[l[h]]);if(_!==0)return _}return V(u.length,l.length)})(r.mapValue,e.mapValue);default:throw E(23264,{he:t})}}function oo(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return V(r,e);const t=Se(r),n=Se(e),s=V(t.seconds,n.seconds);return s!==0?s:V(t.nanos,n.nanos)}function ao(r,e){const t=r.values||[],n=e.values||[];for(let s=0;s<t.length&&s<n.length;++s){const i=Be(t[s],n[s]);if(i)return i}return V(t.length,n.length)}function qt(r){return Is(r)}function Is(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const n=Se(t);return`time(${n.seconds},${n.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return be(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return y.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let n="[",s=!0;for(const i of t.values||[])s?s=!1:n+=",",n+=Is(i);return n+"]"})(r.arrayValue):"mapValue"in r?(function(t){const n=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const o of n)i?i=!1:s+=",",s+=`${o}:${Is(t.fields[o])}`;return s+"}"})(r.mapValue):E(61005,{value:r})}function ir(r){switch(Ue(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Ur(r);return e?16+ir(e):16;case 5:return 2*r.stringValue.length;case 6:return be(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(n){return(n.values||[]).reduce(((s,i)=>s+ir(i)),0)})(r.arrayValue);case 10:case 11:return(function(n){let s=0;return Qe(n.fields,((i,o)=>{s+=i.length+ir(o)})),s})(r.mapValue);default:throw E(13486,{value:r})}}function dt(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function Ts(r){return!!r&&"integerValue"in r}function Sn(r){return!!r&&"arrayValue"in r}function uo(r){return!!r&&"nullValue"in r}function co(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function or(r){return!!r&&"mapValue"in r}function Br(r){return(r?.mapValue?.fields||{})[Ws]?.stringValue===Hs}function gn(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const e={mapValue:{fields:{}}};return Qe(r.mapValue.fields,((t,n)=>e.mapValue.fields[t]=gn(n))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=gn(r.arrayValue.values[t]);return e}return{...r}}function $a(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===Ka}const ja={mapValue:{fields:{[Ws]:{stringValue:Hs},[Lt]:{arrayValue:{}}}}};function ql(r){return"nullValue"in r?sr:"booleanValue"in r?{booleanValue:!1}:"integerValue"in r||"doubleValue"in r?{doubleValue:NaN}:"timestampValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in r?{stringValue:""}:"bytesValue"in r?{bytesValue:""}:"referenceValue"in r?dt(ht.empty(),y.empty()):"geoPointValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in r?{arrayValue:{}}:"mapValue"in r?Br(r)?ja:{mapValue:{}}:E(35942,{value:r})}function Ul(r){return"nullValue"in r?{booleanValue:!1}:"booleanValue"in r?{doubleValue:NaN}:"integerValue"in r||"doubleValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in r?{stringValue:""}:"stringValue"in r?{bytesValue:""}:"bytesValue"in r?dt(ht.empty(),y.empty()):"referenceValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in r?{arrayValue:{}}:"arrayValue"in r?ja:"mapValue"in r?Br(r)?{mapValue:{}}:Oe:E(61959,{value:r})}function lo(r,e){const t=Be(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?-1:!r.inclusive&&e.inclusive?1:0}function ho(r,e){const t=Be(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?1:!r.inclusive&&e.inclusive?-1:0}/**
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
 */class ne{constructor(e){this.value=e}static empty(){return new ne({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!or(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=gn(t)}setAll(e){let t=q.emptyPath(),n={},s=[];e.forEach(((o,a)=>{if(!t.isImmediateParentOf(a)){const u=this.getFieldsMap(t);this.applyChanges(u,n,s),n={},s=[],t=a.popLast()}o?n[a.lastSegment()]=gn(o):s.push(a.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,n,s)}delete(e){const t=this.field(e.popLast());or(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return ve(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let s=t.mapValue.fields[e.get(n)];or(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,n){Qe(t,((s,i)=>e[s]=i));for(const s of n)delete e[s]}clone(){return new ne(gn(this.value))}}function Qa(r){const e=[];return Qe(r.fields,((t,n)=>{const s=new q([t]);if(or(n)){const i=Qa(n.mapValue).fields;if(i.length===0)e.push(s);else for(const o of i)e.push(s.child(o))}else e.push(s)})),new ue(e)}/**
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
 */class B{constructor(e,t,n,s,i,o,a){this.key=e,this.documentType=t,this.version=n,this.readTime=s,this.createTime=i,this.data=o,this.documentState=a}static newInvalidDocument(e){return new B(e,0,R.min(),R.min(),R.min(),ne.empty(),0)}static newFoundDocument(e,t,n,s){return new B(e,1,t,R.min(),n,s,0)}static newNoDocument(e,t){return new B(e,2,t,R.min(),R.min(),ne.empty(),0)}static newUnknownDocument(e,t){return new B(e,3,t,R.min(),R.min(),ne.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(R.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=ne.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=ne.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=R.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof B&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new B(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class ze{constructor(e,t){this.position=e,this.inclusive=t}}function fo(r,e,t){let n=0;for(let s=0;s<r.position.length;s++){const i=e[s],o=r.position[s];if(i.field.isKeyField()?n=y.comparator(y.fromName(o.referenceValue),t.key):n=Be(o,t.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function mo(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!ve(r.position[t],e.position[t]))return!1;return!0}/**
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
 */class bn{constructor(e,t="asc"){this.field=e,this.dir=t}}function Bl(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
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
 */class Wa{}class b extends Wa{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new zl(e,t,n):t==="array-contains"?new $l(e,n):t==="in"?new eu(e,n):t==="not-in"?new jl(e,n):t==="array-contains-any"?new Ql(e,n):new b(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new Gl(e,n):new Kl(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Be(t,this.value)):t!==null&&Ue(this.value)===Ue(t)&&this.matchesComparison(Be(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return E(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class M extends Wa{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new M(e,t)}matches(e){return Ut(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function Ut(r){return r.op==="and"}function Es(r){return r.op==="or"}function Js(r){return Ha(r)&&Ut(r)}function Ha(r){for(const e of r.filters)if(e instanceof M)return!1;return!0}function As(r){if(r instanceof b)return r.field.canonicalString()+r.op.toString()+qt(r.value);if(Js(r))return r.filters.map((e=>As(e))).join(",");{const e=r.filters.map((t=>As(t))).join(",");return`${r.op}(${e})`}}function Ja(r,e){return r instanceof b?(function(n,s){return s instanceof b&&n.op===s.op&&n.field.isEqual(s.field)&&ve(n.value,s.value)})(r,e):r instanceof M?(function(n,s){return s instanceof M&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce(((i,o,a)=>i&&Ja(o,s.filters[a])),!0):!1})(r,e):void E(19439)}function Ya(r,e){const t=r.filters.concat(e);return M.create(t,r.op)}function Xa(r){return r instanceof b?(function(t){return`${t.field.canonicalString()} ${t.op} ${qt(t.value)}`})(r):r instanceof M?(function(t){return t.op.toString()+" {"+t.getFilters().map(Xa).join(" ,")+"}"})(r):"Filter"}class zl extends b{constructor(e,t,n){super(e,t,n),this.key=y.fromName(n.referenceValue)}matches(e){const t=y.comparator(e.key,this.key);return this.matchesComparison(t)}}class Gl extends b{constructor(e,t){super(e,"in",t),this.keys=Za("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class Kl extends b{constructor(e,t){super(e,"not-in",t),this.keys=Za("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function Za(r,e){return(e.arrayValue?.values||[]).map((t=>y.fromName(t.referenceValue)))}class $l extends b{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Sn(t)&&Pn(t.arrayValue,this.value)}}class eu extends b{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Pn(this.value.arrayValue,t)}}class jl extends b{constructor(e,t){super(e,"not-in",t)}matches(e){if(Pn(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Pn(this.value.arrayValue,t)}}class Ql extends b{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Sn(t)||!t.arrayValue.values)&&t.arrayValue.values.some((n=>Pn(this.value.arrayValue,n)))}}/**
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
 */class Wl{constructor(e,t=null,n=[],s=[],i=null,o=null,a=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=s,this.limit=i,this.startAt=o,this.endAt=a,this.Te=null}}function ws(r,e=null,t=[],n=[],s=null,i=null,o=null){return new Wl(r,e,t,n,s,i,o)}function ft(r){const e=w(r);if(e.Te===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((n=>As(n))).join(","),t+="|ob:",t+=e.orderBy.map((n=>(function(i){return i.field.canonicalString()+i.dir})(n))).join(","),Mr(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((n=>qt(n))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((n=>qt(n))).join(",")),e.Te=t}return e.Te}function kn(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!Bl(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!Ja(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!mo(r.startAt,e.startAt)&&mo(r.endAt,e.endAt)}function yr(r){return y.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function Ir(r,e){return r.filters.filter((t=>t instanceof b&&t.field.isEqual(e)))}function _o(r,e,t){let n=sr,s=!0;for(const i of Ir(r,e)){let o=sr,a=!0;switch(i.op){case"<":case"<=":o=ql(i.value);break;case"==":case"in":case">=":o=i.value;break;case">":o=i.value,a=!1;break;case"!=":case"not-in":o=sr}lo({value:n,inclusive:s},{value:o,inclusive:a})<0&&(n=o,s=a)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];lo({value:n,inclusive:s},{value:o,inclusive:t.inclusive})<0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}function go(r,e,t){let n=Oe,s=!0;for(const i of Ir(r,e)){let o=Oe,a=!0;switch(i.op){case">=":case">":o=Ul(i.value),a=!1;break;case"==":case"in":case"<=":o=i.value;break;case"<":o=i.value,a=!1;break;case"!=":case"not-in":o=Oe}ho({value:n,inclusive:s},{value:o,inclusive:a})>0&&(n=o,s=a)}if(t!==null){for(let i=0;i<r.orderBy.length;++i)if(r.orderBy[i].field.isEqual(e)){const o=t.position[i];ho({value:n,inclusive:s},{value:o,inclusive:t.inclusive})>0&&(n=o,s=t.inclusive);break}}return{value:n,inclusive:s}}/**
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
 */class Ce{constructor(e,t=null,n=[],s=[],i=null,o="F",a=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=s,this.limit=i,this.limitType=o,this.startAt=a,this.endAt=u,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function tu(r,e,t,n,s,i,o,a){return new Ce(r,e,t,n,s,i,o,a)}function Mn(r){return new Ce(r)}function po(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function Ys(r){return r.collectionGroup!==null}function Ct(r){const e=w(r);if(e.Ie===null){e.Ie=[];const t=new Set;for(const i of e.explicitOrderBy)e.Ie.push(i),t.add(i.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new F(q.comparator);return o.filters.forEach((u=>{u.getFlattenedFilters().forEach((c=>{c.isInequality()&&(a=a.add(c.field))}))})),a})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.Ie.push(new bn(i,n))})),t.has(q.keyField().canonicalString())||e.Ie.push(new bn(q.keyField(),n))}return e.Ie}function he(r){const e=w(r);return e.Ee||(e.Ee=Hl(e,Ct(r))),e.Ee}function Hl(r,e){if(r.limitType==="F")return ws(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new bn(s.field,i)}));const t=r.endAt?new ze(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new ze(r.startAt.position,r.startAt.inclusive):null;return ws(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function vs(r,e){const t=r.filters.concat([e]);return new Ce(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function Tr(r,e,t){return new Ce(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function zr(r,e){return kn(he(r),he(e))&&r.limitType===e.limitType}function nu(r){return`${ft(he(r))}|lt:${r.limitType}`}function Vt(r){return`Query(target=${(function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map((s=>Xa(s))).join(", ")}]`),Mr(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map((s=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(s))).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map((s=>qt(s))).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map((s=>qt(s))).join(",")),`Target(${n})`})(he(r))}; limitType=${r.limitType})`}function Fn(r,e){return e.isFoundDocument()&&(function(n,s){const i=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):y.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)})(r,e)&&(function(n,s){for(const i of Ct(n))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(r,e)&&(function(n,s){for(const i of n.filters)if(!i.matches(s))return!1;return!0})(r,e)&&(function(n,s){return!(n.startAt&&!(function(o,a,u){const c=fo(o,a,u);return o.inclusive?c<=0:c<0})(n.startAt,Ct(n),s)||n.endAt&&!(function(o,a,u){const c=fo(o,a,u);return o.inclusive?c>=0:c>0})(n.endAt,Ct(n),s))})(r,e)}function ru(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function su(r){return(e,t)=>{let n=!1;for(const s of Ct(r)){const i=Jl(s,e,t);if(i!==0)return i;n=n||s.field.isKeyField()}return 0}}function Jl(r,e,t){const n=r.field.isKeyField()?y.comparator(e.key,t.key):(function(i,o,a){const u=o.data.field(i),c=a.data.field(i);return u!==null&&c!==null?Be(u,c):E(42886)})(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return E(19790,{direction:r.dir})}}/**
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
 */class De{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[s,i]of n)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],e))return n.length===1?delete this.inner[t]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Qe(this.inner,((t,n)=>{for(const[s,i]of n)e(s,i)}))}isEmpty(){return La(this.inner)}size(){return this.innerSize}}/**
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
 */const Yl=new O(y.comparator);function le(){return Yl}const iu=new O(y.comparator);function un(...r){let e=iu;for(const t of r)e=e.insert(t.key,t);return e}function ou(r){let e=iu;return r.forEach(((t,n)=>e=e.insert(t,n.overlayedDocument))),e}function Te(){return pn()}function au(){return pn()}function pn(){return new De((r=>r.toString()),((r,e)=>r.isEqual(e)))}const Xl=new O(y.comparator),Zl=new F(y.comparator);function S(...r){let e=Zl;for(const t of r)e=e.add(t);return e}const eh=new F(V);function Xs(){return eh}/**
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
 */function Zs(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:An(e)?"-0":e}}function uu(r){return{integerValue:""+r}}function cu(r,e){return Pa(e)?uu(e):Zs(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
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
 */class Gr{constructor(){this._=void 0}}function th(r,e,t){return r instanceof Bt?(function(s,i){const o={fields:{[Ba]:{stringValue:Ua},[Ga]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&qr(i)&&(i=Ur(i)),i&&(o.fields[za]=i),{mapValue:o}})(t,e):r instanceof zt?hu(r,e):r instanceof Gt?du(r,e):(function(s,i){const o=lu(s,i),a=yo(o)+yo(s.Ae);return Ts(o)&&Ts(s.Ae)?uu(a):Zs(s.serializer,a)})(r,e)}function nh(r,e,t){return r instanceof zt?hu(r,e):r instanceof Gt?du(r,e):t}function lu(r,e){return r instanceof Kt?(function(n){return Ts(n)||(function(i){return!!i&&"doubleValue"in i})(n)})(e)?e:{integerValue:0}:null}class Bt extends Gr{}class zt extends Gr{constructor(e){super(),this.elements=e}}function hu(r,e){const t=fu(e);for(const n of r.elements)t.some((s=>ve(s,n)))||t.push(n);return{arrayValue:{values:t}}}class Gt extends Gr{constructor(e){super(),this.elements=e}}function du(r,e){let t=fu(e);for(const n of r.elements)t=t.filter((s=>!ve(s,n)));return{arrayValue:{values:t}}}class Kt extends Gr{constructor(e,t){super(),this.serializer=e,this.Ae=t}}function yo(r){return L(r.integerValue||r.doubleValue)}function fu(r){return Sn(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
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
 */class ei{constructor(e,t){this.field=e,this.transform=t}}function rh(r,e){return r.field.isEqual(e.field)&&(function(n,s){return n instanceof zt&&s instanceof zt||n instanceof Gt&&s instanceof Gt?xt(n.elements,s.elements,ve):n instanceof Kt&&s instanceof Kt?ve(n.Ae,s.Ae):n instanceof Bt&&s instanceof Bt})(r.transform,e.transform)}class sh{constructor(e,t){this.version=e,this.transformResults=t}}class H{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new H}static exists(e){return new H(void 0,e)}static updateTime(e){return new H(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function ar(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class Kr{}function mu(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new On(r.key,H.none()):new Yt(r.key,r.data,H.none());{const t=r.data,n=ne.empty();let s=new F(q.comparator);for(let i of e.fields)if(!s.has(i)){let o=t.field(i);o===null&&i.length>1&&(i=i.popLast(),o=t.field(i)),o===null?n.delete(i):n.set(i,o),s=s.add(i)}return new xe(r.key,n,new ue(s.toArray()),H.none())}}function ih(r,e,t){r instanceof Yt?(function(s,i,o){const a=s.value.clone(),u=To(s.fieldTransforms,i,o.transformResults);a.setAll(u),i.convertToFoundDocument(o.version,a).setHasCommittedMutations()})(r,e,t):r instanceof xe?(function(s,i,o){if(!ar(s.precondition,i))return void i.convertToUnknownDocument(o.version);const a=To(s.fieldTransforms,i,o.transformResults),u=i.data;u.setAll(_u(s)),u.setAll(a),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()})(r,e,t):(function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()})(0,e,t)}function yn(r,e,t,n){return r instanceof Yt?(function(i,o,a,u){if(!ar(i.precondition,o))return a;const c=i.value.clone(),l=Eo(i.fieldTransforms,u,o);return c.setAll(l),o.convertToFoundDocument(o.version,c).setHasLocalMutations(),null})(r,e,t,n):r instanceof xe?(function(i,o,a,u){if(!ar(i.precondition,o))return a;const c=Eo(i.fieldTransforms,u,o),l=o.data;return l.setAll(_u(i)),l.setAll(c),o.convertToFoundDocument(o.version,l).setHasLocalMutations(),a===null?null:a.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((h=>h.field)))})(r,e,t,n):(function(i,o,a){return ar(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):a})(r,e,t)}function oh(r,e){let t=null;for(const n of r.fieldTransforms){const s=e.data.field(n.field),i=lu(n.transform,s||null);i!=null&&(t===null&&(t=ne.empty()),t.set(n.field,i))}return t||null}function Io(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&xt(n,s,((i,o)=>rh(i,o)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class Yt extends Kr{constructor(e,t,n,s=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class xe extends Kr{constructor(e,t,n,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function _u(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}})),e}function To(r,e,t){const n=new Map;v(r.length===t.length,32656,{Re:t.length,Ve:r.length});for(let s=0;s<t.length;s++){const i=r[s],o=i.transform,a=e.data.field(i.field);n.set(i.field,nh(o,a,t[s]))}return n}function Eo(r,e,t){const n=new Map;for(const s of r){const i=s.transform,o=t.data.field(s.field);n.set(s.field,th(i,o,e))}return n}class On extends Kr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class gu extends Kr{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class ti{constructor(e,t,n,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&ih(i,e,n[s])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=yn(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=yn(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=au();return this.mutations.forEach((s=>{const i=e.get(s.key),o=i.overlayedDocument;let a=this.applyToLocalView(o,i.mutatedFields);a=t.has(s.key)?null:a;const u=mu(o,a);u!==null&&n.set(s.key,u),o.isValidDocument()||o.convertToNoDocument(R.min())})),n}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),S())}isEqual(e){return this.batchId===e.batchId&&xt(this.mutations,e.mutations,((t,n)=>Io(t,n)))&&xt(this.baseMutations,e.baseMutations,((t,n)=>Io(t,n)))}}class ni{constructor(e,t,n,s){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=s}static from(e,t,n){v(e.mutations.length===n.length,58842,{me:e.mutations.length,fe:n.length});let s=(function(){return Xl})();const i=e.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,n[o].version);return new ni(e,t,n,s)}}/**
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
 */class ri{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
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
 */class ah{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
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
 */var j,D;function uh(r){switch(r){case m.OK:return E(64938);case m.CANCELLED:case m.UNKNOWN:case m.DEADLINE_EXCEEDED:case m.RESOURCE_EXHAUSTED:case m.INTERNAL:case m.UNAVAILABLE:case m.UNAUTHENTICATED:return!1;case m.INVALID_ARGUMENT:case m.NOT_FOUND:case m.ALREADY_EXISTS:case m.PERMISSION_DENIED:case m.FAILED_PRECONDITION:case m.ABORTED:case m.OUT_OF_RANGE:case m.UNIMPLEMENTED:case m.DATA_LOSS:return!0;default:return E(15467,{code:r})}}function pu(r){if(r===void 0)return K("GRPC error has no .code"),m.UNKNOWN;switch(r){case j.OK:return m.OK;case j.CANCELLED:return m.CANCELLED;case j.UNKNOWN:return m.UNKNOWN;case j.DEADLINE_EXCEEDED:return m.DEADLINE_EXCEEDED;case j.RESOURCE_EXHAUSTED:return m.RESOURCE_EXHAUSTED;case j.INTERNAL:return m.INTERNAL;case j.UNAVAILABLE:return m.UNAVAILABLE;case j.UNAUTHENTICATED:return m.UNAUTHENTICATED;case j.INVALID_ARGUMENT:return m.INVALID_ARGUMENT;case j.NOT_FOUND:return m.NOT_FOUND;case j.ALREADY_EXISTS:return m.ALREADY_EXISTS;case j.PERMISSION_DENIED:return m.PERMISSION_DENIED;case j.FAILED_PRECONDITION:return m.FAILED_PRECONDITION;case j.ABORTED:return m.ABORTED;case j.OUT_OF_RANGE:return m.OUT_OF_RANGE;case j.UNIMPLEMENTED:return m.UNIMPLEMENTED;case j.DATA_LOSS:return m.DATA_LOSS;default:return E(39323,{code:r})}}(D=j||(j={}))[D.OK=0]="OK",D[D.CANCELLED=1]="CANCELLED",D[D.UNKNOWN=2]="UNKNOWN",D[D.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",D[D.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",D[D.NOT_FOUND=5]="NOT_FOUND",D[D.ALREADY_EXISTS=6]="ALREADY_EXISTS",D[D.PERMISSION_DENIED=7]="PERMISSION_DENIED",D[D.UNAUTHENTICATED=16]="UNAUTHENTICATED",D[D.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",D[D.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",D[D.ABORTED=10]="ABORTED",D[D.OUT_OF_RANGE=11]="OUT_OF_RANGE",D[D.UNIMPLEMENTED=12]="UNIMPLEMENTED",D[D.INTERNAL=13]="INTERNAL",D[D.UNAVAILABLE=14]="UNAVAILABLE",D[D.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
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
 */function ch(){return new TextEncoder}/**
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
 */const lh=new st([4294967295,4294967295],0);function Ao(r){const e=ch().encode(r),t=new Hc;return t.update(e),new Uint8Array(t.digest())}function wo(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new st([t,n],0),new st([s,i],0)]}class si{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new cn(`Invalid padding: ${t}`);if(n<0)throw new cn(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new cn(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new cn(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=st.fromNumber(this.ge)}ye(e,t,n){let s=e.add(t.multiply(st.fromNumber(n)));return s.compare(lh)===1&&(s=new st([s.getBits(0),s.getBits(1)],0)),s.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const t=Ao(e),[n,s]=wo(t);for(let i=0;i<this.hashCount;i++){const o=this.ye(n,s,i);if(!this.we(o))return!1}return!0}static create(e,t,n){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new si(i,s,t);return n.forEach((a=>o.insert(a))),o}insert(e){if(this.ge===0)return;const t=Ao(e),[n,s]=wo(t);for(let i=0;i<this.hashCount;i++){const o=this.ye(n,s,i);this.Se(o)}}Se(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class cn extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class Ln{constructor(e,t,n,s,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const s=new Map;return s.set(e,qn.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new Ln(R.min(),s,new O(V),le(),S())}}class qn{constructor(e,t,n,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new qn(n,t,S(),S(),S())}}/**
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
 */class ur{constructor(e,t,n,s){this.be=e,this.removedTargetIds=t,this.key=n,this.De=s}}class yu{constructor(e,t){this.targetId=e,this.Ce=t}}class Iu{constructor(e,t,n=$.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=s}}class vo{constructor(){this.ve=0,this.Fe=Ro(),this.Me=$.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=S(),t=S(),n=S();return this.Fe.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:n=n.add(s);break;default:E(38017,{changeType:i})}})),new qn(this.Me,this.xe,e,t,n)}qe(){this.Oe=!1,this.Fe=Ro()}Qe(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}$e(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}Ue(){this.ve+=1}Ke(){this.ve-=1,v(this.ve>=0,3241,{ve:this.ve})}We(){this.Oe=!0,this.xe=!0}}class hh{constructor(e){this.Ge=e,this.ze=new Map,this.je=le(),this.Je=Jn(),this.He=Jn(),this.Ye=new O(V)}Ze(e){for(const t of e.be)e.De&&e.De.isFoundDocument()?this.Xe(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,(t=>{const n=this.nt(t);switch(e.state){case 0:this.rt(t)&&n.Le(e.resumeToken);break;case 1:n.Ke(),n.Ne||n.qe(),n.Le(e.resumeToken);break;case 2:n.Ke(),n.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(n.We(),n.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),n.Le(e.resumeToken));break;default:E(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach(((n,s)=>{this.rt(s)&&t(s)}))}st(e){const t=e.targetId,n=e.Ce.count,s=this.ot(t);if(s){const i=s.target;if(yr(i))if(n===0){const o=new y(i.path);this.et(t,o,B.newNoDocument(o,R.min()))}else v(n===1,20013,{expectedCount:n});else{const o=this._t(t);if(o!==n){const a=this.ut(e),u=a?this.ct(a,e,o):1;if(u!==0){this.it(t);const c=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ye=this.Ye.insert(t,c)}}}}}ut(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:i=0}=t;let o,a;try{o=be(n).toUint8Array()}catch(u){if(u instanceof qa)return Tn("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{a=new si(o,s,i)}catch(u){return Tn(u instanceof cn?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return a.ge===0?null:a}ct(e,t,n){return t.Ce.count===n-this.Pt(e,t.targetId)?0:2}Pt(e,t){const n=this.Ge.getRemoteKeysForTarget(t);let s=0;return n.forEach((i=>{const o=this.Ge.ht(),a=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(a)||(this.et(t,i,null),s++)})),s}Tt(e){const t=new Map;this.ze.forEach(((i,o)=>{const a=this.ot(o);if(a){if(i.current&&yr(a.target)){const u=new y(a.target.path);this.It(u).has(o)||this.Et(o,u)||this.et(o,u,B.newNoDocument(u,e))}i.Be&&(t.set(o,i.ke()),i.qe())}}));let n=S();this.He.forEach(((i,o)=>{let a=!0;o.forEachWhile((u=>{const c=this.ot(u);return!c||c.purpose==="TargetPurposeLimboResolution"||(a=!1,!1)})),a&&(n=n.add(i))})),this.je.forEach(((i,o)=>o.setReadTime(e)));const s=new Ln(e,t,this.Ye,this.je,n);return this.je=le(),this.Je=Jn(),this.He=Jn(),this.Ye=new O(V),s}Xe(e,t){if(!this.rt(e))return;const n=this.Et(e,t.key)?2:0;this.nt(e).Qe(t.key,n),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.It(t.key).add(e)),this.He=this.He.insert(t.key,this.dt(t.key).add(e))}et(e,t,n){if(!this.rt(e))return;const s=this.nt(e);this.Et(e,t)?s.Qe(t,1):s.$e(t),this.He=this.He.insert(t,this.dt(t).delete(e)),this.He=this.He.insert(t,this.dt(t).add(e)),n&&(this.je=this.je.insert(t,n))}removeTarget(e){this.ze.delete(e)}_t(e){const t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}Ue(e){this.nt(e).Ue()}nt(e){let t=this.ze.get(e);return t||(t=new vo,this.ze.set(e,t)),t}dt(e){let t=this.He.get(e);return t||(t=new F(V),this.He=this.He.insert(e,t)),t}It(e){let t=this.Je.get(e);return t||(t=new F(V),this.Je=this.Je.insert(e,t)),t}rt(e){const t=this.ot(e)!==null;return t||g("WatchChangeAggregator","Detected inactive target",e),t}ot(e){const t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new vo),this.Ge.getRemoteKeysForTarget(e).forEach((t=>{this.et(e,t,null)}))}Et(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function Jn(){return new O(y.comparator)}function Ro(){return new O(y.comparator)}const dh={asc:"ASCENDING",desc:"DESCENDING"},fh={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},mh={and:"AND",or:"OR"};class _h{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Rs(r,e){return r.useProto3Json||Mr(e)?e:{value:e}}function $t(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Tu(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function gh(r,e){return $t(r,e.toTimestamp())}function ie(r){return v(!!r,49232),R.fromTimestamp((function(t){const n=Se(t);return new k(n.seconds,n.nanos)})(r))}function ii(r,e){return Vs(r,e).canonicalString()}function Vs(r,e){const t=(function(s){return new x(["projects",s.projectId,"databases",s.database])})(r).child("documents");return e===void 0?t:t.child(e)}function Eu(r){const e=x.fromString(r);return v(Cu(e),10190,{key:e.toString()}),e}function Er(r,e){return ii(r.databaseId,e.path)}function at(r,e){const t=Eu(e);if(t.get(1)!==r.databaseId.projectId)throw new p(m.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new p(m.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new y(vu(t))}function Au(r,e){return ii(r.databaseId,e)}function wu(r){const e=Eu(r);return e.length===4?x.emptyPath():vu(e)}function Ps(r){return new x(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function vu(r){return v(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function Vo(r,e,t){return{name:Er(r,e),fields:t.value.mapValue.fields}}function ph(r,e,t){const n=at(r,e.name),s=ie(e.updateTime),i=e.createTime?ie(e.createTime):R.min(),o=new ne({mapValue:{fields:e.fields}}),a=B.newFoundDocument(n,s,i,o);return t&&a.setHasCommittedMutations(),t?a.setHasCommittedMutations():a}function yh(r,e){let t;if("targetChange"in e){e.targetChange;const n=(function(c){return c==="NO_CHANGE"?0:c==="ADD"?1:c==="REMOVE"?2:c==="CURRENT"?3:c==="RESET"?4:E(39313,{state:c})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(c,l){return c.useProto3Json?(v(l===void 0||typeof l=="string",58123),$.fromBase64String(l||"")):(v(l===void 0||l instanceof Buffer||l instanceof Uint8Array,16193),$.fromUint8Array(l||new Uint8Array))})(r,e.targetChange.resumeToken),o=e.targetChange.cause,a=o&&(function(c){const l=c.code===void 0?m.UNKNOWN:pu(c.code);return new p(l,c.message||"")})(o);t=new Iu(n,s,i,a||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const s=at(r,n.document.name),i=ie(n.document.updateTime),o=n.document.createTime?ie(n.document.createTime):R.min(),a=new ne({mapValue:{fields:n.document.fields}}),u=B.newFoundDocument(s,i,o,a),c=n.targetIds||[],l=n.removedTargetIds||[];t=new ur(c,l,u.key,u)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const s=at(r,n.document),i=n.readTime?ie(n.readTime):R.min(),o=B.newNoDocument(s,i),a=n.removedTargetIds||[];t=new ur([],a,o.key,o)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const s=at(r,n.document),i=n.removedTargetIds||[];t=new ur([],i,s,null)}else{if(!("filter"in e))return E(11601,{Rt:e});{e.filter;const n=e.filter;n.targetId;const{count:s=0,unchangedNames:i}=n,o=new ah(s,i),a=n.targetId;t=new yu(a,o)}}return t}function Ar(r,e){let t;if(e instanceof Yt)t={update:Vo(r,e.key,e.value)};else if(e instanceof On)t={delete:Er(r,e.key)};else if(e instanceof xe)t={update:Vo(r,e.key,e.data),updateMask:vh(e.fieldMask)};else{if(!(e instanceof gu))return E(16599,{Vt:e.type});t={verify:Er(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((n=>(function(i,o){const a=o.transform;if(a instanceof Bt)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof zt)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof Gt)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof Kt)return{fieldPath:o.field.canonicalString(),increment:a.Ae};throw E(20930,{transform:o.transform})})(0,n)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:gh(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:E(27497)})(r,e.precondition)),t}function Ss(r,e){const t=e.currentDocument?(function(i){return i.updateTime!==void 0?H.updateTime(ie(i.updateTime)):i.exists!==void 0?H.exists(i.exists):H.none()})(e.currentDocument):H.none(),n=e.updateTransforms?e.updateTransforms.map((s=>(function(o,a){let u=null;if("setToServerValue"in a)v(a.setToServerValue==="REQUEST_TIME",16630,{proto:a}),u=new Bt;else if("appendMissingElements"in a){const l=a.appendMissingElements.values||[];u=new zt(l)}else if("removeAllFromArray"in a){const l=a.removeAllFromArray.values||[];u=new Gt(l)}else"increment"in a?u=new Kt(o,a.increment):E(16584,{proto:a});const c=q.fromServerFormat(a.fieldPath);return new ei(c,u)})(r,s))):[];if(e.update){e.update.name;const s=at(r,e.update.name),i=new ne({mapValue:{fields:e.update.fields}});if(e.updateMask){const o=(function(u){const c=u.fieldPaths||[];return new ue(c.map((l=>q.fromServerFormat(l))))})(e.updateMask);return new xe(s,i,o,t,n)}return new Yt(s,i,t,n)}if(e.delete){const s=at(r,e.delete);return new On(s,t)}if(e.verify){const s=at(r,e.verify);return new gu(s,t)}return E(1463,{proto:e})}function Ih(r,e){return r&&r.length>0?(v(e!==void 0,14353),r.map((t=>(function(s,i){let o=s.updateTime?ie(s.updateTime):ie(i);return o.isEqual(R.min())&&(o=ie(i)),new sh(o,s.transformResults||[])})(t,e)))):[]}function Ru(r,e){return{documents:[Au(r,e.path)]}}function Vu(r,e){const t={structuredQuery:{}},n=e.path;let s;e.collectionGroup!==null?(s=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=Au(r,s);const i=(function(c){if(c.length!==0)return bu(M.create(c,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const o=(function(c){if(c.length!==0)return c.map((l=>(function(f){return{field:Pt(f.field),direction:Eh(f.dir)}})(l)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);const a=Rs(r,e.limit);return a!==null&&(t.structuredQuery.limit=a),e.startAt&&(t.structuredQuery.startAt=(function(c){return{before:c.inclusive,values:c.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(c){return{before:!c.inclusive,values:c.position}})(e.endAt)),{ft:t,parent:s}}function Pu(r){let e=wu(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let s=null;if(n>0){v(n===1,65062);const l=t.from[0];l.allDescendants?s=l.collectionId:e=e.child(l.collectionId)}let i=[];t.where&&(i=(function(h){const f=Su(h);return f instanceof M&&Js(f)?f.getFilters():[f]})(t.where));let o=[];t.orderBy&&(o=(function(h){return h.map((f=>(function(I){return new bn(St(I.field),(function(T){switch(T){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(I.direction))})(f)))})(t.orderBy));let a=null;t.limit&&(a=(function(h){let f;return f=typeof h=="object"?h.value:h,Mr(f)?null:f})(t.limit));let u=null;t.startAt&&(u=(function(h){const f=!!h.before,_=h.values||[];return new ze(_,f)})(t.startAt));let c=null;return t.endAt&&(c=(function(h){const f=!h.before,_=h.values||[];return new ze(_,f)})(t.endAt)),tu(e,s,o,i,a,"F",u,c)}function Th(r,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return E(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Su(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=St(t.unaryFilter.field);return b.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=St(t.unaryFilter.field);return b.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=St(t.unaryFilter.field);return b.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=St(t.unaryFilter.field);return b.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return E(61313);default:return E(60726)}})(r):r.fieldFilter!==void 0?(function(t){return b.create(St(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return E(58110);default:return E(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return M.create(t.compositeFilter.filters.map((n=>Su(n))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return E(1026)}})(t.compositeFilter.op))})(r):E(30097,{filter:r})}function Eh(r){return dh[r]}function Ah(r){return fh[r]}function wh(r){return mh[r]}function Pt(r){return{fieldPath:r.canonicalString()}}function St(r){return q.fromServerFormat(r.fieldPath)}function bu(r){return r instanceof b?(function(t){if(t.op==="=="){if(co(t.value))return{unaryFilter:{field:Pt(t.field),op:"IS_NAN"}};if(uo(t.value))return{unaryFilter:{field:Pt(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(co(t.value))return{unaryFilter:{field:Pt(t.field),op:"IS_NOT_NAN"}};if(uo(t.value))return{unaryFilter:{field:Pt(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Pt(t.field),op:Ah(t.op),value:t.value}}})(r):r instanceof M?(function(t){const n=t.getFilters().map((s=>bu(s)));return n.length===1?n[0]:{compositeFilter:{op:wh(t.op),filters:n}}})(r):E(54877,{filter:r})}function vh(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Cu(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
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
 */class Pe{constructor(e,t,n,s,i=R.min(),o=R.min(),a=$.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a,this.expectedCount=u}withSequenceNumber(e){return new Pe(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Pe(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Pe(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Pe(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class Du{constructor(e){this.yt=e}}function Rh(r,e){let t;if(e.document)t=ph(r.yt,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const n=y.fromSegments(e.noDocument.path),s=_t(e.noDocument.readTime);t=B.newNoDocument(n,s),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return E(56709);{const n=y.fromSegments(e.unknownDocument.path),s=_t(e.unknownDocument.version);t=B.newUnknownDocument(n,s)}}return e.readTime&&t.setReadTime((function(s){const i=new k(s[0],s[1]);return R.fromTimestamp(i)})(e.readTime)),t}function Po(r,e){const t=e.key,n={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:wr(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())n.document=(function(i,o){return{name:Er(i,o.key),fields:o.data.value.mapValue.fields,updateTime:$t(i,o.version.toTimestamp()),createTime:$t(i,o.createTime.toTimestamp())}})(r.yt,e);else if(e.isNoDocument())n.noDocument={path:t.path.toArray(),readTime:mt(e.version)};else{if(!e.isUnknownDocument())return E(57904,{document:e});n.unknownDocument={path:t.path.toArray(),version:mt(e.version)}}return n}function wr(r){const e=r.toTimestamp();return[e.seconds,e.nanoseconds]}function mt(r){const e=r.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function _t(r){const e=new k(r.seconds,r.nanoseconds);return R.fromTimestamp(e)}function et(r,e){const t=(e.baseMutations||[]).map((i=>Ss(r.yt,i)));for(let i=0;i<e.mutations.length-1;++i){const o=e.mutations[i];if(i+1<e.mutations.length&&e.mutations[i+1].transform!==void 0){const a=e.mutations[i+1];o.updateTransforms=a.transform.fieldTransforms,e.mutations.splice(i+1,1),++i}}const n=e.mutations.map((i=>Ss(r.yt,i))),s=k.fromMillis(e.localWriteTimeMs);return new ti(e.batchId,s,t,n)}function ln(r){const e=_t(r.readTime),t=r.lastLimboFreeSnapshotVersion!==void 0?_t(r.lastLimboFreeSnapshotVersion):R.min();let n;return n=(function(i){return i.documents!==void 0})(r.query)?(function(i){const o=i.documents.length;return v(o===1,1966,{count:o}),he(Mn(wu(i.documents[0])))})(r.query):(function(i){return he(Pu(i))})(r.query),new Pe(n,r.targetId,"TargetPurposeListen",r.lastListenSequenceNumber,e,t,$.fromBase64String(r.resumeToken))}function xu(r,e){const t=mt(e.snapshotVersion),n=mt(e.lastLimboFreeSnapshotVersion);let s;s=yr(e.target)?Ru(r.yt,e.target):Vu(r.yt,e.target).ft;const i=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:ft(e.target),readTime:t,resumeToken:i,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:n,query:s}}function Nu(r){const e=Pu({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?Tr(e,e.limit,"L"):e}function ss(r,e){return new ri(e.largestBatchId,Ss(r.yt,e.overlayMutation))}function So(r,e){const t=e.path.lastSegment();return[r,re(e.path.popLast()),t]}function bo(r,e,t,n){return{indexId:r,uid:e,sequenceNumber:t,readTime:mt(n.readTime),documentKey:re(n.documentKey.path),largestBatchId:n.largestBatchId}}/**
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
 */class Vh{getBundleMetadata(e,t){return Co(e).get(t).next((n=>{if(n)return(function(i){return{id:i.bundleId,createTime:_t(i.createTime),version:i.version}})(n)}))}saveBundleMetadata(e,t){return Co(e).put((function(s){return{bundleId:s.id,createTime:mt(ie(s.createTime)),version:s.version}})(t))}getNamedQuery(e,t){return Do(e).get(t).next((n=>{if(n)return(function(i){return{name:i.name,query:Nu(i.bundledQuery),readTime:_t(i.readTime)}})(n)}))}saveNamedQuery(e,t){return Do(e).put((function(s){return{name:s.name,readTime:mt(ie(s.readTime)),bundledQuery:s.bundledQuery}})(t))}}function Co(r){return J(r,Fr)}function Do(r){return J(r,Or)}/**
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
 */class $r{constructor(e,t){this.serializer=e,this.userId=t}static wt(e,t){const n=t.uid||"";return new $r(e,n)}getOverlay(e,t){return nn(e).get(So(this.userId,t)).next((n=>n?ss(this.serializer,n):null))}getOverlays(e,t){const n=Te();return d.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}saveOverlays(e,t,n){const s=[];return n.forEach(((i,o)=>{const a=new ri(t,o);s.push(this.St(e,a))})),d.waitFor(s)}removeOverlaysForBatchId(e,t,n){const s=new Set;t.forEach((o=>s.add(re(o.getCollectionPath()))));const i=[];return s.forEach((o=>{const a=IDBKeyRange.bound([this.userId,o,n],[this.userId,o,n+1],!1,!0);i.push(nn(e).Z(ps,a))})),d.waitFor(i)}getOverlaysForCollection(e,t,n){const s=Te(),i=re(t),o=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return nn(e).J(ps,o).next((a=>{for(const u of a){const c=ss(this.serializer,u);s.set(c.getKey(),c)}return s}))}getOverlaysForCollectionGroup(e,t,n,s){const i=Te();let o;const a=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return nn(e).ee({index:Na,range:a},((u,c,l)=>{const h=ss(this.serializer,c);i.size()<s||h.largestBatchId===o?(i.set(h.getKey(),h),o=h.largestBatchId):l.done()})).next((()=>i))}St(e,t){return nn(e).put((function(s,i,o){const[a,u,c]=So(i,o.mutation.key);return{userId:i,collectionPath:u,documentId:c,collectionGroup:o.mutation.key.getCollectionGroup(),largestBatchId:o.largestBatchId,overlayMutation:Ar(s.yt,o.mutation)}})(this.serializer,this.userId,t))}}function nn(r){return J(r,Lr)}/**
 * @license
 * Copyright 2024 Google LLC
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
 */class Ph{bt(e){return J(e,js)}getSessionToken(e){return this.bt(e).get("sessionToken").next((t=>{const n=t?.value;return n?$.fromUint8Array(n):$.EMPTY_BYTE_STRING}))}setSessionToken(e,t){return this.bt(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
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
 */class tt{constructor(){}Dt(e,t){this.Ct(e,t),t.vt()}Ct(e,t){if("nullValue"in e)this.Ft(t,5);else if("booleanValue"in e)this.Ft(t,10),t.Mt(e.booleanValue?1:0);else if("integerValue"in e)this.Ft(t,15),t.Mt(L(e.integerValue));else if("doubleValue"in e){const n=L(e.doubleValue);isNaN(n)?this.Ft(t,13):(this.Ft(t,15),An(n)?t.Mt(0):t.Mt(n))}else if("timestampValue"in e){let n=e.timestampValue;this.Ft(t,20),typeof n=="string"&&(n=Se(n)),t.xt(`${n.seconds||""}`),t.Mt(n.nanos||0)}else if("stringValue"in e)this.Ot(e.stringValue,t),this.Nt(t);else if("bytesValue"in e)this.Ft(t,30),t.Bt(be(e.bytesValue)),this.Nt(t);else if("referenceValue"in e)this.Lt(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.Ft(t,45),t.Mt(n.latitude||0),t.Mt(n.longitude||0)}else"mapValue"in e?$a(e)?this.Ft(t,Number.MAX_SAFE_INTEGER):Br(e)?this.kt(e.mapValue,t):(this.qt(e.mapValue,t),this.Nt(t)):"arrayValue"in e?(this.Qt(e.arrayValue,t),this.Nt(t)):E(19022,{$t:e})}Ot(e,t){this.Ft(t,25),this.Ut(e,t)}Ut(e,t){t.xt(e)}qt(e,t){const n=e.fields||{};this.Ft(t,55);for(const s of Object.keys(n))this.Ot(s,t),this.Ct(n[s],t)}kt(e,t){const n=e.fields||{};this.Ft(t,53);const s=Lt,i=n[s].arrayValue?.values?.length||0;this.Ft(t,15),t.Mt(L(i)),this.Ot(s,t),this.Ct(n[s],t)}Qt(e,t){const n=e.values||[];this.Ft(t,50);for(const s of n)this.Ct(s,t)}Lt(e,t){this.Ft(t,37),y.fromName(e).path.forEach((n=>{this.Ft(t,60),this.Ut(n,t)}))}Ft(e,t){e.Mt(t)}Nt(e){e.Mt(2)}}tt.Kt=new tt;/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Et=255;function Sh(r){if(r===0)return 8;let e=0;return r>>4||(e+=4,r<<=4),r>>6||(e+=2,r<<=2),r>>7||(e+=1),e}function xo(r){const e=64-(function(n){let s=0;for(let i=0;i<8;++i){const o=Sh(255&n[i]);if(s+=o,o!==8)break}return s})(r);return Math.ceil(e/8)}class bh{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Wt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Gt(n.value),n=t.next();this.zt()}jt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Jt(n.value),n=t.next();this.Ht()}Yt(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Gt(n);else if(n<2048)this.Gt(960|n>>>6),this.Gt(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Gt(480|n>>>12),this.Gt(128|63&n>>>6),this.Gt(128|63&n);else{const s=t.codePointAt(0);this.Gt(240|s>>>18),this.Gt(128|63&s>>>12),this.Gt(128|63&s>>>6),this.Gt(128|63&s)}}this.zt()}Zt(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.Jt(n);else if(n<2048)this.Jt(960|n>>>6),this.Jt(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.Jt(480|n>>>12),this.Jt(128|63&n>>>6),this.Jt(128|63&n);else{const s=t.codePointAt(0);this.Jt(240|s>>>18),this.Jt(128|63&s>>>12),this.Jt(128|63&s>>>6),this.Jt(128|63&s)}}this.Ht()}Xt(e){const t=this.en(e),n=xo(t);this.tn(1+n),this.buffer[this.position++]=255&n;for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=255&t[s]}nn(e){const t=this.en(e),n=xo(t);this.tn(1+n),this.buffer[this.position++]=~(255&n);for(let s=t.length-n;s<t.length;++s)this.buffer[this.position++]=~(255&t[s])}rn(){this.sn(Et),this.sn(255)}_n(){this.an(Et),this.an(255)}reset(){this.position=0}seed(e){this.tn(e.length),this.buffer.set(e,this.position),this.position+=e.length}un(){return this.buffer.slice(0,this.position)}en(e){const t=(function(i){const o=new DataView(new ArrayBuffer(8));return o.setFloat64(0,i,!1),new Uint8Array(o.buffer)})(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let s=1;s<t.length;++s)t[s]^=n?255:0;return t}Gt(e){const t=255&e;t===0?(this.sn(0),this.sn(255)):t===Et?(this.sn(Et),this.sn(0)):this.sn(t)}Jt(e){const t=255&e;t===0?(this.an(0),this.an(255)):t===Et?(this.an(Et),this.an(0)):this.an(e)}zt(){this.sn(0),this.sn(1)}Ht(){this.an(0),this.an(1)}sn(e){this.tn(1),this.buffer[this.position++]=e}an(e){this.tn(1),this.buffer[this.position++]=~e}tn(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const s=new Uint8Array(n);s.set(this.buffer),this.buffer=s}}class Ch{constructor(e){this.cn=e}Bt(e){this.cn.Wt(e)}xt(e){this.cn.Yt(e)}Mt(e){this.cn.Xt(e)}vt(){this.cn.rn()}}class Dh{constructor(e){this.cn=e}Bt(e){this.cn.jt(e)}xt(e){this.cn.Zt(e)}Mt(e){this.cn.nn(e)}vt(){this.cn._n()}}class rn{constructor(){this.cn=new bh,this.ln=new Ch(this.cn),this.hn=new Dh(this.cn)}seed(e){this.cn.seed(e)}Pn(e){return e===0?this.ln:this.hn}un(){return this.cn.un()}reset(){this.cn.reset()}}/**
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
 */class nt{constructor(e,t,n,s){this.Tn=e,this.In=t,this.En=n,this.dn=s}An(){const e=this.dn.length,t=e===0||this.dn[e-1]===255?e+1:e,n=new Uint8Array(t);return n.set(this.dn,0),t!==e?n.set([0],this.dn.length):++n[n.length-1],new nt(this.Tn,this.In,this.En,n)}Rn(e,t,n){return{indexId:this.Tn,uid:e,arrayValue:cr(this.En),directionalValue:cr(this.dn),orderedDocumentKey:cr(t),documentKey:n.path.toArray()}}Vn(e,t,n){const s=this.Rn(e,t,n);return[s.indexId,s.uid,s.arrayValue,s.directionalValue,s.orderedDocumentKey,s.documentKey]}}function Ne(r,e){let t=r.Tn-e.Tn;return t!==0?t:(t=No(r.En,e.En),t!==0?t:(t=No(r.dn,e.dn),t!==0?t:y.comparator(r.In,e.In)))}function No(r,e){for(let t=0;t<r.length&&t<e.length;++t){const n=r[t]-e[t];if(n!==0)return n}return r.length-e.length}function cr(r){return pa()?(function(t){let n="";for(let s=0;s<t.length;s++)n+=String.fromCharCode(t[s]);return n})(r):r}function ko(r){return typeof r!="string"?r:(function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n})(r)}class Mo{constructor(e){this.mn=new F(((t,n)=>q.comparator(t.field,n.field))),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.fn=e.orderBy,this.gn=[];for(const t of e.filters){const n=t;n.isInequality()?this.mn=this.mn.add(n):this.gn.push(n)}}get pn(){return this.mn.size>1}yn(e){if(v(e.collectionGroup===this.collectionId,49279),this.pn)return!1;const t=ms(e);if(t!==void 0&&!this.wn(t))return!1;const n=Ye(e);let s=new Set,i=0,o=0;for(;i<n.length&&this.wn(n[i]);++i)s=s.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.mn.size>0){const a=this.mn.getIterator().getNext();if(!s.has(a.field.canonicalString())){const u=n[i];if(!this.Sn(a,u)||!this.bn(this.fn[o++],u))return!1}++i}for(;i<n.length;++i){const a=n[i];if(o>=this.fn.length||!this.bn(this.fn[o++],a))return!1}return!0}Dn(){if(this.pn)return null;let e=new F(q.comparator);const t=[];for(const n of this.gn)if(!n.field.isKeyField())if(n.op==="array-contains"||n.op==="array-contains-any")t.push(new tr(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new tr(n.field,0))}for(const n of this.fn)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new tr(n.field,n.dir==="asc"?0:1)));return new fr(fr.UNKNOWN_ID,this.collectionId,t,En.empty())}wn(e){for(const t of this.gn)if(this.Sn(t,e))return!0;return!1}Sn(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;const n=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===n}bn(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}}/**
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
 */function ku(r){if(v(r instanceof b||r instanceof M,20012),r instanceof b){if(r instanceof eu){const t=r.value.arrayValue?.values?.map((n=>b.create(r.field,"==",n)))||[];return M.create(t,"or")}return r}const e=r.filters.map((t=>ku(t)));return M.create(e,r.op)}function xh(r){if(r.getFilters().length===0)return[];const e=Ds(ku(r));return v(Mu(e),7391),bs(e)||Cs(e)?[e]:e.getFilters()}function bs(r){return r instanceof b}function Cs(r){return r instanceof M&&Js(r)}function Mu(r){return bs(r)||Cs(r)||(function(t){if(t instanceof M&&Es(t)){for(const n of t.getFilters())if(!bs(n)&&!Cs(n))return!1;return!0}return!1})(r)}function Ds(r){if(v(r instanceof b||r instanceof M,34018),r instanceof b)return r;if(r.filters.length===1)return Ds(r.filters[0]);const e=r.filters.map((n=>Ds(n)));let t=M.create(e,r.op);return t=vr(t),Mu(t)?t:(v(t instanceof M,64498),v(Ut(t),40251),v(t.filters.length>1,57927),t.filters.reduce(((n,s)=>oi(n,s))))}function oi(r,e){let t;return v(r instanceof b||r instanceof M,38388),v(e instanceof b||e instanceof M,25473),t=r instanceof b?e instanceof b?(function(s,i){return M.create([s,i],"and")})(r,e):Fo(r,e):e instanceof b?Fo(e,r):(function(s,i){if(v(s.filters.length>0&&i.filters.length>0,48005),Ut(s)&&Ut(i))return Ya(s,i.getFilters());const o=Es(s)?s:i,a=Es(s)?i:s,u=o.filters.map((c=>oi(c,a)));return M.create(u,"or")})(r,e),vr(t)}function Fo(r,e){if(Ut(e))return Ya(e,r.getFilters());{const t=e.filters.map((n=>oi(r,n)));return M.create(t,"or")}}function vr(r){if(v(r instanceof b||r instanceof M,11850),r instanceof b)return r;const e=r.getFilters();if(e.length===1)return vr(e[0]);if(Ha(r))return r;const t=e.map((s=>vr(s))),n=[];return t.forEach((s=>{s instanceof b?n.push(s):s instanceof M&&(s.op===r.op?n.push(...s.filters):n.push(s))})),n.length===1?n[0]:M.create(n,r.op)}/**
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
 */class Nh{constructor(){this.Cn=new ai}addToCollectionParentIndex(e,t){return this.Cn.add(t),d.resolve()}getCollectionParents(e,t){return d.resolve(this.Cn.getEntries(t))}addFieldIndex(e,t){return d.resolve()}deleteFieldIndex(e,t){return d.resolve()}deleteAllFieldIndexes(e){return d.resolve()}createTargetIndexes(e,t){return d.resolve()}getDocumentsMatchingTarget(e,t){return d.resolve(null)}getIndexType(e,t){return d.resolve(0)}getFieldIndexes(e,t){return d.resolve([])}getNextCollectionGroupToUpdate(e){return d.resolve(null)}getMinOffset(e,t){return d.resolve(fe.min())}getMinOffsetFromCollectionGroup(e,t){return d.resolve(fe.min())}updateCollectionGroup(e,t,n){return d.resolve()}updateIndexEntries(e,t){return d.resolve()}}class ai{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t]||new F(x.comparator),i=!s.has(n);return this.index[t]=s.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t];return s&&s.has(n)}getEntries(e){return(this.index[e]||new F(x.comparator)).toArray()}}/**
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
 */const Oo="IndexedDbIndexManager",Yn=new Uint8Array(0);class kh{constructor(e,t){this.databaseId=t,this.vn=new ai,this.Fn=new De((n=>ft(n)),((n,s)=>kn(n,s))),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.vn.has(t)){const n=t.lastSegment(),s=t.popLast();e.addOnCommittedListener((()=>{this.vn.add(t)}));const i={collectionId:n,parent:re(s)};return Lo(e).put(i)}return d.resolve()}getCollectionParents(e,t){const n=[],s=IDBKeyRange.bound([t,""],[Ia(t),""],!1,!0);return Lo(e).J(s).next((i=>{for(const o of i){if(o.collectionId!==t)break;n.push(Ie(o.parent))}return n}))}addFieldIndex(e,t){const n=sn(e),s=(function(a){return{indexId:a.indexId,collectionGroup:a.collectionGroup,fields:a.fields.map((u=>[u.fieldPath.canonicalString(),u.kind]))}})(t);delete s.indexId;const i=n.add(s);if(t.indexState){const o=wt(e);return i.next((a=>{o.put(bo(a,this.uid,t.indexState.sequenceNumber,t.indexState.offset))}))}return i.next()}deleteFieldIndex(e,t){const n=sn(e),s=wt(e),i=At(e);return n.delete(t.indexId).next((()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))).next((()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))))}deleteAllFieldIndexes(e){const t=sn(e),n=At(e),s=wt(e);return t.Z().next((()=>n.Z())).next((()=>s.Z()))}createTargetIndexes(e,t){return d.forEach(this.Mn(t),(n=>this.getIndexType(e,n).next((s=>{if(s===0||s===1){const i=new Mo(n).Dn();if(i!=null)return this.addFieldIndex(e,i)}}))))}getDocumentsMatchingTarget(e,t){const n=At(e);let s=!0;const i=new Map;return d.forEach(this.Mn(t),(o=>this.xn(e,o).next((a=>{s&&(s=!!a),i.set(o,a)})))).next((()=>{if(s){let o=S();const a=[];return d.forEach(i,((u,c)=>{g(Oo,`Using index ${(function(P){return`id=${P.indexId}|cg=${P.collectionGroup}|f=${P.fields.map((W=>`${W.fieldPath}:${W.kind}`)).join(",")}`})(u)} to execute ${ft(t)}`);const l=(function(P,W){const U=ms(W);if(U===void 0)return null;for(const G of Ir(P,U.fieldPath))switch(G.op){case"array-contains-any":return G.value.arrayValue.values||[];case"array-contains":return[G.value]}return null})(c,u),h=(function(P,W){const U=new Map;for(const G of Ye(W))for(const oe of Ir(P,G.fieldPath))switch(oe.op){case"==":case"in":U.set(G.fieldPath.canonicalString(),oe.value);break;case"not-in":case"!=":return U.set(G.fieldPath.canonicalString(),oe.value),Array.from(U.values())}return null})(c,u),f=(function(P,W){const U=[];let G=!0;for(const oe of Ye(W)){const He=oe.kind===0?_o(P,oe.fieldPath,P.startAt):go(P,oe.fieldPath,P.startAt);U.push(He.value),G&&(G=He.inclusive)}return new ze(U,G)})(c,u),_=(function(P,W){const U=[];let G=!0;for(const oe of Ye(W)){const He=oe.kind===0?go(P,oe.fieldPath,P.endAt):_o(P,oe.fieldPath,P.endAt);U.push(He.value),G&&(G=He.inclusive)}return new ze(U,G)})(c,u),I=this.On(u,c,f),A=this.On(u,c,_),T=this.Nn(u,c,h),N=this.Bn(u.indexId,l,I,f.inclusive,A,_.inclusive,T);return d.forEach(N,(C=>n.Y(C,t.limit).next((P=>{P.forEach((W=>{const U=y.fromSegments(W.documentKey);o.has(U)||(o=o.add(U),a.push(U))}))}))))})).next((()=>a))}return d.resolve(null)}))}Mn(e){let t=this.Fn.get(e);return t||(e.filters.length===0?t=[e]:t=xh(M.create(e.filters,"and")).map((n=>ws(e.path,e.collectionGroup,e.orderBy,n.getFilters(),e.limit,e.startAt,e.endAt))),this.Fn.set(e,t),t)}Bn(e,t,n,s,i,o,a){const u=(t!=null?t.length:1)*Math.max(n.length,i.length),c=u/(t!=null?t.length:1),l=[];for(let h=0;h<u;++h){const f=t?this.Ln(t[h/c]):Yn,_=this.kn(e,f,n[h%c],s),I=this.qn(e,f,i[h%c],o),A=a.map((T=>this.kn(e,f,T,!0)));l.push(...this.createRange(_,I,A))}return l}kn(e,t,n,s){const i=new nt(e,y.empty(),t,n);return s?i:i.An()}qn(e,t,n,s){const i=new nt(e,y.empty(),t,n);return s?i.An():i}xn(e,t){const n=new Mo(t),s=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,s).next((i=>{let o=null;for(const a of i)n.yn(a)&&(!o||a.fields.length>o.fields.length)&&(o=a);return o}))}getIndexType(e,t){let n=2;const s=this.Mn(t);return d.forEach(s,(i=>this.xn(e,i).next((o=>{o?n!==0&&o.fields.length<(function(u){let c=new F(q.comparator),l=!1;for(const h of u.filters)for(const f of h.getFlattenedFilters())f.field.isKeyField()||(f.op==="array-contains"||f.op==="array-contains-any"?l=!0:c=c.add(f.field));for(const h of u.orderBy)h.field.isKeyField()||(c=c.add(h.field));return c.size+(l?1:0)})(i)&&(n=1):n=0})))).next((()=>(function(o){return o.limit!==null})(t)&&s.length>1&&n===2?1:n))}Qn(e,t){const n=new rn;for(const s of Ye(e)){const i=t.data.field(s.fieldPath);if(i==null)return null;const o=n.Pn(s.kind);tt.Kt.Dt(i,o)}return n.un()}Ln(e){const t=new rn;return tt.Kt.Dt(e,t.Pn(0)),t.un()}$n(e,t){const n=new rn;return tt.Kt.Dt(dt(this.databaseId,t),n.Pn((function(i){const o=Ye(i);return o.length===0?0:o[o.length-1].kind})(e))),n.un()}Nn(e,t,n){if(n===null)return[];let s=[];s.push(new rn);let i=0;for(const o of Ye(e)){const a=n[i++];for(const u of s)if(this.Un(t,o.fieldPath)&&Sn(a))s=this.Kn(s,o,a);else{const c=u.Pn(o.kind);tt.Kt.Dt(a,c)}}return this.Wn(s)}On(e,t,n){return this.Nn(e,t,n.position)}Wn(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].un();return t}Kn(e,t,n){const s=[...e],i=[];for(const o of n.arrayValue.values||[])for(const a of s){const u=new rn;u.seed(a.un()),tt.Kt.Dt(o,u.Pn(t.kind)),i.push(u)}return i}Un(e,t){return!!e.filters.find((n=>n instanceof b&&n.field.isEqual(t)&&(n.op==="in"||n.op==="not-in")))}getFieldIndexes(e,t){const n=sn(e),s=wt(e);return(t?n.J(gs,IDBKeyRange.bound(t,t)):n.J()).next((i=>{const o=[];return d.forEach(i,(a=>s.get([a.indexId,this.uid]).next((u=>{o.push((function(l,h){const f=h?new En(h.sequenceNumber,new fe(_t(h.readTime),new y(Ie(h.documentKey)),h.largestBatchId)):En.empty(),_=l.fields.map((([I,A])=>new tr(q.fromServerFormat(I),A)));return new fr(l.indexId,l.collectionGroup,_,f)})(a,u))})))).next((()=>o))}))}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next((t=>t.length===0?null:(t.sort(((n,s)=>{const i=n.indexState.sequenceNumber-s.indexState.sequenceNumber;return i!==0?i:V(n.collectionGroup,s.collectionGroup)})),t[0].collectionGroup)))}updateCollectionGroup(e,t,n){const s=sn(e),i=wt(e);return this.Gn(e).next((o=>s.J(gs,IDBKeyRange.bound(t,t)).next((a=>d.forEach(a,(u=>i.put(bo(u.indexId,this.uid,o,n))))))))}updateIndexEntries(e,t){const n=new Map;return d.forEach(t,((s,i)=>{const o=n.get(s.collectionGroup);return(o?d.resolve(o):this.getFieldIndexes(e,s.collectionGroup)).next((a=>(n.set(s.collectionGroup,a),d.forEach(a,(u=>this.zn(e,s,u).next((c=>{const l=this.jn(i,u);return c.isEqual(l)?d.resolve():this.Jn(e,i,u,c,l)})))))))}))}Hn(e,t,n,s){return At(e).put(s.Rn(this.uid,this.$n(n,t.key),t.key))}Yn(e,t,n,s){return At(e).delete(s.Vn(this.uid,this.$n(n,t.key),t.key))}zn(e,t,n){const s=At(e);let i=new F(Ne);return s.ee({index:xa,range:IDBKeyRange.only([n.indexId,this.uid,cr(this.$n(n,t))])},((o,a)=>{i=i.add(new nt(n.indexId,t,ko(a.arrayValue),ko(a.directionalValue)))})).next((()=>i))}jn(e,t){let n=new F(Ne);const s=this.Qn(t,e);if(s==null)return n;const i=ms(t);if(i!=null){const o=e.data.field(i.fieldPath);if(Sn(o))for(const a of o.arrayValue.values||[])n=n.add(new nt(t.indexId,e.key,this.Ln(a),s))}else n=n.add(new nt(t.indexId,e.key,Yn,s));return n}Jn(e,t,n,s,i){g(Oo,"Updating index entries for document '%s'",t.key);const o=[];return(function(u,c,l,h,f){const _=u.getIterator(),I=c.getIterator();let A=Tt(_),T=Tt(I);for(;A||T;){let N=!1,C=!1;if(A&&T){const P=l(A,T);P<0?C=!0:P>0&&(N=!0)}else A!=null?C=!0:N=!0;N?(h(T),T=Tt(I)):C?(f(A),A=Tt(_)):(A=Tt(_),T=Tt(I))}})(s,i,Ne,(a=>{o.push(this.Hn(e,t,n,a))}),(a=>{o.push(this.Yn(e,t,n,a))})),d.waitFor(o)}Gn(e){let t=1;return wt(e).ee({index:Da,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},((n,s,i)=>{i.done(),t=s.sequenceNumber+1})).next((()=>t))}createRange(e,t,n){n=n.sort(((o,a)=>Ne(o,a))).filter(((o,a,u)=>!a||Ne(o,u[a-1])!==0));const s=[];s.push(e);for(const o of n){const a=Ne(o,e),u=Ne(o,t);if(a===0)s[0]=e.An();else if(a>0&&u<0)s.push(o),s.push(o.An());else if(u>0)break}s.push(t);const i=[];for(let o=0;o<s.length;o+=2){if(this.Zn(s[o],s[o+1]))return[];const a=s[o].Vn(this.uid,Yn,y.empty()),u=s[o+1].Vn(this.uid,Yn,y.empty());i.push(IDBKeyRange.bound(a,u))}return i}Zn(e,t){return Ne(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(qo)}getMinOffset(e,t){return d.mapArray(this.Mn(t),(n=>this.xn(e,n).next((s=>s||E(44426))))).next(qo)}}function Lo(r){return J(r,Rn)}function At(r){return J(r,_n)}function sn(r){return J(r,$s)}function wt(r){return J(r,mn)}function qo(r){v(r.length!==0,28825);let e=r[0].indexState.offset,t=e.largestBatchId;for(let n=1;n<r.length;n++){const s=r[n].indexState.offset;zs(s,e)<0&&(e=s),t<s.largestBatchId&&(t=s.largestBatchId)}return new fe(e.readTime,e.documentKey,t)}/**
 * @license
 * Copyright 2018 Google LLC
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
 */const Uo={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Fu=41943040;class te{static withCacheSize(e){return new te(e,te.DEFAULT_COLLECTION_PERCENTILE,te.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}/**
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
 */function Ou(r,e,t){const n=r.store(ge),s=r.store(kt),i=[],o=IDBKeyRange.only(t.batchId);let a=0;const u=n.ee({range:o},((l,h,f)=>(a++,f.delete())));i.push(u.next((()=>{v(a===1,47070,{batchId:t.batchId})})));const c=[];for(const l of t.mutations){const h=Sa(e,l.key.path,t.batchId);i.push(s.delete(h)),c.push(l.key)}return d.waitFor(i).next((()=>c))}function Rr(r){if(!r)return 0;let e;if(r.document)e=r.document;else if(r.unknownDocument)e=r.unknownDocument;else{if(!r.noDocument)throw E(14731);e=r.noDocument}return JSON.stringify(e).length}/**
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
 */te.DEFAULT_COLLECTION_PERCENTILE=10,te.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,te.DEFAULT=new te(Fu,te.DEFAULT_COLLECTION_PERCENTILE,te.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),te.DISABLED=new te(-1,0,0);class jr{constructor(e,t,n,s){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=s,this.Xn={}}static wt(e,t,n,s){v(e.uid!=="",64387);const i=e.isAuthenticated()?e.uid:"";return new jr(i,t,n,s)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return ke(e).ee({index:rt,range:n},((s,i,o)=>{t=!1,o.done()})).next((()=>t))}addMutationBatch(e,t,n,s){const i=bt(e),o=ke(e);return o.add({}).next((a=>{v(typeof a=="number",49019);const u=new ti(a,t,n,s),c=(function(_,I,A){const T=A.baseMutations.map((C=>Ar(_.yt,C))),N=A.mutations.map((C=>Ar(_.yt,C)));return{userId:I,batchId:A.batchId,localWriteTimeMs:A.localWriteTime.toMillis(),baseMutations:T,mutations:N}})(this.serializer,this.userId,u),l=[];let h=new F(((f,_)=>V(f.canonicalString(),_.canonicalString())));for(const f of s){const _=Sa(this.userId,f.key.path,a);h=h.add(f.key.path.popLast()),l.push(o.put(c)),l.push(i.put(_,fl))}return h.forEach((f=>{l.push(this.indexManager.addToCollectionParentIndex(e,f))})),e.addOnCommittedListener((()=>{this.Xn[a]=u.keys()})),d.waitFor(l).next((()=>u))}))}lookupMutationBatch(e,t){return ke(e).get(t).next((n=>n?(v(n.userId===this.userId,48,"Unexpected user for mutation batch",{userId:n.userId,batchId:t}),et(this.serializer,n)):null))}er(e,t){return this.Xn[t]?d.resolve(this.Xn[t]):this.lookupMutationBatch(e,t).next((n=>{if(n){const s=n.keys();return this.Xn[t]=s,s}return null}))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=IDBKeyRange.lowerBound([this.userId,n]);let i=null;return ke(e).ee({index:rt,range:s},((o,a,u)=>{a.userId===this.userId&&(v(a.batchId>=n,47524,{tr:n}),i=et(this.serializer,a)),u.done()})).next((()=>i))}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=it;return ke(e).ee({index:rt,range:t,reverse:!0},((s,i,o)=>{n=i.batchId,o.done()})).next((()=>n))}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,it],[this.userId,Number.POSITIVE_INFINITY]);return ke(e).J(rt,t).next((n=>n.map((s=>et(this.serializer,s)))))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=nr(this.userId,t.path),s=IDBKeyRange.lowerBound(n),i=[];return bt(e).ee({range:s},((o,a,u)=>{const[c,l,h]=o,f=Ie(l);if(c===this.userId&&t.path.isEqual(f))return ke(e).get(h).next((_=>{if(!_)throw E(61480,{nr:o,batchId:h});v(_.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:_.userId,batchId:h}),i.push(et(this.serializer,_))}));u.done()})).next((()=>i))}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new F(V);const s=[];return t.forEach((i=>{const o=nr(this.userId,i.path),a=IDBKeyRange.lowerBound(o),u=bt(e).ee({range:a},((c,l,h)=>{const[f,_,I]=c,A=Ie(_);f===this.userId&&i.path.isEqual(A)?n=n.add(I):h.done()}));s.push(u)})),d.waitFor(s).next((()=>this.rr(e,n)))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1,i=nr(this.userId,n),o=IDBKeyRange.lowerBound(i);let a=new F(V);return bt(e).ee({range:o},((u,c,l)=>{const[h,f,_]=u,I=Ie(f);h===this.userId&&n.isPrefixOf(I)?I.length===s&&(a=a.add(_)):l.done()})).next((()=>this.rr(e,a)))}rr(e,t){const n=[],s=[];return t.forEach((i=>{s.push(ke(e).get(i).next((o=>{if(o===null)throw E(35274,{batchId:i});v(o.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:o.userId,batchId:i}),n.push(et(this.serializer,o))})))})),d.waitFor(s).next((()=>n))}removeMutationBatch(e,t){return Ou(e.le,this.userId,t).next((n=>(e.addOnCommittedListener((()=>{this.ir(t.batchId)})),d.forEach(n,(s=>this.referenceDelegate.markPotentiallyOrphaned(e,s))))))}ir(e){delete this.Xn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next((t=>{if(!t)return d.resolve();const n=IDBKeyRange.lowerBound((function(o){return[o]})(this.userId)),s=[];return bt(e).ee({range:n},((i,o,a)=>{if(i[0]===this.userId){const u=Ie(i[1]);s.push(u)}else a.done()})).next((()=>{v(s.length===0,56720,{sr:s.map((i=>i.canonicalString()))})}))}))}containsKey(e,t){return Lu(e,this.userId,t)}_r(e){return qu(e).get(this.userId).next((t=>t||{userId:this.userId,lastAcknowledgedBatchId:it,lastStreamToken:""}))}}function Lu(r,e,t){const n=nr(e,t.path),s=n[1],i=IDBKeyRange.lowerBound(n);let o=!1;return bt(r).ee({range:i,X:!0},((a,u,c)=>{const[l,h,f]=a;l===e&&h===s&&(o=!0),c.done()})).next((()=>o))}function ke(r){return J(r,ge)}function bt(r){return J(r,kt)}function qu(r){return J(r,wn)}/**
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
 */class gt{constructor(e){this.ar=e}next(){return this.ar+=2,this.ar}static ur(){return new gt(0)}static cr(){return new gt(-1)}}/**
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
 */class Mh{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.lr(e).next((t=>{const n=new gt(t.highestTargetId);return t.highestTargetId=n.next(),this.hr(e,t).next((()=>t.highestTargetId))}))}getLastRemoteSnapshotVersion(e){return this.lr(e).next((t=>R.fromTimestamp(new k(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds))))}getHighestSequenceNumber(e){return this.lr(e).next((t=>t.highestListenSequenceNumber))}setTargetsMetadata(e,t,n){return this.lr(e).next((s=>(s.highestListenSequenceNumber=t,n&&(s.lastRemoteSnapshotVersion=n.toTimestamp()),t>s.highestListenSequenceNumber&&(s.highestListenSequenceNumber=t),this.hr(e,s))))}addTargetData(e,t){return this.Pr(e,t).next((()=>this.lr(e).next((n=>(n.targetCount+=1,this.Tr(t,n),this.hr(e,n))))))}updateTargetData(e,t){return this.Pr(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next((()=>vt(e).delete(t.targetId))).next((()=>this.lr(e))).next((n=>(v(n.targetCount>0,8065),n.targetCount-=1,this.hr(e,n))))}removeTargets(e,t,n){let s=0;const i=[];return vt(e).ee(((o,a)=>{const u=ln(a);u.sequenceNumber<=t&&n.get(u.targetId)===null&&(s++,i.push(this.removeTargetData(e,u)))})).next((()=>d.waitFor(i))).next((()=>s))}forEachTarget(e,t){return vt(e).ee(((n,s)=>{const i=ln(s);t(i)}))}lr(e){return Bo(e).get(gr).next((t=>(v(t!==null,2888),t)))}hr(e,t){return Bo(e).put(gr,t)}Pr(e,t){return vt(e).put(xu(this.serializer,t))}Tr(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.lr(e).next((t=>t.targetCount))}getTargetData(e,t){const n=ft(t),s=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let i=null;return vt(e).ee({range:s,index:Ca},((o,a,u)=>{const c=ln(a);kn(t,c.target)&&(i=c,u.done())})).next((()=>i))}addMatchingKeys(e,t,n){const s=[],i=Fe(e);return t.forEach((o=>{const a=re(o.path);s.push(i.put({targetId:n,path:a})),s.push(this.referenceDelegate.addReference(e,n,o))})),d.waitFor(s)}removeMatchingKeys(e,t,n){const s=Fe(e);return d.forEach(t,(i=>{const o=re(i.path);return d.waitFor([s.delete([n,o]),this.referenceDelegate.removeReference(e,n,i)])}))}removeMatchingKeysForTargetId(e,t){const n=Fe(e),s=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(s)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),s=Fe(e);let i=S();return s.ee({range:n,X:!0},((o,a,u)=>{const c=Ie(o[1]),l=new y(c);i=i.add(l)})).next((()=>i))}containsKey(e,t){const n=re(t.path),s=IDBKeyRange.bound([n],[Ia(n)],!1,!0);let i=0;return Fe(e).ee({index:Ks,X:!0,range:s},(([o,a],u,c)=>{o!==0&&(i++,c.done())})).next((()=>i>0))}At(e,t){return vt(e).get(t).next((n=>n?ln(n):null))}}function vt(r){return J(r,Mt)}function Bo(r){return J(r,ot)}function Fe(r){return J(r,Ft)}/**
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
 */const zo="LruGarbageCollector",Uu=1048576;function Go([r,e],[t,n]){const s=V(r,t);return s===0?V(e,n):s}class Fh{constructor(e){this.Ir=e,this.buffer=new F(Go),this.Er=0}dr(){return++this.Er}Ar(e){const t=[e,this.dr()];if(this.buffer.size<this.Ir)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();Go(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class Bu{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Vr(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Vr(e){g(zo,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){je(t)?g(zo,"Ignoring IndexedDB error during garbage collection: ",t):await $e(t)}await this.Vr(3e5)}))}}class Oh{constructor(e,t){this.mr=e,this.params=t}calculateTargetCount(e,t){return this.mr.gr(e).next((n=>Math.floor(t/100*n)))}nthSequenceNumber(e,t){if(t===0)return d.resolve(ae.ce);const n=new Fh(t);return this.mr.forEachTarget(e,(s=>n.Ar(s.sequenceNumber))).next((()=>this.mr.pr(e,(s=>n.Ar(s))))).next((()=>n.maxValue))}removeTargets(e,t,n){return this.mr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.mr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(g("LruGarbageCollector","Garbage collection skipped; disabled"),d.resolve(Uo)):this.getCacheSize(e).next((n=>n<this.params.cacheSizeCollectionThreshold?(g("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Uo):this.yr(e,t)))}getCacheSize(e){return this.mr.getCacheSize(e)}yr(e,t){let n,s,i,o,a,u,c;const l=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((h=>(h>this.params.maximumSequenceNumbersToCollect?(g("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${h}`),s=this.params.maximumSequenceNumbersToCollect):s=h,o=Date.now(),this.nthSequenceNumber(e,s)))).next((h=>(n=h,a=Date.now(),this.removeTargets(e,n,t)))).next((h=>(i=h,u=Date.now(),this.removeOrphanedDocuments(e,n)))).next((h=>(c=Date.now(),Rt()<=Ve.DEBUG&&g("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-l}ms
	Determined least recently used ${s} in `+(a-o)+`ms
	Removed ${i} targets in `+(u-a)+`ms
	Removed ${h} documents in `+(c-u)+`ms
Total Duration: ${c-l}ms`),d.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:h}))))}}function zu(r,e){return new Oh(r,e)}/**
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
 */class Lh{constructor(e,t){this.db=e,this.garbageCollector=zu(this,t)}gr(e){const t=this.wr(e);return this.db.getTargetCache().getTargetCount(e).next((n=>t.next((s=>n+s))))}wr(e){let t=0;return this.pr(e,(n=>{t++})).next((()=>t))}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}pr(e,t){return this.Sr(e,((n,s)=>t(s)))}addReference(e,t,n){return Xn(e,n)}removeReference(e,t,n){return Xn(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return Xn(e,t)}br(e,t){return(function(s,i){let o=!1;return qu(s).te((a=>Lu(s,a,i).next((u=>(u&&(o=!0),d.resolve(!u)))))).next((()=>o))})(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),s=[];let i=0;return this.Sr(e,((o,a)=>{if(a<=t){const u=this.br(e,o).next((c=>{if(!c)return i++,n.getEntry(e,o).next((()=>(n.removeEntry(o,R.min()),Fe(e).delete((function(h){return[0,re(h.path)]})(o)))))}));s.push(u)}})).next((()=>d.waitFor(s))).next((()=>n.apply(e))).next((()=>i))}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return Xn(e,t)}Sr(e,t){const n=Fe(e);let s,i=ae.ce;return n.ee({index:Ks},(([o,a],{path:u,sequenceNumber:c})=>{o===0?(i!==ae.ce&&t(new y(Ie(s)),i),i=c,s=u):i=ae.ce})).next((()=>{i!==ae.ce&&t(new y(Ie(s)),i)}))}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function Xn(r,e){return Fe(r).put((function(n,s){return{targetId:0,path:re(n.path),sequenceNumber:s}})(e,r.currentSequenceNumber))}/**
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
 */class Gu{constructor(){this.changes=new De((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,B.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?d.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class qh{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return Je(e).put(n)}removeEntry(e,t,n){return Je(e).delete((function(i,o){const a=i.path.toArray();return[a.slice(0,a.length-2),a[a.length-2],wr(o),a[a.length-1]]})(t,n))}updateMetadata(e,t){return this.getMetadata(e).next((n=>(n.byteSize+=t,this.Dr(e,n))))}getEntry(e,t){let n=B.newInvalidDocument(t);return Je(e).ee({index:rr,range:IDBKeyRange.only(on(t))},((s,i)=>{n=this.Cr(t,i)})).next((()=>n))}vr(e,t){let n={size:0,document:B.newInvalidDocument(t)};return Je(e).ee({index:rr,range:IDBKeyRange.only(on(t))},((s,i)=>{n={document:this.Cr(t,i),size:Rr(i)}})).next((()=>n))}getEntries(e,t){let n=le();return this.Fr(e,t,((s,i)=>{const o=this.Cr(s,i);n=n.insert(s,o)})).next((()=>n))}Mr(e,t){let n=le(),s=new O(y.comparator);return this.Fr(e,t,((i,o)=>{const a=this.Cr(i,o);n=n.insert(i,a),s=s.insert(i,Rr(o))})).next((()=>({documents:n,Or:s})))}Fr(e,t,n){if(t.isEmpty())return d.resolve();let s=new F(jo);t.forEach((u=>s=s.add(u)));const i=IDBKeyRange.bound(on(s.first()),on(s.last())),o=s.getIterator();let a=o.getNext();return Je(e).ee({index:rr,range:i},((u,c,l)=>{const h=y.fromSegments([...c.prefixPath,c.collectionGroup,c.documentId]);for(;a&&jo(a,h)<0;)n(a,null),a=o.getNext();a&&a.isEqual(h)&&(n(a,c),a=o.hasNext()?o.getNext():null),a?l.j(on(a)):l.done()})).next((()=>{for(;a;)n(a,null),a=o.hasNext()?o.getNext():null}))}getDocumentsMatchingQuery(e,t,n,s,i){const o=t.path,a=[o.popLast().toArray(),o.lastSegment(),wr(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],u=[o.popLast().toArray(),o.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return Je(e).J(IDBKeyRange.bound(a,u,!0)).next((c=>{i?.incrementDocumentReadCount(c.length);let l=le();for(const h of c){const f=this.Cr(y.fromSegments(h.prefixPath.concat(h.collectionGroup,h.documentId)),h);f.isFoundDocument()&&(Fn(t,f)||s.has(f.key))&&(l=l.insert(f.key,f))}return l}))}getAllFromCollectionGroup(e,t,n,s){let i=le();const o=$o(t,n),a=$o(t,fe.max());return Je(e).ee({index:ba,range:IDBKeyRange.bound(o,a,!0)},((u,c,l)=>{const h=this.Cr(y.fromSegments(c.prefixPath.concat(c.collectionGroup,c.documentId)),c);i=i.insert(h.key,h),i.size===s&&l.done()})).next((()=>i))}newChangeBuffer(e){return new Uh(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next((t=>t.byteSize))}getMetadata(e){return Ko(e).get(_s).next((t=>(v(!!t,20021),t)))}Dr(e,t){return Ko(e).put(_s,t)}Cr(e,t){if(t){const n=Rh(this.serializer,t);if(!(n.isNoDocument()&&n.version.isEqual(R.min())))return n}return B.newInvalidDocument(e)}}function Ku(r){return new qh(r)}class Uh extends Gu{constructor(e,t){super(),this.Nr=e,this.trackRemovals=t,this.Br=new De((n=>n.toString()),((n,s)=>n.isEqual(s)))}applyChanges(e){const t=[];let n=0,s=new F(((i,o)=>V(i.canonicalString(),o.canonicalString())));return this.changes.forEach(((i,o)=>{const a=this.Br.get(i);if(t.push(this.Nr.removeEntry(e,i,a.readTime)),o.isValidDocument()){const u=Po(this.Nr.serializer,o);s=s.add(i.path.popLast());const c=Rr(u);n+=c-a.size,t.push(this.Nr.addEntry(e,i,u))}else if(n-=a.size,this.trackRemovals){const u=Po(this.Nr.serializer,o.convertToNoDocument(R.min()));t.push(this.Nr.addEntry(e,i,u))}})),s.forEach((i=>{t.push(this.Nr.indexManager.addToCollectionParentIndex(e,i))})),t.push(this.Nr.updateMetadata(e,n)),d.waitFor(t)}getFromCache(e,t){return this.Nr.vr(e,t).next((n=>(this.Br.set(t,{size:n.size,readTime:n.document.readTime}),n.document)))}getAllFromCache(e,t){return this.Nr.Mr(e,t).next((({documents:n,Or:s})=>(s.forEach(((i,o)=>{this.Br.set(i,{size:o,readTime:n.get(i).readTime})})),n)))}}function Ko(r){return J(r,vn)}function Je(r){return J(r,_r)}function on(r){const e=r.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function $o(r,e){const t=e.documentKey.path.toArray();return[r,wr(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function jo(r,e){const t=r.path.toArray(),n=e.path.toArray();let s=0;for(let i=0;i<t.length-2&&i<n.length-2;++i)if(s=V(t[i],n[i]),s)return s;return s=V(t.length,n.length),s||(s=V(t[t.length-2],n[n.length-2]),s||V(t[t.length-1],n[n.length-1]))}/**
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
 *//**
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
 */class Bh{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
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
 */class $u{constructor(e,t,n,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=s}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(n=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(n!==null&&yn(n.mutation,s,ue.empty(),k.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.getLocalViewOfDocuments(e,n,S()).next((()=>n))))}getLocalViewOfDocuments(e,t,n=S()){const s=Te();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,n).next((i=>{let o=un();return i.forEach(((a,u)=>{o=o.insert(a,u.overlayedDocument)})),o}))))}getOverlayedDocuments(e,t){const n=Te();return this.populateOverlays(e,n,t).next((()=>this.computeViews(e,t,n,S())))}populateOverlays(e,t,n){const s=[];return n.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((o,a)=>{t.set(o,a)}))}))}computeViews(e,t,n,s){let i=le();const o=pn(),a=(function(){return pn()})();return t.forEach(((u,c)=>{const l=n.get(c.key);s.has(c.key)&&(l===void 0||l.mutation instanceof xe)?i=i.insert(c.key,c):l!==void 0?(o.set(c.key,l.mutation.getFieldMask()),yn(l.mutation,c,l.mutation.getFieldMask(),k.now())):o.set(c.key,ue.empty())})),this.recalculateAndSaveOverlays(e,i).next((u=>(u.forEach(((c,l)=>o.set(c,l))),t.forEach(((c,l)=>a.set(c,new Bh(l,o.get(c)??null)))),a)))}recalculateAndSaveOverlays(e,t){const n=pn();let s=new O(((o,a)=>o-a)),i=S();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((o=>{for(const a of o)a.keys().forEach((u=>{const c=t.get(u);if(c===null)return;let l=n.get(u)||ue.empty();l=a.applyToLocalView(c,l),n.set(u,l);const h=(s.get(a.batchId)||S()).add(u);s=s.insert(a.batchId,h)}))})).next((()=>{const o=[],a=s.getReverseIterator();for(;a.hasNext();){const u=a.getNext(),c=u.key,l=u.value,h=au();l.forEach((f=>{if(!i.has(f)){const _=mu(t.get(f),n.get(f));_!==null&&h.set(f,_),i=i.add(f)}})),o.push(this.documentOverlayCache.saveOverlays(e,c,h))}return d.waitFor(o)})).next((()=>n))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.recalculateAndSaveOverlays(e,n)))}getDocumentsMatchingQuery(e,t,n,s){return(function(o){return y.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0})(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Ys(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,s):this.getDocumentsMatchingCollectionQuery(e,t,n,s)}getNextDocuments(e,t,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,s).next((i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,s-i.size):d.resolve(Te());let a=Nt,u=i;return o.next((c=>d.forEach(c,((l,h)=>(a<h.largestBatchId&&(a=h.largestBatchId),i.get(l)?d.resolve():this.remoteDocumentCache.getEntry(e,l).next((f=>{u=u.insert(l,f)}))))).next((()=>this.populateOverlays(e,c,i))).next((()=>this.computeViews(e,u,c,S()))).next((l=>({batchId:a,changes:ou(l)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new y(t)).next((n=>{let s=un();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,n,s){const i=t.collectionGroup;let o=un();return this.indexManager.getCollectionParents(e,i).next((a=>d.forEach(a,(u=>{const c=(function(h,f){return new Ce(f,null,h.explicitOrderBy.slice(),h.filters.slice(),h.limit,h.limitType,h.startAt,h.endAt)})(t,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,c,n,s).next((l=>{l.forEach(((h,f)=>{o=o.insert(h,f)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(e,t,n,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next((o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s)))).next((o=>{i.forEach(((u,c)=>{const l=c.getKey();o.get(l)===null&&(o=o.insert(l,B.newInvalidDocument(l)))}));let a=un();return o.forEach(((u,c)=>{const l=i.get(u);l!==void 0&&yn(l.mutation,c,ue.empty(),k.now()),Fn(t,c)&&(a=a.insert(u,c))})),a}))}}/**
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
 */class zh{constructor(e){this.serializer=e,this.Lr=new Map,this.kr=new Map}getBundleMetadata(e,t){return d.resolve(this.Lr.get(t))}saveBundleMetadata(e,t){return this.Lr.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:ie(s.createTime)}})(t)),d.resolve()}getNamedQuery(e,t){return d.resolve(this.kr.get(t))}saveNamedQuery(e,t){return this.kr.set(t.name,(function(s){return{name:s.name,query:Nu(s.bundledQuery),readTime:ie(s.readTime)}})(t)),d.resolve()}}/**
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
 */class Gh{constructor(){this.overlays=new O(y.comparator),this.qr=new Map}getOverlay(e,t){return d.resolve(this.overlays.get(t))}getOverlays(e,t){const n=Te();return d.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}saveOverlays(e,t,n){return n.forEach(((s,i)=>{this.St(e,t,i)})),d.resolve()}removeOverlaysForBatchId(e,t,n){const s=this.qr.get(n);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.qr.delete(n)),d.resolve()}getOverlaysForCollection(e,t,n){const s=Te(),i=t.length+1,o=new y(t.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const u=a.getNext().value,c=u.getKey();if(!t.isPrefixOf(c.path))break;c.path.length===i&&u.largestBatchId>n&&s.set(u.getKey(),u)}return d.resolve(s)}getOverlaysForCollectionGroup(e,t,n,s){let i=new O(((c,l)=>c-l));const o=this.overlays.getIterator();for(;o.hasNext();){const c=o.getNext().value;if(c.getKey().getCollectionGroup()===t&&c.largestBatchId>n){let l=i.get(c.largestBatchId);l===null&&(l=Te(),i=i.insert(c.largestBatchId,l)),l.set(c.getKey(),c)}}const a=Te(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((c,l)=>a.set(c,l))),!(a.size()>=s)););return d.resolve(a)}St(e,t,n){const s=this.overlays.get(n.key);if(s!==null){const o=this.qr.get(s.largestBatchId).delete(n.key);this.qr.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new ri(t,n));let i=this.qr.get(t);i===void 0&&(i=S(),this.qr.set(t,i)),this.qr.set(t,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
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
 */class Kh{constructor(){this.sessionToken=$.EMPTY_BYTE_STRING}getSessionToken(e){return d.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,d.resolve()}}/**
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
 */class ui{constructor(){this.Qr=new F(Y.$r),this.Ur=new F(Y.Kr)}isEmpty(){return this.Qr.isEmpty()}addReference(e,t){const n=new Y(e,t);this.Qr=this.Qr.add(n),this.Ur=this.Ur.add(n)}Wr(e,t){e.forEach((n=>this.addReference(n,t)))}removeReference(e,t){this.Gr(new Y(e,t))}zr(e,t){e.forEach((n=>this.removeReference(n,t)))}jr(e){const t=new y(new x([])),n=new Y(t,e),s=new Y(t,e+1),i=[];return this.Ur.forEachInRange([n,s],(o=>{this.Gr(o),i.push(o.key)})),i}Jr(){this.Qr.forEach((e=>this.Gr(e)))}Gr(e){this.Qr=this.Qr.delete(e),this.Ur=this.Ur.delete(e)}Hr(e){const t=new y(new x([])),n=new Y(t,e),s=new Y(t,e+1);let i=S();return this.Ur.forEachInRange([n,s],(o=>{i=i.add(o.key)})),i}containsKey(e){const t=new Y(e,0),n=this.Qr.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class Y{constructor(e,t){this.key=e,this.Yr=t}static $r(e,t){return y.comparator(e.key,t.key)||V(e.Yr,t.Yr)}static Kr(e,t){return V(e.Yr,t.Yr)||y.comparator(e.key,t.key)}}/**
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
 */class $h{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.tr=1,this.Zr=new F(Y.$r)}checkEmpty(e){return d.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,s){const i=this.tr;this.tr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new ti(i,t,n,s);this.mutationQueue.push(o);for(const a of s)this.Zr=this.Zr.add(new Y(a.key,i)),this.indexManager.addToCollectionParentIndex(e,a.key.path.popLast());return d.resolve(o)}lookupMutationBatch(e,t){return d.resolve(this.Xr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=this.ei(n),i=s<0?0:s;return d.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return d.resolve(this.mutationQueue.length===0?it:this.tr-1)}getAllMutationBatches(e){return d.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new Y(t,0),s=new Y(t,Number.POSITIVE_INFINITY),i=[];return this.Zr.forEachInRange([n,s],(o=>{const a=this.Xr(o.Yr);i.push(a)})),d.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new F(V);return t.forEach((s=>{const i=new Y(s,0),o=new Y(s,Number.POSITIVE_INFINITY);this.Zr.forEachInRange([i,o],(a=>{n=n.add(a.Yr)}))})),d.resolve(this.ti(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1;let i=n;y.isDocumentKey(i)||(i=i.child(""));const o=new Y(new y(i),0);let a=new F(V);return this.Zr.forEachWhile((u=>{const c=u.key.path;return!!n.isPrefixOf(c)&&(c.length===s&&(a=a.add(u.Yr)),!0)}),o),d.resolve(this.ti(a))}ti(e){const t=[];return e.forEach((n=>{const s=this.Xr(n);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){v(this.ni(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.Zr;return d.forEach(t.mutations,(s=>{const i=new Y(s.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.Zr=n}))}ir(e){}containsKey(e,t){const n=new Y(t,0),s=this.Zr.firstAfterOrEqual(n);return d.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,d.resolve()}ni(e,t){return this.ei(e)}ei(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Xr(e){const t=this.ei(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class jh{constructor(e){this.ri=e,this.docs=(function(){return new O(y.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,s=this.docs.get(n),i=s?s.size:0,o=this.ri(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return d.resolve(n?n.document.mutableCopy():B.newInvalidDocument(t))}getEntries(e,t){let n=le();return t.forEach((s=>{const i=this.docs.get(s);n=n.insert(s,i?i.document.mutableCopy():B.newInvalidDocument(s))})),d.resolve(n)}getDocumentsMatchingQuery(e,t,n,s){let i=le();const o=t.path,a=new y(o.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(a);for(;u.hasNext();){const{key:c,value:{document:l}}=u.getNext();if(!o.isPrefixOf(c.path))break;c.path.length>o.length+1||zs(wa(l),n)<=0||(s.has(l.key)||Fn(t,l))&&(i=i.insert(l.key,l.mutableCopy()))}return d.resolve(i)}getAllFromCollectionGroup(e,t,n,s){E(9500)}ii(e,t){return d.forEach(this.docs,(n=>t(n)))}newChangeBuffer(e){return new Qh(this)}getSize(e){return d.resolve(this.size)}}class Qh extends Gu{constructor(e){super(),this.Nr=e}applyChanges(e){const t=[];return this.changes.forEach(((n,s)=>{s.isValidDocument()?t.push(this.Nr.addEntry(e,s)):this.Nr.removeEntry(n)})),d.waitFor(t)}getFromCache(e,t){return this.Nr.getEntry(e,t)}getAllFromCache(e,t){return this.Nr.getEntries(e,t)}}/**
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
 */class Wh{constructor(e){this.persistence=e,this.si=new De((t=>ft(t)),kn),this.lastRemoteSnapshotVersion=R.min(),this.highestTargetId=0,this.oi=0,this._i=new ui,this.targetCount=0,this.ai=gt.ur()}forEachTarget(e,t){return this.si.forEach(((n,s)=>t(s))),d.resolve()}getLastRemoteSnapshotVersion(e){return d.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return d.resolve(this.oi)}allocateTargetId(e){return this.highestTargetId=this.ai.next(),d.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.oi&&(this.oi=t),d.resolve()}Pr(e){this.si.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.ai=new gt(t),this.highestTargetId=t),e.sequenceNumber>this.oi&&(this.oi=e.sequenceNumber)}addTargetData(e,t){return this.Pr(t),this.targetCount+=1,d.resolve()}updateTargetData(e,t){return this.Pr(t),d.resolve()}removeTargetData(e,t){return this.si.delete(t.target),this._i.jr(t.targetId),this.targetCount-=1,d.resolve()}removeTargets(e,t,n){let s=0;const i=[];return this.si.forEach(((o,a)=>{a.sequenceNumber<=t&&n.get(a.targetId)===null&&(this.si.delete(o),i.push(this.removeMatchingKeysForTargetId(e,a.targetId)),s++)})),d.waitFor(i).next((()=>s))}getTargetCount(e){return d.resolve(this.targetCount)}getTargetData(e,t){const n=this.si.get(t)||null;return d.resolve(n)}addMatchingKeys(e,t,n){return this._i.Wr(t,n),d.resolve()}removeMatchingKeys(e,t,n){this._i.zr(t,n);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((o=>{i.push(s.markPotentiallyOrphaned(e,o))})),d.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this._i.jr(t),d.resolve()}getMatchingKeysForTargetId(e,t){const n=this._i.Hr(t);return d.resolve(n)}containsKey(e,t){return d.resolve(this._i.containsKey(t))}}/**
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
 */class ci{constructor(e,t){this.ui={},this.overlays={},this.ci=new ae(0),this.li=!1,this.li=!0,this.hi=new Kh,this.referenceDelegate=e(this),this.Pi=new Wh(this),this.indexManager=new Nh,this.remoteDocumentCache=(function(s){return new jh(s)})((n=>this.referenceDelegate.Ti(n))),this.serializer=new Du(t),this.Ii=new zh(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.li=!1,Promise.resolve()}get started(){return this.li}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Gh,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.ui[e.toKey()];return n||(n=new $h(t,this.referenceDelegate),this.ui[e.toKey()]=n),n}getGlobalsCache(){return this.hi}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ii}runTransaction(e,t,n){g("MemoryPersistence","Starting transaction:",e);const s=new Hh(this.ci.next());return this.referenceDelegate.Ei(),n(s).next((i=>this.referenceDelegate.di(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}Ai(e,t){return d.or(Object.values(this.ui).map((n=>()=>n.containsKey(e,t))))}}class Hh extends Ra{constructor(e){super(),this.currentSequenceNumber=e}}class Qr{constructor(e){this.persistence=e,this.Ri=new ui,this.Vi=null}static mi(e){return new Qr(e)}get fi(){if(this.Vi)return this.Vi;throw E(60996)}addReference(e,t,n){return this.Ri.addReference(n,t),this.fi.delete(n.toString()),d.resolve()}removeReference(e,t,n){return this.Ri.removeReference(n,t),this.fi.add(n.toString()),d.resolve()}markPotentiallyOrphaned(e,t){return this.fi.add(t.toString()),d.resolve()}removeTarget(e,t){this.Ri.jr(t.targetId).forEach((s=>this.fi.add(s.toString())));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.fi.add(i.toString())))})).next((()=>n.removeTargetData(e,t)))}Ei(){this.Vi=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return d.forEach(this.fi,(n=>{const s=y.fromPath(n);return this.gi(e,s).next((i=>{i||t.removeEntry(s,R.min())}))})).next((()=>(this.Vi=null,t.apply(e))))}updateLimboDocument(e,t){return this.gi(e,t).next((n=>{n?this.fi.delete(t.toString()):this.fi.add(t.toString())}))}Ti(e){return 0}gi(e,t){return d.or([()=>d.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ai(e,t)])}}class Vr{constructor(e,t){this.persistence=e,this.pi=new De((n=>re(n.path)),((n,s)=>n.isEqual(s))),this.garbageCollector=zu(this,t)}static mi(e,t){return new Vr(e,t)}Ei(){}di(e){return d.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}gr(e){const t=this.wr(e);return this.persistence.getTargetCache().getTargetCount(e).next((n=>t.next((s=>n+s))))}wr(e){let t=0;return this.pr(e,(n=>{t++})).next((()=>t))}pr(e,t){return d.forEach(this.pi,((n,s)=>this.br(e,n,s).next((i=>i?d.resolve():t(s)))))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.ii(e,(o=>this.br(e,o,t).next((a=>{a||(n++,i.removeEntry(o,R.min()))})))).next((()=>i.apply(e))).next((()=>n))}markPotentiallyOrphaned(e,t){return this.pi.set(t,e.currentSequenceNumber),d.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.pi.set(n,e.currentSequenceNumber),d.resolve()}removeReference(e,t,n){return this.pi.set(n,e.currentSequenceNumber),d.resolve()}updateLimboDocument(e,t){return this.pi.set(t,e.currentSequenceNumber),d.resolve()}Ti(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=ir(e.data.value)),t}br(e,t,n){return d.or([()=>this.persistence.Ai(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.pi.get(t);return d.resolve(s!==void 0&&s>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
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
 */class Jh{constructor(e){this.serializer=e}k(e,t,n,s){const i=new kr("createOrUpgrade",t);n<1&&s>=1&&((function(u){u.createObjectStore(Nn)})(e),(function(u){u.createObjectStore(wn,{keyPath:dl}),u.createObjectStore(ge,{keyPath:no,autoIncrement:!0}).createIndex(rt,ro,{unique:!0}),u.createObjectStore(kt)})(e),Qo(e),(function(u){u.createObjectStore(Xe)})(e));let o=d.resolve();return n<3&&s>=3&&(n!==0&&((function(u){u.deleteObjectStore(Ft),u.deleteObjectStore(Mt),u.deleteObjectStore(ot)})(e),Qo(e)),o=o.next((()=>(function(u){const c=u.store(ot),l={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:R.min().toTimestamp(),targetCount:0};return c.put(gr,l)})(i)))),n<4&&s>=4&&(n!==0&&(o=o.next((()=>(function(u,c){return c.store(ge).J().next((h=>{u.deleteObjectStore(ge),u.createObjectStore(ge,{keyPath:no,autoIncrement:!0}).createIndex(rt,ro,{unique:!0});const f=c.store(ge),_=h.map((I=>f.put(I)));return d.waitFor(_)}))})(e,i)))),o=o.next((()=>{(function(u){u.createObjectStore(Ot,{keyPath:El})})(e)}))),n<5&&s>=5&&(o=o.next((()=>this.yi(i)))),n<6&&s>=6&&(o=o.next((()=>((function(u){u.createObjectStore(vn)})(e),this.wi(i))))),n<7&&s>=7&&(o=o.next((()=>this.Si(i)))),n<8&&s>=8&&(o=o.next((()=>this.bi(e,i)))),n<9&&s>=9&&(o=o.next((()=>{(function(u){u.objectStoreNames.contains("remoteDocumentChanges")&&u.deleteObjectStore("remoteDocumentChanges")})(e)}))),n<10&&s>=10&&(o=o.next((()=>this.Di(i)))),n<11&&s>=11&&(o=o.next((()=>{(function(u){u.createObjectStore(Fr,{keyPath:Al})})(e),(function(u){u.createObjectStore(Or,{keyPath:wl})})(e)}))),n<12&&s>=12&&(o=o.next((()=>{(function(u){const c=u.createObjectStore(Lr,{keyPath:Cl});c.createIndex(ps,Dl,{unique:!1}),c.createIndex(Na,xl,{unique:!1})})(e)}))),n<13&&s>=13&&(o=o.next((()=>(function(u){const c=u.createObjectStore(_r,{keyPath:ml});c.createIndex(rr,_l),c.createIndex(ba,gl)})(e))).next((()=>this.Ci(e,i))).next((()=>e.deleteObjectStore(Xe)))),n<14&&s>=14&&(o=o.next((()=>this.Fi(e,i)))),n<15&&s>=15&&(o=o.next((()=>(function(u){u.createObjectStore($s,{keyPath:vl,autoIncrement:!0}).createIndex(gs,Rl,{unique:!1}),u.createObjectStore(mn,{keyPath:Vl}).createIndex(Da,Pl,{unique:!1}),u.createObjectStore(_n,{keyPath:Sl}).createIndex(xa,bl,{unique:!1})})(e)))),n<16&&s>=16&&(o=o.next((()=>{t.objectStore(mn).clear()})).next((()=>{t.objectStore(_n).clear()}))),n<17&&s>=17&&(o=o.next((()=>{(function(u){u.createObjectStore(js,{keyPath:Nl})})(e)}))),n<18&&s>=18&&pa()&&(o=o.next((()=>{t.objectStore(mn).clear()})).next((()=>{t.objectStore(_n).clear()}))),o}wi(e){let t=0;return e.store(Xe).ee(((n,s)=>{t+=Rr(s)})).next((()=>{const n={byteSize:t};return e.store(vn).put(_s,n)}))}yi(e){const t=e.store(wn),n=e.store(ge);return t.J().next((s=>d.forEach(s,(i=>{const o=IDBKeyRange.bound([i.userId,it],[i.userId,i.lastAcknowledgedBatchId]);return n.J(rt,o).next((a=>d.forEach(a,(u=>{v(u.userId===i.userId,18650,"Cannot process batch from unexpected user",{batchId:u.batchId});const c=et(this.serializer,u);return Ou(e,i.userId,c).next((()=>{}))}))))}))))}Si(e){const t=e.store(Ft),n=e.store(Xe);return e.store(ot).get(gr).next((s=>{const i=[];return n.ee(((o,a)=>{const u=new x(o),c=(function(h){return[0,re(h)]})(u);i.push(t.get(c).next((l=>l?d.resolve():(h=>t.put({targetId:0,path:re(h),sequenceNumber:s.highestListenSequenceNumber}))(u))))})).next((()=>d.waitFor(i)))}))}bi(e,t){e.createObjectStore(Rn,{keyPath:Tl});const n=t.store(Rn),s=new ai,i=o=>{if(s.add(o)){const a=o.lastSegment(),u=o.popLast();return n.put({collectionId:a,parent:re(u)})}};return t.store(Xe).ee({X:!0},((o,a)=>{const u=new x(o);return i(u.popLast())})).next((()=>t.store(kt).ee({X:!0},(([o,a,u],c)=>{const l=Ie(a);return i(l.popLast())}))))}Di(e){const t=e.store(Mt);return t.ee(((n,s)=>{const i=ln(s),o=xu(this.serializer,i);return t.put(o)}))}Ci(e,t){const n=t.store(Xe),s=[];return n.ee(((i,o)=>{const a=t.store(_r),u=(function(h){return h.document?new y(x.fromString(h.document.name).popFirst(5)):h.noDocument?y.fromSegments(h.noDocument.path):h.unknownDocument?y.fromSegments(h.unknownDocument.path):E(36783)})(o).path.toArray(),c={prefixPath:u.slice(0,u.length-2),collectionGroup:u[u.length-2],documentId:u[u.length-1],readTime:o.readTime||[0,0],unknownDocument:o.unknownDocument,noDocument:o.noDocument,document:o.document,hasCommittedMutations:!!o.hasCommittedMutations};s.push(a.put(c))})).next((()=>d.waitFor(s)))}Fi(e,t){const n=t.store(ge),s=Ku(this.serializer),i=new ci(Qr.mi,this.serializer.yt);return n.J().next((o=>{const a=new Map;return o.forEach((u=>{let c=a.get(u.userId)??S();et(this.serializer,u).keys().forEach((l=>c=c.add(l))),a.set(u.userId,c)})),d.forEach(a,((u,c)=>{const l=new ee(c),h=$r.wt(this.serializer,l),f=i.getIndexManager(l),_=jr.wt(l,this.serializer,f,i.referenceDelegate);return new $u(s,_,h,f).recalculateAndSaveOverlaysForDocumentKeys(new ys(t,ae.ce),u).next()}))}))}}function Qo(r){r.createObjectStore(Ft,{keyPath:yl}).createIndex(Ks,Il,{unique:!0}),r.createObjectStore(Mt,{keyPath:"targetId"}).createIndex(Ca,pl,{unique:!0}),r.createObjectStore(ot)}const Me="IndexedDbPersistence",is=18e5,os=5e3,as="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",Yh="main";class li{constructor(e,t,n,s,i,o,a,u,c,l,h=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.Mi=i,this.window=o,this.document=a,this.xi=c,this.Oi=l,this.Ni=h,this.ci=null,this.li=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Bi=null,this.inForeground=!1,this.Li=null,this.ki=null,this.qi=Number.NEGATIVE_INFINITY,this.Qi=f=>Promise.resolve(),!li.v())throw new p(m.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new Lh(this,s),this.$i=t+Yh,this.serializer=new Du(u),this.Ui=new Le(this.$i,this.Ni,new Jh(this.serializer)),this.hi=new Ph,this.Pi=new Mh(this.referenceDelegate,this.serializer),this.remoteDocumentCache=Ku(this.serializer),this.Ii=new Vh,this.window&&this.window.localStorage?this.Ki=this.window.localStorage:(this.Ki=null,l===!1&&K(Me,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.Wi().then((()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new p(m.FAILED_PRECONDITION,as);return this.Gi(),this.zi(),this.ji(),this.runTransaction("getHighestListenSequenceNumber","readonly",(e=>this.Pi.getHighestSequenceNumber(e)))})).then((e=>{this.ci=new ae(e,this.xi)})).then((()=>{this.li=!0})).catch((e=>(this.Ui&&this.Ui.close(),Promise.reject(e))))}Ji(e){return this.Qi=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.Ui.$((async t=>{t.newVersion===null&&await e()}))}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Mi.enqueueAndForget((async()=>{this.started&&await this.Wi()})))}Wi(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",(e=>Zn(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next((()=>{if(this.isPrimary)return this.Hi(e).next((t=>{t||(this.isPrimary=!1,this.Mi.enqueueRetryable((()=>this.Qi(!1))))}))})).next((()=>this.Yi(e))).next((t=>this.isPrimary&&!t?this.Zi(e).next((()=>!1)):!!t&&this.Xi(e).next((()=>!0)))))).catch((e=>{if(je(e))return g(Me,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return g(Me,"Releasing owner lease after error during lease refresh",e),!1})).then((e=>{this.isPrimary!==e&&this.Mi.enqueueRetryable((()=>this.Qi(e))),this.isPrimary=e}))}Hi(e){return an(e).get(It).next((t=>d.resolve(this.es(t))))}ts(e){return Zn(e).delete(this.clientId)}async ns(){if(this.isPrimary&&!this.rs(this.qi,is)){this.qi=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",(t=>{const n=J(t,Ot);return n.J().next((s=>{const i=this.ss(s,is),o=s.filter((a=>i.indexOf(a)===-1));return d.forEach(o,(a=>n.delete(a.clientId))).next((()=>o))}))})).catch((()=>[]));if(this.Ki)for(const t of e)this.Ki.removeItem(this._s(t.clientId))}}ji(){this.ki=this.Mi.enqueueAfterDelay("client_metadata_refresh",4e3,(()=>this.Wi().then((()=>this.ns())).then((()=>this.ji()))))}es(e){return!!e&&e.ownerId===this.clientId}Yi(e){return this.Oi?d.resolve(!0):an(e).get(It).next((t=>{if(t!==null&&this.rs(t.leaseTimestampMs,os)&&!this.us(t.ownerId)){if(this.es(t)&&this.networkEnabled)return!0;if(!this.es(t)){if(!t.allowTabSynchronization)throw new p(m.FAILED_PRECONDITION,as);return!1}}return!(!this.networkEnabled||!this.inForeground)||Zn(e).J().next((n=>this.ss(n,os).find((s=>{if(this.clientId!==s.clientId){const i=!this.networkEnabled&&s.networkEnabled,o=!this.inForeground&&s.inForeground,a=this.networkEnabled===s.networkEnabled;if(i||o&&a)return!0}return!1}))===void 0))})).next((t=>(this.isPrimary!==t&&g(Me,`Client ${t?"is":"is not"} eligible for a primary lease.`),t)))}async shutdown(){this.li=!1,this.cs(),this.ki&&(this.ki.cancel(),this.ki=null),this.ls(),this.hs(),await this.Ui.runTransaction("shutdown","readwrite",[Nn,Ot],(e=>{const t=new ys(e,ae.ce);return this.Zi(t).next((()=>this.ts(t)))})),this.Ui.close(),this.Ps()}ss(e,t){return e.filter((n=>this.rs(n.updateTimeMs,t)&&!this.us(n.clientId)))}Ts(){return this.runTransaction("getActiveClients","readonly",(e=>Zn(e).J().next((t=>this.ss(t,is).map((n=>n.clientId))))))}get started(){return this.li}getGlobalsCache(){return this.hi}getMutationQueue(e,t){return jr.wt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new kh(e,this.serializer.yt.databaseId)}getDocumentOverlayCache(e){return $r.wt(this.serializer,e)}getBundleCache(){return this.Ii}runTransaction(e,t,n){g(Me,"Starting transaction:",e);const s=t==="readonly"?"readonly":"readwrite",i=(function(u){return u===18?Fl:u===17?Oa:u===16?Ml:u===15?Qs:u===14?Fa:u===13?Ma:u===12?kl:u===11?ka:void E(60245)})(this.Ni);let o;return this.Ui.runTransaction(e,s,i,(a=>(o=new ys(a,this.ci?this.ci.next():ae.ce),t==="readwrite-primary"?this.Hi(o).next((u=>!!u||this.Yi(o))).next((u=>{if(!u)throw K(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Mi.enqueueRetryable((()=>this.Qi(!1))),new p(m.FAILED_PRECONDITION,va);return n(o)})).next((u=>this.Xi(o).next((()=>u)))):this.Is(o).next((()=>n(o)))))).then((a=>(o.raiseOnCommittedEvent(),a)))}Is(e){return an(e).get(It).next((t=>{if(t!==null&&this.rs(t.leaseTimestampMs,os)&&!this.us(t.ownerId)&&!this.es(t)&&!(this.Oi||this.allowTabSynchronization&&t.allowTabSynchronization))throw new p(m.FAILED_PRECONDITION,as)}))}Xi(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return an(e).put(It,t)}static v(){return Le.v()}Zi(e){const t=an(e);return t.get(It).next((n=>this.es(n)?(g(Me,"Releasing primary lease."),t.delete(It)):d.resolve()))}rs(e,t){const n=Date.now();return!(e<n-t)&&(!(e>n)||(K(`Detected an update time that is in the future: ${e} > ${n}`),!1))}Gi(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.Li=()=>{this.Mi.enqueueAndForget((()=>(this.inForeground=this.document.visibilityState==="visible",this.Wi())))},this.document.addEventListener("visibilitychange",this.Li),this.inForeground=this.document.visibilityState==="visible")}ls(){this.Li&&(this.document.removeEventListener("visibilitychange",this.Li),this.Li=null)}zi(){typeof this.window?.addEventListener=="function"&&(this.Bi=()=>{this.cs();const e=/(?:Version|Mobile)\/1[456]/;ga()&&(navigator.appVersion.match(e)||navigator.userAgent.match(e))&&this.Mi.enterRestrictedMode(!0),this.Mi.enqueueAndForget((()=>this.shutdown()))},this.window.addEventListener("pagehide",this.Bi))}hs(){this.Bi&&(this.window.removeEventListener("pagehide",this.Bi),this.Bi=null)}us(e){try{const t=this.Ki?.getItem(this._s(e))!==null;return g(Me,`Client '${e}' ${t?"is":"is not"} zombied in LocalStorage`),t}catch(t){return K(Me,"Failed to get zombied client id.",t),!1}}cs(){if(this.Ki)try{this.Ki.setItem(this._s(this.clientId),String(Date.now()))}catch(e){K("Failed to set zombie client id.",e)}}Ps(){if(this.Ki)try{this.Ki.removeItem(this._s(this.clientId))}catch{}}_s(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function an(r){return J(r,Nn)}function Zn(r){return J(r,Ot)}function ju(r,e){let t=r.projectId;return r.isDefaultDatabase||(t+="."+r.database),"firestore/"+e+"/"+t+"/"}/**
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
 */class hi{constructor(e,t,n,s){this.targetId=e,this.fromCache=t,this.Es=n,this.ds=s}static As(e,t){let n=S(),s=S();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new hi(e,t.fromCache,n,s)}}/**
 * @license
 * Copyright 2023 Google LLC
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
 */class Xh{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class Qu{constructor(){this.Rs=!1,this.Vs=!1,this.fs=100,this.gs=(function(){return ga()?8:Va(dr())>0?6:4})()}initialize(e,t){this.ps=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,n,s){const i={result:null};return this.ys(e,t).next((o=>{i.result=o})).next((()=>{if(!i.result)return this.ws(e,t,s,n).next((o=>{i.result=o}))})).next((()=>{if(i.result)return;const o=new Xh;return this.Ss(e,t,o).next((a=>{if(i.result=a,this.Vs)return this.bs(e,t,o,a.size)}))})).next((()=>i.result))}bs(e,t,n,s){return n.documentReadCount<this.fs?(Rt()<=Ve.DEBUG&&g("QueryEngine","SDK will not create cache indexes for query:",Vt(t),"since it only creates cache indexes for collection contains","more than or equal to",this.fs,"documents"),d.resolve()):(Rt()<=Ve.DEBUG&&g("QueryEngine","Query:",Vt(t),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.gs*s?(Rt()<=Ve.DEBUG&&g("QueryEngine","The SDK decides to create cache indexes for query:",Vt(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,he(t))):d.resolve())}ys(e,t){if(po(t))return d.resolve(null);let n=he(t);return this.indexManager.getIndexType(e,n).next((s=>s===0?null:(t.limit!==null&&s===1&&(t=Tr(t,null,"F"),n=he(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next((i=>{const o=S(...i);return this.ps.getDocuments(e,o).next((a=>this.indexManager.getMinOffset(e,n).next((u=>{const c=this.Ds(t,a);return this.Cs(t,c,o,u.readTime)?this.ys(e,Tr(t,null,"F")):this.vs(e,c,t,u)}))))})))))}ws(e,t,n,s){return po(t)||s.isEqual(R.min())?d.resolve(null):this.ps.getDocuments(e,n).next((i=>{const o=this.Ds(t,i);return this.Cs(t,o,n,s)?d.resolve(null):(Rt()<=Ve.DEBUG&&g("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Vt(t)),this.vs(e,o,t,Aa(s,Nt)).next((a=>a)))}))}Ds(e,t){let n=new F(su(e));return t.forEach(((s,i)=>{Fn(e,i)&&(n=n.add(i))})),n}Cs(e,t,n,s){if(e.limit===null)return!1;if(n.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Ss(e,t,n){return Rt()<=Ve.DEBUG&&g("QueryEngine","Using full collection scan to execute query:",Vt(t)),this.ps.getDocumentsMatchingQuery(e,t,fe.min(),n)}vs(e,t,n,s){return this.ps.getDocumentsMatchingQuery(e,n,s).next((i=>(t.forEach((o=>{i=i.insert(o.key,o)})),i)))}}/**
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
 */const di="LocalStore",Zh=3e8;class ed{constructor(e,t,n,s){this.persistence=e,this.Fs=t,this.serializer=s,this.Ms=new O(V),this.xs=new De((i=>ft(i)),kn),this.Os=new Map,this.Ns=e.getRemoteDocumentCache(),this.Pi=e.getTargetCache(),this.Ii=e.getBundleCache(),this.Bs(n)}Bs(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new $u(this.Ns,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ns.setIndexManager(this.indexManager),this.Fs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Ms)))}}function Wu(r,e,t,n){return new ed(r,e,t,n)}async function Hu(r,e){const t=w(r);return await t.persistence.runTransaction("Handle user change","readonly",(n=>{let s;return t.mutationQueue.getAllMutationBatches(n).next((i=>(s=i,t.Bs(e),t.mutationQueue.getAllMutationBatches(n)))).next((i=>{const o=[],a=[];let u=S();for(const c of s){o.push(c.batchId);for(const l of c.mutations)u=u.add(l.key)}for(const c of i){a.push(c.batchId);for(const l of c.mutations)u=u.add(l.key)}return t.localDocuments.getDocuments(n,u).next((c=>({Ls:c,removedBatchIds:o,addedBatchIds:a})))}))}))}function td(r,e){const t=w(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(n=>{const s=e.batch.keys(),i=t.Ns.newChangeBuffer({trackRemovals:!0});return(function(a,u,c,l){const h=c.batch,f=h.keys();let _=d.resolve();return f.forEach((I=>{_=_.next((()=>l.getEntry(u,I))).next((A=>{const T=c.docVersions.get(I);v(T!==null,48541),A.version.compareTo(T)<0&&(h.applyToRemoteDocument(A,c),A.isValidDocument()&&(A.setReadTime(c.commitVersion),l.addEntry(A)))}))})),_.next((()=>a.mutationQueue.removeMutationBatch(u,h)))})(t,n,e,i).next((()=>i.apply(n))).next((()=>t.mutationQueue.performConsistencyCheck(n))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(n,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,(function(a){let u=S();for(let c=0;c<a.mutationResults.length;++c)a.mutationResults[c].transformResults.length>0&&(u=u.add(a.batch.mutations[c].key));return u})(e)))).next((()=>t.localDocuments.getDocuments(n,s)))}))}function Ju(r){const e=w(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.Pi.getLastRemoteSnapshotVersion(t)))}function nd(r,e){const t=w(r),n=e.snapshotVersion;let s=t.Ms;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const o=t.Ns.newChangeBuffer({trackRemovals:!0});s=t.Ms;const a=[];e.targetChanges.forEach(((l,h)=>{const f=s.get(h);if(!f)return;a.push(t.Pi.removeMatchingKeys(i,l.removedDocuments,h).next((()=>t.Pi.addMatchingKeys(i,l.addedDocuments,h))));let _=f.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(h)!==null?_=_.withResumeToken($.EMPTY_BYTE_STRING,R.min()).withLastLimboFreeSnapshotVersion(R.min()):l.resumeToken.approximateByteSize()>0&&(_=_.withResumeToken(l.resumeToken,n)),s=s.insert(h,_),(function(A,T,N){return A.resumeToken.approximateByteSize()===0||T.snapshotVersion.toMicroseconds()-A.snapshotVersion.toMicroseconds()>=Zh?!0:N.addedDocuments.size+N.modifiedDocuments.size+N.removedDocuments.size>0})(f,_,l)&&a.push(t.Pi.updateTargetData(i,_))}));let u=le(),c=S();if(e.documentUpdates.forEach((l=>{e.resolvedLimboDocuments.has(l)&&a.push(t.persistence.referenceDelegate.updateLimboDocument(i,l))})),a.push(rd(i,o,e.documentUpdates).next((l=>{u=l.ks,c=l.qs}))),!n.isEqual(R.min())){const l=t.Pi.getLastRemoteSnapshotVersion(i).next((h=>t.Pi.setTargetsMetadata(i,i.currentSequenceNumber,n)));a.push(l)}return d.waitFor(a).next((()=>o.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,u,c))).next((()=>u))})).then((i=>(t.Ms=s,i)))}function rd(r,e,t){let n=S(),s=S();return t.forEach((i=>n=n.add(i))),e.getEntries(r,n).next((i=>{let o=le();return t.forEach(((a,u)=>{const c=i.get(a);u.isFoundDocument()!==c.isFoundDocument()&&(s=s.add(a)),u.isNoDocument()&&u.version.isEqual(R.min())?(e.removeEntry(a,u.readTime),o=o.insert(a,u)):!c.isValidDocument()||u.version.compareTo(c.version)>0||u.version.compareTo(c.version)===0&&c.hasPendingWrites?(e.addEntry(u),o=o.insert(a,u)):g(di,"Ignoring outdated watch update for ",a,". Current version:",c.version," Watch version:",u.version)})),{ks:o,qs:s}}))}function sd(r,e){const t=w(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(n=>(e===void 0&&(e=it),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e))))}function Pr(r,e){const t=w(r);return t.persistence.runTransaction("Allocate target","readwrite",(n=>{let s;return t.Pi.getTargetData(n,e).next((i=>i?(s=i,d.resolve(s)):t.Pi.allocateTargetId(n).next((o=>(s=new Pe(e,o,"TargetPurposeListen",n.currentSequenceNumber),t.Pi.addTargetData(n,s).next((()=>s)))))))})).then((n=>{const s=t.Ms.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.Ms=t.Ms.insert(n.targetId,n),t.xs.set(e,n.targetId)),n}))}async function jt(r,e,t){const n=w(r),s=n.Ms.get(e),i=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",i,(o=>n.persistence.referenceDelegate.removeTarget(o,s)))}catch(o){if(!je(o))throw o;g(di,`Failed to update sequence numbers for target ${e}: ${o}`)}n.Ms=n.Ms.remove(e),n.xs.delete(s.target)}function xs(r,e,t){const n=w(r);let s=R.min(),i=S();return n.persistence.runTransaction("Execute query","readwrite",(o=>(function(u,c,l){const h=w(u),f=h.xs.get(l);return f!==void 0?d.resolve(h.Ms.get(f)):h.Pi.getTargetData(c,l)})(n,o,he(e)).next((a=>{if(a)return s=a.lastLimboFreeSnapshotVersion,n.Pi.getMatchingKeysForTargetId(o,a.targetId).next((u=>{i=u}))})).next((()=>n.Fs.getDocumentsMatchingQuery(o,e,t?s:R.min(),t?i:S()))).next((a=>(Zu(n,ru(e),a),{documents:a,Qs:i})))))}function Yu(r,e){const t=w(r),n=w(t.Pi),s=t.Ms.get(e);return s?Promise.resolve(s.target):t.persistence.runTransaction("Get target data","readonly",(i=>n.At(i,e).next((o=>o?o.target:null))))}function Xu(r,e){const t=w(r),n=t.Os.get(e)||R.min();return t.persistence.runTransaction("Get new document changes","readonly",(s=>t.Ns.getAllFromCollectionGroup(s,e,Aa(n,Nt),Number.MAX_SAFE_INTEGER))).then((s=>(Zu(t,e,s),s)))}function Zu(r,e,t){let n=r.Os.get(e)||R.min();t.forEach(((s,i)=>{i.readTime.compareTo(n)>0&&(n=i.readTime)})),r.Os.set(e,n)}/**
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
 */const ec="firestore_clients";function Wo(r,e){return`${ec}_${r}_${e}`}const tc="firestore_mutations";function Ho(r,e,t){let n=`${tc}_${r}_${t}`;return e.isAuthenticated()&&(n+=`_${e.uid}`),n}const nc="firestore_targets";function us(r,e){return`${nc}_${r}_${e}`}/**
 * @license
 * Copyright 2018 Google LLC
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
 */const ye="SharedClientState";class Sr{constructor(e,t,n,s){this.user=e,this.batchId=t,this.state=n,this.error=s}static Ws(e,t,n){const s=JSON.parse(n);let i,o=typeof s=="object"&&["pending","acknowledged","rejected"].indexOf(s.state)!==-1&&(s.error===void 0||typeof s.error=="object");return o&&s.error&&(o=typeof s.error.message=="string"&&typeof s.error.code=="string",o&&(i=new p(s.error.code,s.error.message))),o?new Sr(e,t,s.state,i):(K(ye,`Failed to parse mutation state for ID '${t}': ${n}`),null)}Gs(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class In{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static Ws(e,t){const n=JSON.parse(t);let s,i=typeof n=="object"&&["not-current","current","rejected"].indexOf(n.state)!==-1&&(n.error===void 0||typeof n.error=="object");return i&&n.error&&(i=typeof n.error.message=="string"&&typeof n.error.code=="string",i&&(s=new p(n.error.code,n.error.message))),i?new In(e,n.state,s):(K(ye,`Failed to parse target state for ID '${e}': ${t}`),null)}Gs(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class br{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static Ws(e,t){const n=JSON.parse(t);let s=typeof n=="object"&&n.activeTargetIds instanceof Array,i=Xs();for(let o=0;s&&o<n.activeTargetIds.length;++o)s=Pa(n.activeTargetIds[o]),i=i.add(n.activeTargetIds[o]);return s?new br(e,i):(K(ye,`Failed to parse client data for instance '${e}': ${t}`),null)}}class fi{constructor(e,t){this.clientId=e,this.onlineState=t}static Ws(e){const t=JSON.parse(e);return typeof t=="object"&&["Unknown","Online","Offline"].indexOf(t.onlineState)!==-1&&typeof t.clientId=="string"?new fi(t.clientId,t.onlineState):(K(ye,`Failed to parse online state: ${e}`),null)}}class Ns{constructor(){this.activeTargetIds=Xs()}zs(e){this.activeTargetIds=this.activeTargetIds.add(e)}js(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Gs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class cs{constructor(e,t,n,s,i){this.window=e,this.Mi=t,this.persistenceKey=n,this.Js=s,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.Hs=this.Ys.bind(this),this.Zs=new O(V),this.started=!1,this.Xs=[];const o=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.eo=Wo(this.persistenceKey,this.Js),this.no=(function(u){return`firestore_sequence_number_${u}`})(this.persistenceKey),this.Zs=this.Zs.insert(this.Js,new Ns),this.ro=new RegExp(`^${ec}_${o}_([^_]*)$`),this.io=new RegExp(`^${tc}_${o}_(\\d+)(?:_(.*))?$`),this.so=new RegExp(`^${nc}_${o}_(\\d+)$`),this.oo=(function(u){return`firestore_online_state_${u}`})(this.persistenceKey),this._o=(function(u){return`firestore_bundle_loaded_v2_${u}`})(this.persistenceKey),this.window.addEventListener("storage",this.Hs)}static v(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.Ts();for(const n of e){if(n===this.Js)continue;const s=this.getItem(Wo(this.persistenceKey,n));if(s){const i=br.Ws(n,s);i&&(this.Zs=this.Zs.insert(i.clientId,i))}}this.ao();const t=this.storage.getItem(this.oo);if(t){const n=this.uo(t);n&&this.co(n)}for(const n of this.Xs)this.Ys(n);this.Xs=[],this.window.addEventListener("pagehide",(()=>this.shutdown())),this.started=!0}writeSequenceNumber(e){this.setItem(this.no,JSON.stringify(e))}getAllActiveQueryTargets(){return this.lo(this.Zs)}isActiveQueryTarget(e){let t=!1;return this.Zs.forEach(((n,s)=>{s.activeTargetIds.has(e)&&(t=!0)})),t}addPendingMutation(e){this.ho(e,"pending")}updateMutationState(e,t,n){this.ho(e,t,n),this.Po(e)}addLocalQueryTarget(e,t=!0){let n="not-current";if(this.isActiveQueryTarget(e)){const s=this.storage.getItem(us(this.persistenceKey,e));if(s){const i=In.Ws(e,s);i&&(n=i.state)}}return t&&this.To.zs(e),this.ao(),n}removeLocalQueryTarget(e){this.To.js(e),this.ao()}isLocalQueryTarget(e){return this.To.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(us(this.persistenceKey,e))}updateQueryState(e,t,n){this.Io(e,t,n)}handleUserChange(e,t,n){t.forEach((s=>{this.Po(s)})),this.currentUser=e,n.forEach((s=>{this.addPendingMutation(s)}))}setOnlineState(e){this.Eo(e)}notifyBundleLoaded(e){this.Ao(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.Hs),this.removeItem(this.eo),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return g(ye,"READ",e,t),t}setItem(e,t){g(ye,"SET",e,t),this.storage.setItem(e,t)}removeItem(e){g(ye,"REMOVE",e),this.storage.removeItem(e)}Ys(e){const t=e;if(t.storageArea===this.storage){if(g(ye,"EVENT",t.key,t.newValue),t.key===this.eo)return void K("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.Mi.enqueueRetryable((async()=>{if(this.started){if(t.key!==null){if(this.ro.test(t.key)){if(t.newValue==null){const n=this.Ro(t.key);return this.Vo(n,null)}{const n=this.mo(t.key,t.newValue);if(n)return this.Vo(n.clientId,n)}}else if(this.io.test(t.key)){if(t.newValue!==null){const n=this.fo(t.key,t.newValue);if(n)return this.po(n)}}else if(this.so.test(t.key)){if(t.newValue!==null){const n=this.yo(t.key,t.newValue);if(n)return this.wo(n)}}else if(t.key===this.oo){if(t.newValue!==null){const n=this.uo(t.newValue);if(n)return this.co(n)}}else if(t.key===this.no){const n=(function(i){let o=ae.ce;if(i!=null)try{const a=JSON.parse(i);v(typeof a=="number",30636,{So:i}),o=a}catch(a){K(ye,"Failed to read sequence number from WebStorage",a)}return o})(t.newValue);n!==ae.ce&&this.sequenceNumberHandler(n)}else if(t.key===this._o){const n=this.bo(t.newValue);await Promise.all(n.map((s=>this.syncEngine.Do(s))))}}}else this.Xs.push(t)}))}}get To(){return this.Zs.get(this.Js)}ao(){this.setItem(this.eo,this.To.Gs())}ho(e,t,n){const s=new Sr(this.currentUser,e,t,n),i=Ho(this.persistenceKey,this.currentUser,e);this.setItem(i,s.Gs())}Po(e){const t=Ho(this.persistenceKey,this.currentUser,e);this.removeItem(t)}Eo(e){const t={clientId:this.Js,onlineState:e};this.storage.setItem(this.oo,JSON.stringify(t))}Io(e,t,n){const s=us(this.persistenceKey,e),i=new In(e,t,n);this.setItem(s,i.Gs())}Ao(e){const t=JSON.stringify(Array.from(e));this.setItem(this._o,t)}Ro(e){const t=this.ro.exec(e);return t?t[1]:null}mo(e,t){const n=this.Ro(e);return br.Ws(n,t)}fo(e,t){const n=this.io.exec(e),s=Number(n[1]),i=n[2]!==void 0?n[2]:null;return Sr.Ws(new ee(i),s,t)}yo(e,t){const n=this.so.exec(e),s=Number(n[1]);return In.Ws(s,t)}uo(e){return fi.Ws(e)}bo(e){return JSON.parse(e)}async po(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.Co(e.batchId,e.state,e.error);g(ye,`Ignoring mutation for non-active user ${e.user.uid}`)}wo(e){return this.syncEngine.vo(e.targetId,e.state,e.error)}Vo(e,t){const n=t?this.Zs.insert(e,t):this.Zs.remove(e),s=this.lo(this.Zs),i=this.lo(n),o=[],a=[];return i.forEach((u=>{s.has(u)||o.push(u)})),s.forEach((u=>{i.has(u)||a.push(u)})),this.syncEngine.Fo(o,a).then((()=>{this.Zs=n}))}co(e){this.Zs.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}lo(e){let t=Xs();return e.forEach(((n,s)=>{t=t.unionWith(s.activeTargetIds)})),t}}class rc{constructor(){this.Mo=new Ns,this.xo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.Mo.zs(e),this.xo[e]||"not-current"}updateQueryState(e,t,n){this.xo[e]=t}removeLocalQueryTarget(e){this.Mo.js(e)}isLocalQueryTarget(e){return this.Mo.activeTargetIds.has(e)}clearQueryState(e){delete this.xo[e]}getAllActiveQueryTargets(){return this.Mo.activeTargetIds}isActiveQueryTarget(e){return this.Mo.activeTargetIds.has(e)}start(){return this.Mo=new Ns,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class id{Oo(e){}shutdown(){}}/**
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
 */const Jo="ConnectivityMonitor";class Yo{constructor(){this.No=()=>this.Bo(),this.Lo=()=>this.ko(),this.qo=[],this.Qo()}Oo(e){this.qo.push(e)}shutdown(){window.removeEventListener("online",this.No),window.removeEventListener("offline",this.Lo)}Qo(){window.addEventListener("online",this.No),window.addEventListener("offline",this.Lo)}Bo(){g(Jo,"Network connectivity changed: AVAILABLE");for(const e of this.qo)e(0)}ko(){g(Jo,"Network connectivity changed: UNAVAILABLE");for(const e of this.qo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
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
 */let er=null;function ks(){return er===null?er=(function(){return 268435456+Math.round(2147483648*Math.random())})():er++,"0x"+er.toString(16)}/**
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
 */const ls="RestConnection",od={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class ad{get $o(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Uo=t+"://"+e.host,this.Ko=`projects/${n}/databases/${s}`,this.Wo=this.databaseId.database===pr?`project_id=${n}`:`project_id=${n}&database_id=${s}`}Go(e,t,n,s,i){const o=ks(),a=this.zo(e,t.toUriEncodedString());g(ls,`Sending RPC '${e}' ${o}:`,a,n);const u={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Wo};this.jo(u,s,i);const{host:c}=new URL(a),l=_a(c);return this.Jo(e,a,u,n,l).then((h=>(g(ls,`Received RPC '${e}' ${o}: `,h),h)),(h=>{throw Tn(ls,`RPC '${e}' ${o} failed with error: `,h,"url: ",a,"request:",n),h}))}Ho(e,t,n,s,i,o){return this.Go(e,t,n,s,i)}jo(e,t,n){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Jt})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),n&&n.headers.forEach(((s,i)=>e[i]=s))}zo(e,t){const n=od[e];return`${this.Uo}/v1/${t}:${n}`}terminate(){}}/**
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
 */class ud{constructor(e){this.Yo=e.Yo,this.Zo=e.Zo}Xo(e){this.e_=e}t_(e){this.n_=e}r_(e){this.i_=e}onMessage(e){this.s_=e}close(){this.Zo()}send(e){this.Yo(e)}o_(){this.e_()}__(){this.n_()}a_(e){this.i_(e)}u_(e){this.s_(e)}}/**
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
 */const Z="WebChannelConnection";class cd extends ad{constructor(e){super(e),this.c_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Jo(e,t,n,s,i){const o=ks();return new Promise(((a,u)=>{const c=new Kc;c.setWithCredentials(!0),c.listenOnce($c.COMPLETE,(()=>{try{switch(c.getLastErrorCode()){case ns.NO_ERROR:const h=c.getResponseJson();g(Z,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(h)),a(h);break;case ns.TIMEOUT:g(Z,`RPC '${e}' ${o} timed out`),u(new p(m.DEADLINE_EXCEEDED,"Request time out"));break;case ns.HTTP_ERROR:const f=c.getStatus();if(g(Z,`RPC '${e}' ${o} failed with status:`,f,"response text:",c.getResponseText()),f>0){let _=c.getResponseJson();Array.isArray(_)&&(_=_[0]);const I=_?.error;if(I&&I.status&&I.message){const A=(function(N){const C=N.toLowerCase().replace(/_/g,"-");return Object.values(m).indexOf(C)>=0?C:m.UNKNOWN})(I.status);u(new p(A,I.message))}else u(new p(m.UNKNOWN,"Server responded with status "+c.getStatus()))}else u(new p(m.UNAVAILABLE,"Connection failed."));break;default:E(9055,{l_:e,streamId:o,h_:c.getLastErrorCode(),P_:c.getLastError()})}}finally{g(Z,`RPC '${e}' ${o} completed.`)}}));const l=JSON.stringify(s);g(Z,`RPC '${e}' ${o} sending request:`,s),c.send(t,"POST",l,n,15)}))}T_(e,t,n){const s=ks(),i=[this.Uo,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=jc(),a=Qc(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;c!==void 0&&(u.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(u.useFetchStreams=!0),this.jo(u.initMessageHeaders,t,n),u.encodeInitMessageHeaders=!0;const l=i.join("");g(Z,`Creating RPC '${e}' stream ${s}: ${l}`,u);const h=o.createWebChannel(l,u);this.I_(h);let f=!1,_=!1;const I=new ud({Yo:T=>{_?g(Z,`Not sending because RPC '${e}' stream ${s} is closed:`,T):(f||(g(Z,`Opening RPC '${e}' stream ${s} transport.`),h.open(),f=!0),g(Z,`RPC '${e}' stream ${s} sending:`,T),h.send(T))},Zo:()=>h.close()}),A=(T,N,C)=>{T.listen(N,(P=>{try{C(P)}catch(W){setTimeout((()=>{throw W}),0)}}))};return A(h,Wn.EventType.OPEN,(()=>{_||(g(Z,`RPC '${e}' stream ${s} transport opened.`),I.o_())})),A(h,Wn.EventType.CLOSE,(()=>{_||(_=!0,g(Z,`RPC '${e}' stream ${s} transport closed`),I.a_(),this.E_(h))})),A(h,Wn.EventType.ERROR,(T=>{_||(_=!0,Tn(Z,`RPC '${e}' stream ${s} transport errored. Name:`,T.name,"Message:",T.message),I.a_(new p(m.UNAVAILABLE,"The operation could not be completed")))})),A(h,Wn.EventType.MESSAGE,(T=>{if(!_){const N=T.data[0];v(!!N,16349);const C=N,P=C?.error||C[0]?.error;if(P){g(Z,`RPC '${e}' stream ${s} received error:`,P);const W=P.status;let U=(function(He){const Gi=j[He];if(Gi!==void 0)return pu(Gi)})(W),G=P.message;U===void 0&&(U=m.INTERNAL,G="Unknown error status: "+W+" with message "+P.message),_=!0,I.a_(new p(U,G)),h.close()}else g(Z,`RPC '${e}' stream ${s} received:`,N),I.u_(N)}})),A(a,Wc.STAT_EVENT,(T=>{T.stat===$i.PROXY?g(Z,`RPC '${e}' stream ${s} detected buffering proxy`):T.stat===$i.NOPROXY&&g(Z,`RPC '${e}' stream ${s} detected no buffering proxy`)})),setTimeout((()=>{I.__()}),0),I}terminate(){this.c_.forEach((e=>e.close())),this.c_=[]}I_(e){this.c_.push(e)}E_(e){this.c_=this.c_.filter((t=>t===e))}}/**
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
 *//**
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
 */function sc(){return typeof window<"u"?window:null}function lr(){return typeof document<"u"?document:null}/**
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
 */function Wr(r){return new _h(r,!0)}/**
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
 */class ic{constructor(e,t,n=1e3,s=1.5,i=6e4){this.Mi=e,this.timerId=t,this.d_=n,this.A_=s,this.R_=i,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(e){this.cancel();const t=Math.floor(this.V_+this.y_()),n=Math.max(0,Date.now()-this.f_),s=Math.max(0,t-n);s>0&&g("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.V_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,s,(()=>(this.f_=Date.now(),e()))),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}/**
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
 */const Xo="PersistentStream";class oc{constructor(e,t,n,s,i,o,a,u){this.Mi=e,this.S_=n,this.b_=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=u,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new ic(e,t)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Mi.enqueueAfterDelay(this.S_,6e4,(()=>this.k_())))}q_(e){this.Q_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}Q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.Q_(),this.U_(),this.M_.cancel(),this.D_++,e!==4?this.M_.reset():t&&t.code===m.RESOURCE_EXHAUSTED?(K(t.toString()),K("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):t&&t.code===m.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.K_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.r_(t)}K_(){}auth(){this.state=1;const e=this.W_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([n,s])=>{this.D_===t&&this.G_(n,s)}),(n=>{e((()=>{const s=new p(m.UNKNOWN,"Fetching auth token failed: "+n.message);return this.z_(s)}))}))}G_(e,t){const n=this.W_(this.D_);this.stream=this.j_(e,t),this.stream.Xo((()=>{n((()=>this.listener.Xo()))})),this.stream.t_((()=>{n((()=>(this.state=2,this.v_=this.Mi.enqueueAfterDelay(this.b_,1e4,(()=>(this.O_()&&(this.state=3),Promise.resolve()))),this.listener.t_())))})),this.stream.r_((s=>{n((()=>this.z_(s)))})),this.stream.onMessage((s=>{n((()=>++this.F_==1?this.J_(s):this.onNext(s)))}))}N_(){this.state=5,this.M_.p_((async()=>{this.state=0,this.start()}))}z_(e){return g(Xo,`close with error: ${e}`),this.stream=null,this.close(4,e)}W_(e){return t=>{this.Mi.enqueueAndForget((()=>this.D_===e?t():(g(Xo,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class ld extends oc{constructor(e,t,n,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}j_(e,t){return this.connection.T_("Listen",e,t)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();const t=yh(this.serializer,e),n=(function(i){if(!("targetChange"in i))return R.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?R.min():o.readTime?ie(o.readTime):R.min()})(e);return this.listener.H_(t,n)}Y_(e){const t={};t.database=Ps(this.serializer),t.addTarget=(function(i,o){let a;const u=o.target;if(a=yr(u)?{documents:Ru(i,u)}:{query:Vu(i,u).ft},a.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){a.resumeToken=Tu(i,o.resumeToken);const c=Rs(i,o.expectedCount);c!==null&&(a.expectedCount=c)}else if(o.snapshotVersion.compareTo(R.min())>0){a.readTime=$t(i,o.snapshotVersion.toTimestamp());const c=Rs(i,o.expectedCount);c!==null&&(a.expectedCount=c)}return a})(this.serializer,e);const n=Th(this.serializer,e);n&&(t.labels=n),this.q_(t)}Z_(e){const t={};t.database=Ps(this.serializer),t.removeTarget=e,this.q_(t)}}class hd extends oc{constructor(e,t,n,s,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}get X_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}K_(){this.X_&&this.ea([])}j_(e,t){return this.connection.T_("Write",e,t)}J_(e){return v(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,v(!e.writeResults||e.writeResults.length===0,55816),this.listener.ta()}onNext(e){v(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const t=Ih(e.writeResults,e.commitTime),n=ie(e.commitTime);return this.listener.na(n,t)}ra(){const e={};e.database=Ps(this.serializer),this.q_(e)}ea(e){const t={streamToken:this.lastStreamToken,writes:e.map((n=>Ar(this.serializer,n)))};this.q_(t)}}/**
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
 */class dd{}class fd extends dd{constructor(e,t,n,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=s,this.ia=!1}sa(){if(this.ia)throw new p(m.FAILED_PRECONDITION,"The client has already been terminated.")}Go(e,t,n,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.Go(e,Vs(t,n),s,i,o))).catch((i=>{throw i.name==="FirebaseError"?(i.code===m.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new p(m.UNKNOWN,i.toString())}))}Ho(e,t,n,s,i){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,a])=>this.connection.Ho(e,Vs(t,n),s,o,a,i))).catch((o=>{throw o.name==="FirebaseError"?(o.code===m.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new p(m.UNKNOWN,o.toString())}))}terminate(){this.ia=!0,this.connection.terminate()}}class md{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve()))))}ha(e){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,e==="Online"&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(K(t),this.aa=!1):g("OnlineStateTracker",t)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
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
 */const pt="RemoteStore";class _d{constructor(e,t,n,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.da=[],this.Aa=i,this.Aa.Oo((o=>{n.enqueueAndForget((async()=>{yt(this)&&(g(pt,"Restarting streams for network reachability change."),await(async function(u){const c=w(u);c.Ea.add(4),await Un(c),c.Ra.set("Unknown"),c.Ea.delete(4),await Hr(c)})(this))}))})),this.Ra=new md(n,s)}}async function Hr(r){if(yt(r))for(const e of r.da)await e(!0)}async function Un(r){for(const e of r.da)await e(!1)}function Jr(r,e){const t=w(r);t.Ia.has(e.targetId)||(t.Ia.set(e.targetId,e),gi(t)?_i(t):Zt(t).O_()&&mi(t,e))}function Qt(r,e){const t=w(r),n=Zt(t);t.Ia.delete(e),n.O_()&&ac(t,e),t.Ia.size===0&&(n.O_()?n.L_():yt(t)&&t.Ra.set("Unknown"))}function mi(r,e){if(r.Va.Ue(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(R.min())>0){const t=r.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Zt(r).Y_(e)}function ac(r,e){r.Va.Ue(e),Zt(r).Z_(e)}function _i(r){r.Va=new hh({getRemoteKeysForTarget:e=>r.remoteSyncer.getRemoteKeysForTarget(e),At:e=>r.Ia.get(e)||null,ht:()=>r.datastore.serializer.databaseId}),Zt(r).start(),r.Ra.ua()}function gi(r){return yt(r)&&!Zt(r).x_()&&r.Ia.size>0}function yt(r){return w(r).Ea.size===0}function uc(r){r.Va=void 0}async function gd(r){r.Ra.set("Online")}async function pd(r){r.Ia.forEach(((e,t)=>{mi(r,e)}))}async function yd(r,e){uc(r),gi(r)?(r.Ra.ha(e),_i(r)):r.Ra.set("Unknown")}async function Id(r,e,t){if(r.Ra.set("Online"),e instanceof Iu&&e.state===2&&e.cause)try{await(async function(s,i){const o=i.cause;for(const a of i.targetIds)s.Ia.has(a)&&(await s.remoteSyncer.rejectListen(a,o),s.Ia.delete(a),s.Va.removeTarget(a))})(r,e)}catch(n){g(pt,"Failed to remove targets %s: %s ",e.targetIds.join(","),n),await Cr(r,n)}else if(e instanceof ur?r.Va.Ze(e):e instanceof yu?r.Va.st(e):r.Va.tt(e),!t.isEqual(R.min()))try{const n=await Ju(r.localStore);t.compareTo(n)>=0&&await(function(i,o){const a=i.Va.Tt(o);return a.targetChanges.forEach(((u,c)=>{if(u.resumeToken.approximateByteSize()>0){const l=i.Ia.get(c);l&&i.Ia.set(c,l.withResumeToken(u.resumeToken,o))}})),a.targetMismatches.forEach(((u,c)=>{const l=i.Ia.get(u);if(!l)return;i.Ia.set(u,l.withResumeToken($.EMPTY_BYTE_STRING,l.snapshotVersion)),ac(i,u);const h=new Pe(l.target,u,c,l.sequenceNumber);mi(i,h)})),i.remoteSyncer.applyRemoteEvent(a)})(r,t)}catch(n){g(pt,"Failed to raise snapshot:",n),await Cr(r,n)}}async function Cr(r,e,t){if(!je(e))throw e;r.Ea.add(1),await Un(r),r.Ra.set("Offline"),t||(t=()=>Ju(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{g(pt,"Retrying IndexedDB access"),await t(),r.Ea.delete(1),await Hr(r)}))}function cc(r,e){return e().catch((t=>Cr(r,t,e)))}async function Xt(r){const e=w(r),t=Ge(e);let n=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:it;for(;Td(e);)try{const s=await sd(e.localStore,n);if(s===null){e.Ta.length===0&&t.L_();break}n=s.batchId,Ed(e,s)}catch(s){await Cr(e,s)}lc(e)&&hc(e)}function Td(r){return yt(r)&&r.Ta.length<10}function Ed(r,e){r.Ta.push(e);const t=Ge(r);t.O_()&&t.X_&&t.ea(e.mutations)}function lc(r){return yt(r)&&!Ge(r).x_()&&r.Ta.length>0}function hc(r){Ge(r).start()}async function Ad(r){Ge(r).ra()}async function wd(r){const e=Ge(r);for(const t of r.Ta)e.ea(t.mutations)}async function vd(r,e,t){const n=r.Ta.shift(),s=ni.from(n,e,t);await cc(r,(()=>r.remoteSyncer.applySuccessfulWrite(s))),await Xt(r)}async function Rd(r,e){e&&Ge(r).X_&&await(async function(n,s){if((function(o){return uh(o)&&o!==m.ABORTED})(s.code)){const i=n.Ta.shift();Ge(n).B_(),await cc(n,(()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s))),await Xt(n)}})(r,e),lc(r)&&hc(r)}async function Zo(r,e){const t=w(r);t.asyncQueue.verifyOperationInProgress(),g(pt,"RemoteStore received new credentials");const n=yt(t);t.Ea.add(3),await Un(t),n&&t.Ra.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ea.delete(3),await Hr(t)}async function Ms(r,e){const t=w(r);e?(t.Ea.delete(2),await Hr(t)):e||(t.Ea.add(2),await Un(t),t.Ra.set("Unknown"))}function Zt(r){return r.ma||(r.ma=(function(t,n,s){const i=w(t);return i.sa(),new ld(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Xo:gd.bind(null,r),t_:pd.bind(null,r),r_:yd.bind(null,r),H_:Id.bind(null,r)}),r.da.push((async e=>{e?(r.ma.B_(),gi(r)?_i(r):r.Ra.set("Unknown")):(await r.ma.stop(),uc(r))}))),r.ma}function Ge(r){return r.fa||(r.fa=(function(t,n,s){const i=w(t);return i.sa(),new hd(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Xo:()=>Promise.resolve(),t_:Ad.bind(null,r),r_:Rd.bind(null,r),ta:wd.bind(null,r),na:vd.bind(null,r)}),r.da.push((async e=>{e?(r.fa.B_(),await Xt(r)):(await r.fa.stop(),r.Ta.length>0&&(g(pt,`Stopping write stream with ${r.Ta.length} pending writes`),r.Ta=[]))}))),r.fa}/**
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
 */class pi{constructor(e,t,n,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=s,this.removalCallback=i,this.deferred=new Ee,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,s,i){const o=Date.now()+n,a=new pi(e,t,o,s,i);return a.start(n),a}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new p(m.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function yi(r,e){if(K("AsyncQueue",`${e}: ${r}`),je(r))return new p(m.UNAVAILABLE,`${e}: ${r}`);throw r}/**
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
 */class Dt{static emptySet(e){return new Dt(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||y.comparator(t.key,n.key):(t,n)=>y.comparator(t.key,n.key),this.keyedMap=un(),this.sortedSet=new O(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,n)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Dt)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new Dt;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
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
 */class ea{constructor(){this.ga=new O(y.comparator)}track(e){const t=e.doc.key,n=this.ga.get(t);n?e.type!==0&&n.type===3?this.ga=this.ga.insert(t,e):e.type===3&&n.type!==1?this.ga=this.ga.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.ga=this.ga.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.ga=this.ga.remove(t):e.type===1&&n.type===2?this.ga=this.ga.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):E(63341,{Rt:e,pa:n}):this.ga=this.ga.insert(t,e)}ya(){const e=[];return this.ga.inorderTraversal(((t,n)=>{e.push(n)})),e}}class Wt{constructor(e,t,n,s,i,o,a,u,c){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=u,this.hasCachedResults=c}static fromInitialDocuments(e,t,n,s,i){const o=[];return t.forEach((a=>{o.push({type:0,doc:a})})),new Wt(e,t,Dt.emptySet(t),o,n,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&zr(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==n[s].type||!t[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
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
 */class Vd{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some((e=>e.Da()))}}class Pd{constructor(){this.queries=ta(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(t,n){const s=w(t),i=s.queries;s.queries=ta(),i.forEach(((o,a)=>{for(const u of a.Sa)u.onError(n)}))})(this,new p(m.ABORTED,"Firestore shutting down"))}}function ta(){return new De((r=>nu(r)),zr)}async function Ii(r,e){const t=w(r);let n=3;const s=e.query;let i=t.queries.get(s);i?!i.ba()&&e.Da()&&(n=2):(i=new Vd,n=e.Da()?0:1);try{switch(n){case 0:i.wa=await t.onListen(s,!0);break;case 1:i.wa=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(o){const a=yi(o,`Initialization of query '${Vt(e.query)}' failed`);return void e.onError(a)}t.queries.set(s,i),i.Sa.push(e),e.va(t.onlineState),i.wa&&e.Fa(i.wa)&&Ei(t)}async function Ti(r,e){const t=w(r),n=e.query;let s=3;const i=t.queries.get(n);if(i){const o=i.Sa.indexOf(e);o>=0&&(i.Sa.splice(o,1),i.Sa.length===0?s=e.Da()?0:1:!i.ba()&&e.Da()&&(s=2))}switch(s){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function Sd(r,e){const t=w(r);let n=!1;for(const s of e){const i=s.query,o=t.queries.get(i);if(o){for(const a of o.Sa)a.Fa(s)&&(n=!0);o.wa=s}}n&&Ei(t)}function bd(r,e,t){const n=w(r),s=n.queries.get(e);if(s)for(const i of s.Sa)i.onError(t);n.queries.delete(e)}function Ei(r){r.Ca.forEach((e=>{e.next()}))}var Fs,na;(na=Fs||(Fs={})).Ma="default",na.Cache="cache";class Ai{constructor(e,t,n){this.query=e,this.xa=t,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=n||{}}Fa(e){if(!this.options.includeMetadataChanges){const n=[];for(const s of e.docChanges)s.type!==3&&n.push(s);e=new Wt(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),t=!0):this.La(e,this.onlineState)&&(this.ka(e),t=!0),this.Na=e,t}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let t=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),t=!0),t}La(e,t){if(!e.fromCache||!this.Da())return!0;const n=t!=="Offline";return(!this.options.qa||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Ba(e){if(e.docChanges.length>0)return!0;const t=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}ka(e){e=Wt.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==Fs.Cache}}/**
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
 */class dc{constructor(e){this.key=e}}class fc{constructor(e){this.key=e}}class Cd{constructor(e,t){this.query=e,this.Ya=t,this.Za=null,this.hasCachedResults=!1,this.current=!1,this.Xa=S(),this.mutatedKeys=S(),this.eu=su(e),this.tu=new Dt(this.eu)}get nu(){return this.Ya}ru(e,t){const n=t?t.iu:new ea,s=t?t.tu:this.tu;let i=t?t.mutatedKeys:this.mutatedKeys,o=s,a=!1;const u=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,c=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal(((l,h)=>{const f=s.get(l),_=Fn(this.query,h)?h:null,I=!!f&&this.mutatedKeys.has(f.key),A=!!_&&(_.hasLocalMutations||this.mutatedKeys.has(_.key)&&_.hasCommittedMutations);let T=!1;f&&_?f.data.isEqual(_.data)?I!==A&&(n.track({type:3,doc:_}),T=!0):this.su(f,_)||(n.track({type:2,doc:_}),T=!0,(u&&this.eu(_,u)>0||c&&this.eu(_,c)<0)&&(a=!0)):!f&&_?(n.track({type:0,doc:_}),T=!0):f&&!_&&(n.track({type:1,doc:f}),T=!0,(u||c)&&(a=!0)),T&&(_?(o=o.add(_),i=A?i.add(l):i.delete(l)):(o=o.delete(l),i=i.delete(l)))})),this.query.limit!==null)for(;o.size>this.query.limit;){const l=this.query.limitType==="F"?o.last():o.first();o=o.delete(l.key),i=i.delete(l.key),n.track({type:1,doc:l})}return{tu:o,iu:n,Cs:a,mutatedKeys:i}}su(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,s){const i=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;const o=e.iu.ya();o.sort(((l,h)=>(function(_,I){const A=T=>{switch(T){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return E(20277,{Rt:T})}};return A(_)-A(I)})(l.type,h.type)||this.eu(l.doc,h.doc))),this.ou(n),s=s??!1;const a=t&&!s?this._u():[],u=this.Xa.size===0&&this.current&&!s?1:0,c=u!==this.Za;return this.Za=u,o.length!==0||c?{snapshot:new Wt(this.query,e.tu,i,o,e.mutatedKeys,u===0,c,!1,!!n&&n.resumeToken.approximateByteSize()>0),au:a}:{au:a}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new ea,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{au:[]}}uu(e){return!this.Ya.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach((t=>this.Ya=this.Ya.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ya=this.Ya.delete(t))),this.current=e.current)}_u(){if(!this.current)return[];const e=this.Xa;this.Xa=S(),this.tu.forEach((n=>{this.uu(n.key)&&(this.Xa=this.Xa.add(n.key))}));const t=[];return e.forEach((n=>{this.Xa.has(n)||t.push(new fc(n))})),this.Xa.forEach((n=>{e.has(n)||t.push(new dc(n))})),t}cu(e){this.Ya=e.Qs,this.Xa=S();const t=this.ru(e.documents);return this.applyChanges(t,!0)}lu(){return Wt.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Za===0,this.hasCachedResults)}}const en="SyncEngine";class Dd{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class xd{constructor(e){this.key=e,this.hu=!1}}class Nd{constructor(e,t,n,s,i,o){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Pu={},this.Tu=new De((a=>nu(a)),zr),this.Iu=new Map,this.Eu=new Set,this.du=new O(y.comparator),this.Au=new Map,this.Ru=new ui,this.Vu={},this.mu=new Map,this.fu=gt.cr(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function kd(r,e,t=!0){const n=Yr(r);let s;const i=n.Tu.get(e);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.lu()):s=await mc(n,e,t,!0),s}async function Md(r,e){const t=Yr(r);await mc(t,e,!0,!1)}async function mc(r,e,t,n){const s=await Pr(r.localStore,he(e)),i=s.targetId,o=r.sharedClientState.addLocalQueryTarget(i,t);let a;return n&&(a=await wi(r,e,i,o==="current",s.resumeToken)),r.isPrimaryClient&&t&&Jr(r.remoteStore,s),a}async function wi(r,e,t,n,s){r.pu=(h,f,_)=>(async function(A,T,N,C){let P=T.view.ru(N);P.Cs&&(P=await xs(A.localStore,T.query,!1).then((({documents:oe})=>T.view.ru(oe,P))));const W=C&&C.targetChanges.get(T.targetId),U=C&&C.targetMismatches.get(T.targetId)!=null,G=T.view.applyChanges(P,A.isPrimaryClient,W,U);return Os(A,T.targetId,G.au),G.snapshot})(r,h,f,_);const i=await xs(r.localStore,e,!0),o=new Cd(e,i.Qs),a=o.ru(i.documents),u=qn.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",s),c=o.applyChanges(a,r.isPrimaryClient,u);Os(r,t,c.au);const l=new Dd(e,t,o);return r.Tu.set(e,l),r.Iu.has(t)?r.Iu.get(t).push(e):r.Iu.set(t,[e]),c.snapshot}async function Fd(r,e,t){const n=w(r),s=n.Tu.get(e),i=n.Iu.get(s.targetId);if(i.length>1)return n.Iu.set(s.targetId,i.filter((o=>!zr(o,e)))),void n.Tu.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await jt(n.localStore,s.targetId,!1).then((()=>{n.sharedClientState.clearQueryState(s.targetId),t&&Qt(n.remoteStore,s.targetId),Ht(n,s.targetId)})).catch($e)):(Ht(n,s.targetId),await jt(n.localStore,s.targetId,!0))}async function Od(r,e){const t=w(r),n=t.Tu.get(e),s=t.Iu.get(n.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),Qt(t.remoteStore,n.targetId))}async function Ld(r,e,t){const n=Pi(r);try{const s=await(function(o,a){const u=w(o),c=k.now(),l=a.reduce(((_,I)=>_.add(I.key)),S());let h,f;return u.persistence.runTransaction("Locally write mutations","readwrite",(_=>{let I=le(),A=S();return u.Ns.getEntries(_,l).next((T=>{I=T,I.forEach(((N,C)=>{C.isValidDocument()||(A=A.add(N))}))})).next((()=>u.localDocuments.getOverlayedDocuments(_,I))).next((T=>{h=T;const N=[];for(const C of a){const P=oh(C,h.get(C.key).overlayedDocument);P!=null&&N.push(new xe(C.key,P,Qa(P.value.mapValue),H.exists(!0)))}return u.mutationQueue.addMutationBatch(_,c,N,a)})).next((T=>{f=T;const N=T.applyToLocalDocumentSet(h,A);return u.documentOverlayCache.saveOverlays(_,T.batchId,N)}))})).then((()=>({batchId:f.batchId,changes:ou(h)})))})(n.localStore,e);n.sharedClientState.addPendingMutation(s.batchId),(function(o,a,u){let c=o.Vu[o.currentUser.toKey()];c||(c=new O(V)),c=c.insert(a,u),o.Vu[o.currentUser.toKey()]=c})(n,s.batchId,t),await We(n,s.changes),await Xt(n.remoteStore)}catch(s){const i=yi(s,"Failed to persist write");t.reject(i)}}async function _c(r,e){const t=w(r);try{const n=await nd(t.localStore,e);e.targetChanges.forEach(((s,i)=>{const o=t.Au.get(i);o&&(v(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.hu=!0:s.modifiedDocuments.size>0?v(o.hu,14607):s.removedDocuments.size>0&&(v(o.hu,42227),o.hu=!1))})),await We(t,n,e)}catch(n){await $e(n)}}function ra(r,e,t){const n=w(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const s=[];n.Tu.forEach(((i,o)=>{const a=o.view.va(e);a.snapshot&&s.push(a.snapshot)})),(function(o,a){const u=w(o);u.onlineState=a;let c=!1;u.queries.forEach(((l,h)=>{for(const f of h.Sa)f.va(a)&&(c=!0)})),c&&Ei(u)})(n.eventManager,e),s.length&&n.Pu.H_(s),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function qd(r,e,t){const n=w(r);n.sharedClientState.updateQueryState(e,"rejected",t);const s=n.Au.get(e),i=s&&s.key;if(i){let o=new O(y.comparator);o=o.insert(i,B.newNoDocument(i,R.min()));const a=S().add(i),u=new Ln(R.min(),new Map,new O(V),o,a);await _c(n,u),n.du=n.du.remove(i),n.Au.delete(e),Vi(n)}else await jt(n.localStore,e,!1).then((()=>Ht(n,e,t))).catch($e)}async function Ud(r,e){const t=w(r),n=e.batch.batchId;try{const s=await td(t.localStore,e);Ri(t,n,null),vi(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await We(t,s)}catch(s){await $e(s)}}async function Bd(r,e,t){const n=w(r);try{const s=await(function(o,a){const u=w(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",(c=>{let l;return u.mutationQueue.lookupMutationBatch(c,a).next((h=>(v(h!==null,37113),l=h.keys(),u.mutationQueue.removeMutationBatch(c,h)))).next((()=>u.mutationQueue.performConsistencyCheck(c))).next((()=>u.documentOverlayCache.removeOverlaysForBatchId(c,l,a))).next((()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(c,l))).next((()=>u.localDocuments.getDocuments(c,l)))}))})(n.localStore,e);Ri(n,e,t),vi(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await We(n,s)}catch(s){await $e(s)}}function vi(r,e){(r.mu.get(e)||[]).forEach((t=>{t.resolve()})),r.mu.delete(e)}function Ri(r,e,t){const n=w(r);let s=n.Vu[n.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),n.Vu[n.currentUser.toKey()]=s}}function Ht(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.Iu.get(e))r.Tu.delete(n),t&&r.Pu.yu(n,t);r.Iu.delete(e),r.isPrimaryClient&&r.Ru.jr(e).forEach((n=>{r.Ru.containsKey(n)||gc(r,n)}))}function gc(r,e){r.Eu.delete(e.path.canonicalString());const t=r.du.get(e);t!==null&&(Qt(r.remoteStore,t),r.du=r.du.remove(e),r.Au.delete(t),Vi(r))}function Os(r,e,t){for(const n of t)n instanceof dc?(r.Ru.addReference(n.key,e),zd(r,n)):n instanceof fc?(g(en,"Document no longer in limbo: "+n.key),r.Ru.removeReference(n.key,e),r.Ru.containsKey(n.key)||gc(r,n.key)):E(19791,{wu:n})}function zd(r,e){const t=e.key,n=t.path.canonicalString();r.du.get(t)||r.Eu.has(n)||(g(en,"New document in limbo: "+t),r.Eu.add(n),Vi(r))}function Vi(r){for(;r.Eu.size>0&&r.du.size<r.maxConcurrentLimboResolutions;){const e=r.Eu.values().next().value;r.Eu.delete(e);const t=new y(x.fromString(e)),n=r.fu.next();r.Au.set(n,new xd(t)),r.du=r.du.insert(t,n),Jr(r.remoteStore,new Pe(he(Mn(t.path)),n,"TargetPurposeLimboResolution",ae.ce))}}async function We(r,e,t){const n=w(r),s=[],i=[],o=[];n.Tu.isEmpty()||(n.Tu.forEach(((a,u)=>{o.push(n.pu(u,e,t).then((c=>{if((c||t)&&n.isPrimaryClient){const l=c?!c.fromCache:t?.targetChanges.get(u.targetId)?.current;n.sharedClientState.updateQueryState(u.targetId,l?"current":"not-current")}if(c){s.push(c);const l=hi.As(u.targetId,c);i.push(l)}})))})),await Promise.all(o),n.Pu.H_(s),await(async function(u,c){const l=w(u);try{await l.persistence.runTransaction("notifyLocalViewChanges","readwrite",(h=>d.forEach(c,(f=>d.forEach(f.Es,(_=>l.persistence.referenceDelegate.addReference(h,f.targetId,_))).next((()=>d.forEach(f.ds,(_=>l.persistence.referenceDelegate.removeReference(h,f.targetId,_)))))))))}catch(h){if(!je(h))throw h;g(di,"Failed to update sequence numbers: "+h)}for(const h of c){const f=h.targetId;if(!h.fromCache){const _=l.Ms.get(f),I=_.snapshotVersion,A=_.withLastLimboFreeSnapshotVersion(I);l.Ms=l.Ms.insert(f,A)}}})(n.localStore,i))}async function Gd(r,e){const t=w(r);if(!t.currentUser.isEqual(e)){g(en,"User change. New user:",e.toKey());const n=await Hu(t.localStore,e);t.currentUser=e,(function(i,o){i.mu.forEach((a=>{a.forEach((u=>{u.reject(new p(m.CANCELLED,o))}))})),i.mu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await We(t,n.Ls)}}function Kd(r,e){const t=w(r),n=t.Au.get(e);if(n&&n.hu)return S().add(n.key);{let s=S();const i=t.Iu.get(e);if(!i)return s;for(const o of i){const a=t.Tu.get(o);s=s.unionWith(a.view.nu)}return s}}async function $d(r,e){const t=w(r),n=await xs(t.localStore,e.query,!0),s=e.view.cu(n);return t.isPrimaryClient&&Os(t,e.targetId,s.au),s}async function jd(r,e){const t=w(r);return Xu(t.localStore,e).then((n=>We(t,n)))}async function Qd(r,e,t,n){const s=w(r),i=await(function(a,u){const c=w(a),l=w(c.mutationQueue);return c.persistence.runTransaction("Lookup mutation documents","readonly",(h=>l.er(h,u).next((f=>f?c.localDocuments.getDocuments(h,f):d.resolve(null)))))})(s.localStore,e);i!==null?(t==="pending"?await Xt(s.remoteStore):t==="acknowledged"||t==="rejected"?(Ri(s,e,n||null),vi(s,e),(function(a,u){w(w(a).mutationQueue).ir(u)})(s.localStore,e)):E(6720,"Unknown batchState",{Su:t}),await We(s,i)):g(en,"Cannot apply mutation batch with id: "+e)}async function Wd(r,e){const t=w(r);if(Yr(t),Pi(t),e===!0&&t.gu!==!0){const n=t.sharedClientState.getAllActiveQueryTargets(),s=await sa(t,n.toArray());t.gu=!0,await Ms(t.remoteStore,!0);for(const i of s)Jr(t.remoteStore,i)}else if(e===!1&&t.gu!==!1){const n=[];let s=Promise.resolve();t.Iu.forEach(((i,o)=>{t.sharedClientState.isLocalQueryTarget(o)?n.push(o):s=s.then((()=>(Ht(t,o),jt(t.localStore,o,!0)))),Qt(t.remoteStore,o)})),await s,await sa(t,n),(function(o){const a=w(o);a.Au.forEach(((u,c)=>{Qt(a.remoteStore,c)})),a.Ru.Jr(),a.Au=new Map,a.du=new O(y.comparator)})(t),t.gu=!1,await Ms(t.remoteStore,!1)}}async function sa(r,e,t){const n=w(r),s=[],i=[];for(const o of e){let a;const u=n.Iu.get(o);if(u&&u.length!==0){a=await Pr(n.localStore,he(u[0]));for(const c of u){const l=n.Tu.get(c),h=await $d(n,l);h.snapshot&&i.push(h.snapshot)}}else{const c=await Yu(n.localStore,o);a=await Pr(n.localStore,c),await wi(n,pc(c),o,!1,a.resumeToken)}s.push(a)}return n.Pu.H_(i),s}function pc(r){return tu(r.path,r.collectionGroup,r.orderBy,r.filters,r.limit,"F",r.startAt,r.endAt)}function Hd(r){return(function(t){return w(w(t).persistence).Ts()})(w(r).localStore)}async function Jd(r,e,t,n){const s=w(r);if(s.gu)return void g(en,"Ignoring unexpected query state notification.");const i=s.Iu.get(e);if(i&&i.length>0)switch(t){case"current":case"not-current":{const o=await Xu(s.localStore,ru(i[0])),a=Ln.createSynthesizedRemoteEventForCurrentChange(e,t==="current",$.EMPTY_BYTE_STRING);await We(s,o,a);break}case"rejected":await jt(s.localStore,e,!0),Ht(s,e,n);break;default:E(64155,t)}}async function Yd(r,e,t){const n=Yr(r);if(n.gu){for(const s of e){if(n.Iu.has(s)&&n.sharedClientState.isActiveQueryTarget(s)){g(en,"Adding an already active target "+s);continue}const i=await Yu(n.localStore,s),o=await Pr(n.localStore,i);await wi(n,pc(i),o.targetId,!1,o.resumeToken),Jr(n.remoteStore,o)}for(const s of t)n.Iu.has(s)&&await jt(n.localStore,s,!1).then((()=>{Qt(n.remoteStore,s),Ht(n,s)})).catch($e)}}function Yr(r){const e=w(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=_c.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Kd.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=qd.bind(null,e),e.Pu.H_=Sd.bind(null,e.eventManager),e.Pu.yu=bd.bind(null,e.eventManager),e}function Pi(r){const e=w(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Ud.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Bd.bind(null,e),e}class Cn{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Wr(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,t){return null}Mu(e,t){return null}vu(e){return Wu(this.persistence,new Qu,e.initialUser,this.serializer)}Cu(e){return new ci(Qr.mi,this.serializer)}Du(e){return new rc}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Cn.provider={build:()=>new Cn};class Xd extends Cn{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,t){v(this.persistence.referenceDelegate instanceof Vr,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new Bu(n,e.asyncQueue,t)}Cu(e){const t=this.cacheSizeBytes!==void 0?te.withCacheSize(this.cacheSizeBytes):te.DEFAULT;return new ci((n=>Vr.mi(n,t)),this.serializer)}}class yc extends Cn{constructor(e,t,n){super(),this.xu=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.xu.initialize(this,e),await Pi(this.xu.syncEngine),await Xt(this.xu.remoteStore),await this.persistence.Ji((()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve())))}vu(e){return Wu(this.persistence,new Qu,e.initialUser,this.serializer)}Fu(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new Bu(n,e.asyncQueue,t)}Mu(e,t){const n=new ll(t,this.persistence);return new cl(e.asyncQueue,n)}Cu(e){const t=ju(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=this.cacheSizeBytes!==void 0?te.withCacheSize(this.cacheSizeBytes):te.DEFAULT;return new li(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,sc(),lr(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Du(e){return new rc}}class Zd extends yc{constructor(e,t){super(e,t,!1),this.xu=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.xu.syncEngine;this.sharedClientState instanceof cs&&(this.sharedClientState.syncEngine={Co:Qd.bind(null,t),vo:Jd.bind(null,t),Fo:Yd.bind(null,t),Ts:Hd.bind(null,t),Do:jd.bind(null,t)},await this.sharedClientState.start()),await this.persistence.Ji((async n=>{await Wd(this.xu.syncEngine,n),this.gcScheduler&&(n&&!this.gcScheduler.started?this.gcScheduler.start():n||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(n&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():n||this.indexBackfillerScheduler.stop())}))}Du(e){const t=sc();if(!cs.v(t))throw new p(m.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=ju(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new cs(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class Dn{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>ra(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=Gd.bind(null,this.syncEngine),await Ms(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new Pd})()}createDatastore(e){const t=Wr(e.databaseInfo.databaseId),n=(function(i){return new cd(i)})(e.databaseInfo);return(function(i,o,a,u){return new fd(i,o,a,u)})(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return(function(n,s,i,o,a){return new _d(n,s,i,o,a)})(this.localStore,this.datastore,e.asyncQueue,(t=>ra(this.syncEngine,t,0)),(function(){return Yo.v()?new Yo:new id})())}createSyncEngine(e,t){return(function(s,i,o,a,u,c,l){const h=new Nd(s,i,o,a,u,c);return l&&(h.gu=!0),h})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){await(async function(t){const n=w(t);g(pt,"RemoteStore shutting down."),n.Ea.add(5),await Un(n),n.Aa.shutdown(),n.Ra.set("Unknown")})(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}}Dn.provider={build:()=>new Dn};/**
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
 *//**
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
 */class Si{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):K("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
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
 */const Ke="FirestoreClient";class ef{constructor(e,t,n,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=s,this.user=ee.UNAUTHENTICATED,this.clientId=Us.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,(async o=>{g(Ke,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(n,(o=>(g(Ke,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Ee;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=yi(t,"Failed to shutdown persistence");e.reject(n)}})),e.promise}}async function hs(r,e){r.asyncQueue.verifyOperationInProgress(),g(Ke,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener((async s=>{n.isEqual(s)||(await Hu(e.localStore,s),n=s)})),e.persistence.setDatabaseDeletedListener((()=>r.terminate())),r._offlineComponents=e}async function ia(r,e){r.asyncQueue.verifyOperationInProgress();const t=await tf(r);g(Ke,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((n=>Zo(e.remoteStore,n))),r.setAppCheckTokenChangeListener(((n,s)=>Zo(e.remoteStore,s))),r._onlineComponents=e}async function tf(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){g(Ke,"Using user provided OfflineComponentProvider");try{await hs(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===m.FAILED_PRECONDITION||s.code===m.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;Tn("Error using user provided cache. Falling back to memory cache: "+t),await hs(r,new Cn)}}else g(Ke,"Using default OfflineComponentProvider"),await hs(r,new Xd(void 0));return r._offlineComponents}async function Ic(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(g(Ke,"Using user provided OnlineComponentProvider"),await ia(r,r._uninitializedComponentsProvider._online)):(g(Ke,"Using default OnlineComponentProvider"),await ia(r,new Dn))),r._onlineComponents}function nf(r){return Ic(r).then((e=>e.syncEngine))}async function Dr(r){const e=await Ic(r),t=e.eventManager;return t.onListen=kd.bind(null,e.syncEngine),t.onUnlisten=Fd.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=Md.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Od.bind(null,e.syncEngine),t}function rf(r,e,t={}){const n=new Ee;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,a,u,c){const l=new Si({next:f=>{l.Nu(),o.enqueueAndForget((()=>Ti(i,h)));const _=f.docs.has(a);!_&&f.fromCache?c.reject(new p(m.UNAVAILABLE,"Failed to get document because the client is offline.")):_&&f.fromCache&&u&&u.source==="server"?c.reject(new p(m.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):c.resolve(f)},error:f=>c.reject(f)}),h=new Ai(Mn(a.path),l,{includeMetadataChanges:!0,qa:!0});return Ii(i,h)})(await Dr(r),r.asyncQueue,e,t,n))),n.promise}function sf(r,e,t={}){const n=new Ee;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,a,u,c){const l=new Si({next:f=>{l.Nu(),o.enqueueAndForget((()=>Ti(i,h))),f.fromCache&&u.source==="server"?c.reject(new p(m.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):c.resolve(f)},error:f=>c.reject(f)}),h=new Ai(a,l,{includeMetadataChanges:!0,qa:!0});return Ii(i,h)})(await Dr(r),r.asyncQueue,e,t,n))),n.promise}/**
 * @license
 * Copyright 2023 Google LLC
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
 */function Tc(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
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
 */const oa=new Map;/**
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
 */const of="firestore.googleapis.com",aa=!0;class ua{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new p(m.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=of,this.ssl=aa}else this.host=e.host,this.ssl=e.ssl??aa;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Fu;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Uu)throw new p(m.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}ol("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Tc(e.experimentalLongPollingOptions??{}),(function(n){if(n.timeoutSeconds!==void 0){if(isNaN(n.timeoutSeconds))throw new p(m.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (must not be NaN)`);if(n.timeoutSeconds<5)throw new p(m.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (minimum allowed value is 5)`);if(n.timeoutSeconds>30)throw new p(m.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(n,s){return n.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Xr{constructor(e,t,n,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ua({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new p(m.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new p(m.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ua(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(n){if(!n)return new Yc;switch(n.type){case"firstParty":return new el(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new p(m.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const n=oa.get(t);n&&(g("ComponentProvider","Removing Datastore"),oa.delete(t),n.terminate())})(this),Promise.resolve()}}/**
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
 */class _e{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new _e(this.firestore,e,this._query)}}class z{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new qe(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new z(this.firestore,e,this._key)}toJSON(){return{type:z._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(xn(t,z._jsonSchema))return new z(e,n||null,new y(x.fromString(t.referencePath)))}}z._jsonSchemaVersion="firestore/documentReference/1.0",z._jsonSchema={type:Q("string",z._jsonSchemaVersion),referencePath:Q("string")};class qe extends _e{constructor(e,t,n){super(e,t,Mn(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new z(this.firestore,null,new y(e))}withConverter(e){return new qe(this.firestore,e,this._path)}}function Pf(r,e,...t){if(r=de(r),Bs("collection","path",e),r instanceof Xr){const n=x.fromString(e,...t);return Yi(n),new qe(r,null,n)}{if(!(r instanceof z||r instanceof qe))throw new p(m.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(x.fromString(e,...t));return Yi(n),new qe(r.firestore,null,n)}}function Sf(r,e){if(r=se(r,Xr),Bs("collectionGroup","collection id",e),e.indexOf("/")>=0)throw new p(m.INVALID_ARGUMENT,`Invalid collection ID '${e}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new _e(r,null,(function(n){return new Ce(x.emptyPath(),n)})(e))}function af(r,e,...t){if(r=de(r),arguments.length===1&&(e=Us.newId()),Bs("doc","path",e),r instanceof Xr){const n=x.fromString(e,...t);return Ji(n),new z(r,null,new y(n))}{if(!(r instanceof z||r instanceof qe))throw new p(m.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(x.fromString(e,...t));return Ji(n),new z(r.firestore,r instanceof qe?r.converter:null,new y(n))}}/**
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
 */const ca="AsyncQueue";class la{constructor(e=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new ic(this,"async_queue_retry"),this._c=()=>{const n=lr();n&&g(ca,"Visibility state changed to "+n.visibilityState),this.M_.w_()},this.ac=e;const t=lr();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=lr();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise((()=>{}));const t=new Ee;return this.cc((()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Xu.push(e),this.lc())))}async lc(){if(this.Xu.length!==0){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(e){if(!je(e))throw e;g(ca,"Operation failed with retryable error: "+e)}this.Xu.length>0&&this.M_.p_((()=>this.lc()))}}cc(e){const t=this.ac.then((()=>(this.rc=!0,e().catch((n=>{throw this.nc=n,this.rc=!1,K("INTERNAL UNHANDLED ERROR: ",ha(n)),n})).then((n=>(this.rc=!1,n))))));return this.ac=t,t}enqueueAfterDelay(e,t,n){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const s=pi.createAndSchedule(this,e,t,n,(i=>this.hc(i)));return this.tc.push(s),s}uc(){this.nc&&E(47125,{Pc:ha(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ic(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ec(e){return this.Tc().then((()=>{this.tc.sort(((t,n)=>t.targetTimeMs-n.targetTimeMs));for(const t of this.tc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Tc()}))}dc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function ha(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),e}/**
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
 */function da(r){return(function(t,n){if(typeof t!="object"||t===null)return!1;const s=t;for(const i of n)if(i in s&&typeof s[i]=="function")return!0;return!1})(r,["next","error","complete"])}class Re extends Xr{constructor(e,t,n,s){super(e,t,n,s),this.type="firestore",this._queue=new la,this._persistenceKey=s?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new la(e),this._firestoreClient=void 0,await e}}}function bf(r,e,t){t||(t=pr);const n=Mc(r,"firestore");if(n.isInitialized(t)){const s=n.getImmediate({identifier:t}),i=n.getOptions(t);if(Uc(i,e))return s;throw new p(m.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new p(m.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<Uu)throw new p(m.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&_a(e.host)&&Bc(e.host),n.initialize({options:e,instanceIdentifier:t})}function Bn(r){if(r._terminated)throw new p(m.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||uf(r),r._firestoreClient}function uf(r){const e=r._freezeSettings(),t=(function(s,i,o,a){return new Ll(s,i,o,a.host,a.ssl,a.experimentalForceLongPolling,a.experimentalAutoDetectLongPolling,Tc(a.experimentalLongPollingOptions),a.useFetchStreams,a.isUsingEmulator)})(r._databaseId,r._app?.options.appId||"",r._persistenceKey,e);r._componentsProvider||e.localCache?._offlineComponentProvider&&e.localCache?._onlineComponentProvider&&(r._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),r._firestoreClient=new ef(r._authCredentials,r._appCheckCredentials,r._queue,t,r._componentsProvider&&(function(s){const i=s?._online.build();return{_offline:s?._offline.build(i),_online:i}})(r._componentsProvider))}/**
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
 */class me{constructor(e){this._byteString=e}static fromBase64String(e){try{return new me($.fromBase64String(e))}catch(t){throw new p(m.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new me($.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:me._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(xn(e,me._jsonSchema))return me.fromBase64String(e.bytes)}}me._jsonSchemaVersion="firestore/bytes/1.0",me._jsonSchema={type:Q("string",me._jsonSchemaVersion),bytes:Q("string")};/**
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
 */class zn{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new p(m.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new q(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class Gn{constructor(e){this._methodName=e}}/**
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
 */class Ae{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new p(m.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new p(m.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return V(this._lat,e._lat)||V(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Ae._jsonSchemaVersion}}static fromJSON(e){if(xn(e,Ae._jsonSchema))return new Ae(e.latitude,e.longitude)}}Ae._jsonSchemaVersion="firestore/geoPoint/1.0",Ae._jsonSchema={type:Q("string",Ae._jsonSchemaVersion),latitude:Q("number"),longitude:Q("number")};/**
 * @license
 * Copyright 2024 Google LLC
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
 */class we{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(n,s){if(n.length!==s.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:we._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(xn(e,we._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new we(e.vectorValues);throw new p(m.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}we._jsonSchemaVersion="firestore/vectorValue/1.0",we._jsonSchema={type:Q("string",we._jsonSchemaVersion),vectorValues:Q("object")};/**
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
 */const cf=/^__.*__$/;class lf{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new xe(e,this.data,this.fieldMask,t,this.fieldTransforms):new Yt(e,this.data,t,this.fieldTransforms)}}class Ec{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new xe(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Ac(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw E(40011,{Ac:r})}}class bi{constructor(e,t,n,s,i,o){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=s,i===void 0&&this.Rc(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Ac(){return this.settings.Ac}Vc(e){return new bi({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}mc(e){const t=this.path?.child(e),n=this.Vc({path:t,fc:!1});return n.gc(e),n}yc(e){const t=this.path?.child(e),n=this.Vc({path:t,fc:!1});return n.Rc(),n}wc(e){return this.Vc({path:void 0,fc:!0})}Sc(e){return xr(e,this.settings.methodName,this.settings.bc||!1,this.path,this.settings.Dc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Rc(){if(this.path)for(let e=0;e<this.path.length;e++)this.gc(this.path.get(e))}gc(e){if(e.length===0)throw this.Sc("Document fields must not be empty");if(Ac(this.Ac)&&cf.test(e))throw this.Sc('Document fields cannot begin and end with "__"')}}class hf{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||Wr(e)}Cc(e,t,n,s=!1){return new bi({Ac:e,methodName:t,Dc:n,path:q.emptyPath(),fc:!1,bc:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function tn(r){const e=r._freezeSettings(),t=Wr(r._databaseId);return new hf(r._databaseId,!!e.ignoreUndefinedProperties,t)}function Ci(r,e,t,n,s,i={}){const o=r.Cc(i.merge||i.mergeFields?2:0,e,t,s);Ni("Data must be an object, but it was:",o,n);const a=Vc(n,o);let u,c;if(i.merge)u=new ue(o.fieldMask),c=o.fieldTransforms;else if(i.mergeFields){const l=[];for(const h of i.mergeFields){const f=Ls(e,h,t);if(!o.contains(f))throw new p(m.INVALID_ARGUMENT,`Field '${f}' is specified in your field mask but missing from your input data.`);Sc(l,f)||l.push(f)}u=new ue(l),c=o.fieldTransforms.filter((h=>u.covers(h.field)))}else u=null,c=o.fieldTransforms;return new lf(new ne(a),u,c)}class Kn extends Gn{_toFieldTransform(e){if(e.Ac!==2)throw e.Ac===1?e.Sc(`${this._methodName}() can only appear at the top level of your update data`):e.Sc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Kn}}class Di extends Gn{_toFieldTransform(e){return new ei(e.path,new Bt)}isEqual(e){return e instanceof Di}}class xi extends Gn{constructor(e,t){super(e),this.Fc=t}_toFieldTransform(e){const t=new Kt(e.serializer,cu(e.serializer,this.Fc));return new ei(e.path,t)}isEqual(e){return e instanceof xi&&this.Fc===e.Fc}}function wc(r,e,t,n){const s=r.Cc(1,e,t);Ni("Data must be an object, but it was:",s,n);const i=[],o=ne.empty();Qe(n,((u,c)=>{const l=ki(e,u,t);c=de(c);const h=s.yc(l);if(c instanceof Kn)i.push(l);else{const f=$n(c,h);f!=null&&(i.push(l),o.set(l,f))}}));const a=new ue(i);return new Ec(o,a,s.fieldTransforms)}function vc(r,e,t,n,s,i){const o=r.Cc(1,e,t),a=[Ls(e,n,t)],u=[s];if(i.length%2!=0)throw new p(m.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let f=0;f<i.length;f+=2)a.push(Ls(e,i[f])),u.push(i[f+1]);const c=[],l=ne.empty();for(let f=a.length-1;f>=0;--f)if(!Sc(c,a[f])){const _=a[f];let I=u[f];I=de(I);const A=o.yc(_);if(I instanceof Kn)c.push(_);else{const T=$n(I,A);T!=null&&(c.push(_),l.set(_,T))}}const h=new ue(c);return new Ec(l,h,o.fieldTransforms)}function Rc(r,e,t,n=!1){return $n(t,r.Cc(n?4:3,e))}function $n(r,e){if(Pc(r=de(r)))return Ni("Unsupported field value:",e,r),Vc(r,e);if(r instanceof Gn)return(function(n,s){if(!Ac(s.Ac))throw s.Sc(`${n._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Sc(`${n._methodName}() is not currently supported inside arrays`);const i=n._toFieldTransform(s);i&&s.fieldTransforms.push(i)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.fc&&e.Ac!==4)throw e.Sc("Nested arrays are not supported");return(function(n,s){const i=[];let o=0;for(const a of n){let u=$n(a,s.wc(o));u==null&&(u={nullValue:"NULL_VALUE"}),i.push(u),o++}return{arrayValue:{values:i}}})(r,e)}return(function(n,s){if((n=de(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return cu(s.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const i=k.fromDate(n);return{timestampValue:$t(s.serializer,i)}}if(n instanceof k){const i=new k(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:$t(s.serializer,i)}}if(n instanceof Ae)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof me)return{bytesValue:Tu(s.serializer,n._byteString)};if(n instanceof z){const i=s.databaseId,o=n.firestore._databaseId;if(!o.isEqual(i))throw s.Sc(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:ii(n.firestore._databaseId||s.databaseId,n._key.path)}}if(n instanceof we)return(function(o,a){return{mapValue:{fields:{[Ws]:{stringValue:Hs},[Lt]:{arrayValue:{values:o.toArray().map((c=>{if(typeof c!="number")throw a.Sc("VectorValues must only contain numeric values.");return Zs(a.serializer,c)}))}}}}}})(n,s);throw s.Sc(`Unsupported field value: ${Nr(n)}`)})(r,e)}function Vc(r,e){const t={};return La(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Qe(r,((n,s)=>{const i=$n(s,e.mc(n));i!=null&&(t[n]=i)})),{mapValue:{fields:t}}}function Pc(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof k||r instanceof Ae||r instanceof me||r instanceof z||r instanceof Gn||r instanceof we)}function Ni(r,e,t){if(!Pc(t)||!Ta(t)){const n=Nr(t);throw n==="an object"?e.Sc(r+" a custom object"):e.Sc(r+" "+n)}}function Ls(r,e,t){if((e=de(e))instanceof zn)return e._internalPath;if(typeof e=="string")return ki(r,e);throw xr("Field path arguments must be of type string or ",r,!1,void 0,t)}const df=new RegExp("[~\\*/\\[\\]]");function ki(r,e,t){if(e.search(df)>=0)throw xr(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new zn(...e.split("."))._internalPath}catch{throw xr(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function xr(r,e,t,n,s){const i=n&&!n.isEmpty(),o=s!==void 0;let a=`Function ${e}() called with invalid data`;t&&(a+=" (via `toFirestore()`)"),a+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${n}`),o&&(u+=` in document ${s}`),u+=")"),new p(m.INVALID_ARGUMENT,a+r+u)}function Sc(r,e){return r.some((t=>t.isEqual(e)))}/**
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
 */class Mi{constructor(e,t,n,s,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new z(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new ff(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Zr("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class ff extends Mi{data(){return super.data()}}function Zr(r,e){return typeof e=="string"?ki(r,e):e instanceof zn?e._internalPath:e._delegate._internalPath}/**
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
 */function bc(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new p(m.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Fi{}class jn extends Fi{}function Cf(r,e,...t){let n=[];e instanceof Fi&&n.push(e),n=n.concat(t),(function(i){const o=i.filter((u=>u instanceof Oi)).length,a=i.filter((u=>u instanceof es)).length;if(o>1||o>0&&a>0)throw new p(m.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(n);for(const s of n)r=s._apply(r);return r}class es extends jn{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new es(e,t,n)}_apply(e){const t=this._parse(e);return Dc(e._query,t),new _e(e.firestore,e.converter,vs(e._query,t))}_parse(e){const t=tn(e.firestore);return(function(i,o,a,u,c,l,h){let f;if(c.isKeyField()){if(l==="array-contains"||l==="array-contains-any")throw new p(m.INVALID_ARGUMENT,`Invalid Query. You can't perform '${l}' queries on documentId().`);if(l==="in"||l==="not-in"){ma(h,l);const I=[];for(const A of h)I.push(fa(u,i,A));f={arrayValue:{values:I}}}else f=fa(u,i,h)}else l!=="in"&&l!=="not-in"&&l!=="array-contains-any"||ma(h,l),f=Rc(a,o,h,l==="in"||l==="not-in");return b.create(c,l,f)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function Df(r,e,t){const n=e,s=Zr("where",r);return es._create(s,n,t)}class Oi extends Fi{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Oi(e,t)}_parse(e){const t=this._queryConstraints.map((n=>n._parse(e))).filter((n=>n.getFilters().length>0));return t.length===1?t[0]:M.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(s,i){let o=s;const a=i.getFlattenedFilters();for(const u of a)Dc(o,u),o=vs(o,u)})(e._query,t),new _e(e.firestore,e.converter,vs(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Li extends jn{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Li(e,t)}_apply(e){const t=(function(s,i,o){if(s.startAt!==null)throw new p(m.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new p(m.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new bn(i,o)})(e._query,this._field,this._direction);return new _e(e.firestore,e.converter,(function(s,i){const o=s.explicitOrderBy.concat([i]);return new Ce(s.path,s.collectionGroup,o,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)})(e._query,t))}}function xf(r,e="asc"){const t=e,n=Zr("orderBy",r);return Li._create(n,t)}class ts extends jn{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new ts(e,t,n)}_apply(e){return new _e(e.firestore,e.converter,Tr(e._query,this._limit,this._limitType))}}function Nf(r){return Ea("limit",r),ts._create("limit",r,"F")}function kf(r){return Ea("limitToLast",r),ts._create("limitToLast",r,"L")}class qi extends jn{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new qi(e,t,n)}_apply(e){const t=Cc(e,this.type,this._docOrFields,this._inclusive);return new _e(e.firestore,e.converter,(function(s,i){return new Ce(s.path,s.collectionGroup,s.explicitOrderBy.slice(),s.filters.slice(),s.limit,s.limitType,i,s.endAt)})(e._query,t))}}function Mf(...r){return qi._create("startAfter",r,!1)}class Ui extends jn{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new Ui(e,t,n)}_apply(e){const t=Cc(e,this.type,this._docOrFields,this._inclusive);return new _e(e.firestore,e.converter,(function(s,i){return new Ce(s.path,s.collectionGroup,s.explicitOrderBy.slice(),s.filters.slice(),s.limit,s.limitType,s.startAt,i)})(e._query,t))}}function Ff(...r){return Ui._create("endBefore",r,!1)}function Cc(r,e,t,n){if(t[0]=de(t[0]),t[0]instanceof Mi)return(function(i,o,a,u,c){if(!u)throw new p(m.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${a}().`);const l=[];for(const h of Ct(i))if(h.field.isKeyField())l.push(dt(o,u.key));else{const f=u.data.field(h.field);if(qr(f))throw new p(m.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+h.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(f===null){const _=h.field.canonicalString();throw new p(m.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${_}' (used as the orderBy) does not exist.`)}l.push(f)}return new ze(l,c)})(r._query,r.firestore._databaseId,e,t[0]._document,n);{const s=tn(r.firestore);return(function(o,a,u,c,l,h){const f=o.explicitOrderBy;if(l.length>f.length)throw new p(m.INVALID_ARGUMENT,`Too many arguments provided to ${c}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const _=[];for(let I=0;I<l.length;I++){const A=l[I];if(f[I].field.isKeyField()){if(typeof A!="string")throw new p(m.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${c}(), but got a ${typeof A}`);if(!Ys(o)&&A.indexOf("/")!==-1)throw new p(m.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${c}() must be a plain document ID, but '${A}' contains a slash.`);const T=o.path.child(x.fromString(A));if(!y.isDocumentKey(T))throw new p(m.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${c}() must result in a valid document path, but '${T}' is not because it contains an odd number of segments.`);const N=new y(T);_.push(dt(a,N))}else{const T=Rc(u,c,A);_.push(T)}}return new ze(_,h)})(r._query,r.firestore._databaseId,s,e,t,n)}}function fa(r,e,t){if(typeof(t=de(t))=="string"){if(t==="")throw new p(m.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Ys(e)&&t.indexOf("/")!==-1)throw new p(m.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const n=e.path.child(x.fromString(t));if(!y.isDocumentKey(n))throw new p(m.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return dt(r,new y(n))}if(t instanceof z)return dt(r,t._key);throw new p(m.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Nr(t)}.`)}function ma(r,e){if(!Array.isArray(r)||r.length===0)throw new p(m.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Dc(r,e){const t=(function(s,i){for(const o of s)for(const a of o.getFlattenedFilters())if(i.indexOf(a.op)>=0)return a.op;return null})(r.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new p(m.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new p(m.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class mf{convertValue(e,t="none"){switch(Ue(e)){case 0:return null;case 1:return e.booleanValue;case 2:return L(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(be(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw E(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return Qe(e,((s,i)=>{n[s]=this.convertValue(i,t)})),n}convertVectorValue(e){const t=e.fields?.[Lt].arrayValue?.values?.map((n=>L(n.doubleValue)));return new we(t)}convertGeoPoint(e){return new Ae(L(e.latitude),L(e.longitude))}convertArray(e,t){return(e.values||[]).map((n=>this.convertValue(n,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const n=Ur(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(Vn(e));default:return null}}convertTimestamp(e){const t=Se(e);return new k(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=x.fromString(e);v(Cu(n),9688,{name:e});const s=new ht(n.get(1),n.get(3)),i=new y(n.popFirst(5));return s.isEqual(t)||K(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
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
 */function Bi(r,e,t){let n;return n=r?t&&(t.merge||t.mergeFields)?r.toFirestore(e,t):r.toFirestore(e):e,n}class hn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class ut extends Mi{constructor(e,t,n,s,i,o){super(e,t,n,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new hr(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(Zr("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new p(m.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=ut._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}ut._jsonSchemaVersion="firestore/documentSnapshot/1.0",ut._jsonSchema={type:Q("string",ut._jsonSchemaVersion),bundleSource:Q("string","DocumentSnapshot"),bundleName:Q("string"),bundle:Q("string")};class hr extends ut{data(e={}){return super.data(e)}}class ct{constructor(e,t,n,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new hn(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((n=>{e.call(t,new hr(this._firestore,this._userDataWriter,n.key,n,new hn(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new p(m.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map((a=>{const u=new hr(s._firestore,s._userDataWriter,a.doc.key,a.doc,new hn(s._snapshot.mutatedKeys.has(a.doc.key),s._snapshot.fromCache),s.query.converter);return a.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}}))}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((a=>i||a.type!==3)).map((a=>{const u=new hr(s._firestore,s._userDataWriter,a.doc.key,a.doc,new hn(s._snapshot.mutatedKeys.has(a.doc.key),s._snapshot.fromCache),s.query.converter);let c=-1,l=-1;return a.type!==0&&(c=o.indexOf(a.doc.key),o=o.delete(a.doc.key)),a.type!==1&&(o=o.add(a.doc),l=o.indexOf(a.doc.key)),{type:_f(a.type),doc:u,oldIndex:c,newIndex:l}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new p(m.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=ct._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Us.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),n.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function _f(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return E(61501,{type:r})}}/**
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
 */function Of(r){r=se(r,z);const e=se(r.firestore,Re);return rf(Bn(e),r._key).then((t=>xc(e,r,t)))}ct._jsonSchemaVersion="firestore/querySnapshot/1.0",ct._jsonSchema={type:Q("string",ct._jsonSchemaVersion),bundleSource:Q("string","QuerySnapshot"),bundleName:Q("string"),bundle:Q("string")};class zi extends mf{constructor(e){super(),this.firestore=e}convertBytes(e){return new me(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new z(this.firestore,null,t)}}function Lf(r){r=se(r,_e);const e=se(r.firestore,Re),t=Bn(e),n=new zi(e);return bc(r._query),sf(t,r._query).then((s=>new ct(e,n,r,s)))}function qf(r,e,t){r=se(r,z);const n=se(r.firestore,Re),s=Bi(r.converter,e,t);return Qn(n,[Ci(tn(n),"setDoc",r._key,s,r.converter!==null,t).toMutation(r._key,H.none())])}function Uf(r,e,t,...n){r=se(r,z);const s=se(r.firestore,Re),i=tn(s);let o;return o=typeof(e=de(e))=="string"||e instanceof zn?vc(i,"updateDoc",r._key,e,t,n):wc(i,"updateDoc",r._key,e),Qn(s,[o.toMutation(r._key,H.exists(!0))])}function Bf(r){return Qn(se(r.firestore,Re),[new On(r._key,H.none())])}function zf(r,e){const t=se(r.firestore,Re),n=af(r),s=Bi(r.converter,e);return Qn(t,[Ci(tn(r.firestore),"addDoc",n._key,s,r.converter!==null,{}).toMutation(n._key,H.exists(!1))]).then((()=>n))}function Gf(r,...e){r=de(r);let t={includeMetadataChanges:!1,source:"default"},n=0;typeof e[n]!="object"||da(e[n])||(t=e[n++]);const s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(da(e[n])){const u=e[n];e[n]=u.next?.bind(u),e[n+1]=u.error?.bind(u),e[n+2]=u.complete?.bind(u)}let i,o,a;if(r instanceof z)o=se(r.firestore,Re),a=Mn(r._key.path),i={next:u=>{e[n]&&e[n](xc(o,r,u))},error:e[n+1],complete:e[n+2]};else{const u=se(r,_e);o=se(u.firestore,Re),a=u._query;const c=new zi(o);i={next:l=>{e[n]&&e[n](new ct(o,c,u,l))},error:e[n+1],complete:e[n+2]},bc(r._query)}return(function(c,l,h,f){const _=new Si(f),I=new Ai(l,_,h);return c.asyncQueue.enqueueAndForget((async()=>Ii(await Dr(c),I))),()=>{_.Nu(),c.asyncQueue.enqueueAndForget((async()=>Ti(await Dr(c),I)))}})(Bn(o),a,s,i)}function Qn(r,e){return(function(n,s){const i=new Ee;return n.asyncQueue.enqueueAndForget((async()=>Ld(await nf(n),s,i))),i.promise})(Bn(r),e)}function xc(r,e,t){const n=t.docs.get(e._key),s=new zi(r);return new ut(r,s,e._key,n,new hn(t.hasPendingWrites,t.fromCache),e.converter)}class gf{constructor(e){let t;this.kind="persistent",e?.tabManager?(e.tabManager._initialize(e),t=e.tabManager):(t=If(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}function Kf(r){return new gf(r)}class pf{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Dn.provider,this._offlineComponentProvider={build:t=>new yc(t,e?.cacheSizeBytes,this.forceOwnership)}}}class yf{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Dn.provider,this._offlineComponentProvider={build:t=>new Zd(t,e?.cacheSizeBytes)}}}function If(r){return new pf(r?.forceOwnership)}function $f(){return new yf}/**
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
 */class Tf{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=tn(e)}set(e,t,n){this._verifyNotCommitted();const s=ds(e,this._firestore),i=Bi(s.converter,t,n),o=Ci(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,n);return this._mutations.push(o.toMutation(s._key,H.none())),this}update(e,t,n,...s){this._verifyNotCommitted();const i=ds(e,this._firestore);let o;return o=typeof(t=de(t))=="string"||t instanceof zn?vc(this._dataReader,"WriteBatch.update",i._key,t,n,s):wc(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(o.toMutation(i._key,H.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=ds(e,this._firestore);return this._mutations=this._mutations.concat(new On(t._key,H.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new p(m.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function ds(r,e){if((r=de(r)).firestore!==e)throw new p(m.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return r}/**
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
 */function jf(){return new Kn("deleteField")}function Qf(){return new Di("serverTimestamp")}function Wf(r){return new xi("increment",r)}/**
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
 */function Hf(r){return Bn(r=se(r,Re)),new Tf(r,(e=>Qn(r,e)))}(function(e,t=!0){(function(s){Jt=s})(Fc),Nc(new Oc("firestore",((n,{instanceIdentifier:s,options:i})=>{const o=n.getProvider("app").getImmediate(),a=new Re(new Xc(n.getProvider("auth-internal")),new tl(o,n.getProvider("app-check-internal")),(function(c,l){if(!Object.prototype.hasOwnProperty.apply(c.options,["projectId"]))throw new p(m.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ht(c.options.projectId,l)})(o,s),o);return i={useFetchStreams:t,...i},a._setSettings(i),a}),"PUBLIC").setMultipleInstances(!0)),Ki(ji,Qi,e),Ki(ji,Qi,"esm2020")})();export{k as T,$f as a,Gf as b,Pf as c,zf as d,af as e,Mf as f,Lf as g,Wf as h,bf as i,Of as j,Hf as k,Nf as l,Bf as m,Sf as n,xf as o,Kf as p,Cf as q,jf as r,Qf as s,qf as t,Uf as u,kf as v,Df as w,Ff as x};
