import{_ as Xi,r as Rr,b as Ji,a as Zi,S as eo}from"./pkg-at-firebase-app-B-jb69A0.js";import{C as to}from"./pkg-at-firebase-component-uLb4jufn.js";import{L as no,a as ce}from"./pkg-at-firebase-logger-CNz1B4Yj.js";import{F as ro,d as so,o as Rs,p as io,g as ee,z as oo,l as ao}from"./pkg-at-firebase-util-DEf2dHJc.js";import{I as Ve,M as uo,X as co,E as lo,a as dn,c as ho,g as fo,W as Rt,b as mo,S as vr}from"./pkg-at-firebase-webchannel-wrapper-QS5lB7L3.js";const Vr="@firebase/firestore",Pr="4.9.1";/**
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
 */class K{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}K.UNAUTHENTICATED=new K(null),K.GOOGLE_CREDENTIALS=new K("google-credentials-uid"),K.FIRST_PARTY=new K("first-party-uid"),K.MOCK_USER=new K("mock-user");/**
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
 */let je="12.2.0";/**
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
 */const Ce=new no("@firebase/firestore");function xe(){return Ce.logLevel}function g(r,...e){if(Ce.logLevel<=ce.DEBUG){const t=e.map(xn);Ce.debug(`Firestore (${je}): ${r}`,...t)}}function he(r,...e){if(Ce.logLevel<=ce.ERROR){const t=e.map(xn);Ce.error(`Firestore (${je}): ${r}`,...t)}}function st(r,...e){if(Ce.logLevel<=ce.WARN){const t=e.map(xn);Ce.warn(`Firestore (${je}): ${r}`,...t)}}function xn(r){if(typeof r=="string")return r;try{/**
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
 */function I(r,e,t){let n="Unexpected state";typeof e=="string"?n=e:t=e,vs(r,n,t)}function vs(r,e,t){let n=`FIRESTORE (${je}) INTERNAL ASSERTION FAILED: ${e} (ID: ${r.toString(16)})`;if(t!==void 0)try{n+=" CONTEXT: "+JSON.stringify(t)}catch{n+=" CONTEXT: "+t}throw he(n),new Error(n)}function S(r,e,t,n){let s="Unexpected state";typeof t=="string"?s=t:n=t,r||vs(e,s,n)}function R(r,e){return r}/**
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
 */const d={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class p extends ro{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class le{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
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
 */class _o{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class po{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(K.UNAUTHENTICATED)))}shutdown(){}}class go{constructor(e){this.t=e,this.currentUser=K.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){S(this.o===void 0,42304);let n=this.i;const s=u=>this.i!==n?(n=this.i,t(u)):Promise.resolve();let i=new le;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new le,e.enqueueRetryable((()=>s(this.currentUser)))};const o=()=>{const u=i;e.enqueueRetryable((async()=>{await u.promise,await s(this.currentUser)}))},a=u=>{g("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit((u=>a(u))),setTimeout((()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?a(u):(g("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new le)}}),0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((n=>this.i!==e?(g("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(S(typeof n.accessToken=="string",31837,{l:n}),new _o(n.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return S(e===null||typeof e=="string",2055,{h:e}),new K(e)}}class yo{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type="FirstParty",this.user=K.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class Eo{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new yo(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(K.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Sr{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class To{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Ji(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){S(this.o===void 0,3512);const n=i=>{i.error!=null&&g("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.m;return this.m=i.token,g("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(i.token):Promise.resolve()};this.o=i=>{e.enqueueRetryable((()=>n(i)))};const s=i=>{g("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.V.getImmediate({optional:!0});i?s(i):g("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Sr(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(S(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new Sr(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function Io(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
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
 */class Mn{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=Io(40);for(let i=0;i<s.length;++i)n.length<20&&s[i]<t&&(n+=e.charAt(s[i]%62))}return n}}function v(r,e){return r<e?-1:r>e?1:0}function yn(r,e){const t=Math.min(r.length,e.length);for(let n=0;n<t;n++){const s=r.charAt(n),i=e.charAt(n);if(s!==i)return fn(s)===fn(i)?v(s,i):fn(s)?1:-1}return v(r.length,e.length)}const Ao=55296,wo=57343;function fn(r){const e=r.charCodeAt(0);return e>=Ao&&e<=wo}function qe(r,e,t){return r.length===e.length&&r.every(((n,s)=>t(n,e[s])))}/**
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
 */const Cr="__name__";class re{constructor(e,t,n){t===void 0?t=0:t>e.length&&I(637,{offset:t,range:e.length}),n===void 0?n=e.length-t:n>e.length-t&&I(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return re.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof re?e.forEach((n=>{t.push(n)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let s=0;s<n;s++){const i=re.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return v(e.length,t.length)}static compareSegments(e,t){const n=re.isNumericId(e),s=re.isNumericId(t);return n&&!s?-1:!n&&s?1:n&&s?re.extractNumericId(e).compare(re.extractNumericId(t)):yn(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Ve.fromString(e.substring(4,e.length-2))}}class C extends re{construct(e,t,n){return new C(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new p(d.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter((s=>s.length>0)))}return new C(t)}static emptyPath(){return new C([])}}const Ro=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class $ extends re{construct(e,t,n){return new $(e,t,n)}static isValidIdentifier(e){return Ro.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),$.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Cr}static keyField(){return new $([Cr])}static fromServerFormat(e){const t=[];let n="",s=0;const i=()=>{if(n.length===0)throw new p(d.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let o=!1;for(;s<e.length;){const a=e[s];if(a==="\\"){if(s+1===e.length)throw new p(d.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new p(d.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=u,s+=2}else a==="`"?(o=!o,s++):a!=="."||o?(n+=a,s++):(i(),s++)}if(i(),o)throw new p(d.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new $(t)}static emptyPath(){return new $([])}}/**
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
 */class y{constructor(e){this.path=e}static fromPath(e){return new y(C.fromString(e))}static fromName(e){return new y(C.fromString(e).popFirst(5))}static empty(){return new y(C.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&C.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return C.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new y(new C(e.slice()))}}/**
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
 */function Vs(r,e,t){if(!t)throw new p(d.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function vo(r,e,t,n){if(e===!0&&n===!0)throw new p(d.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function br(r){if(!y.isDocumentKey(r))throw new p(d.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function Nr(r){if(y.isDocumentKey(r))throw new p(d.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function Ps(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function Gt(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(n){return n.constructor?n.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":I(12329,{type:typeof r})}function X(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new p(d.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Gt(r);throw new p(d.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}function Ss(r,e){if(e<=0)throw new p(d.INVALID_ARGUMENT,`Function ${r}() requires a positive number, but it was: ${e}.`)}/**
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
 */function L(r,e){const t={typeString:r};return e&&(t.value=e),t}function mt(r,e){if(!Ps(r))throw new p(d.INVALID_ARGUMENT,"JSON must be an object");let t;for(const n in e)if(e[n]){const s=e[n].typeString,i="value"in e[n]?{value:e[n].value}:void 0;if(!(n in r)){t=`JSON missing required field: '${n}'`;break}const o=r[n];if(s&&typeof o!==s){t=`JSON field '${n}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){t=`Expected '${n}' field to equal '${i.value}'`;break}}if(t)throw new p(d.INVALID_ARGUMENT,t);return!0}/**
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
 */const Dr=-62135596800,kr=1e6;class b{static now(){return b.fromMillis(Date.now())}static fromDate(e){return b.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*kr);return new b(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new p(d.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new p(d.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Dr)throw new p(d.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new p(d.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/kr}_compareTo(e){return this.seconds===e.seconds?v(this.nanoseconds,e.nanoseconds):v(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:b._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(mt(e,b._jsonSchema))return new b(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Dr;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}b._jsonSchemaVersion="firestore/timestamp/1.0",b._jsonSchema={type:L("string",b._jsonSchemaVersion),seconds:L("number"),nanoseconds:L("number")};/**
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
 */class A{static fromTimestamp(e){return new A(e)}static min(){return new A(new b(0,0))}static max(){return new A(new b(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */const it=-1;function Vo(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=A.fromTimestamp(n===1e9?new b(t+1,0):new b(t,n));return new pe(s,y.empty(),e)}function Po(r){return new pe(r.readTime,r.key,it)}class pe{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new pe(A.min(),y.empty(),it)}static max(){return new pe(A.max(),y.empty(),it)}}function So(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=y.comparator(r.documentKey,e.documentKey),t!==0?t:v(r.largestBatchId,e.largestBatchId))}/**
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
 */const Co="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class bo{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
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
 */async function Ke(r){if(r.code!==d.FAILED_PRECONDITION||r.message!==Co)throw r;g("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class m{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&I(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new m(((n,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(n,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(n,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof m?t:m.resolve(t)}catch(t){return m.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):m.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):m.reject(t)}static resolve(e){return new m(((t,n)=>{t(e)}))}static reject(e){return new m(((t,n)=>{n(e)}))}static waitFor(e){return new m(((t,n)=>{let s=0,i=0,o=!1;e.forEach((a=>{++s,a.next((()=>{++i,o&&i===s&&t()}),(u=>n(u)))})),o=!0,i===s&&t()}))}static or(e){let t=m.resolve(!1);for(const n of e)t=t.next((s=>s?m.resolve(s):n()));return t}static forEach(e,t){const n=[];return e.forEach(((s,i)=>{n.push(t.call(this,s,i))})),this.waitFor(n)}static mapArray(e,t){return new m(((n,s)=>{const i=e.length,o=new Array(i);let a=0;for(let u=0;u<i;u++){const c=u;t(e[c]).next((l=>{o[c]=l,++a,a===i&&n(o)}),(l=>s(l)))}}))}static doWhile(e,t){return new m(((n,s)=>{const i=()=>{e()===!0?t().next((()=>{i()}),s):n()};i()}))}}function No(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function We(r){return r.name==="IndexedDbTransactionError"}/**
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
 */class jt{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.ae(n),this.ue=n=>t.writeSequenceNumber(n))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}jt.ce=-1;/**
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
 */const On=-1;function Kt(r){return r==null}function xt(r){return r===0&&1/r==-1/0}function Do(r){return typeof r=="number"&&Number.isInteger(r)&&!xt(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
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
 */const Cs="";function ko(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=xr(e)),e=xo(r.get(t),e);return xr(e)}function xo(r,e){let t=e;const n=r.length;for(let s=0;s<n;s++){const i=r.charAt(s);switch(i){case"\0":t+="";break;case Cs:t+="";break;default:t+=i}}return t}function xr(r){return r+Cs+""}/**
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
 */function Mr(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function Ae(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function bs(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
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
 */class D{constructor(e,t){this.comparator=e,this.root=t||z.EMPTY}insert(e,t){return new D(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,z.BLACK,null,null))}remove(e){return new D(this.comparator,this.root.remove(e,this.comparator).copy(null,null,z.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(e,n.key);if(s===0)return t+n.left.size;s<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,n)=>(e(t,n),!1)))}toString(){const e=[];return this.inorderTraversal(((t,n)=>(e.push(`${t}:${n}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new vt(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new vt(this.root,e,this.comparator,!1)}getReverseIterator(){return new vt(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new vt(this.root,e,this.comparator,!0)}}class vt{constructor(e,t,n,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class z{constructor(e,t,n,s,i){this.key=e,this.value=t,this.color=n??z.RED,this.left=s??z.EMPTY,this.right=i??z.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,s,i){return new z(e??this.key,t??this.value,n??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let s=this;const i=n(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,n),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return z.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return z.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,z.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,z.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw I(43730,{key:this.key,value:this.value});if(this.right.isRed())throw I(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw I(27949);return e+(this.isRed()?0:1)}}z.EMPTY=null,z.RED=!0,z.BLACK=!1;z.EMPTY=new class{constructor(){this.size=0}get key(){throw I(57766)}get value(){throw I(16141)}get color(){throw I(16727)}get left(){throw I(29726)}get right(){throw I(36894)}copy(e,t,n,s,i){return this}insert(e,t,n){return new z(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class U{constructor(e){this.comparator=e,this.data=new D(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,n)=>(e(t),!1)))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Or(this.data.getIterator())}getIteratorFrom(e){return new Or(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((n=>{t=t.add(n)})),t}isEqual(e){if(!(e instanceof U)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new U(this.comparator);return t.data=e,t}}class Or{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class Y{constructor(e){this.fields=e,e.sort($.comparator)}static empty(){return new Y([])}unionWith(e){let t=new U($.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new Y(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return qe(this.fields,e.fields,((t,n)=>t.isEqual(n)))}}/**
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
 */class Ns extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class Q{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new Ns("Invalid base64 string: "+i):i}})(e);return new Q(t)}static fromUint8Array(e){const t=(function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i})(e);return new Q(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const n=new Uint8Array(t.length);for(let s=0;s<t.length;s++)n[s]=t.charCodeAt(s);return n})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return v(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}Q.EMPTY_BYTE_STRING=new Q("");const Mo=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function ge(r){if(S(!!r,39018),typeof r=="string"){let e=0;const t=Mo.exec(r);if(S(!!t,46558,{timestamp:r}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:x(r.seconds),nanos:x(r.nanos)}}function x(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function ye(r){return typeof r=="string"?Q.fromBase64String(r):Q.fromUint8Array(r)}/**
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
 */const Ds="server_timestamp",ks="__type__",xs="__previous_value__",Ms="__local_write_time__";function Wt(r){return(r?.mapValue?.fields||{})[ks]?.stringValue===Ds}function Ht(r){const e=r.mapValue.fields[xs];return Wt(e)?Ht(e):e}function ot(r){const e=ge(r.mapValue.fields[Ms].timestampValue);return new b(e.seconds,e.nanos)}/**
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
 */class Oo{constructor(e,t,n,s,i,o,a,u,c,l){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=u,this.useFetchStreams=c,this.isUsingEmulator=l}}const Mt="(default)";class at{constructor(e,t){this.projectId=e,this.database=t||Mt}static empty(){return new at("","")}get isDefaultDatabase(){return this.database===Mt}isEqual(e){return e instanceof at&&e.projectId===this.projectId&&e.database===this.database}}/**
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
 */const Os="__type__",Lo="__max__",Vt={mapValue:{}},Ls="__vector__",Ot="value";function Ee(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Wt(r)?4:Uo(r)?9007199254740991:Fo(r)?10:11:I(28295,{value:r})}function ue(r,e){if(r===e)return!0;const t=Ee(r);if(t!==Ee(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return ot(r).isEqual(ot(e));case 3:return(function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const o=ge(s.timestampValue),a=ge(i.timestampValue);return o.seconds===a.seconds&&o.nanos===a.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(s,i){return ye(s.bytesValue).isEqual(ye(i.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(s,i){return x(s.geoPointValue.latitude)===x(i.geoPointValue.latitude)&&x(s.geoPointValue.longitude)===x(i.geoPointValue.longitude)})(r,e);case 2:return(function(s,i){if("integerValue"in s&&"integerValue"in i)return x(s.integerValue)===x(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const o=x(s.doubleValue),a=x(i.doubleValue);return o===a?xt(o)===xt(a):isNaN(o)&&isNaN(a)}return!1})(r,e);case 9:return qe(r.arrayValue.values||[],e.arrayValue.values||[],ue);case 10:case 11:return(function(s,i){const o=s.mapValue.fields||{},a=i.mapValue.fields||{};if(Mr(o)!==Mr(a))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(a[u]===void 0||!ue(o[u],a[u])))return!1;return!0})(r,e);default:return I(52216,{left:r})}}function ut(r,e){return(r.values||[]).find((t=>ue(t,e)))!==void 0}function Be(r,e){if(r===e)return 0;const t=Ee(r),n=Ee(e);if(t!==n)return v(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return v(r.booleanValue,e.booleanValue);case 2:return(function(i,o){const a=x(i.integerValue||i.doubleValue),u=x(o.integerValue||o.doubleValue);return a<u?-1:a>u?1:a===u?0:isNaN(a)?isNaN(u)?0:-1:1})(r,e);case 3:return Lr(r.timestampValue,e.timestampValue);case 4:return Lr(ot(r),ot(e));case 5:return yn(r.stringValue,e.stringValue);case 6:return(function(i,o){const a=ye(i),u=ye(o);return a.compareTo(u)})(r.bytesValue,e.bytesValue);case 7:return(function(i,o){const a=i.split("/"),u=o.split("/");for(let c=0;c<a.length&&c<u.length;c++){const l=v(a[c],u[c]);if(l!==0)return l}return v(a.length,u.length)})(r.referenceValue,e.referenceValue);case 8:return(function(i,o){const a=v(x(i.latitude),x(o.latitude));return a!==0?a:v(x(i.longitude),x(o.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return Fr(r.arrayValue,e.arrayValue);case 10:return(function(i,o){const a=i.fields||{},u=o.fields||{},c=a[Ot]?.arrayValue,l=u[Ot]?.arrayValue,h=v(c?.values?.length||0,l?.values?.length||0);return h!==0?h:Fr(c,l)})(r.mapValue,e.mapValue);case 11:return(function(i,o){if(i===Vt.mapValue&&o===Vt.mapValue)return 0;if(i===Vt.mapValue)return 1;if(o===Vt.mapValue)return-1;const a=i.fields||{},u=Object.keys(a),c=o.fields||{},l=Object.keys(c);u.sort(),l.sort();for(let h=0;h<u.length&&h<l.length;++h){const f=yn(u[h],l[h]);if(f!==0)return f;const _=Be(a[u[h]],c[l[h]]);if(_!==0)return _}return v(u.length,l.length)})(r.mapValue,e.mapValue);default:throw I(23264,{he:t})}}function Lr(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return v(r,e);const t=ge(r),n=ge(e),s=v(t.seconds,n.seconds);return s!==0?s:v(t.nanos,n.nanos)}function Fr(r,e){const t=r.values||[],n=e.values||[];for(let s=0;s<t.length&&s<n.length;++s){const i=Be(t[s],n[s]);if(i)return i}return v(t.length,n.length)}function ze(r){return En(r)}function En(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const n=ge(t);return`time(${n.seconds},${n.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return ye(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return y.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let n="[",s=!0;for(const i of t.values||[])s?s=!1:n+=",",n+=En(i);return n+"]"})(r.arrayValue):"mapValue"in r?(function(t){const n=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const o of n)i?i=!1:s+=",",s+=`${o}:${En(t.fields[o])}`;return s+"}"})(r.mapValue):I(61005,{value:r})}function Ct(r){switch(Ee(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Ht(r);return e?16+Ct(e):16;case 5:return 2*r.stringValue.length;case 6:return ye(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(n){return(n.values||[]).reduce(((s,i)=>s+Ct(i)),0)})(r.arrayValue);case 10:case 11:return(function(n){let s=0;return Ae(n.fields,((i,o)=>{s+=i.length+Ct(o)})),s})(r.mapValue);default:throw I(13486,{value:r})}}function Lt(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function Tn(r){return!!r&&"integerValue"in r}function Ln(r){return!!r&&"arrayValue"in r}function Ur(r){return!!r&&"nullValue"in r}function qr(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function bt(r){return!!r&&"mapValue"in r}function Fo(r){return(r?.mapValue?.fields||{})[Os]?.stringValue===Ls}function tt(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const e={mapValue:{fields:{}}};return Ae(r.mapValue.fields,((t,n)=>e.mapValue.fields[t]=tt(n))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=tt(r.arrayValue.values[t]);return e}return{...r}}function Uo(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===Lo}/**
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
 */class H{constructor(e){this.value=e}static empty(){return new H({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!bt(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=tt(t)}setAll(e){let t=$.emptyPath(),n={},s=[];e.forEach(((o,a)=>{if(!t.isImmediateParentOf(a)){const u=this.getFieldsMap(t);this.applyChanges(u,n,s),n={},s=[],t=a.popLast()}o?n[a.lastSegment()]=tt(o):s.push(a.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,n,s)}delete(e){const t=this.field(e.popLast());bt(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return ue(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let s=t.mapValue.fields[e.get(n)];bt(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,n){Ae(t,((s,i)=>e[s]=i));for(const s of n)delete e[s]}clone(){return new H(tt(this.value))}}function Fs(r){const e=[];return Ae(r.fields,((t,n)=>{const s=new $([t]);if(bt(n)){const i=Fs(n.mapValue).fields;if(i.length===0)e.push(s);else for(const o of i)e.push(s.child(o))}else e.push(s)})),new Y(e)}/**
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
 */class j{constructor(e,t,n,s,i,o,a){this.key=e,this.documentType=t,this.version=n,this.readTime=s,this.createTime=i,this.data=o,this.documentState=a}static newInvalidDocument(e){return new j(e,0,A.min(),A.min(),A.min(),H.empty(),0)}static newFoundDocument(e,t,n,s){return new j(e,1,t,A.min(),n,s,0)}static newNoDocument(e,t){return new j(e,2,t,A.min(),A.min(),H.empty(),0)}static newUnknownDocument(e,t){return new j(e,3,t,A.min(),A.min(),H.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(A.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=H.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=H.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=A.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof j&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new j(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class $e{constructor(e,t){this.position=e,this.inclusive=t}}function Br(r,e,t){let n=0;for(let s=0;s<r.position.length;s++){const i=e[s],o=r.position[s];if(i.field.isKeyField()?n=y.comparator(y.fromName(o.referenceValue),t.key):n=Be(o,t.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function zr(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!ue(r.position[t],e.position[t]))return!1;return!0}/**
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
 */class ct{constructor(e,t="asc"){this.field=e,this.dir=t}}function qo(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
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
 */class Us{}class O extends Us{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new zo(e,t,n):t==="array-contains"?new Go(e,n):t==="in"?new jo(e,n):t==="not-in"?new Ko(e,n):t==="array-contains-any"?new Wo(e,n):new O(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new $o(e,n):new Qo(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(Be(t,this.value)):t!==null&&Ee(this.value)===Ee(t)&&this.matchesComparison(Be(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return I(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class te extends Us{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new te(e,t)}matches(e){return qs(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function qs(r){return r.op==="and"}function Bs(r){return Bo(r)&&qs(r)}function Bo(r){for(const e of r.filters)if(e instanceof te)return!1;return!0}function In(r){if(r instanceof O)return r.field.canonicalString()+r.op.toString()+ze(r.value);if(Bs(r))return r.filters.map((e=>In(e))).join(",");{const e=r.filters.map((t=>In(t))).join(",");return`${r.op}(${e})`}}function zs(r,e){return r instanceof O?(function(n,s){return s instanceof O&&n.op===s.op&&n.field.isEqual(s.field)&&ue(n.value,s.value)})(r,e):r instanceof te?(function(n,s){return s instanceof te&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce(((i,o,a)=>i&&zs(o,s.filters[a])),!0):!1})(r,e):void I(19439)}function $s(r){return r instanceof O?(function(t){return`${t.field.canonicalString()} ${t.op} ${ze(t.value)}`})(r):r instanceof te?(function(t){return t.op.toString()+" {"+t.getFilters().map($s).join(" ,")+"}"})(r):"Filter"}class zo extends O{constructor(e,t,n){super(e,t,n),this.key=y.fromName(n.referenceValue)}matches(e){const t=y.comparator(e.key,this.key);return this.matchesComparison(t)}}class $o extends O{constructor(e,t){super(e,"in",t),this.keys=Qs("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class Qo extends O{constructor(e,t){super(e,"not-in",t),this.keys=Qs("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function Qs(r,e){return(e.arrayValue?.values||[]).map((t=>y.fromName(t.referenceValue)))}class Go extends O{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Ln(t)&&ut(t.arrayValue,this.value)}}class jo extends O{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&ut(this.value.arrayValue,t)}}class Ko extends O{constructor(e,t){super(e,"not-in",t)}matches(e){if(ut(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!ut(this.value.arrayValue,t)}}class Wo extends O{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Ln(t)||!t.arrayValue.values)&&t.arrayValue.values.some((n=>ut(this.value.arrayValue,n)))}}/**
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
 */class Ho{constructor(e,t=null,n=[],s=[],i=null,o=null,a=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=s,this.limit=i,this.startAt=o,this.endAt=a,this.Te=null}}function $r(r,e=null,t=[],n=[],s=null,i=null,o=null){return new Ho(r,e,t,n,s,i,o)}function Fn(r){const e=R(r);if(e.Te===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((n=>In(n))).join(","),t+="|ob:",t+=e.orderBy.map((n=>(function(i){return i.field.canonicalString()+i.dir})(n))).join(","),Kt(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((n=>ze(n))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((n=>ze(n))).join(",")),e.Te=t}return e.Te}function Un(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!qo(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!zs(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!zr(r.startAt,e.startAt)&&zr(r.endAt,e.endAt)}function An(r){return y.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}/**
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
 */class we{constructor(e,t=null,n=[],s=[],i=null,o="F",a=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=s,this.limit=i,this.limitType=o,this.startAt=a,this.endAt=u,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function Yo(r,e,t,n,s,i,o,a){return new we(r,e,t,n,s,i,o,a)}function Yt(r){return new we(r)}function Qr(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function qn(r){return r.collectionGroup!==null}function Fe(r){const e=R(r);if(e.Ie===null){e.Ie=[];const t=new Set;for(const i of e.explicitOrderBy)e.Ie.push(i),t.add(i.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new U($.comparator);return o.filters.forEach((u=>{u.getFlattenedFilters().forEach((c=>{c.isInequality()&&(a=a.add(c.field))}))})),a})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.Ie.push(new ct(i,n))})),t.has($.keyField().canonicalString())||e.Ie.push(new ct($.keyField(),n))}return e.Ie}function se(r){const e=R(r);return e.Ee||(e.Ee=Xo(e,Fe(r))),e.Ee}function Xo(r,e){if(r.limitType==="F")return $r(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new ct(s.field,i)}));const t=r.endAt?new $e(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new $e(r.startAt.position,r.startAt.inclusive):null;return $r(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function wn(r,e){const t=r.filters.concat([e]);return new we(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function Ft(r,e,t){return new we(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function Xt(r,e){return Un(se(r),se(e))&&r.limitType===e.limitType}function Gs(r){return`${Fn(se(r))}|lt:${r.limitType}`}function Me(r){return`Query(target=${(function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map((s=>$s(s))).join(", ")}]`),Kt(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map((s=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(s))).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map((s=>ze(s))).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map((s=>ze(s))).join(",")),`Target(${n})`})(se(r))}; limitType=${r.limitType})`}function Jt(r,e){return e.isFoundDocument()&&(function(n,s){const i=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):y.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)})(r,e)&&(function(n,s){for(const i of Fe(n))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(r,e)&&(function(n,s){for(const i of n.filters)if(!i.matches(s))return!1;return!0})(r,e)&&(function(n,s){return!(n.startAt&&!(function(o,a,u){const c=Br(o,a,u);return o.inclusive?c<=0:c<0})(n.startAt,Fe(n),s)||n.endAt&&!(function(o,a,u){const c=Br(o,a,u);return o.inclusive?c>=0:c>0})(n.endAt,Fe(n),s))})(r,e)}function Jo(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function js(r){return(e,t)=>{let n=!1;for(const s of Fe(r)){const i=Zo(s,e,t);if(i!==0)return i;n=n||s.field.isKeyField()}return 0}}function Zo(r,e,t){const n=r.field.isKeyField()?y.comparator(e.key,t.key):(function(i,o,a){const u=o.data.field(i),c=a.data.field(i);return u!==null&&c!==null?Be(u,c):I(42886)})(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return I(19790,{direction:r.dir})}}/**
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
 */class Ne{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[s,i]of n)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),s=this.inner[n];if(s===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],e))return n.length===1?delete this.inner[t]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Ae(this.inner,((t,n)=>{for(const[s,i]of n)e(s,i)}))}isEmpty(){return bs(this.inner)}size(){return this.innerSize}}/**
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
 */const ea=new D(y.comparator);function de(){return ea}const Ks=new D(y.comparator);function Je(...r){let e=Ks;for(const t of r)e=e.insert(t.key,t);return e}function Ws(r){let e=Ks;return r.forEach(((t,n)=>e=e.insert(t,n.overlayedDocument))),e}function ve(){return nt()}function Hs(){return nt()}function nt(){return new Ne((r=>r.toString()),((r,e)=>r.isEqual(e)))}const ta=new D(y.comparator),na=new U(y.comparator);function V(...r){let e=na;for(const t of r)e=e.add(t);return e}const ra=new U(v);function sa(){return ra}/**
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
 */function Bn(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:xt(e)?"-0":e}}function Ys(r){return{integerValue:""+r}}function Xs(r,e){return Do(e)?Ys(e):Bn(r,e)}/**
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
 */class Zt{constructor(){this._=void 0}}function ia(r,e,t){return r instanceof lt?(function(s,i){const o={fields:{[ks]:{stringValue:Ds},[Ms]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Wt(i)&&(i=Ht(i)),i&&(o.fields[xs]=i),{mapValue:o}})(t,e):r instanceof ht?Zs(r,e):r instanceof dt?ei(r,e):(function(s,i){const o=Js(s,i),a=Gr(o)+Gr(s.Ae);return Tn(o)&&Tn(s.Ae)?Ys(a):Bn(s.serializer,a)})(r,e)}function oa(r,e,t){return r instanceof ht?Zs(r,e):r instanceof dt?ei(r,e):t}function Js(r,e){return r instanceof ft?(function(n){return Tn(n)||(function(i){return!!i&&"doubleValue"in i})(n)})(e)?e:{integerValue:0}:null}class lt extends Zt{}class ht extends Zt{constructor(e){super(),this.elements=e}}function Zs(r,e){const t=ti(e);for(const n of r.elements)t.some((s=>ue(s,n)))||t.push(n);return{arrayValue:{values:t}}}class dt extends Zt{constructor(e){super(),this.elements=e}}function ei(r,e){let t=ti(e);for(const n of r.elements)t=t.filter((s=>!ue(s,n)));return{arrayValue:{values:t}}}class ft extends Zt{constructor(e,t){super(),this.serializer=e,this.Ae=t}}function Gr(r){return x(r.integerValue||r.doubleValue)}function ti(r){return Ln(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
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
 */class ni{constructor(e,t){this.field=e,this.transform=t}}function aa(r,e){return r.field.isEqual(e.field)&&(function(n,s){return n instanceof ht&&s instanceof ht||n instanceof dt&&s instanceof dt?qe(n.elements,s.elements,ue):n instanceof ft&&s instanceof ft?ue(n.Ae,s.Ae):n instanceof lt&&s instanceof lt})(r.transform,e.transform)}class ua{constructor(e,t){this.version=e,this.transformResults=t}}class Z{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Z}static exists(e){return new Z(void 0,e)}static updateTime(e){return new Z(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Nt(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class en{}function ri(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new zn(r.key,Z.none()):new _t(r.key,r.data,Z.none());{const t=r.data,n=H.empty();let s=new U($.comparator);for(let i of e.fields)if(!s.has(i)){let o=t.field(i);o===null&&i.length>1&&(i=i.popLast(),o=t.field(i)),o===null?n.delete(i):n.set(i,o),s=s.add(i)}return new Re(r.key,n,new Y(s.toArray()),Z.none())}}function ca(r,e,t){r instanceof _t?(function(s,i,o){const a=s.value.clone(),u=Kr(s.fieldTransforms,i,o.transformResults);a.setAll(u),i.convertToFoundDocument(o.version,a).setHasCommittedMutations()})(r,e,t):r instanceof Re?(function(s,i,o){if(!Nt(s.precondition,i))return void i.convertToUnknownDocument(o.version);const a=Kr(s.fieldTransforms,i,o.transformResults),u=i.data;u.setAll(si(s)),u.setAll(a),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()})(r,e,t):(function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()})(0,e,t)}function rt(r,e,t,n){return r instanceof _t?(function(i,o,a,u){if(!Nt(i.precondition,o))return a;const c=i.value.clone(),l=Wr(i.fieldTransforms,u,o);return c.setAll(l),o.convertToFoundDocument(o.version,c).setHasLocalMutations(),null})(r,e,t,n):r instanceof Re?(function(i,o,a,u){if(!Nt(i.precondition,o))return a;const c=Wr(i.fieldTransforms,u,o),l=o.data;return l.setAll(si(i)),l.setAll(c),o.convertToFoundDocument(o.version,l).setHasLocalMutations(),a===null?null:a.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((h=>h.field)))})(r,e,t,n):(function(i,o,a){return Nt(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):a})(r,e,t)}function la(r,e){let t=null;for(const n of r.fieldTransforms){const s=e.data.field(n.field),i=Js(n.transform,s||null);i!=null&&(t===null&&(t=H.empty()),t.set(n.field,i))}return t||null}function jr(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&qe(n,s,((i,o)=>aa(i,o)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class _t extends en{constructor(e,t,n,s=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Re extends en{constructor(e,t,n,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function si(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}})),e}function Kr(r,e,t){const n=new Map;S(r.length===t.length,32656,{Re:t.length,Ve:r.length});for(let s=0;s<t.length;s++){const i=r[s],o=i.transform,a=e.data.field(i.field);n.set(i.field,oa(o,a,t[s]))}return n}function Wr(r,e,t){const n=new Map;for(const s of r){const i=s.transform,o=t.data.field(s.field);n.set(s.field,ia(i,o,e))}return n}class zn extends en{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class ha extends en{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class da{constructor(e,t,n,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&ca(i,e,n[s])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=rt(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=rt(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=Hs();return this.mutations.forEach((s=>{const i=e.get(s.key),o=i.overlayedDocument;let a=this.applyToLocalView(o,i.mutatedFields);a=t.has(s.key)?null:a;const u=ri(o,a);u!==null&&n.set(s.key,u),o.isValidDocument()||o.convertToNoDocument(A.min())})),n}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),V())}isEqual(e){return this.batchId===e.batchId&&qe(this.mutations,e.mutations,((t,n)=>jr(t,n)))&&qe(this.baseMutations,e.baseMutations,((t,n)=>jr(t,n)))}}class $n{constructor(e,t,n,s){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=s}static from(e,t,n){S(e.mutations.length===n.length,58842,{me:e.mutations.length,fe:n.length});let s=(function(){return ta})();const i=e.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,n[o].version);return new $n(e,t,n,s)}}/**
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
 */class fa{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
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
 */class ma{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
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
 */var M,P;function _a(r){switch(r){case d.OK:return I(64938);case d.CANCELLED:case d.UNKNOWN:case d.DEADLINE_EXCEEDED:case d.RESOURCE_EXHAUSTED:case d.INTERNAL:case d.UNAVAILABLE:case d.UNAUTHENTICATED:return!1;case d.INVALID_ARGUMENT:case d.NOT_FOUND:case d.ALREADY_EXISTS:case d.PERMISSION_DENIED:case d.FAILED_PRECONDITION:case d.ABORTED:case d.OUT_OF_RANGE:case d.UNIMPLEMENTED:case d.DATA_LOSS:return!0;default:return I(15467,{code:r})}}function ii(r){if(r===void 0)return he("GRPC error has no .code"),d.UNKNOWN;switch(r){case M.OK:return d.OK;case M.CANCELLED:return d.CANCELLED;case M.UNKNOWN:return d.UNKNOWN;case M.DEADLINE_EXCEEDED:return d.DEADLINE_EXCEEDED;case M.RESOURCE_EXHAUSTED:return d.RESOURCE_EXHAUSTED;case M.INTERNAL:return d.INTERNAL;case M.UNAVAILABLE:return d.UNAVAILABLE;case M.UNAUTHENTICATED:return d.UNAUTHENTICATED;case M.INVALID_ARGUMENT:return d.INVALID_ARGUMENT;case M.NOT_FOUND:return d.NOT_FOUND;case M.ALREADY_EXISTS:return d.ALREADY_EXISTS;case M.PERMISSION_DENIED:return d.PERMISSION_DENIED;case M.FAILED_PRECONDITION:return d.FAILED_PRECONDITION;case M.ABORTED:return d.ABORTED;case M.OUT_OF_RANGE:return d.OUT_OF_RANGE;case M.UNIMPLEMENTED:return d.UNIMPLEMENTED;case M.DATA_LOSS:return d.DATA_LOSS;default:return I(39323,{code:r})}}(P=M||(M={}))[P.OK=0]="OK",P[P.CANCELLED=1]="CANCELLED",P[P.UNKNOWN=2]="UNKNOWN",P[P.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",P[P.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",P[P.NOT_FOUND=5]="NOT_FOUND",P[P.ALREADY_EXISTS=6]="ALREADY_EXISTS",P[P.PERMISSION_DENIED=7]="PERMISSION_DENIED",P[P.UNAUTHENTICATED=16]="UNAUTHENTICATED",P[P.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",P[P.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",P[P.ABORTED=10]="ABORTED",P[P.OUT_OF_RANGE=11]="OUT_OF_RANGE",P[P.UNIMPLEMENTED=12]="UNIMPLEMENTED",P[P.INTERNAL=13]="INTERNAL",P[P.UNAVAILABLE=14]="UNAVAILABLE",P[P.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function pa(){return new TextEncoder}/**
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
 */const ga=new Ve([4294967295,4294967295],0);function Hr(r){const e=pa().encode(r),t=new uo;return t.update(e),new Uint8Array(t.digest())}function Yr(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new Ve([t,n],0),new Ve([s,i],0)]}class Qn{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new Ze(`Invalid padding: ${t}`);if(n<0)throw new Ze(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new Ze(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new Ze(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=Ve.fromNumber(this.ge)}ye(e,t,n){let s=e.add(t.multiply(Ve.fromNumber(n)));return s.compare(ga)===1&&(s=new Ve([s.getBits(0),s.getBits(1)],0)),s.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const t=Hr(e),[n,s]=Yr(t);for(let i=0;i<this.hashCount;i++){const o=this.ye(n,s,i);if(!this.we(o))return!1}return!0}static create(e,t,n){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new Qn(i,s,t);return n.forEach((a=>o.insert(a))),o}insert(e){if(this.ge===0)return;const t=Hr(e),[n,s]=Yr(t);for(let i=0;i<this.hashCount;i++){const o=this.ye(n,s,i);this.Se(o)}}Se(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class Ze extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class tn{constructor(e,t,n,s,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const s=new Map;return s.set(e,pt.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new tn(A.min(),s,new D(v),de(),V())}}class pt{constructor(e,t,n,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new pt(n,t,V(),V(),V())}}/**
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
 */class Dt{constructor(e,t,n,s){this.be=e,this.removedTargetIds=t,this.key=n,this.De=s}}class oi{constructor(e,t){this.targetId=e,this.Ce=t}}class ai{constructor(e,t,n=Q.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=s}}class Xr{constructor(){this.ve=0,this.Fe=Jr(),this.Me=Q.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=V(),t=V(),n=V();return this.Fe.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:n=n.add(s);break;default:I(38017,{changeType:i})}})),new pt(this.Me,this.xe,e,t,n)}qe(){this.Oe=!1,this.Fe=Jr()}Qe(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}$e(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}Ue(){this.ve+=1}Ke(){this.ve-=1,S(this.ve>=0,3241,{ve:this.ve})}We(){this.Oe=!0,this.xe=!0}}class ya{constructor(e){this.Ge=e,this.ze=new Map,this.je=de(),this.Je=Pt(),this.He=Pt(),this.Ye=new D(v)}Ze(e){for(const t of e.be)e.De&&e.De.isFoundDocument()?this.Xe(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,(t=>{const n=this.nt(t);switch(e.state){case 0:this.rt(t)&&n.Le(e.resumeToken);break;case 1:n.Ke(),n.Ne||n.qe(),n.Le(e.resumeToken);break;case 2:n.Ke(),n.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(n.We(),n.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),n.Le(e.resumeToken));break;default:I(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach(((n,s)=>{this.rt(s)&&t(s)}))}st(e){const t=e.targetId,n=e.Ce.count,s=this.ot(t);if(s){const i=s.target;if(An(i))if(n===0){const o=new y(i.path);this.et(t,o,j.newNoDocument(o,A.min()))}else S(n===1,20013,{expectedCount:n});else{const o=this._t(t);if(o!==n){const a=this.ut(e),u=a?this.ct(a,e,o):1;if(u!==0){this.it(t);const c=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ye=this.Ye.insert(t,c)}}}}}ut(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:i=0}=t;let o,a;try{o=ye(n).toUint8Array()}catch(u){if(u instanceof Ns)return st("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{a=new Qn(o,s,i)}catch(u){return st(u instanceof Ze?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return a.ge===0?null:a}ct(e,t,n){return t.Ce.count===n-this.Pt(e,t.targetId)?0:2}Pt(e,t){const n=this.Ge.getRemoteKeysForTarget(t);let s=0;return n.forEach((i=>{const o=this.Ge.ht(),a=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(a)||(this.et(t,i,null),s++)})),s}Tt(e){const t=new Map;this.ze.forEach(((i,o)=>{const a=this.ot(o);if(a){if(i.current&&An(a.target)){const u=new y(a.target.path);this.It(u).has(o)||this.Et(o,u)||this.et(o,u,j.newNoDocument(u,e))}i.Be&&(t.set(o,i.ke()),i.qe())}}));let n=V();this.He.forEach(((i,o)=>{let a=!0;o.forEachWhile((u=>{const c=this.ot(u);return!c||c.purpose==="TargetPurposeLimboResolution"||(a=!1,!1)})),a&&(n=n.add(i))})),this.je.forEach(((i,o)=>o.setReadTime(e)));const s=new tn(e,t,this.Ye,this.je,n);return this.je=de(),this.Je=Pt(),this.He=Pt(),this.Ye=new D(v),s}Xe(e,t){if(!this.rt(e))return;const n=this.Et(e,t.key)?2:0;this.nt(e).Qe(t.key,n),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.It(t.key).add(e)),this.He=this.He.insert(t.key,this.dt(t.key).add(e))}et(e,t,n){if(!this.rt(e))return;const s=this.nt(e);this.Et(e,t)?s.Qe(t,1):s.$e(t),this.He=this.He.insert(t,this.dt(t).delete(e)),this.He=this.He.insert(t,this.dt(t).add(e)),n&&(this.je=this.je.insert(t,n))}removeTarget(e){this.ze.delete(e)}_t(e){const t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}Ue(e){this.nt(e).Ue()}nt(e){let t=this.ze.get(e);return t||(t=new Xr,this.ze.set(e,t)),t}dt(e){let t=this.He.get(e);return t||(t=new U(v),this.He=this.He.insert(e,t)),t}It(e){let t=this.Je.get(e);return t||(t=new U(v),this.Je=this.Je.insert(e,t)),t}rt(e){const t=this.ot(e)!==null;return t||g("WatchChangeAggregator","Detected inactive target",e),t}ot(e){const t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new Xr),this.Ge.getRemoteKeysForTarget(e).forEach((t=>{this.et(e,t,null)}))}Et(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function Pt(){return new D(y.comparator)}function Jr(){return new D(y.comparator)}const Ea={asc:"ASCENDING",desc:"DESCENDING"},Ta={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Ia={and:"AND",or:"OR"};class Aa{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Rn(r,e){return r.useProto3Json||Kt(e)?e:{value:e}}function Ut(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function ui(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function wa(r,e){return Ut(r,e.toTimestamp())}function ie(r){return S(!!r,49232),A.fromTimestamp((function(t){const n=ge(t);return new b(n.seconds,n.nanos)})(r))}function Gn(r,e){return vn(r,e).canonicalString()}function vn(r,e){const t=(function(s){return new C(["projects",s.projectId,"databases",s.database])})(r).child("documents");return e===void 0?t:t.child(e)}function ci(r){const e=C.fromString(r);return S(mi(e),10190,{key:e.toString()}),e}function Vn(r,e){return Gn(r.databaseId,e.path)}function mn(r,e){const t=ci(e);if(t.get(1)!==r.databaseId.projectId)throw new p(d.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new p(d.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new y(hi(t))}function li(r,e){return Gn(r.databaseId,e)}function Ra(r){const e=ci(r);return e.length===4?C.emptyPath():hi(e)}function Pn(r){return new C(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function hi(r){return S(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function Zr(r,e,t){return{name:Vn(r,e),fields:t.value.mapValue.fields}}function va(r,e){let t;if("targetChange"in e){e.targetChange;const n=(function(c){return c==="NO_CHANGE"?0:c==="ADD"?1:c==="REMOVE"?2:c==="CURRENT"?3:c==="RESET"?4:I(39313,{state:c})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(c,l){return c.useProto3Json?(S(l===void 0||typeof l=="string",58123),Q.fromBase64String(l||"")):(S(l===void 0||l instanceof Buffer||l instanceof Uint8Array,16193),Q.fromUint8Array(l||new Uint8Array))})(r,e.targetChange.resumeToken),o=e.targetChange.cause,a=o&&(function(c){const l=c.code===void 0?d.UNKNOWN:ii(c.code);return new p(l,c.message||"")})(o);t=new ai(n,s,i,a||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const s=mn(r,n.document.name),i=ie(n.document.updateTime),o=n.document.createTime?ie(n.document.createTime):A.min(),a=new H({mapValue:{fields:n.document.fields}}),u=j.newFoundDocument(s,i,o,a),c=n.targetIds||[],l=n.removedTargetIds||[];t=new Dt(c,l,u.key,u)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const s=mn(r,n.document),i=n.readTime?ie(n.readTime):A.min(),o=j.newNoDocument(s,i),a=n.removedTargetIds||[];t=new Dt([],a,o.key,o)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const s=mn(r,n.document),i=n.removedTargetIds||[];t=new Dt([],i,s,null)}else{if(!("filter"in e))return I(11601,{Rt:e});{e.filter;const n=e.filter;n.targetId;const{count:s=0,unchangedNames:i}=n,o=new ma(s,i),a=n.targetId;t=new oi(a,o)}}return t}function Va(r,e){let t;if(e instanceof _t)t={update:Zr(r,e.key,e.value)};else if(e instanceof zn)t={delete:Vn(r,e.key)};else if(e instanceof Re)t={update:Zr(r,e.key,e.data),updateMask:Ma(e.fieldMask)};else{if(!(e instanceof ha))return I(16599,{Vt:e.type});t={verify:Vn(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((n=>(function(i,o){const a=o.transform;if(a instanceof lt)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof ht)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof dt)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof ft)return{fieldPath:o.field.canonicalString(),increment:a.Ae};throw I(20930,{transform:o.transform})})(0,n)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:wa(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:I(27497)})(r,e.precondition)),t}function Pa(r,e){return r&&r.length>0?(S(e!==void 0,14353),r.map((t=>(function(s,i){let o=s.updateTime?ie(s.updateTime):ie(i);return o.isEqual(A.min())&&(o=ie(i)),new ua(o,s.transformResults||[])})(t,e)))):[]}function Sa(r,e){return{documents:[li(r,e.path)]}}function Ca(r,e){const t={structuredQuery:{}},n=e.path;let s;e.collectionGroup!==null?(s=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=li(r,s);const i=(function(c){if(c.length!==0)return fi(te.create(c,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const o=(function(c){if(c.length!==0)return c.map((l=>(function(f){return{field:Oe(f.field),direction:Da(f.dir)}})(l)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);const a=Rn(r,e.limit);return a!==null&&(t.structuredQuery.limit=a),e.startAt&&(t.structuredQuery.startAt=(function(c){return{before:c.inclusive,values:c.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(c){return{before:!c.inclusive,values:c.position}})(e.endAt)),{ft:t,parent:s}}function ba(r){let e=Ra(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let s=null;if(n>0){S(n===1,65062);const l=t.from[0];l.allDescendants?s=l.collectionId:e=e.child(l.collectionId)}let i=[];t.where&&(i=(function(h){const f=di(h);return f instanceof te&&Bs(f)?f.getFilters():[f]})(t.where));let o=[];t.orderBy&&(o=(function(h){return h.map((f=>(function(T){return new ct(Le(T.field),(function(E){switch(E){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(T.direction))})(f)))})(t.orderBy));let a=null;t.limit&&(a=(function(h){let f;return f=typeof h=="object"?h.value:h,Kt(f)?null:f})(t.limit));let u=null;t.startAt&&(u=(function(h){const f=!!h.before,_=h.values||[];return new $e(_,f)})(t.startAt));let c=null;return t.endAt&&(c=(function(h){const f=!h.before,_=h.values||[];return new $e(_,f)})(t.endAt)),Yo(e,s,o,i,a,"F",u,c)}function Na(r,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return I(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function di(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=Le(t.unaryFilter.field);return O.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=Le(t.unaryFilter.field);return O.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Le(t.unaryFilter.field);return O.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Le(t.unaryFilter.field);return O.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return I(61313);default:return I(60726)}})(r):r.fieldFilter!==void 0?(function(t){return O.create(Le(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return I(58110);default:return I(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return te.create(t.compositeFilter.filters.map((n=>di(n))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return I(1026)}})(t.compositeFilter.op))})(r):I(30097,{filter:r})}function Da(r){return Ea[r]}function ka(r){return Ta[r]}function xa(r){return Ia[r]}function Oe(r){return{fieldPath:r.canonicalString()}}function Le(r){return $.fromServerFormat(r.fieldPath)}function fi(r){return r instanceof O?(function(t){if(t.op==="=="){if(qr(t.value))return{unaryFilter:{field:Oe(t.field),op:"IS_NAN"}};if(Ur(t.value))return{unaryFilter:{field:Oe(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(qr(t.value))return{unaryFilter:{field:Oe(t.field),op:"IS_NOT_NAN"}};if(Ur(t.value))return{unaryFilter:{field:Oe(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Oe(t.field),op:ka(t.op),value:t.value}}})(r):r instanceof te?(function(t){const n=t.getFilters().map((s=>fi(s)));return n.length===1?n[0]:{compositeFilter:{op:xa(t.op),filters:n}}})(r):I(54877,{filter:r})}function Ma(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function mi(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
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
 */class me{constructor(e,t,n,s,i=A.min(),o=A.min(),a=Q.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a,this.expectedCount=u}withSequenceNumber(e){return new me(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new me(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new me(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new me(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
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
 */class Oa{constructor(e){this.yt=e}}function La(r){const e=ba({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?Ft(e,e.limit,"L"):e}/**
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
 */class Fa{constructor(){this.Cn=new Ua}addToCollectionParentIndex(e,t){return this.Cn.add(t),m.resolve()}getCollectionParents(e,t){return m.resolve(this.Cn.getEntries(t))}addFieldIndex(e,t){return m.resolve()}deleteFieldIndex(e,t){return m.resolve()}deleteAllFieldIndexes(e){return m.resolve()}createTargetIndexes(e,t){return m.resolve()}getDocumentsMatchingTarget(e,t){return m.resolve(null)}getIndexType(e,t){return m.resolve(0)}getFieldIndexes(e,t){return m.resolve([])}getNextCollectionGroupToUpdate(e){return m.resolve(null)}getMinOffset(e,t){return m.resolve(pe.min())}getMinOffsetFromCollectionGroup(e,t){return m.resolve(pe.min())}updateCollectionGroup(e,t,n){return m.resolve()}updateIndexEntries(e,t){return m.resolve()}}class Ua{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t]||new U(C.comparator),i=!s.has(n);return this.index[t]=s.add(n),i}has(e){const t=e.lastSegment(),n=e.popLast(),s=this.index[t];return s&&s.has(n)}getEntries(e){return(this.index[e]||new U(C.comparator)).toArray()}}/**
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
 */const es={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},_i=41943040;class W{static withCacheSize(e){return new W(e,W.DEFAULT_COLLECTION_PERCENTILE,W.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}/**
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
 */W.DEFAULT_COLLECTION_PERCENTILE=10,W.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,W.DEFAULT=new W(_i,W.DEFAULT_COLLECTION_PERCENTILE,W.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),W.DISABLED=new W(-1,0,0);/**
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
 */class Qe{constructor(e){this.ar=e}next(){return this.ar+=2,this.ar}static ur(){return new Qe(0)}static cr(){return new Qe(-1)}}/**
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
 */const ts="LruGarbageCollector",pi=1048576;function ns([r,e],[t,n]){const s=v(r,t);return s===0?v(e,n):s}class qa{constructor(e){this.Ir=e,this.buffer=new U(ns),this.Er=0}dr(){return++this.Er}Ar(e){const t=[e,this.dr()];if(this.buffer.size<this.Ir)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();ns(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class Ba{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Vr(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Vr(e){g(ts,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){We(t)?g(ts,"Ignoring IndexedDB error during garbage collection: ",t):await Ke(t)}await this.Vr(3e5)}))}}class za{constructor(e,t){this.mr=e,this.params=t}calculateTargetCount(e,t){return this.mr.gr(e).next((n=>Math.floor(t/100*n)))}nthSequenceNumber(e,t){if(t===0)return m.resolve(jt.ce);const n=new qa(t);return this.mr.forEachTarget(e,(s=>n.Ar(s.sequenceNumber))).next((()=>this.mr.pr(e,(s=>n.Ar(s))))).next((()=>n.maxValue))}removeTargets(e,t,n){return this.mr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.mr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(g("LruGarbageCollector","Garbage collection skipped; disabled"),m.resolve(es)):this.getCacheSize(e).next((n=>n<this.params.cacheSizeCollectionThreshold?(g("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),es):this.yr(e,t)))}getCacheSize(e){return this.mr.getCacheSize(e)}yr(e,t){let n,s,i,o,a,u,c;const l=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((h=>(h>this.params.maximumSequenceNumbersToCollect?(g("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${h}`),s=this.params.maximumSequenceNumbersToCollect):s=h,o=Date.now(),this.nthSequenceNumber(e,s)))).next((h=>(n=h,a=Date.now(),this.removeTargets(e,n,t)))).next((h=>(i=h,u=Date.now(),this.removeOrphanedDocuments(e,n)))).next((h=>(c=Date.now(),xe()<=ce.DEBUG&&g("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-l}ms
	Determined least recently used ${s} in `+(a-o)+`ms
	Removed ${i} targets in `+(u-a)+`ms
	Removed ${h} documents in `+(c-u)+`ms
Total Duration: ${c-l}ms`),m.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:h}))))}}function $a(r,e){return new za(r,e)}/**
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
 */class Qa{constructor(){this.changes=new Ne((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,j.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?m.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
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
 */class Ga{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
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
 */class ja{constructor(e,t,n,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=s}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(n=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(n!==null&&rt(n.mutation,s,Y.empty(),b.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.getLocalViewOfDocuments(e,n,V()).next((()=>n))))}getLocalViewOfDocuments(e,t,n=V()){const s=ve();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,n).next((i=>{let o=Je();return i.forEach(((a,u)=>{o=o.insert(a,u.overlayedDocument)})),o}))))}getOverlayedDocuments(e,t){const n=ve();return this.populateOverlays(e,n,t).next((()=>this.computeViews(e,t,n,V())))}populateOverlays(e,t,n){const s=[];return n.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((o,a)=>{t.set(o,a)}))}))}computeViews(e,t,n,s){let i=de();const o=nt(),a=(function(){return nt()})();return t.forEach(((u,c)=>{const l=n.get(c.key);s.has(c.key)&&(l===void 0||l.mutation instanceof Re)?i=i.insert(c.key,c):l!==void 0?(o.set(c.key,l.mutation.getFieldMask()),rt(l.mutation,c,l.mutation.getFieldMask(),b.now())):o.set(c.key,Y.empty())})),this.recalculateAndSaveOverlays(e,i).next((u=>(u.forEach(((c,l)=>o.set(c,l))),t.forEach(((c,l)=>a.set(c,new Ga(l,o.get(c)??null)))),a)))}recalculateAndSaveOverlays(e,t){const n=nt();let s=new D(((o,a)=>o-a)),i=V();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((o=>{for(const a of o)a.keys().forEach((u=>{const c=t.get(u);if(c===null)return;let l=n.get(u)||Y.empty();l=a.applyToLocalView(c,l),n.set(u,l);const h=(s.get(a.batchId)||V()).add(u);s=s.insert(a.batchId,h)}))})).next((()=>{const o=[],a=s.getReverseIterator();for(;a.hasNext();){const u=a.getNext(),c=u.key,l=u.value,h=Hs();l.forEach((f=>{if(!i.has(f)){const _=ri(t.get(f),n.get(f));_!==null&&h.set(f,_),i=i.add(f)}})),o.push(this.documentOverlayCache.saveOverlays(e,c,h))}return m.waitFor(o)})).next((()=>n))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.recalculateAndSaveOverlays(e,n)))}getDocumentsMatchingQuery(e,t,n,s){return(function(o){return y.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0})(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):qn(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,s):this.getDocumentsMatchingCollectionQuery(e,t,n,s)}getNextDocuments(e,t,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,s).next((i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,s-i.size):m.resolve(ve());let a=it,u=i;return o.next((c=>m.forEach(c,((l,h)=>(a<h.largestBatchId&&(a=h.largestBatchId),i.get(l)?m.resolve():this.remoteDocumentCache.getEntry(e,l).next((f=>{u=u.insert(l,f)}))))).next((()=>this.populateOverlays(e,c,i))).next((()=>this.computeViews(e,u,c,V()))).next((l=>({batchId:a,changes:Ws(l)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new y(t)).next((n=>{let s=Je();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,n,s){const i=t.collectionGroup;let o=Je();return this.indexManager.getCollectionParents(e,i).next((a=>m.forEach(a,(u=>{const c=(function(h,f){return new we(f,null,h.explicitOrderBy.slice(),h.filters.slice(),h.limit,h.limitType,h.startAt,h.endAt)})(t,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,c,n,s).next((l=>{l.forEach(((h,f)=>{o=o.insert(h,f)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(e,t,n,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next((o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,s)))).next((o=>{i.forEach(((u,c)=>{const l=c.getKey();o.get(l)===null&&(o=o.insert(l,j.newInvalidDocument(l)))}));let a=Je();return o.forEach(((u,c)=>{const l=i.get(u);l!==void 0&&rt(l.mutation,c,Y.empty(),b.now()),Jt(t,c)&&(a=a.insert(u,c))})),a}))}}/**
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
 */class Ka{constructor(e){this.serializer=e,this.Lr=new Map,this.kr=new Map}getBundleMetadata(e,t){return m.resolve(this.Lr.get(t))}saveBundleMetadata(e,t){return this.Lr.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:ie(s.createTime)}})(t)),m.resolve()}getNamedQuery(e,t){return m.resolve(this.kr.get(t))}saveNamedQuery(e,t){return this.kr.set(t.name,(function(s){return{name:s.name,query:La(s.bundledQuery),readTime:ie(s.readTime)}})(t)),m.resolve()}}/**
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
 */class Wa{constructor(){this.overlays=new D(y.comparator),this.qr=new Map}getOverlay(e,t){return m.resolve(this.overlays.get(t))}getOverlays(e,t){const n=ve();return m.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}saveOverlays(e,t,n){return n.forEach(((s,i)=>{this.St(e,t,i)})),m.resolve()}removeOverlaysForBatchId(e,t,n){const s=this.qr.get(n);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.qr.delete(n)),m.resolve()}getOverlaysForCollection(e,t,n){const s=ve(),i=t.length+1,o=new y(t.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const u=a.getNext().value,c=u.getKey();if(!t.isPrefixOf(c.path))break;c.path.length===i&&u.largestBatchId>n&&s.set(u.getKey(),u)}return m.resolve(s)}getOverlaysForCollectionGroup(e,t,n,s){let i=new D(((c,l)=>c-l));const o=this.overlays.getIterator();for(;o.hasNext();){const c=o.getNext().value;if(c.getKey().getCollectionGroup()===t&&c.largestBatchId>n){let l=i.get(c.largestBatchId);l===null&&(l=ve(),i=i.insert(c.largestBatchId,l)),l.set(c.getKey(),c)}}const a=ve(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((c,l)=>a.set(c,l))),!(a.size()>=s)););return m.resolve(a)}St(e,t,n){const s=this.overlays.get(n.key);if(s!==null){const o=this.qr.get(s.largestBatchId).delete(n.key);this.qr.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new fa(t,n));let i=this.qr.get(t);i===void 0&&(i=V(),this.qr.set(t,i)),this.qr.set(t,i.add(n.key))}}/**
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
 */class Ha{constructor(){this.sessionToken=Q.EMPTY_BYTE_STRING}getSessionToken(e){return m.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,m.resolve()}}/**
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
 */class jn{constructor(){this.Qr=new U(q.$r),this.Ur=new U(q.Kr)}isEmpty(){return this.Qr.isEmpty()}addReference(e,t){const n=new q(e,t);this.Qr=this.Qr.add(n),this.Ur=this.Ur.add(n)}Wr(e,t){e.forEach((n=>this.addReference(n,t)))}removeReference(e,t){this.Gr(new q(e,t))}zr(e,t){e.forEach((n=>this.removeReference(n,t)))}jr(e){const t=new y(new C([])),n=new q(t,e),s=new q(t,e+1),i=[];return this.Ur.forEachInRange([n,s],(o=>{this.Gr(o),i.push(o.key)})),i}Jr(){this.Qr.forEach((e=>this.Gr(e)))}Gr(e){this.Qr=this.Qr.delete(e),this.Ur=this.Ur.delete(e)}Hr(e){const t=new y(new C([])),n=new q(t,e),s=new q(t,e+1);let i=V();return this.Ur.forEachInRange([n,s],(o=>{i=i.add(o.key)})),i}containsKey(e){const t=new q(e,0),n=this.Qr.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class q{constructor(e,t){this.key=e,this.Yr=t}static $r(e,t){return y.comparator(e.key,t.key)||v(e.Yr,t.Yr)}static Kr(e,t){return v(e.Yr,t.Yr)||y.comparator(e.key,t.key)}}/**
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
 */class Ya{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.tr=1,this.Zr=new U(q.$r)}checkEmpty(e){return m.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,s){const i=this.tr;this.tr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new da(i,t,n,s);this.mutationQueue.push(o);for(const a of s)this.Zr=this.Zr.add(new q(a.key,i)),this.indexManager.addToCollectionParentIndex(e,a.key.path.popLast());return m.resolve(o)}lookupMutationBatch(e,t){return m.resolve(this.Xr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,s=this.ei(n),i=s<0?0:s;return m.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return m.resolve(this.mutationQueue.length===0?On:this.tr-1)}getAllMutationBatches(e){return m.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new q(t,0),s=new q(t,Number.POSITIVE_INFINITY),i=[];return this.Zr.forEachInRange([n,s],(o=>{const a=this.Xr(o.Yr);i.push(a)})),m.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new U(v);return t.forEach((s=>{const i=new q(s,0),o=new q(s,Number.POSITIVE_INFINITY);this.Zr.forEachInRange([i,o],(a=>{n=n.add(a.Yr)}))})),m.resolve(this.ti(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,s=n.length+1;let i=n;y.isDocumentKey(i)||(i=i.child(""));const o=new q(new y(i),0);let a=new U(v);return this.Zr.forEachWhile((u=>{const c=u.key.path;return!!n.isPrefixOf(c)&&(c.length===s&&(a=a.add(u.Yr)),!0)}),o),m.resolve(this.ti(a))}ti(e){const t=[];return e.forEach((n=>{const s=this.Xr(n);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){S(this.ni(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.Zr;return m.forEach(t.mutations,(s=>{const i=new q(s.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.Zr=n}))}ir(e){}containsKey(e,t){const n=new q(t,0),s=this.Zr.firstAfterOrEqual(n);return m.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,m.resolve()}ni(e,t){return this.ei(e)}ei(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Xr(e){const t=this.ei(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
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
 */class Xa{constructor(e){this.ri=e,this.docs=(function(){return new D(y.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,s=this.docs.get(n),i=s?s.size:0,o=this.ri(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return m.resolve(n?n.document.mutableCopy():j.newInvalidDocument(t))}getEntries(e,t){let n=de();return t.forEach((s=>{const i=this.docs.get(s);n=n.insert(s,i?i.document.mutableCopy():j.newInvalidDocument(s))})),m.resolve(n)}getDocumentsMatchingQuery(e,t,n,s){let i=de();const o=t.path,a=new y(o.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(a);for(;u.hasNext();){const{key:c,value:{document:l}}=u.getNext();if(!o.isPrefixOf(c.path))break;c.path.length>o.length+1||So(Po(l),n)<=0||(s.has(l.key)||Jt(t,l))&&(i=i.insert(l.key,l.mutableCopy()))}return m.resolve(i)}getAllFromCollectionGroup(e,t,n,s){I(9500)}ii(e,t){return m.forEach(this.docs,(n=>t(n)))}newChangeBuffer(e){return new Ja(this)}getSize(e){return m.resolve(this.size)}}class Ja extends Qa{constructor(e){super(),this.Nr=e}applyChanges(e){const t=[];return this.changes.forEach(((n,s)=>{s.isValidDocument()?t.push(this.Nr.addEntry(e,s)):this.Nr.removeEntry(n)})),m.waitFor(t)}getFromCache(e,t){return this.Nr.getEntry(e,t)}getAllFromCache(e,t){return this.Nr.getEntries(e,t)}}/**
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
 */class Za{constructor(e){this.persistence=e,this.si=new Ne((t=>Fn(t)),Un),this.lastRemoteSnapshotVersion=A.min(),this.highestTargetId=0,this.oi=0,this._i=new jn,this.targetCount=0,this.ai=Qe.ur()}forEachTarget(e,t){return this.si.forEach(((n,s)=>t(s))),m.resolve()}getLastRemoteSnapshotVersion(e){return m.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return m.resolve(this.oi)}allocateTargetId(e){return this.highestTargetId=this.ai.next(),m.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.oi&&(this.oi=t),m.resolve()}Pr(e){this.si.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.ai=new Qe(t),this.highestTargetId=t),e.sequenceNumber>this.oi&&(this.oi=e.sequenceNumber)}addTargetData(e,t){return this.Pr(t),this.targetCount+=1,m.resolve()}updateTargetData(e,t){return this.Pr(t),m.resolve()}removeTargetData(e,t){return this.si.delete(t.target),this._i.jr(t.targetId),this.targetCount-=1,m.resolve()}removeTargets(e,t,n){let s=0;const i=[];return this.si.forEach(((o,a)=>{a.sequenceNumber<=t&&n.get(a.targetId)===null&&(this.si.delete(o),i.push(this.removeMatchingKeysForTargetId(e,a.targetId)),s++)})),m.waitFor(i).next((()=>s))}getTargetCount(e){return m.resolve(this.targetCount)}getTargetData(e,t){const n=this.si.get(t)||null;return m.resolve(n)}addMatchingKeys(e,t,n){return this._i.Wr(t,n),m.resolve()}removeMatchingKeys(e,t,n){this._i.zr(t,n);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((o=>{i.push(s.markPotentiallyOrphaned(e,o))})),m.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this._i.jr(t),m.resolve()}getMatchingKeysForTargetId(e,t){const n=this._i.Hr(t);return m.resolve(n)}containsKey(e,t){return m.resolve(this._i.containsKey(t))}}/**
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
 */class gi{constructor(e,t){this.ui={},this.overlays={},this.ci=new jt(0),this.li=!1,this.li=!0,this.hi=new Ha,this.referenceDelegate=e(this),this.Pi=new Za(this),this.indexManager=new Fa,this.remoteDocumentCache=(function(s){return new Xa(s)})((n=>this.referenceDelegate.Ti(n))),this.serializer=new Oa(t),this.Ii=new Ka(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.li=!1,Promise.resolve()}get started(){return this.li}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Wa,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.ui[e.toKey()];return n||(n=new Ya(t,this.referenceDelegate),this.ui[e.toKey()]=n),n}getGlobalsCache(){return this.hi}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ii}runTransaction(e,t,n){g("MemoryPersistence","Starting transaction:",e);const s=new eu(this.ci.next());return this.referenceDelegate.Ei(),n(s).next((i=>this.referenceDelegate.di(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}Ai(e,t){return m.or(Object.values(this.ui).map((n=>()=>n.containsKey(e,t))))}}class eu extends bo{constructor(e){super(),this.currentSequenceNumber=e}}class Kn{constructor(e){this.persistence=e,this.Ri=new jn,this.Vi=null}static mi(e){return new Kn(e)}get fi(){if(this.Vi)return this.Vi;throw I(60996)}addReference(e,t,n){return this.Ri.addReference(n,t),this.fi.delete(n.toString()),m.resolve()}removeReference(e,t,n){return this.Ri.removeReference(n,t),this.fi.add(n.toString()),m.resolve()}markPotentiallyOrphaned(e,t){return this.fi.add(t.toString()),m.resolve()}removeTarget(e,t){this.Ri.jr(t.targetId).forEach((s=>this.fi.add(s.toString())));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.fi.add(i.toString())))})).next((()=>n.removeTargetData(e,t)))}Ei(){this.Vi=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return m.forEach(this.fi,(n=>{const s=y.fromPath(n);return this.gi(e,s).next((i=>{i||t.removeEntry(s,A.min())}))})).next((()=>(this.Vi=null,t.apply(e))))}updateLimboDocument(e,t){return this.gi(e,t).next((n=>{n?this.fi.delete(t.toString()):this.fi.add(t.toString())}))}Ti(e){return 0}gi(e,t){return m.or([()=>m.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ai(e,t)])}}class qt{constructor(e,t){this.persistence=e,this.pi=new Ne((n=>ko(n.path)),((n,s)=>n.isEqual(s))),this.garbageCollector=$a(this,t)}static mi(e,t){return new qt(e,t)}Ei(){}di(e){return m.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}gr(e){const t=this.wr(e);return this.persistence.getTargetCache().getTargetCount(e).next((n=>t.next((s=>n+s))))}wr(e){let t=0;return this.pr(e,(n=>{t++})).next((()=>t))}pr(e,t){return m.forEach(this.pi,((n,s)=>this.br(e,n,s).next((i=>i?m.resolve():t(s)))))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.ii(e,(o=>this.br(e,o,t).next((a=>{a||(n++,i.removeEntry(o,A.min()))})))).next((()=>i.apply(e))).next((()=>n))}markPotentiallyOrphaned(e,t){return this.pi.set(t,e.currentSequenceNumber),m.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.pi.set(n,e.currentSequenceNumber),m.resolve()}removeReference(e,t,n){return this.pi.set(n,e.currentSequenceNumber),m.resolve()}updateLimboDocument(e,t){return this.pi.set(t,e.currentSequenceNumber),m.resolve()}Ti(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Ct(e.data.value)),t}br(e,t,n){return m.or([()=>this.persistence.Ai(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.pi.get(t);return m.resolve(s!==void 0&&s>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
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
 */class Wn{constructor(e,t,n,s){this.targetId=e,this.fromCache=t,this.Es=n,this.ds=s}static As(e,t){let n=V(),s=V();for(const i of t.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new Wn(e,t.fromCache,n,s)}}/**
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
 */class tu{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
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
 */class nu{constructor(){this.Rs=!1,this.Vs=!1,this.fs=100,this.gs=(function(){return oo()?8:No(ao())>0?6:4})()}initialize(e,t){this.ps=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,n,s){const i={result:null};return this.ys(e,t).next((o=>{i.result=o})).next((()=>{if(!i.result)return this.ws(e,t,s,n).next((o=>{i.result=o}))})).next((()=>{if(i.result)return;const o=new tu;return this.Ss(e,t,o).next((a=>{if(i.result=a,this.Vs)return this.bs(e,t,o,a.size)}))})).next((()=>i.result))}bs(e,t,n,s){return n.documentReadCount<this.fs?(xe()<=ce.DEBUG&&g("QueryEngine","SDK will not create cache indexes for query:",Me(t),"since it only creates cache indexes for collection contains","more than or equal to",this.fs,"documents"),m.resolve()):(xe()<=ce.DEBUG&&g("QueryEngine","Query:",Me(t),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.gs*s?(xe()<=ce.DEBUG&&g("QueryEngine","The SDK decides to create cache indexes for query:",Me(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,se(t))):m.resolve())}ys(e,t){if(Qr(t))return m.resolve(null);let n=se(t);return this.indexManager.getIndexType(e,n).next((s=>s===0?null:(t.limit!==null&&s===1&&(t=Ft(t,null,"F"),n=se(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next((i=>{const o=V(...i);return this.ps.getDocuments(e,o).next((a=>this.indexManager.getMinOffset(e,n).next((u=>{const c=this.Ds(t,a);return this.Cs(t,c,o,u.readTime)?this.ys(e,Ft(t,null,"F")):this.vs(e,c,t,u)}))))})))))}ws(e,t,n,s){return Qr(t)||s.isEqual(A.min())?m.resolve(null):this.ps.getDocuments(e,n).next((i=>{const o=this.Ds(t,i);return this.Cs(t,o,n,s)?m.resolve(null):(xe()<=ce.DEBUG&&g("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Me(t)),this.vs(e,o,t,Vo(s,it)).next((a=>a)))}))}Ds(e,t){let n=new U(js(e));return t.forEach(((s,i)=>{Jt(e,i)&&(n=n.add(i))})),n}Cs(e,t,n,s){if(e.limit===null)return!1;if(n.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Ss(e,t,n){return xe()<=ce.DEBUG&&g("QueryEngine","Using full collection scan to execute query:",Me(t)),this.ps.getDocumentsMatchingQuery(e,t,pe.min(),n)}vs(e,t,n,s){return this.ps.getDocumentsMatchingQuery(e,n,s).next((i=>(t.forEach((o=>{i=i.insert(o.key,o)})),i)))}}/**
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
 */const Hn="LocalStore",ru=3e8;class su{constructor(e,t,n,s){this.persistence=e,this.Fs=t,this.serializer=s,this.Ms=new D(v),this.xs=new Ne((i=>Fn(i)),Un),this.Os=new Map,this.Ns=e.getRemoteDocumentCache(),this.Pi=e.getTargetCache(),this.Ii=e.getBundleCache(),this.Bs(n)}Bs(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new ja(this.Ns,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ns.setIndexManager(this.indexManager),this.Fs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Ms)))}}function iu(r,e,t,n){return new su(r,e,t,n)}async function yi(r,e){const t=R(r);return await t.persistence.runTransaction("Handle user change","readonly",(n=>{let s;return t.mutationQueue.getAllMutationBatches(n).next((i=>(s=i,t.Bs(e),t.mutationQueue.getAllMutationBatches(n)))).next((i=>{const o=[],a=[];let u=V();for(const c of s){o.push(c.batchId);for(const l of c.mutations)u=u.add(l.key)}for(const c of i){a.push(c.batchId);for(const l of c.mutations)u=u.add(l.key)}return t.localDocuments.getDocuments(n,u).next((c=>({Ls:c,removedBatchIds:o,addedBatchIds:a})))}))}))}function ou(r,e){const t=R(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(n=>{const s=e.batch.keys(),i=t.Ns.newChangeBuffer({trackRemovals:!0});return(function(a,u,c,l){const h=c.batch,f=h.keys();let _=m.resolve();return f.forEach((T=>{_=_.next((()=>l.getEntry(u,T))).next((w=>{const E=c.docVersions.get(T);S(E!==null,48541),w.version.compareTo(E)<0&&(h.applyToRemoteDocument(w,c),w.isValidDocument()&&(w.setReadTime(c.commitVersion),l.addEntry(w)))}))})),_.next((()=>a.mutationQueue.removeMutationBatch(u,h)))})(t,n,e,i).next((()=>i.apply(n))).next((()=>t.mutationQueue.performConsistencyCheck(n))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(n,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,(function(a){let u=V();for(let c=0;c<a.mutationResults.length;++c)a.mutationResults[c].transformResults.length>0&&(u=u.add(a.batch.mutations[c].key));return u})(e)))).next((()=>t.localDocuments.getDocuments(n,s)))}))}function Ei(r){const e=R(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.Pi.getLastRemoteSnapshotVersion(t)))}function au(r,e){const t=R(r),n=e.snapshotVersion;let s=t.Ms;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const o=t.Ns.newChangeBuffer({trackRemovals:!0});s=t.Ms;const a=[];e.targetChanges.forEach(((l,h)=>{const f=s.get(h);if(!f)return;a.push(t.Pi.removeMatchingKeys(i,l.removedDocuments,h).next((()=>t.Pi.addMatchingKeys(i,l.addedDocuments,h))));let _=f.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(h)!==null?_=_.withResumeToken(Q.EMPTY_BYTE_STRING,A.min()).withLastLimboFreeSnapshotVersion(A.min()):l.resumeToken.approximateByteSize()>0&&(_=_.withResumeToken(l.resumeToken,n)),s=s.insert(h,_),(function(w,E,N){return w.resumeToken.approximateByteSize()===0||E.snapshotVersion.toMicroseconds()-w.snapshotVersion.toMicroseconds()>=ru?!0:N.addedDocuments.size+N.modifiedDocuments.size+N.removedDocuments.size>0})(f,_,l)&&a.push(t.Pi.updateTargetData(i,_))}));let u=de(),c=V();if(e.documentUpdates.forEach((l=>{e.resolvedLimboDocuments.has(l)&&a.push(t.persistence.referenceDelegate.updateLimboDocument(i,l))})),a.push(uu(i,o,e.documentUpdates).next((l=>{u=l.ks,c=l.qs}))),!n.isEqual(A.min())){const l=t.Pi.getLastRemoteSnapshotVersion(i).next((h=>t.Pi.setTargetsMetadata(i,i.currentSequenceNumber,n)));a.push(l)}return m.waitFor(a).next((()=>o.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,u,c))).next((()=>u))})).then((i=>(t.Ms=s,i)))}function uu(r,e,t){let n=V(),s=V();return t.forEach((i=>n=n.add(i))),e.getEntries(r,n).next((i=>{let o=de();return t.forEach(((a,u)=>{const c=i.get(a);u.isFoundDocument()!==c.isFoundDocument()&&(s=s.add(a)),u.isNoDocument()&&u.version.isEqual(A.min())?(e.removeEntry(a,u.readTime),o=o.insert(a,u)):!c.isValidDocument()||u.version.compareTo(c.version)>0||u.version.compareTo(c.version)===0&&c.hasPendingWrites?(e.addEntry(u),o=o.insert(a,u)):g(Hn,"Ignoring outdated watch update for ",a,". Current version:",c.version," Watch version:",u.version)})),{ks:o,qs:s}}))}function cu(r,e){const t=R(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(n=>(e===void 0&&(e=On),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e))))}function lu(r,e){const t=R(r);return t.persistence.runTransaction("Allocate target","readwrite",(n=>{let s;return t.Pi.getTargetData(n,e).next((i=>i?(s=i,m.resolve(s)):t.Pi.allocateTargetId(n).next((o=>(s=new me(e,o,"TargetPurposeListen",n.currentSequenceNumber),t.Pi.addTargetData(n,s).next((()=>s)))))))})).then((n=>{const s=t.Ms.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.Ms=t.Ms.insert(n.targetId,n),t.xs.set(e,n.targetId)),n}))}async function Sn(r,e,t){const n=R(r),s=n.Ms.get(e),i=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",i,(o=>n.persistence.referenceDelegate.removeTarget(o,s)))}catch(o){if(!We(o))throw o;g(Hn,`Failed to update sequence numbers for target ${e}: ${o}`)}n.Ms=n.Ms.remove(e),n.xs.delete(s.target)}function rs(r,e,t){const n=R(r);let s=A.min(),i=V();return n.persistence.runTransaction("Execute query","readwrite",(o=>(function(u,c,l){const h=R(u),f=h.xs.get(l);return f!==void 0?m.resolve(h.Ms.get(f)):h.Pi.getTargetData(c,l)})(n,o,se(e)).next((a=>{if(a)return s=a.lastLimboFreeSnapshotVersion,n.Pi.getMatchingKeysForTargetId(o,a.targetId).next((u=>{i=u}))})).next((()=>n.Fs.getDocumentsMatchingQuery(o,e,t?s:A.min(),t?i:V()))).next((a=>(hu(n,Jo(e),a),{documents:a,Qs:i})))))}function hu(r,e,t){let n=r.Os.get(e)||A.min();t.forEach(((s,i)=>{i.readTime.compareTo(n)>0&&(n=i.readTime)})),r.Os.set(e,n)}class ss{constructor(){this.activeTargetIds=sa()}zs(e){this.activeTargetIds=this.activeTargetIds.add(e)}js(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Gs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class du{constructor(){this.Mo=new ss,this.xo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.Mo.zs(e),this.xo[e]||"not-current"}updateQueryState(e,t,n){this.xo[e]=t}removeLocalQueryTarget(e){this.Mo.js(e)}isLocalQueryTarget(e){return this.Mo.activeTargetIds.has(e)}clearQueryState(e){delete this.xo[e]}getAllActiveQueryTargets(){return this.Mo.activeTargetIds}isActiveQueryTarget(e){return this.Mo.activeTargetIds.has(e)}start(){return this.Mo=new ss,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
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
 */class fu{Oo(e){}shutdown(){}}/**
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
 */const is="ConnectivityMonitor";class os{constructor(){this.No=()=>this.Bo(),this.Lo=()=>this.ko(),this.qo=[],this.Qo()}Oo(e){this.qo.push(e)}shutdown(){window.removeEventListener("online",this.No),window.removeEventListener("offline",this.Lo)}Qo(){window.addEventListener("online",this.No),window.addEventListener("offline",this.Lo)}Bo(){g(is,"Network connectivity changed: AVAILABLE");for(const e of this.qo)e(0)}ko(){g(is,"Network connectivity changed: UNAVAILABLE");for(const e of this.qo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let St=null;function Cn(){return St===null?St=(function(){return 268435456+Math.round(2147483648*Math.random())})():St++,"0x"+St.toString(16)}/**
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
 */const _n="RestConnection",mu={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class _u{get $o(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Uo=t+"://"+e.host,this.Ko=`projects/${n}/databases/${s}`,this.Wo=this.databaseId.database===Mt?`project_id=${n}`:`project_id=${n}&database_id=${s}`}Go(e,t,n,s,i){const o=Cn(),a=this.zo(e,t.toUriEncodedString());g(_n,`Sending RPC '${e}' ${o}:`,a,n);const u={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Wo};this.jo(u,s,i);const{host:c}=new URL(a),l=Rs(c);return this.Jo(e,a,u,n,l).then((h=>(g(_n,`Received RPC '${e}' ${o}: `,h),h)),(h=>{throw st(_n,`RPC '${e}' ${o} failed with error: `,h,"url: ",a,"request:",n),h}))}Ho(e,t,n,s,i,o){return this.Go(e,t,n,s,i)}jo(e,t,n){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+je})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),n&&n.headers.forEach(((s,i)=>e[i]=s))}zo(e,t){const n=mu[e];return`${this.Uo}/v1/${t}:${n}`}terminate(){}}/**
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
 */class pu{constructor(e){this.Yo=e.Yo,this.Zo=e.Zo}Xo(e){this.e_=e}t_(e){this.n_=e}r_(e){this.i_=e}onMessage(e){this.s_=e}close(){this.Zo()}send(e){this.Yo(e)}o_(){this.e_()}__(){this.n_()}a_(e){this.i_(e)}u_(e){this.s_(e)}}/**
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
 */const G="WebChannelConnection";class gu extends _u{constructor(e){super(e),this.c_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Jo(e,t,n,s,i){const o=Cn();return new Promise(((a,u)=>{const c=new co;c.setWithCredentials(!0),c.listenOnce(lo.COMPLETE,(()=>{try{switch(c.getLastErrorCode()){case dn.NO_ERROR:const h=c.getResponseJson();g(G,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(h)),a(h);break;case dn.TIMEOUT:g(G,`RPC '${e}' ${o} timed out`),u(new p(d.DEADLINE_EXCEEDED,"Request time out"));break;case dn.HTTP_ERROR:const f=c.getStatus();if(g(G,`RPC '${e}' ${o} failed with status:`,f,"response text:",c.getResponseText()),f>0){let _=c.getResponseJson();Array.isArray(_)&&(_=_[0]);const T=_?.error;if(T&&T.status&&T.message){const w=(function(N){const F=N.toLowerCase().replace(/_/g,"-");return Object.values(d).indexOf(F)>=0?F:d.UNKNOWN})(T.status);u(new p(w,T.message))}else u(new p(d.UNKNOWN,"Server responded with status "+c.getStatus()))}else u(new p(d.UNAVAILABLE,"Connection failed."));break;default:I(9055,{l_:e,streamId:o,h_:c.getLastErrorCode(),P_:c.getLastError()})}}finally{g(G,`RPC '${e}' ${o} completed.`)}}));const l=JSON.stringify(s);g(G,`RPC '${e}' ${o} sending request:`,s),c.send(t,"POST",l,n,15)}))}T_(e,t,n){const s=Cn(),i=[this.Uo,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=ho(),a=fo(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;c!==void 0&&(u.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(u.useFetchStreams=!0),this.jo(u.initMessageHeaders,t,n),u.encodeInitMessageHeaders=!0;const l=i.join("");g(G,`Creating RPC '${e}' stream ${s}: ${l}`,u);const h=o.createWebChannel(l,u);this.I_(h);let f=!1,_=!1;const T=new pu({Yo:E=>{_?g(G,`Not sending because RPC '${e}' stream ${s} is closed:`,E):(f||(g(G,`Opening RPC '${e}' stream ${s} transport.`),h.open(),f=!0),g(G,`RPC '${e}' stream ${s} sending:`,E),h.send(E))},Zo:()=>h.close()}),w=(E,N,F)=>{E.listen(N,(B=>{try{F(B)}catch(ke){setTimeout((()=>{throw ke}),0)}}))};return w(h,Rt.EventType.OPEN,(()=>{_||(g(G,`RPC '${e}' stream ${s} transport opened.`),T.o_())})),w(h,Rt.EventType.CLOSE,(()=>{_||(_=!0,g(G,`RPC '${e}' stream ${s} transport closed`),T.a_(),this.E_(h))})),w(h,Rt.EventType.ERROR,(E=>{_||(_=!0,st(G,`RPC '${e}' stream ${s} transport errored. Name:`,E.name,"Message:",E.message),T.a_(new p(d.UNAVAILABLE,"The operation could not be completed")))})),w(h,Rt.EventType.MESSAGE,(E=>{if(!_){const N=E.data[0];S(!!N,16349);const F=N,B=F?.error||F[0]?.error;if(B){g(G,`RPC '${e}' stream ${s} received error:`,B);const ke=B.status;let Ye=(function(Yi){const wr=M[Yi];if(wr!==void 0)return ii(wr)})(ke),Xe=B.message;Ye===void 0&&(Ye=d.INTERNAL,Xe="Unknown error status: "+ke+" with message "+B.message),_=!0,T.a_(new p(Ye,Xe)),h.close()}else g(G,`RPC '${e}' stream ${s} received:`,N),T.u_(N)}})),w(a,mo.STAT_EVENT,(E=>{E.stat===vr.PROXY?g(G,`RPC '${e}' stream ${s} detected buffering proxy`):E.stat===vr.NOPROXY&&g(G,`RPC '${e}' stream ${s} detected no buffering proxy`)})),setTimeout((()=>{T.__()}),0),T}terminate(){this.c_.forEach((e=>e.close())),this.c_=[]}I_(e){this.c_.push(e)}E_(e){this.c_=this.c_.filter((t=>t===e))}}function pn(){return typeof document<"u"?document:null}/**
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
 */function nn(r){return new Aa(r,!0)}/**
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
 */class Ti{constructor(e,t,n=1e3,s=1.5,i=6e4){this.Mi=e,this.timerId=t,this.d_=n,this.A_=s,this.R_=i,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(e){this.cancel();const t=Math.floor(this.V_+this.y_()),n=Math.max(0,Date.now()-this.f_),s=Math.max(0,t-n);s>0&&g("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.V_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,s,(()=>(this.f_=Date.now(),e()))),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}/**
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
 */const as="PersistentStream";class Ii{constructor(e,t,n,s,i,o,a,u){this.Mi=e,this.S_=n,this.b_=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=u,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new Ti(e,t)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Mi.enqueueAfterDelay(this.S_,6e4,(()=>this.k_())))}q_(e){this.Q_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}Q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.Q_(),this.U_(),this.M_.cancel(),this.D_++,e!==4?this.M_.reset():t&&t.code===d.RESOURCE_EXHAUSTED?(he(t.toString()),he("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):t&&t.code===d.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.K_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.r_(t)}K_(){}auth(){this.state=1;const e=this.W_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([n,s])=>{this.D_===t&&this.G_(n,s)}),(n=>{e((()=>{const s=new p(d.UNKNOWN,"Fetching auth token failed: "+n.message);return this.z_(s)}))}))}G_(e,t){const n=this.W_(this.D_);this.stream=this.j_(e,t),this.stream.Xo((()=>{n((()=>this.listener.Xo()))})),this.stream.t_((()=>{n((()=>(this.state=2,this.v_=this.Mi.enqueueAfterDelay(this.b_,1e4,(()=>(this.O_()&&(this.state=3),Promise.resolve()))),this.listener.t_())))})),this.stream.r_((s=>{n((()=>this.z_(s)))})),this.stream.onMessage((s=>{n((()=>++this.F_==1?this.J_(s):this.onNext(s)))}))}N_(){this.state=5,this.M_.p_((async()=>{this.state=0,this.start()}))}z_(e){return g(as,`close with error: ${e}`),this.stream=null,this.close(4,e)}W_(e){return t=>{this.Mi.enqueueAndForget((()=>this.D_===e?t():(g(as,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class yu extends Ii{constructor(e,t,n,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}j_(e,t){return this.connection.T_("Listen",e,t)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();const t=va(this.serializer,e),n=(function(i){if(!("targetChange"in i))return A.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?A.min():o.readTime?ie(o.readTime):A.min()})(e);return this.listener.H_(t,n)}Y_(e){const t={};t.database=Pn(this.serializer),t.addTarget=(function(i,o){let a;const u=o.target;if(a=An(u)?{documents:Sa(i,u)}:{query:Ca(i,u).ft},a.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){a.resumeToken=ui(i,o.resumeToken);const c=Rn(i,o.expectedCount);c!==null&&(a.expectedCount=c)}else if(o.snapshotVersion.compareTo(A.min())>0){a.readTime=Ut(i,o.snapshotVersion.toTimestamp());const c=Rn(i,o.expectedCount);c!==null&&(a.expectedCount=c)}return a})(this.serializer,e);const n=Na(this.serializer,e);n&&(t.labels=n),this.q_(t)}Z_(e){const t={};t.database=Pn(this.serializer),t.removeTarget=e,this.q_(t)}}class Eu extends Ii{constructor(e,t,n,s,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,s,o),this.serializer=i}get X_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}K_(){this.X_&&this.ea([])}j_(e,t){return this.connection.T_("Write",e,t)}J_(e){return S(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,S(!e.writeResults||e.writeResults.length===0,55816),this.listener.ta()}onNext(e){S(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const t=Pa(e.writeResults,e.commitTime),n=ie(e.commitTime);return this.listener.na(n,t)}ra(){const e={};e.database=Pn(this.serializer),this.q_(e)}ea(e){const t={streamToken:this.lastStreamToken,writes:e.map((n=>Va(this.serializer,n)))};this.q_(t)}}/**
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
 */class Tu{}class Iu extends Tu{constructor(e,t,n,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=s,this.ia=!1}sa(){if(this.ia)throw new p(d.FAILED_PRECONDITION,"The client has already been terminated.")}Go(e,t,n,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.Go(e,vn(t,n),s,i,o))).catch((i=>{throw i.name==="FirebaseError"?(i.code===d.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new p(d.UNKNOWN,i.toString())}))}Ho(e,t,n,s,i){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,a])=>this.connection.Ho(e,vn(t,n),s,o,a,i))).catch((o=>{throw o.name==="FirebaseError"?(o.code===d.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new p(d.UNKNOWN,o.toString())}))}terminate(){this.ia=!0,this.connection.terminate()}}class Au{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve()))))}ha(e){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,e==="Online"&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(he(t),this.aa=!1):g("OnlineStateTracker",t)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
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
 */const be="RemoteStore";class wu{constructor(e,t,n,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.da=[],this.Aa=i,this.Aa.Oo((o=>{n.enqueueAndForget((async()=>{De(this)&&(g(be,"Restarting streams for network reachability change."),await(async function(u){const c=R(u);c.Ea.add(4),await gt(c),c.Ra.set("Unknown"),c.Ea.delete(4),await rn(c)})(this))}))})),this.Ra=new Au(n,s)}}async function rn(r){if(De(r))for(const e of r.da)await e(!0)}async function gt(r){for(const e of r.da)await e(!1)}function Ai(r,e){const t=R(r);t.Ia.has(e.targetId)||(t.Ia.set(e.targetId,e),Zn(t)?Jn(t):He(t).O_()&&Xn(t,e))}function Yn(r,e){const t=R(r),n=He(t);t.Ia.delete(e),n.O_()&&wi(t,e),t.Ia.size===0&&(n.O_()?n.L_():De(t)&&t.Ra.set("Unknown"))}function Xn(r,e){if(r.Va.Ue(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(A.min())>0){const t=r.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}He(r).Y_(e)}function wi(r,e){r.Va.Ue(e),He(r).Z_(e)}function Jn(r){r.Va=new ya({getRemoteKeysForTarget:e=>r.remoteSyncer.getRemoteKeysForTarget(e),At:e=>r.Ia.get(e)||null,ht:()=>r.datastore.serializer.databaseId}),He(r).start(),r.Ra.ua()}function Zn(r){return De(r)&&!He(r).x_()&&r.Ia.size>0}function De(r){return R(r).Ea.size===0}function Ri(r){r.Va=void 0}async function Ru(r){r.Ra.set("Online")}async function vu(r){r.Ia.forEach(((e,t)=>{Xn(r,e)}))}async function Vu(r,e){Ri(r),Zn(r)?(r.Ra.ha(e),Jn(r)):r.Ra.set("Unknown")}async function Pu(r,e,t){if(r.Ra.set("Online"),e instanceof ai&&e.state===2&&e.cause)try{await(async function(s,i){const o=i.cause;for(const a of i.targetIds)s.Ia.has(a)&&(await s.remoteSyncer.rejectListen(a,o),s.Ia.delete(a),s.Va.removeTarget(a))})(r,e)}catch(n){g(be,"Failed to remove targets %s: %s ",e.targetIds.join(","),n),await Bt(r,n)}else if(e instanceof Dt?r.Va.Ze(e):e instanceof oi?r.Va.st(e):r.Va.tt(e),!t.isEqual(A.min()))try{const n=await Ei(r.localStore);t.compareTo(n)>=0&&await(function(i,o){const a=i.Va.Tt(o);return a.targetChanges.forEach(((u,c)=>{if(u.resumeToken.approximateByteSize()>0){const l=i.Ia.get(c);l&&i.Ia.set(c,l.withResumeToken(u.resumeToken,o))}})),a.targetMismatches.forEach(((u,c)=>{const l=i.Ia.get(u);if(!l)return;i.Ia.set(u,l.withResumeToken(Q.EMPTY_BYTE_STRING,l.snapshotVersion)),wi(i,u);const h=new me(l.target,u,c,l.sequenceNumber);Xn(i,h)})),i.remoteSyncer.applyRemoteEvent(a)})(r,t)}catch(n){g(be,"Failed to raise snapshot:",n),await Bt(r,n)}}async function Bt(r,e,t){if(!We(e))throw e;r.Ea.add(1),await gt(r),r.Ra.set("Offline"),t||(t=()=>Ei(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{g(be,"Retrying IndexedDB access"),await t(),r.Ea.delete(1),await rn(r)}))}function vi(r,e){return e().catch((t=>Bt(r,t,e)))}async function sn(r){const e=R(r),t=Te(e);let n=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:On;for(;Su(e);)try{const s=await cu(e.localStore,n);if(s===null){e.Ta.length===0&&t.L_();break}n=s.batchId,Cu(e,s)}catch(s){await Bt(e,s)}Vi(e)&&Pi(e)}function Su(r){return De(r)&&r.Ta.length<10}function Cu(r,e){r.Ta.push(e);const t=Te(r);t.O_()&&t.X_&&t.ea(e.mutations)}function Vi(r){return De(r)&&!Te(r).x_()&&r.Ta.length>0}function Pi(r){Te(r).start()}async function bu(r){Te(r).ra()}async function Nu(r){const e=Te(r);for(const t of r.Ta)e.ea(t.mutations)}async function Du(r,e,t){const n=r.Ta.shift(),s=$n.from(n,e,t);await vi(r,(()=>r.remoteSyncer.applySuccessfulWrite(s))),await sn(r)}async function ku(r,e){e&&Te(r).X_&&await(async function(n,s){if((function(o){return _a(o)&&o!==d.ABORTED})(s.code)){const i=n.Ta.shift();Te(n).B_(),await vi(n,(()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s))),await sn(n)}})(r,e),Vi(r)&&Pi(r)}async function us(r,e){const t=R(r);t.asyncQueue.verifyOperationInProgress(),g(be,"RemoteStore received new credentials");const n=De(t);t.Ea.add(3),await gt(t),n&&t.Ra.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ea.delete(3),await rn(t)}async function xu(r,e){const t=R(r);e?(t.Ea.delete(2),await rn(t)):e||(t.Ea.add(2),await gt(t),t.Ra.set("Unknown"))}function He(r){return r.ma||(r.ma=(function(t,n,s){const i=R(t);return i.sa(),new yu(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Xo:Ru.bind(null,r),t_:vu.bind(null,r),r_:Vu.bind(null,r),H_:Pu.bind(null,r)}),r.da.push((async e=>{e?(r.ma.B_(),Zn(r)?Jn(r):r.Ra.set("Unknown")):(await r.ma.stop(),Ri(r))}))),r.ma}function Te(r){return r.fa||(r.fa=(function(t,n,s){const i=R(t);return i.sa(),new Eu(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Xo:()=>Promise.resolve(),t_:bu.bind(null,r),r_:ku.bind(null,r),ta:Nu.bind(null,r),na:Du.bind(null,r)}),r.da.push((async e=>{e?(r.fa.B_(),await sn(r)):(await r.fa.stop(),r.Ta.length>0&&(g(be,`Stopping write stream with ${r.Ta.length} pending writes`),r.Ta=[]))}))),r.fa}/**
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
 */class er{constructor(e,t,n,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=s,this.removalCallback=i,this.deferred=new le,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,s,i){const o=Date.now()+n,a=new er(e,t,o,s,i);return a.start(n),a}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new p(d.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function tr(r,e){if(he("AsyncQueue",`${e}: ${r}`),We(r))return new p(d.UNAVAILABLE,`${e}: ${r}`);throw r}/**
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
 */class Ue{static emptySet(e){return new Ue(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||y.comparator(t.key,n.key):(t,n)=>y.comparator(t.key,n.key),this.keyedMap=Je(),this.sortedSet=new D(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,n)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Ue)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=n.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new Ue;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
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
 */class cs{constructor(){this.ga=new D(y.comparator)}track(e){const t=e.doc.key,n=this.ga.get(t);n?e.type!==0&&n.type===3?this.ga=this.ga.insert(t,e):e.type===3&&n.type!==1?this.ga=this.ga.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.ga=this.ga.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.ga=this.ga.remove(t):e.type===1&&n.type===2?this.ga=this.ga.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):I(63341,{Rt:e,pa:n}):this.ga=this.ga.insert(t,e)}ya(){const e=[];return this.ga.inorderTraversal(((t,n)=>{e.push(n)})),e}}class Ge{constructor(e,t,n,s,i,o,a,u,c){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=u,this.hasCachedResults=c}static fromInitialDocuments(e,t,n,s,i){const o=[];return t.forEach((a=>{o.push({type:0,doc:a})})),new Ge(e,t,Ue.emptySet(t),o,n,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&Xt(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==n[s].type||!t[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
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
 */class Mu{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some((e=>e.Da()))}}class Ou{constructor(){this.queries=ls(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(t,n){const s=R(t),i=s.queries;s.queries=ls(),i.forEach(((o,a)=>{for(const u of a.Sa)u.onError(n)}))})(this,new p(d.ABORTED,"Firestore shutting down"))}}function ls(){return new Ne((r=>Gs(r)),Xt)}async function nr(r,e){const t=R(r);let n=3;const s=e.query;let i=t.queries.get(s);i?!i.ba()&&e.Da()&&(n=2):(i=new Mu,n=e.Da()?0:1);try{switch(n){case 0:i.wa=await t.onListen(s,!0);break;case 1:i.wa=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(o){const a=tr(o,`Initialization of query '${Me(e.query)}' failed`);return void e.onError(a)}t.queries.set(s,i),i.Sa.push(e),e.va(t.onlineState),i.wa&&e.Fa(i.wa)&&sr(t)}async function rr(r,e){const t=R(r),n=e.query;let s=3;const i=t.queries.get(n);if(i){const o=i.Sa.indexOf(e);o>=0&&(i.Sa.splice(o,1),i.Sa.length===0?s=e.Da()?0:1:!i.ba()&&e.Da()&&(s=2))}switch(s){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function Lu(r,e){const t=R(r);let n=!1;for(const s of e){const i=s.query,o=t.queries.get(i);if(o){for(const a of o.Sa)a.Fa(s)&&(n=!0);o.wa=s}}n&&sr(t)}function Fu(r,e,t){const n=R(r),s=n.queries.get(e);if(s)for(const i of s.Sa)i.onError(t);n.queries.delete(e)}function sr(r){r.Ca.forEach((e=>{e.next()}))}var bn,hs;(hs=bn||(bn={})).Ma="default",hs.Cache="cache";class ir{constructor(e,t,n){this.query=e,this.xa=t,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=n||{}}Fa(e){if(!this.options.includeMetadataChanges){const n=[];for(const s of e.docChanges)s.type!==3&&n.push(s);e=new Ge(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),t=!0):this.La(e,this.onlineState)&&(this.ka(e),t=!0),this.Na=e,t}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let t=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),t=!0),t}La(e,t){if(!e.fromCache||!this.Da())return!0;const n=t!=="Offline";return(!this.options.qa||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Ba(e){if(e.docChanges.length>0)return!0;const t=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}ka(e){e=Ge.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==bn.Cache}}/**
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
 */class Si{constructor(e){this.key=e}}class Ci{constructor(e){this.key=e}}class Uu{constructor(e,t){this.query=e,this.Ya=t,this.Za=null,this.hasCachedResults=!1,this.current=!1,this.Xa=V(),this.mutatedKeys=V(),this.eu=js(e),this.tu=new Ue(this.eu)}get nu(){return this.Ya}ru(e,t){const n=t?t.iu:new cs,s=t?t.tu:this.tu;let i=t?t.mutatedKeys:this.mutatedKeys,o=s,a=!1;const u=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,c=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal(((l,h)=>{const f=s.get(l),_=Jt(this.query,h)?h:null,T=!!f&&this.mutatedKeys.has(f.key),w=!!_&&(_.hasLocalMutations||this.mutatedKeys.has(_.key)&&_.hasCommittedMutations);let E=!1;f&&_?f.data.isEqual(_.data)?T!==w&&(n.track({type:3,doc:_}),E=!0):this.su(f,_)||(n.track({type:2,doc:_}),E=!0,(u&&this.eu(_,u)>0||c&&this.eu(_,c)<0)&&(a=!0)):!f&&_?(n.track({type:0,doc:_}),E=!0):f&&!_&&(n.track({type:1,doc:f}),E=!0,(u||c)&&(a=!0)),E&&(_?(o=o.add(_),i=w?i.add(l):i.delete(l)):(o=o.delete(l),i=i.delete(l)))})),this.query.limit!==null)for(;o.size>this.query.limit;){const l=this.query.limitType==="F"?o.last():o.first();o=o.delete(l.key),i=i.delete(l.key),n.track({type:1,doc:l})}return{tu:o,iu:n,Cs:a,mutatedKeys:i}}su(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,s){const i=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;const o=e.iu.ya();o.sort(((l,h)=>(function(_,T){const w=E=>{switch(E){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return I(20277,{Rt:E})}};return w(_)-w(T)})(l.type,h.type)||this.eu(l.doc,h.doc))),this.ou(n),s=s??!1;const a=t&&!s?this._u():[],u=this.Xa.size===0&&this.current&&!s?1:0,c=u!==this.Za;return this.Za=u,o.length!==0||c?{snapshot:new Ge(this.query,e.tu,i,o,e.mutatedKeys,u===0,c,!1,!!n&&n.resumeToken.approximateByteSize()>0),au:a}:{au:a}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new cs,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{au:[]}}uu(e){return!this.Ya.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach((t=>this.Ya=this.Ya.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ya=this.Ya.delete(t))),this.current=e.current)}_u(){if(!this.current)return[];const e=this.Xa;this.Xa=V(),this.tu.forEach((n=>{this.uu(n.key)&&(this.Xa=this.Xa.add(n.key))}));const t=[];return e.forEach((n=>{this.Xa.has(n)||t.push(new Ci(n))})),this.Xa.forEach((n=>{e.has(n)||t.push(new Si(n))})),t}cu(e){this.Ya=e.Qs,this.Xa=V();const t=this.ru(e.documents);return this.applyChanges(t,!0)}lu(){return Ge.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Za===0,this.hasCachedResults)}}const or="SyncEngine";class qu{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class Bu{constructor(e){this.key=e,this.hu=!1}}class zu{constructor(e,t,n,s,i,o){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Pu={},this.Tu=new Ne((a=>Gs(a)),Xt),this.Iu=new Map,this.Eu=new Set,this.du=new D(y.comparator),this.Au=new Map,this.Ru=new jn,this.Vu={},this.mu=new Map,this.fu=Qe.cr(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function $u(r,e,t=!0){const n=Mi(r);let s;const i=n.Tu.get(e);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.lu()):s=await bi(n,e,t,!0),s}async function Qu(r,e){const t=Mi(r);await bi(t,e,!0,!1)}async function bi(r,e,t,n){const s=await lu(r.localStore,se(e)),i=s.targetId,o=r.sharedClientState.addLocalQueryTarget(i,t);let a;return n&&(a=await Gu(r,e,i,o==="current",s.resumeToken)),r.isPrimaryClient&&t&&Ai(r.remoteStore,s),a}async function Gu(r,e,t,n,s){r.pu=(h,f,_)=>(async function(w,E,N,F){let B=E.view.ru(N);B.Cs&&(B=await rs(w.localStore,E.query,!1).then((({documents:Ar})=>E.view.ru(Ar,B))));const ke=F&&F.targetChanges.get(E.targetId),Ye=F&&F.targetMismatches.get(E.targetId)!=null,Xe=E.view.applyChanges(B,w.isPrimaryClient,ke,Ye);return fs(w,E.targetId,Xe.au),Xe.snapshot})(r,h,f,_);const i=await rs(r.localStore,e,!0),o=new Uu(e,i.Qs),a=o.ru(i.documents),u=pt.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",s),c=o.applyChanges(a,r.isPrimaryClient,u);fs(r,t,c.au);const l=new qu(e,t,o);return r.Tu.set(e,l),r.Iu.has(t)?r.Iu.get(t).push(e):r.Iu.set(t,[e]),c.snapshot}async function ju(r,e,t){const n=R(r),s=n.Tu.get(e),i=n.Iu.get(s.targetId);if(i.length>1)return n.Iu.set(s.targetId,i.filter((o=>!Xt(o,e)))),void n.Tu.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await Sn(n.localStore,s.targetId,!1).then((()=>{n.sharedClientState.clearQueryState(s.targetId),t&&Yn(n.remoteStore,s.targetId),Nn(n,s.targetId)})).catch(Ke)):(Nn(n,s.targetId),await Sn(n.localStore,s.targetId,!0))}async function Ku(r,e){const t=R(r),n=t.Tu.get(e),s=t.Iu.get(n.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),Yn(t.remoteStore,n.targetId))}async function Wu(r,e,t){const n=tc(r);try{const s=await(function(o,a){const u=R(o),c=b.now(),l=a.reduce(((_,T)=>_.add(T.key)),V());let h,f;return u.persistence.runTransaction("Locally write mutations","readwrite",(_=>{let T=de(),w=V();return u.Ns.getEntries(_,l).next((E=>{T=E,T.forEach(((N,F)=>{F.isValidDocument()||(w=w.add(N))}))})).next((()=>u.localDocuments.getOverlayedDocuments(_,T))).next((E=>{h=E;const N=[];for(const F of a){const B=la(F,h.get(F.key).overlayedDocument);B!=null&&N.push(new Re(F.key,B,Fs(B.value.mapValue),Z.exists(!0)))}return u.mutationQueue.addMutationBatch(_,c,N,a)})).next((E=>{f=E;const N=E.applyToLocalDocumentSet(h,w);return u.documentOverlayCache.saveOverlays(_,E.batchId,N)}))})).then((()=>({batchId:f.batchId,changes:Ws(h)})))})(n.localStore,e);n.sharedClientState.addPendingMutation(s.batchId),(function(o,a,u){let c=o.Vu[o.currentUser.toKey()];c||(c=new D(v)),c=c.insert(a,u),o.Vu[o.currentUser.toKey()]=c})(n,s.batchId,t),await yt(n,s.changes),await sn(n.remoteStore)}catch(s){const i=tr(s,"Failed to persist write");t.reject(i)}}async function Ni(r,e){const t=R(r);try{const n=await au(t.localStore,e);e.targetChanges.forEach(((s,i)=>{const o=t.Au.get(i);o&&(S(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.hu=!0:s.modifiedDocuments.size>0?S(o.hu,14607):s.removedDocuments.size>0&&(S(o.hu,42227),o.hu=!1))})),await yt(t,n,e)}catch(n){await Ke(n)}}function ds(r,e,t){const n=R(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const s=[];n.Tu.forEach(((i,o)=>{const a=o.view.va(e);a.snapshot&&s.push(a.snapshot)})),(function(o,a){const u=R(o);u.onlineState=a;let c=!1;u.queries.forEach(((l,h)=>{for(const f of h.Sa)f.va(a)&&(c=!0)})),c&&sr(u)})(n.eventManager,e),s.length&&n.Pu.H_(s),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function Hu(r,e,t){const n=R(r);n.sharedClientState.updateQueryState(e,"rejected",t);const s=n.Au.get(e),i=s&&s.key;if(i){let o=new D(y.comparator);o=o.insert(i,j.newNoDocument(i,A.min()));const a=V().add(i),u=new tn(A.min(),new Map,new D(v),o,a);await Ni(n,u),n.du=n.du.remove(i),n.Au.delete(e),ar(n)}else await Sn(n.localStore,e,!1).then((()=>Nn(n,e,t))).catch(Ke)}async function Yu(r,e){const t=R(r),n=e.batch.batchId;try{const s=await ou(t.localStore,e);ki(t,n,null),Di(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await yt(t,s)}catch(s){await Ke(s)}}async function Xu(r,e,t){const n=R(r);try{const s=await(function(o,a){const u=R(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",(c=>{let l;return u.mutationQueue.lookupMutationBatch(c,a).next((h=>(S(h!==null,37113),l=h.keys(),u.mutationQueue.removeMutationBatch(c,h)))).next((()=>u.mutationQueue.performConsistencyCheck(c))).next((()=>u.documentOverlayCache.removeOverlaysForBatchId(c,l,a))).next((()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(c,l))).next((()=>u.localDocuments.getDocuments(c,l)))}))})(n.localStore,e);ki(n,e,t),Di(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await yt(n,s)}catch(s){await Ke(s)}}function Di(r,e){(r.mu.get(e)||[]).forEach((t=>{t.resolve()})),r.mu.delete(e)}function ki(r,e,t){const n=R(r);let s=n.Vu[n.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),n.Vu[n.currentUser.toKey()]=s}}function Nn(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.Iu.get(e))r.Tu.delete(n),t&&r.Pu.yu(n,t);r.Iu.delete(e),r.isPrimaryClient&&r.Ru.jr(e).forEach((n=>{r.Ru.containsKey(n)||xi(r,n)}))}function xi(r,e){r.Eu.delete(e.path.canonicalString());const t=r.du.get(e);t!==null&&(Yn(r.remoteStore,t),r.du=r.du.remove(e),r.Au.delete(t),ar(r))}function fs(r,e,t){for(const n of t)n instanceof Si?(r.Ru.addReference(n.key,e),Ju(r,n)):n instanceof Ci?(g(or,"Document no longer in limbo: "+n.key),r.Ru.removeReference(n.key,e),r.Ru.containsKey(n.key)||xi(r,n.key)):I(19791,{wu:n})}function Ju(r,e){const t=e.key,n=t.path.canonicalString();r.du.get(t)||r.Eu.has(n)||(g(or,"New document in limbo: "+t),r.Eu.add(n),ar(r))}function ar(r){for(;r.Eu.size>0&&r.du.size<r.maxConcurrentLimboResolutions;){const e=r.Eu.values().next().value;r.Eu.delete(e);const t=new y(C.fromString(e)),n=r.fu.next();r.Au.set(n,new Bu(t)),r.du=r.du.insert(t,n),Ai(r.remoteStore,new me(se(Yt(t.path)),n,"TargetPurposeLimboResolution",jt.ce))}}async function yt(r,e,t){const n=R(r),s=[],i=[],o=[];n.Tu.isEmpty()||(n.Tu.forEach(((a,u)=>{o.push(n.pu(u,e,t).then((c=>{if((c||t)&&n.isPrimaryClient){const l=c?!c.fromCache:t?.targetChanges.get(u.targetId)?.current;n.sharedClientState.updateQueryState(u.targetId,l?"current":"not-current")}if(c){s.push(c);const l=Wn.As(u.targetId,c);i.push(l)}})))})),await Promise.all(o),n.Pu.H_(s),await(async function(u,c){const l=R(u);try{await l.persistence.runTransaction("notifyLocalViewChanges","readwrite",(h=>m.forEach(c,(f=>m.forEach(f.Es,(_=>l.persistence.referenceDelegate.addReference(h,f.targetId,_))).next((()=>m.forEach(f.ds,(_=>l.persistence.referenceDelegate.removeReference(h,f.targetId,_)))))))))}catch(h){if(!We(h))throw h;g(Hn,"Failed to update sequence numbers: "+h)}for(const h of c){const f=h.targetId;if(!h.fromCache){const _=l.Ms.get(f),T=_.snapshotVersion,w=_.withLastLimboFreeSnapshotVersion(T);l.Ms=l.Ms.insert(f,w)}}})(n.localStore,i))}async function Zu(r,e){const t=R(r);if(!t.currentUser.isEqual(e)){g(or,"User change. New user:",e.toKey());const n=await yi(t.localStore,e);t.currentUser=e,(function(i,o){i.mu.forEach((a=>{a.forEach((u=>{u.reject(new p(d.CANCELLED,o))}))})),i.mu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await yt(t,n.Ls)}}function ec(r,e){const t=R(r),n=t.Au.get(e);if(n&&n.hu)return V().add(n.key);{let s=V();const i=t.Iu.get(e);if(!i)return s;for(const o of i){const a=t.Tu.get(o);s=s.unionWith(a.view.nu)}return s}}function Mi(r){const e=R(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=Ni.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=ec.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=Hu.bind(null,e),e.Pu.H_=Lu.bind(null,e.eventManager),e.Pu.yu=Fu.bind(null,e.eventManager),e}function tc(r){const e=R(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Yu.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Xu.bind(null,e),e}class zt{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=nn(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,t){return null}Mu(e,t){return null}vu(e){return iu(this.persistence,new nu,e.initialUser,this.serializer)}Cu(e){return new gi(Kn.mi,this.serializer)}Du(e){return new du}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}zt.provider={build:()=>new zt};class nc extends zt{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,t){S(this.persistence.referenceDelegate instanceof qt,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new Ba(n,e.asyncQueue,t)}Cu(e){const t=this.cacheSizeBytes!==void 0?W.withCacheSize(this.cacheSizeBytes):W.DEFAULT;return new gi((n=>qt.mi(n,t)),this.serializer)}}class Dn{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>ds(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=Zu.bind(null,this.syncEngine),await xu(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new Ou})()}createDatastore(e){const t=nn(e.databaseInfo.databaseId),n=(function(i){return new gu(i)})(e.databaseInfo);return(function(i,o,a,u){return new Iu(i,o,a,u)})(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return(function(n,s,i,o,a){return new wu(n,s,i,o,a)})(this.localStore,this.datastore,e.asyncQueue,(t=>ds(this.syncEngine,t,0)),(function(){return os.v()?new os:new fu})())}createSyncEngine(e,t){return(function(s,i,o,a,u,c,l){const h=new zu(s,i,o,a,u,c);return l&&(h.gu=!0),h})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){await(async function(t){const n=R(t);g(be,"RemoteStore shutting down."),n.Ea.add(5),await gt(n),n.Aa.shutdown(),n.Ra.set("Unknown")})(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}}Dn.provider={build:()=>new Dn};/**
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
 */class ur{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):he("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
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
 */const Ie="FirestoreClient";class rc{constructor(e,t,n,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=s,this.user=K.UNAUTHENTICATED,this.clientId=Mn.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,(async o=>{g(Ie,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(n,(o=>(g(Ie,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new le;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=tr(t,"Failed to shutdown persistence");e.reject(n)}})),e.promise}}async function gn(r,e){r.asyncQueue.verifyOperationInProgress(),g(Ie,"Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener((async s=>{n.isEqual(s)||(await yi(e.localStore,s),n=s)})),e.persistence.setDatabaseDeletedListener((()=>r.terminate())),r._offlineComponents=e}async function ms(r,e){r.asyncQueue.verifyOperationInProgress();const t=await sc(r);g(Ie,"Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((n=>us(e.remoteStore,n))),r.setAppCheckTokenChangeListener(((n,s)=>us(e.remoteStore,s))),r._onlineComponents=e}async function sc(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){g(Ie,"Using user provided OfflineComponentProvider");try{await gn(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===d.FAILED_PRECONDITION||s.code===d.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;st("Error using user provided cache. Falling back to memory cache: "+t),await gn(r,new zt)}}else g(Ie,"Using default OfflineComponentProvider"),await gn(r,new nc(void 0));return r._offlineComponents}async function Oi(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(g(Ie,"Using user provided OnlineComponentProvider"),await ms(r,r._uninitializedComponentsProvider._online)):(g(Ie,"Using default OnlineComponentProvider"),await ms(r,new Dn))),r._onlineComponents}function ic(r){return Oi(r).then((e=>e.syncEngine))}async function $t(r){const e=await Oi(r),t=e.eventManager;return t.onListen=$u.bind(null,e.syncEngine),t.onUnlisten=ju.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=Qu.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Ku.bind(null,e.syncEngine),t}function oc(r,e,t={}){const n=new le;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,a,u,c){const l=new ur({next:f=>{l.Nu(),o.enqueueAndForget((()=>rr(i,h)));const _=f.docs.has(a);!_&&f.fromCache?c.reject(new p(d.UNAVAILABLE,"Failed to get document because the client is offline.")):_&&f.fromCache&&u&&u.source==="server"?c.reject(new p(d.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):c.resolve(f)},error:f=>c.reject(f)}),h=new ir(Yt(a.path),l,{includeMetadataChanges:!0,qa:!0});return nr(i,h)})(await $t(r),r.asyncQueue,e,t,n))),n.promise}function ac(r,e,t={}){const n=new le;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,a,u,c){const l=new ur({next:f=>{l.Nu(),o.enqueueAndForget((()=>rr(i,h))),f.fromCache&&u.source==="server"?c.reject(new p(d.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):c.resolve(f)},error:f=>c.reject(f)}),h=new ir(a,l,{includeMetadataChanges:!0,qa:!0});return nr(i,h)})(await $t(r),r.asyncQueue,e,t,n))),n.promise}/**
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
 */function Li(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
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
 */const _s=new Map;/**
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
 */const uc="firestore.googleapis.com",ps=!0;class gs{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new p(d.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=uc,this.ssl=ps}else this.host=e.host,this.ssl=e.ssl??ps;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=_i;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<pi)throw new p(d.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}vo("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Li(e.experimentalLongPollingOptions??{}),(function(n){if(n.timeoutSeconds!==void 0){if(isNaN(n.timeoutSeconds))throw new p(d.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (must not be NaN)`);if(n.timeoutSeconds<5)throw new p(d.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (minimum allowed value is 5)`);if(n.timeoutSeconds>30)throw new p(d.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(n,s){return n.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class cr{constructor(e,t,n,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new gs({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new p(d.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new p(d.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new gs(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(n){if(!n)return new po;switch(n.type){case"firstParty":return new Eo(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new p(d.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const n=_s.get(t);n&&(g("ComponentProvider","Removing Datastore"),_s.delete(t),n.terminate())})(this),Promise.resolve()}}/**
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
 */class ne{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new ne(this.firestore,e,this._query)}}class k{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new _e(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new k(this.firestore,e,this._key)}toJSON(){return{type:k._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(mt(t,k._jsonSchema))return new k(e,n||null,new y(C.fromString(t.referencePath)))}}k._jsonSchemaVersion="firestore/documentReference/1.0",k._jsonSchema={type:L("string",k._jsonSchemaVersion),referencePath:L("string")};class _e extends ne{constructor(e,t,n){super(e,t,Yt(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new k(this.firestore,null,new y(e))}withConverter(e){return new _e(this.firestore,e,this._path)}}function Vc(r,e,...t){if(r=ee(r),Vs("collection","path",e),r instanceof cr){const n=C.fromString(e,...t);return Nr(n),new _e(r,null,n)}{if(!(r instanceof k||r instanceof _e))throw new p(d.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(C.fromString(e,...t));return Nr(n),new _e(r.firestore,null,n)}}function cc(r,e,...t){if(r=ee(r),arguments.length===1&&(e=Mn.newId()),Vs("doc","path",e),r instanceof cr){const n=C.fromString(e,...t);return br(n),new k(r,null,new y(n))}{if(!(r instanceof k||r instanceof _e))throw new p(d.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(C.fromString(e,...t));return br(n),new k(r.firestore,r instanceof _e?r.converter:null,new y(n))}}/**
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
 */const ys="AsyncQueue";class Es{constructor(e=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new Ti(this,"async_queue_retry"),this._c=()=>{const n=pn();n&&g(ys,"Visibility state changed to "+n.visibilityState),this.M_.w_()},this.ac=e;const t=pn();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=pn();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise((()=>{}));const t=new le;return this.cc((()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Xu.push(e),this.lc())))}async lc(){if(this.Xu.length!==0){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(e){if(!We(e))throw e;g(ys,"Operation failed with retryable error: "+e)}this.Xu.length>0&&this.M_.p_((()=>this.lc()))}}cc(e){const t=this.ac.then((()=>(this.rc=!0,e().catch((n=>{throw this.nc=n,this.rc=!1,he("INTERNAL UNHANDLED ERROR: ",Ts(n)),n})).then((n=>(this.rc=!1,n))))));return this.ac=t,t}enqueueAfterDelay(e,t,n){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const s=er.createAndSchedule(this,e,t,n,(i=>this.hc(i)));return this.tc.push(s),s}uc(){this.nc&&I(47125,{Pc:Ts(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ic(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ec(e){return this.Tc().then((()=>{this.tc.sort(((t,n)=>t.targetTimeMs-n.targetTimeMs));for(const t of this.tc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Tc()}))}dc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function Ts(r){let e=r.message||"";return r.stack&&(e=r.stack.includes(r.message)?r.stack:r.message+`
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
 */function Is(r){return(function(t,n){if(typeof t!="object"||t===null)return!1;const s=t;for(const i of n)if(i in s&&typeof s[i]=="function")return!0;return!1})(r,["next","error","complete"])}class fe extends cr{constructor(e,t,n,s){super(e,t,n,s),this.type="firestore",this._queue=new Es,this._persistenceKey=s?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Es(e),this._firestoreClient=void 0,await e}}}function Pc(r,e,t){t||(t=Mt);const n=Zi(r,"firestore");if(n.isInitialized(t)){const s=n.getImmediate({identifier:t}),i=n.getOptions(t);if(so(i,e))return s;throw new p(d.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new p(d.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<pi)throw new p(d.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&Rs(e.host)&&io(e.host),n.initialize({options:e,instanceIdentifier:t})}function on(r){if(r._terminated)throw new p(d.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||lc(r),r._firestoreClient}function lc(r){const e=r._freezeSettings(),t=(function(s,i,o,a){return new Oo(s,i,o,a.host,a.ssl,a.experimentalForceLongPolling,a.experimentalAutoDetectLongPolling,Li(a.experimentalLongPollingOptions),a.useFetchStreams,a.isUsingEmulator)})(r._databaseId,r._app?.options.appId||"",r._persistenceKey,e);r._componentsProvider||e.localCache?._offlineComponentProvider&&e.localCache?._onlineComponentProvider&&(r._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),r._firestoreClient=new rc(r._authCredentials,r._appCheckCredentials,r._queue,t,r._componentsProvider&&(function(s){const i=s?._online.build();return{_offline:s?._offline.build(i),_online:i}})(r._componentsProvider))}/**
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
 */class J{constructor(e){this._byteString=e}static fromBase64String(e){try{return new J(Q.fromBase64String(e))}catch(t){throw new p(d.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new J(Q.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:J._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(mt(e,J._jsonSchema))return J.fromBase64String(e.bytes)}}J._jsonSchemaVersion="firestore/bytes/1.0",J._jsonSchema={type:L("string",J._jsonSchemaVersion),bytes:L("string")};/**
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
 */class an{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new p(d.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new $(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
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
 */class Et{constructor(e){this._methodName=e}}/**
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
 */class oe{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new p(d.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new p(d.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return v(this._lat,e._lat)||v(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:oe._jsonSchemaVersion}}static fromJSON(e){if(mt(e,oe._jsonSchema))return new oe(e.latitude,e.longitude)}}oe._jsonSchemaVersion="firestore/geoPoint/1.0",oe._jsonSchema={type:L("string",oe._jsonSchemaVersion),latitude:L("number"),longitude:L("number")};/**
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
 */class ae{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(n,s){if(n.length!==s.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:ae._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(mt(e,ae._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new ae(e.vectorValues);throw new p(d.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}ae._jsonSchemaVersion="firestore/vectorValue/1.0",ae._jsonSchema={type:L("string",ae._jsonSchemaVersion),vectorValues:L("object")};/**
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
 */const hc=/^__.*__$/;class dc{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new Re(e,this.data,this.fieldMask,t,this.fieldTransforms):new _t(e,this.data,t,this.fieldTransforms)}}class Fi{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new Re(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Ui(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw I(40011,{Ac:r})}}class lr{constructor(e,t,n,s,i,o){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=s,i===void 0&&this.Rc(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Ac(){return this.settings.Ac}Vc(e){return new lr({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}mc(e){const t=this.path?.child(e),n=this.Vc({path:t,fc:!1});return n.gc(e),n}yc(e){const t=this.path?.child(e),n=this.Vc({path:t,fc:!1});return n.Rc(),n}wc(e){return this.Vc({path:void 0,fc:!0})}Sc(e){return Qt(e,this.settings.methodName,this.settings.bc||!1,this.path,this.settings.Dc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Rc(){if(this.path)for(let e=0;e<this.path.length;e++)this.gc(this.path.get(e))}gc(e){if(e.length===0)throw this.Sc("Document fields must not be empty");if(Ui(this.Ac)&&hc.test(e))throw this.Sc('Document fields cannot begin and end with "__"')}}class fc{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||nn(e)}Cc(e,t,n,s=!1){return new lr({Ac:e,methodName:t,Dc:n,path:$.emptyPath(),fc:!1,bc:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Tt(r){const e=r._freezeSettings(),t=nn(r._databaseId);return new fc(r._databaseId,!!e.ignoreUndefinedProperties,t)}function qi(r,e,t,n,s,i={}){const o=r.Cc(i.merge||i.mergeFields?2:0,e,t,s);fr("Data must be an object, but it was:",o,n);const a=zi(n,o);let u,c;if(i.merge)u=new Y(o.fieldMask),c=o.fieldTransforms;else if(i.mergeFields){const l=[];for(const h of i.mergeFields){const f=kn(e,h,t);if(!o.contains(f))throw new p(d.INVALID_ARGUMENT,`Field '${f}' is specified in your field mask but missing from your input data.`);Qi(l,f)||l.push(f)}u=new Y(l),c=o.fieldTransforms.filter((h=>u.covers(h.field)))}else u=null,c=o.fieldTransforms;return new dc(new H(a),u,c)}class It extends Et{_toFieldTransform(e){if(e.Ac!==2)throw e.Ac===1?e.Sc(`${this._methodName}() can only appear at the top level of your update data`):e.Sc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof It}}class hr extends Et{_toFieldTransform(e){return new ni(e.path,new lt)}isEqual(e){return e instanceof hr}}class dr extends Et{constructor(e,t){super(e),this.Fc=t}_toFieldTransform(e){const t=new ft(e.serializer,Xs(e.serializer,this.Fc));return new ni(e.path,t)}isEqual(e){return e instanceof dr&&this.Fc===e.Fc}}function mc(r,e,t,n){const s=r.Cc(1,e,t);fr("Data must be an object, but it was:",s,n);const i=[],o=H.empty();Ae(n,((u,c)=>{const l=mr(e,u,t);c=ee(c);const h=s.yc(l);if(c instanceof It)i.push(l);else{const f=At(c,h);f!=null&&(i.push(l),o.set(l,f))}}));const a=new Y(i);return new Fi(o,a,s.fieldTransforms)}function _c(r,e,t,n,s,i){const o=r.Cc(1,e,t),a=[kn(e,n,t)],u=[s];if(i.length%2!=0)throw new p(d.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let f=0;f<i.length;f+=2)a.push(kn(e,i[f])),u.push(i[f+1]);const c=[],l=H.empty();for(let f=a.length-1;f>=0;--f)if(!Qi(c,a[f])){const _=a[f];let T=u[f];T=ee(T);const w=o.yc(_);if(T instanceof It)c.push(_);else{const E=At(T,w);E!=null&&(c.push(_),l.set(_,E))}}const h=new Y(c);return new Fi(l,h,o.fieldTransforms)}function Bi(r,e,t,n=!1){return At(t,r.Cc(n?4:3,e))}function At(r,e){if($i(r=ee(r)))return fr("Unsupported field value:",e,r),zi(r,e);if(r instanceof Et)return(function(n,s){if(!Ui(s.Ac))throw s.Sc(`${n._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Sc(`${n._methodName}() is not currently supported inside arrays`);const i=n._toFieldTransform(s);i&&s.fieldTransforms.push(i)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.fc&&e.Ac!==4)throw e.Sc("Nested arrays are not supported");return(function(n,s){const i=[];let o=0;for(const a of n){let u=At(a,s.wc(o));u==null&&(u={nullValue:"NULL_VALUE"}),i.push(u),o++}return{arrayValue:{values:i}}})(r,e)}return(function(n,s){if((n=ee(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return Xs(s.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const i=b.fromDate(n);return{timestampValue:Ut(s.serializer,i)}}if(n instanceof b){const i=new b(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:Ut(s.serializer,i)}}if(n instanceof oe)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof J)return{bytesValue:ui(s.serializer,n._byteString)};if(n instanceof k){const i=s.databaseId,o=n.firestore._databaseId;if(!o.isEqual(i))throw s.Sc(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:Gn(n.firestore._databaseId||s.databaseId,n._key.path)}}if(n instanceof ae)return(function(o,a){return{mapValue:{fields:{[Os]:{stringValue:Ls},[Ot]:{arrayValue:{values:o.toArray().map((c=>{if(typeof c!="number")throw a.Sc("VectorValues must only contain numeric values.");return Bn(a.serializer,c)}))}}}}}})(n,s);throw s.Sc(`Unsupported field value: ${Gt(n)}`)})(r,e)}function zi(r,e){const t={};return bs(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Ae(r,((n,s)=>{const i=At(s,e.mc(n));i!=null&&(t[n]=i)})),{mapValue:{fields:t}}}function $i(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof b||r instanceof oe||r instanceof J||r instanceof k||r instanceof Et||r instanceof ae)}function fr(r,e,t){if(!$i(t)||!Ps(t)){const n=Gt(t);throw n==="an object"?e.Sc(r+" a custom object"):e.Sc(r+" "+n)}}function kn(r,e,t){if((e=ee(e))instanceof an)return e._internalPath;if(typeof e=="string")return mr(r,e);throw Qt("Field path arguments must be of type string or ",r,!1,void 0,t)}const pc=new RegExp("[~\\*/\\[\\]]");function mr(r,e,t){if(e.search(pc)>=0)throw Qt(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new an(...e.split("."))._internalPath}catch{throw Qt(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function Qt(r,e,t,n,s){const i=n&&!n.isEmpty(),o=s!==void 0;let a=`Function ${e}() called with invalid data`;t&&(a+=" (via `toFirestore()`)"),a+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${n}`),o&&(u+=` in document ${s}`),u+=")"),new p(d.INVALID_ARGUMENT,a+r+u)}function Qi(r,e){return r.some((t=>t.isEqual(e)))}/**
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
 */class _r{constructor(e,t,n,s,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new k(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new gc(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(un("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class gc extends _r{data(){return super.data()}}function un(r,e){return typeof e=="string"?mr(r,e):e instanceof an?e._internalPath:e._delegate._internalPath}/**
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
 */function Gi(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new p(d.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class pr{}class wt extends pr{}function Sc(r,e,...t){let n=[];e instanceof pr&&n.push(e),n=n.concat(t),(function(i){const o=i.filter((u=>u instanceof gr)).length,a=i.filter((u=>u instanceof cn)).length;if(o>1||o>0&&a>0)throw new p(d.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(n);for(const s of n)r=s._apply(r);return r}class cn extends wt{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new cn(e,t,n)}_apply(e){const t=this._parse(e);return Ki(e._query,t),new ne(e.firestore,e.converter,wn(e._query,t))}_parse(e){const t=Tt(e.firestore);return(function(i,o,a,u,c,l,h){let f;if(c.isKeyField()){if(l==="array-contains"||l==="array-contains-any")throw new p(d.INVALID_ARGUMENT,`Invalid Query. You can't perform '${l}' queries on documentId().`);if(l==="in"||l==="not-in"){ws(h,l);const T=[];for(const w of h)T.push(As(u,i,w));f={arrayValue:{values:T}}}else f=As(u,i,h)}else l!=="in"&&l!=="not-in"&&l!=="array-contains-any"||ws(h,l),f=Bi(a,o,h,l==="in"||l==="not-in");return O.create(c,l,f)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function Cc(r,e,t){const n=e,s=un("where",r);return cn._create(s,n,t)}class gr extends pr{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new gr(e,t)}_parse(e){const t=this._queryConstraints.map((n=>n._parse(e))).filter((n=>n.getFilters().length>0));return t.length===1?t[0]:te.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(s,i){let o=s;const a=i.getFlattenedFilters();for(const u of a)Ki(o,u),o=wn(o,u)})(e._query,t),new ne(e.firestore,e.converter,wn(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class yr extends wt{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new yr(e,t)}_apply(e){const t=(function(s,i,o){if(s.startAt!==null)throw new p(d.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new p(d.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new ct(i,o)})(e._query,this._field,this._direction);return new ne(e.firestore,e.converter,(function(s,i){const o=s.explicitOrderBy.concat([i]);return new we(s.path,s.collectionGroup,o,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)})(e._query,t))}}function bc(r,e="asc"){const t=e,n=un("orderBy",r);return yr._create(n,t)}class ln extends wt{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new ln(e,t,n)}_apply(e){return new ne(e.firestore,e.converter,Ft(e._query,this._limit,this._limitType))}}function Nc(r){return Ss("limit",r),ln._create("limit",r,"F")}function Dc(r){return Ss("limitToLast",r),ln._create("limitToLast",r,"L")}class Er extends wt{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new Er(e,t,n)}_apply(e){const t=ji(e,this.type,this._docOrFields,this._inclusive);return new ne(e.firestore,e.converter,(function(s,i){return new we(s.path,s.collectionGroup,s.explicitOrderBy.slice(),s.filters.slice(),s.limit,s.limitType,i,s.endAt)})(e._query,t))}}function kc(...r){return Er._create("startAfter",r,!1)}class Tr extends wt{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new Tr(e,t,n)}_apply(e){const t=ji(e,this.type,this._docOrFields,this._inclusive);return new ne(e.firestore,e.converter,(function(s,i){return new we(s.path,s.collectionGroup,s.explicitOrderBy.slice(),s.filters.slice(),s.limit,s.limitType,s.startAt,i)})(e._query,t))}}function xc(...r){return Tr._create("endBefore",r,!1)}function ji(r,e,t,n){if(t[0]=ee(t[0]),t[0]instanceof _r)return(function(i,o,a,u,c){if(!u)throw new p(d.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${a}().`);const l=[];for(const h of Fe(i))if(h.field.isKeyField())l.push(Lt(o,u.key));else{const f=u.data.field(h.field);if(Wt(f))throw new p(d.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+h.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(f===null){const _=h.field.canonicalString();throw new p(d.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${_}' (used as the orderBy) does not exist.`)}l.push(f)}return new $e(l,c)})(r._query,r.firestore._databaseId,e,t[0]._document,n);{const s=Tt(r.firestore);return(function(o,a,u,c,l,h){const f=o.explicitOrderBy;if(l.length>f.length)throw new p(d.INVALID_ARGUMENT,`Too many arguments provided to ${c}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const _=[];for(let T=0;T<l.length;T++){const w=l[T];if(f[T].field.isKeyField()){if(typeof w!="string")throw new p(d.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${c}(), but got a ${typeof w}`);if(!qn(o)&&w.indexOf("/")!==-1)throw new p(d.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${c}() must be a plain document ID, but '${w}' contains a slash.`);const E=o.path.child(C.fromString(w));if(!y.isDocumentKey(E))throw new p(d.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${c}() must result in a valid document path, but '${E}' is not because it contains an odd number of segments.`);const N=new y(E);_.push(Lt(a,N))}else{const E=Bi(u,c,w);_.push(E)}}return new $e(_,h)})(r._query,r.firestore._databaseId,s,e,t,n)}}function As(r,e,t){if(typeof(t=ee(t))=="string"){if(t==="")throw new p(d.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!qn(e)&&t.indexOf("/")!==-1)throw new p(d.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const n=e.path.child(C.fromString(t));if(!y.isDocumentKey(n))throw new p(d.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return Lt(r,new y(n))}if(t instanceof k)return Lt(r,t._key);throw new p(d.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Gt(t)}.`)}function ws(r,e){if(!Array.isArray(r)||r.length===0)throw new p(d.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Ki(r,e){const t=(function(s,i){for(const o of s)for(const a of o.getFlattenedFilters())if(i.indexOf(a.op)>=0)return a.op;return null})(r.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new p(d.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new p(d.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class yc{convertValue(e,t="none"){switch(Ee(e)){case 0:return null;case 1:return e.booleanValue;case 2:return x(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(ye(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw I(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return Ae(e,((s,i)=>{n[s]=this.convertValue(i,t)})),n}convertVectorValue(e){const t=e.fields?.[Ot].arrayValue?.values?.map((n=>x(n.doubleValue)));return new ae(t)}convertGeoPoint(e){return new oe(x(e.latitude),x(e.longitude))}convertArray(e,t){return(e.values||[]).map((n=>this.convertValue(n,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const n=Ht(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(ot(e));default:return null}}convertTimestamp(e){const t=ge(e);return new b(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=C.fromString(e);S(mi(n),9688,{name:e});const s=new at(n.get(1),n.get(3)),i=new y(n.popFirst(5));return s.isEqual(t)||he(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
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
 */function Wi(r,e,t){let n;return n=r?r.toFirestore(e):e,n}class et{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Pe extends _r{constructor(e,t,n,s,i,o){super(e,t,n,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new kt(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(un("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new p(d.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=Pe._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}Pe._jsonSchemaVersion="firestore/documentSnapshot/1.0",Pe._jsonSchema={type:L("string",Pe._jsonSchemaVersion),bundleSource:L("string","DocumentSnapshot"),bundleName:L("string"),bundle:L("string")};class kt extends Pe{data(e={}){return super.data(e)}}class Se{constructor(e,t,n,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new et(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((n=>{e.call(t,new kt(this._firestore,this._userDataWriter,n.key,n,new et(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new p(d.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map((a=>{const u=new kt(s._firestore,s._userDataWriter,a.doc.key,a.doc,new et(s._snapshot.mutatedKeys.has(a.doc.key),s._snapshot.fromCache),s.query.converter);return a.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}}))}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((a=>i||a.type!==3)).map((a=>{const u=new kt(s._firestore,s._userDataWriter,a.doc.key,a.doc,new et(s._snapshot.mutatedKeys.has(a.doc.key),s._snapshot.fromCache),s.query.converter);let c=-1,l=-1;return a.type!==0&&(c=o.indexOf(a.doc.key),o=o.delete(a.doc.key)),a.type!==1&&(o=o.add(a.doc),l=o.indexOf(a.doc.key)),{type:Ec(a.type),doc:u,oldIndex:c,newIndex:l}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new p(d.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Se._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=Mn.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],n=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),n.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function Ec(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return I(61501,{type:r})}}/**
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
 */function Mc(r){r=X(r,k);const e=X(r.firestore,fe);return oc(on(e),r._key).then((t=>Hi(e,r,t)))}Se._jsonSchemaVersion="firestore/querySnapshot/1.0",Se._jsonSchema={type:L("string",Se._jsonSchemaVersion),bundleSource:L("string","QuerySnapshot"),bundleName:L("string"),bundle:L("string")};class Ir extends yc{constructor(e){super(),this.firestore=e}convertBytes(e){return new J(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new k(this.firestore,null,t)}}function Oc(r){r=X(r,ne);const e=X(r.firestore,fe),t=on(e),n=new Ir(e);return Gi(r._query),ac(t,r._query).then((s=>new Se(e,n,r,s)))}function Lc(r,e,t){r=X(r,k);const n=X(r.firestore,fe),s=Wi(r.converter,e);return hn(n,[qi(Tt(n),"setDoc",r._key,s,r.converter!==null,t).toMutation(r._key,Z.none())])}function Fc(r,e,t,...n){r=X(r,k);const s=X(r.firestore,fe),i=Tt(s);let o;return o=typeof(e=ee(e))=="string"||e instanceof an?_c(i,"updateDoc",r._key,e,t,n):mc(i,"updateDoc",r._key,e),hn(s,[o.toMutation(r._key,Z.exists(!0))])}function Uc(r){return hn(X(r.firestore,fe),[new zn(r._key,Z.none())])}function qc(r,e){const t=X(r.firestore,fe),n=cc(r),s=Wi(r.converter,e);return hn(t,[qi(Tt(r.firestore),"addDoc",n._key,s,r.converter!==null,{}).toMutation(n._key,Z.exists(!1))]).then((()=>n))}function Bc(r,...e){r=ee(r);let t={includeMetadataChanges:!1,source:"default"},n=0;typeof e[n]!="object"||Is(e[n])||(t=e[n++]);const s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(Is(e[n])){const u=e[n];e[n]=u.next?.bind(u),e[n+1]=u.error?.bind(u),e[n+2]=u.complete?.bind(u)}let i,o,a;if(r instanceof k)o=X(r.firestore,fe),a=Yt(r._key.path),i={next:u=>{e[n]&&e[n](Hi(o,r,u))},error:e[n+1],complete:e[n+2]};else{const u=X(r,ne);o=X(u.firestore,fe),a=u._query;const c=new Ir(o);i={next:l=>{e[n]&&e[n](new Se(o,c,u,l))},error:e[n+1],complete:e[n+2]},Gi(r._query)}return(function(c,l,h,f){const _=new ur(f),T=new ir(l,_,h);return c.asyncQueue.enqueueAndForget((async()=>nr(await $t(c),T))),()=>{_.Nu(),c.asyncQueue.enqueueAndForget((async()=>rr(await $t(c),T)))}})(on(o),a,s,i)}function hn(r,e){return(function(n,s){const i=new le;return n.asyncQueue.enqueueAndForget((async()=>Wu(await ic(n),s,i))),i.promise})(on(r),e)}function Hi(r,e,t){const n=t.docs.get(e._key),s=new Ir(r);return new Pe(r,s,e._key,n,new et(t.hasPendingWrites,t.fromCache),e.converter)}/**
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
 */function zc(){return new It("deleteField")}function $c(){return new hr("serverTimestamp")}function Qc(r){return new dr("increment",r)}(function(e,t=!0){(function(s){je=s})(eo),Xi(new to("firestore",((n,{instanceIdentifier:s,options:i})=>{const o=n.getProvider("app").getImmediate(),a=new fe(new go(n.getProvider("auth-internal")),new To(o,n.getProvider("app-check-internal")),(function(c,l){if(!Object.prototype.hasOwnProperty.apply(c.options,["projectId"]))throw new p(d.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new at(c.options.projectId,l)})(o,s),o);return i={useFetchStreams:t,...i},a._setSettings(i),a}),"PUBLIC").setMultipleInstances(!0)),Rr(Vr,Pr,e),Rr(Vr,Pr,"esm2020")})();export{b as T,Bc as a,qc as b,Vc as c,cc as d,kc as e,Qc as f,Oc as g,Uc as h,Pc as i,zc as j,Mc as k,Nc as l,Lc as m,Dc as n,bc as o,xc as p,Sc as q,$c as s,Fc as u,Cc as w};
