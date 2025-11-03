import{_ as to,r as Pr,b as eo,a as no,S as ro}from"./pkg-at-firebase-app-B-jb69A0.js";import{C as so}from"./pkg-at-firebase-component-uLb4jufn.js";import{L as io,a as lt}from"./pkg-at-firebase-logger-CNz1B4Yj.js";import{F as oo,d as ao,o as Ps,p as uo,g as Z,z as co,l as lo}from"./pkg-at-firebase-util-DEf2dHJc.js";import{I as Vt,M as ho,X as fo,E as mo,a as fn,c as _o,g as po,W as Pe,b as go,S as Sr}from"./pkg-at-firebase-webchannel-wrapper-QS5lB7L3.js";const Cr="@firebase/firestore",br="4.9.1";/**
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
 */class W{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}W.UNAUTHENTICATED=new W(null),W.GOOGLE_CREDENTIALS=new W("google-credentials-uid"),W.FIRST_PARTY=new W("first-party-uid"),W.MOCK_USER=new W("mock-user");/**
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
 */let jt="12.2.0";/**
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
 */const Ct=new io("@firebase/firestore");function xt(){return Ct.logLevel}function g(r,...t){if(Ct.logLevel<=lt.DEBUG){const e=t.map(On);Ct.debug(`Firestore (${jt}): ${r}`,...e)}}function dt(r,...t){if(Ct.logLevel<=lt.ERROR){const e=t.map(On);Ct.error(`Firestore (${jt}): ${r}`,...e)}}function ie(r,...t){if(Ct.logLevel<=lt.WARN){const e=t.map(On);Ct.warn(`Firestore (${jt}): ${r}`,...e)}}function On(r){if(typeof r=="string")return r;try{/**
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
*/return(function(e){return JSON.stringify(e)})(r)}catch{return r}}/**
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
 */function I(r,t,e){let n="Unexpected state";typeof t=="string"?n=t:e=t,Ss(r,n,e)}function Ss(r,t,e){let n=`FIRESTORE (${jt}) INTERNAL ASSERTION FAILED: ${t} (ID: ${r.toString(16)})`;if(e!==void 0)try{n+=" CONTEXT: "+JSON.stringify(e)}catch{n+=" CONTEXT: "+e}throw dt(n),new Error(n)}function S(r,t,e,n){let s="Unexpected state";typeof e=="string"?s=e:n=e,r||Ss(t,s,n)}function v(r,t){return r}/**
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
 */const d={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class p extends oo{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
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
 */class ht{constructor(){this.promise=new Promise(((t,e)=>{this.resolve=t,this.reject=e}))}}/**
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
 */class yo{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class Eo{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable((()=>e(W.UNAUTHENTICATED)))}shutdown(){}}class To{constructor(t){this.t=t,this.currentUser=W.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){S(this.o===void 0,42304);let n=this.i;const s=u=>this.i!==n?(n=this.i,e(u)):Promise.resolve();let i=new ht;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new ht,t.enqueueRetryable((()=>s(this.currentUser)))};const o=()=>{const u=i;t.enqueueRetryable((async()=>{await u.promise,await s(this.currentUser)}))},a=u=>{g("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit((u=>a(u))),setTimeout((()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?a(u):(g("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new ht)}}),0),o()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then((n=>this.i!==t?(g("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(S(typeof n.accessToken=="string",31837,{l:n}),new yo(n.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return S(t===null||typeof t=="string",2055,{h:t}),new W(t)}}class Io{constructor(t,e,n){this.P=t,this.T=e,this.I=n,this.type="FirstParty",this.user=W.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const t=this.R();return t&&this.A.set("Authorization",t),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class Ao{constructor(t,e,n){this.P=t,this.T=e,this.I=n}getToken(){return Promise.resolve(new Io(this.P,this.T,this.I))}start(t,e){t.enqueueRetryable((()=>e(W.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Nr{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class wo{constructor(t,e){this.V=e,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,eo(t)&&t.settings.appCheckToken&&(this.p=t.settings.appCheckToken)}start(t,e){S(this.o===void 0,3512);const n=i=>{i.error!=null&&g("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.m;return this.m=i.token,g("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?e(i.token):Promise.resolve()};this.o=i=>{t.enqueueRetryable((()=>n(i)))};const s=i=>{g("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.V.getImmediate({optional:!0});i?s(i):g("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Nr(this.p));const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then((e=>e?(S(typeof e.token=="string",44558,{tokenResult:e}),this.m=e.token,new Nr(e.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
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
 */function vo(r){const t=typeof self<"u"&&(self.crypto||self.msCrypto),e=new Uint8Array(r);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(e);else for(let n=0;n<r;n++)e[n]=Math.floor(256*Math.random());return e}/**
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
 */class Ln{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=62*Math.floor(4.129032258064516);let n="";for(;n.length<20;){const s=vo(40);for(let i=0;i<s.length;++i)n.length<20&&s[i]<e&&(n+=t.charAt(s[i]%62))}return n}}function R(r,t){return r<t?-1:r>t?1:0}function Tn(r,t){const e=Math.min(r.length,t.length);for(let n=0;n<e;n++){const s=r.charAt(n),i=t.charAt(n);if(s!==i)return mn(s)===mn(i)?R(s,i):mn(s)?1:-1}return R(r.length,t.length)}const Ro=55296,Vo=57343;function mn(r){const t=r.charCodeAt(0);return t>=Ro&&t<=Vo}function qt(r,t,e){return r.length===t.length&&r.every(((n,s)=>e(n,t[s])))}/**
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
 */const Dr="__name__";class rt{constructor(t,e,n){e===void 0?e=0:e>t.length&&I(637,{offset:e,range:t.length}),n===void 0?n=t.length-e:n>t.length-e&&I(1746,{length:n,range:t.length-e}),this.segments=t,this.offset=e,this.len=n}get length(){return this.len}isEqual(t){return rt.comparator(this,t)===0}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof rt?t.forEach((n=>{e.push(n)})):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,n=this.limit();e<n;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const n=Math.min(t.length,e.length);for(let s=0;s<n;s++){const i=rt.compareSegments(t.get(s),e.get(s));if(i!==0)return i}return R(t.length,e.length)}static compareSegments(t,e){const n=rt.isNumericId(t),s=rt.isNumericId(e);return n&&!s?-1:!n&&s?1:n&&s?rt.extractNumericId(t).compare(rt.extractNumericId(e)):Tn(t,e)}static isNumericId(t){return t.startsWith("__id")&&t.endsWith("__")}static extractNumericId(t){return Vt.fromString(t.substring(4,t.length-2))}}class C extends rt{construct(t,e,n){return new C(t,e,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const n of t){if(n.indexOf("//")>=0)throw new p(d.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);e.push(...n.split("/").filter((s=>s.length>0)))}return new C(e)}static emptyPath(){return new C([])}}const Po=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class $ extends rt{construct(t,e,n){return new $(t,e,n)}static isValidIdentifier(t){return Po.test(t)}canonicalString(){return this.toArray().map((t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),$.isValidIdentifier(t)||(t="`"+t+"`"),t))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Dr}static keyField(){return new $([Dr])}static fromServerFormat(t){const e=[];let n="",s=0;const i=()=>{if(n.length===0)throw new p(d.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(n),n=""};let o=!1;for(;s<t.length;){const a=t[s];if(a==="\\"){if(s+1===t.length)throw new p(d.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const u=t[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new p(d.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);n+=u,s+=2}else a==="`"?(o=!o,s++):a!=="."||o?(n+=a,s++):(i(),s++)}if(i(),o)throw new p(d.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new $(e)}static emptyPath(){return new $([])}}/**
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
 */class y{constructor(t){this.path=t}static fromPath(t){return new y(C.fromString(t))}static fromName(t){return new y(C.fromString(t).popFirst(5))}static empty(){return new y(C.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&C.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,e){return C.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new y(new C(t.slice()))}}/**
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
 */function Cs(r,t,e){if(!e)throw new p(d.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${t}.`)}function So(r,t,e,n){if(t===!0&&n===!0)throw new p(d.INVALID_ARGUMENT,`${r} and ${e} cannot be used together.`)}function kr(r){if(!y.isDocumentKey(r))throw new p(d.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function xr(r){if(y.isDocumentKey(r))throw new p(d.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function bs(r){return typeof r=="object"&&r!==null&&(Object.getPrototypeOf(r)===Object.prototype||Object.getPrototypeOf(r)===null)}function We(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const t=(function(n){return n.constructor?n.constructor.name:null})(r);return t?`a custom ${t} object`:"an object"}}return typeof r=="function"?"a function":I(12329,{type:typeof r})}function X(r,t){if("_delegate"in r&&(r=r._delegate),!(r instanceof t)){if(t.name===r.constructor.name)throw new p(d.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const e=We(r);throw new p(d.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${e}`)}}return r}function Ns(r,t){if(t<=0)throw new p(d.INVALID_ARGUMENT,`Function ${r}() requires a positive number, but it was: ${t}.`)}/**
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
 */function L(r,t){const e={typeString:r};return t&&(e.value=t),e}function _e(r,t){if(!bs(r))throw new p(d.INVALID_ARGUMENT,"JSON must be an object");let e;for(const n in t)if(t[n]){const s=t[n].typeString,i="value"in t[n]?{value:t[n].value}:void 0;if(!(n in r)){e=`JSON missing required field: '${n}'`;break}const o=r[n];if(s&&typeof o!==s){e=`JSON field '${n}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){e=`Expected '${n}' field to equal '${i.value}'`;break}}if(e)throw new p(d.INVALID_ARGUMENT,e);return!0}/**
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
 */const Mr=-62135596800,Or=1e6;class b{static now(){return b.fromMillis(Date.now())}static fromDate(t){return b.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),n=Math.floor((t-1e3*e)*Or);return new b(e,n)}constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new p(d.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new p(d.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<Mr)throw new p(d.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new p(d.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Or}_compareTo(t){return this.seconds===t.seconds?R(this.nanoseconds,t.nanoseconds):R(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:b._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(t){if(_e(t,b._jsonSchema))return new b(t.seconds,t.nanoseconds)}valueOf(){const t=this.seconds-Mr;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}b._jsonSchemaVersion="firestore/timestamp/1.0",b._jsonSchema={type:L("string",b._jsonSchemaVersion),seconds:L("number"),nanoseconds:L("number")};/**
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
 */class A{static fromTimestamp(t){return new A(t)}static min(){return new A(new b(0,0))}static max(){return new A(new b(253402300799,999999999))}constructor(t){this.timestamp=t}compareTo(t){return this.timestamp._compareTo(t.timestamp)}isEqual(t){return this.timestamp.isEqual(t.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
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
 */const oe=-1;function Co(r,t){const e=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,s=A.fromTimestamp(n===1e9?new b(e+1,0):new b(e,n));return new pt(s,y.empty(),t)}function bo(r){return new pt(r.readTime,r.key,oe)}class pt{constructor(t,e,n){this.readTime=t,this.documentKey=e,this.largestBatchId=n}static min(){return new pt(A.min(),y.empty(),oe)}static max(){return new pt(A.max(),y.empty(),oe)}}function No(r,t){let e=r.readTime.compareTo(t.readTime);return e!==0?e:(e=y.comparator(r.documentKey,t.documentKey),e!==0?e:R(r.largestBatchId,t.largestBatchId))}/**
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
 */const Do="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class ko{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((t=>t()))}}/**
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
 */async function Kt(r){if(r.code!==d.FAILED_PRECONDITION||r.message!==Do)throw r;g("LocalStore","Unexpectedly lost primary lease")}/**
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
 */class m{constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t((e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)}),(e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)}))}catch(t){return this.next(void 0,t)}next(t,e){return this.callbackAttached&&I(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(e,this.error):this.wrapSuccess(t,this.result):new m(((n,s)=>{this.nextCallback=i=>{this.wrapSuccess(t,i).next(n,s)},this.catchCallback=i=>{this.wrapFailure(e,i).next(n,s)}}))}toPromise(){return new Promise(((t,e)=>{this.next(t,e)}))}wrapUserFunction(t){try{const e=t();return e instanceof m?e:m.resolve(e)}catch(e){return m.reject(e)}}wrapSuccess(t,e){return t?this.wrapUserFunction((()=>t(e))):m.resolve(e)}wrapFailure(t,e){return t?this.wrapUserFunction((()=>t(e))):m.reject(e)}static resolve(t){return new m(((e,n)=>{e(t)}))}static reject(t){return new m(((e,n)=>{n(t)}))}static waitFor(t){return new m(((e,n)=>{let s=0,i=0,o=!1;t.forEach((a=>{++s,a.next((()=>{++i,o&&i===s&&e()}),(u=>n(u)))})),o=!0,i===s&&e()}))}static or(t){let e=m.resolve(!1);for(const n of t)e=e.next((s=>s?m.resolve(s):n()));return e}static forEach(t,e){const n=[];return t.forEach(((s,i)=>{n.push(e.call(this,s,i))})),this.waitFor(n)}static mapArray(t,e){return new m(((n,s)=>{const i=t.length,o=new Array(i);let a=0;for(let u=0;u<i;u++){const c=u;e(t[c]).next((l=>{o[c]=l,++a,a===i&&n(o)}),(l=>s(l)))}}))}static doWhile(t,e){return new m(((n,s)=>{const i=()=>{t()===!0?e().next((()=>{i()}),s):n()};i()}))}}function xo(r){const t=r.match(/Android ([\d.]+)/i),e=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(e)}function Wt(r){return r.name==="IndexedDbTransactionError"}/**
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
 */class He{constructor(t,e){this.previousValue=t,e&&(e.sequenceNumberHandler=n=>this.ae(n),this.ue=n=>e.writeSequenceNumber(n))}ae(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this.ue&&this.ue(t),t}}He.ce=-1;/**
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
 */const Fn=-1;function Ye(r){return r==null}function Le(r){return r===0&&1/r==-1/0}function Mo(r){return typeof r=="number"&&Number.isInteger(r)&&!Le(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
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
 */const Ds="";function Oo(r){let t="";for(let e=0;e<r.length;e++)t.length>0&&(t=Lr(t)),t=Lo(r.get(e),t);return Lr(t)}function Lo(r,t){let e=t;const n=r.length;for(let s=0;s<n;s++){const i=r.charAt(s);switch(i){case"\0":e+="";break;case Ds:e+="";break;default:e+=i}}return e}function Lr(r){return r+Ds+""}/**
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
 */function Fr(r){let t=0;for(const e in r)Object.prototype.hasOwnProperty.call(r,e)&&t++;return t}function At(r,t){for(const e in r)Object.prototype.hasOwnProperty.call(r,e)&&t(e,r[e])}function ks(r){for(const t in r)if(Object.prototype.hasOwnProperty.call(r,t))return!1;return!0}/**
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
 */class D{constructor(t,e){this.comparator=t,this.root=e||z.EMPTY}insert(t,e){return new D(this.comparator,this.root.insert(t,e,this.comparator).copy(null,null,z.BLACK,null,null))}remove(t){return new D(this.comparator,this.root.remove(t,this.comparator).copy(null,null,z.BLACK,null,null))}get(t){let e=this.root;for(;!e.isEmpty();){const n=this.comparator(t,e.key);if(n===0)return e.value;n<0?e=e.left:n>0&&(e=e.right)}return null}indexOf(t){let e=0,n=this.root;for(;!n.isEmpty();){const s=this.comparator(t,n.key);if(s===0)return e+n.left.size;s<0?n=n.left:(e+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal(((e,n)=>(t(e,n),!1)))}toString(){const t=[];return this.inorderTraversal(((e,n)=>(t.push(`${e}:${n}`),!1))),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new Se(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new Se(this.root,t,this.comparator,!1)}getReverseIterator(){return new Se(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new Se(this.root,t,this.comparator,!0)}}class Se{constructor(t,e,n,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!t.isEmpty();)if(i=e?n(t.key,e):1,e&&s&&(i*=-1),i<0)t=this.isReverse?t.left:t.right;else{if(i===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const e={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return e}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class z{constructor(t,e,n,s,i){this.key=t,this.value=e,this.color=n??z.RED,this.left=s??z.EMPTY,this.right=i??z.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,e,n,s,i){return new z(t??this.key,e??this.value,n??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,e,n){let s=this;const i=n(t,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(t,e,n),null):i===0?s.copy(null,e,null,null,null):s.copy(null,null,null,null,s.right.insert(t,e,n)),s.fixUp()}removeMin(){if(this.left.isEmpty())return z.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,e){let n,s=this;if(e(t,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(t,e),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),e(t,s.key)===0){if(s.right.isEmpty())return z.EMPTY;n=s.right.min(),s=s.copy(n.key,n.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(t,e))}return s.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,z.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,z.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),e=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,e)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw I(43730,{key:this.key,value:this.value});if(this.right.isRed())throw I(14113,{key:this.key,value:this.value});const t=this.left.check();if(t!==this.right.check())throw I(27949);return t+(this.isRed()?0:1)}}z.EMPTY=null,z.RED=!0,z.BLACK=!1;z.EMPTY=new class{constructor(){this.size=0}get key(){throw I(57766)}get value(){throw I(16141)}get color(){throw I(16727)}get left(){throw I(29726)}get right(){throw I(36894)}copy(t,e,n,s,i){return this}insert(t,e,n){return new z(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
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
 */class U{constructor(t){this.comparator=t,this.data=new D(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal(((e,n)=>(t(e),!1)))}forEachInRange(t,e){const n=this.data.getIteratorFrom(t[0]);for(;n.hasNext();){const s=n.getNext();if(this.comparator(s.key,t[1])>=0)return;e(s.key)}}forEachWhile(t,e){let n;for(n=e!==void 0?this.data.getIteratorFrom(e):this.data.getIterator();n.hasNext();)if(!t(n.getNext().key))return}firstAfterOrEqual(t){const e=this.data.getIteratorFrom(t);return e.hasNext()?e.getNext().key:null}getIterator(){return new Ur(this.data.getIterator())}getIteratorFrom(t){return new Ur(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let e=this;return e.size<t.size&&(e=t,t=this),t.forEach((n=>{e=e.add(n)})),e}isEqual(t){if(!(t instanceof U)||this.size!==t.size)return!1;const e=this.data.getIterator(),n=t.data.getIterator();for(;e.hasNext();){const s=e.getNext().key,i=n.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const t=[];return this.forEach((e=>{t.push(e)})),t}toString(){const t=[];return this.forEach((e=>t.push(e))),"SortedSet("+t.toString()+")"}copy(t){const e=new U(this.comparator);return e.data=t,e}}class Ur{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
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
 */class J{constructor(t){this.fields=t,t.sort($.comparator)}static empty(){return new J([])}unionWith(t){let e=new U($.comparator);for(const n of this.fields)e=e.add(n);for(const n of t)e=e.add(n);return new J(e.toArray())}covers(t){for(const e of this.fields)if(e.isPrefixOf(t))return!0;return!1}isEqual(t){return qt(this.fields,t.fields,((e,n)=>e.isEqual(n)))}}/**
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
 */class xs extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
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
 */class G{constructor(t){this.binaryString=t}static fromBase64String(t){const e=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new xs("Invalid base64 string: "+i):i}})(t);return new G(e)}static fromUint8Array(t){const e=(function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i})(t);return new G(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(e){return btoa(e)})(this.binaryString)}toUint8Array(){return(function(e){const n=new Uint8Array(e.length);for(let s=0;s<e.length;s++)n[s]=e.charCodeAt(s);return n})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return R(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}G.EMPTY_BYTE_STRING=new G("");const Fo=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function gt(r){if(S(!!r,39018),typeof r=="string"){let t=0;const e=Fo.exec(r);if(S(!!e,46558,{timestamp:r}),e[1]){let s=e[1];s=(s+"000000000").substr(0,9),t=Number(s)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:t}}return{seconds:x(r.seconds),nanos:x(r.nanos)}}function x(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function yt(r){return typeof r=="string"?G.fromBase64String(r):G.fromUint8Array(r)}/**
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
 */const Ms="server_timestamp",Os="__type__",Ls="__previous_value__",Fs="__local_write_time__";function Xe(r){return(r?.mapValue?.fields||{})[Os]?.stringValue===Ms}function Je(r){const t=r.mapValue.fields[Ls];return Xe(t)?Je(t):t}function ae(r){const t=gt(r.mapValue.fields[Fs].timestampValue);return new b(t.seconds,t.nanos)}/**
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
 */class Uo{constructor(t,e,n,s,i,o,a,u,c,l){this.databaseId=t,this.appId=e,this.persistenceKey=n,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=u,this.useFetchStreams=c,this.isUsingEmulator=l}}const Fe="(default)";class ue{constructor(t,e){this.projectId=t,this.database=e||Fe}static empty(){return new ue("","")}get isDefaultDatabase(){return this.database===Fe}isEqual(t){return t instanceof ue&&t.projectId===this.projectId&&t.database===this.database}}/**
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
 */const Us="__type__",qo="__max__",Ce={mapValue:{}},qs="__vector__",Ue="value";function Et(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Xe(r)?4:zo(r)?9007199254740991:Bo(r)?10:11:I(28295,{value:r})}function ut(r,t){if(r===t)return!0;const e=Et(r);if(e!==Et(t))return!1;switch(e){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===t.booleanValue;case 4:return ae(r).isEqual(ae(t));case 3:return(function(s,i){if(typeof s.timestampValue=="string"&&typeof i.timestampValue=="string"&&s.timestampValue.length===i.timestampValue.length)return s.timestampValue===i.timestampValue;const o=gt(s.timestampValue),a=gt(i.timestampValue);return o.seconds===a.seconds&&o.nanos===a.nanos})(r,t);case 5:return r.stringValue===t.stringValue;case 6:return(function(s,i){return yt(s.bytesValue).isEqual(yt(i.bytesValue))})(r,t);case 7:return r.referenceValue===t.referenceValue;case 8:return(function(s,i){return x(s.geoPointValue.latitude)===x(i.geoPointValue.latitude)&&x(s.geoPointValue.longitude)===x(i.geoPointValue.longitude)})(r,t);case 2:return(function(s,i){if("integerValue"in s&&"integerValue"in i)return x(s.integerValue)===x(i.integerValue);if("doubleValue"in s&&"doubleValue"in i){const o=x(s.doubleValue),a=x(i.doubleValue);return o===a?Le(o)===Le(a):isNaN(o)&&isNaN(a)}return!1})(r,t);case 9:return qt(r.arrayValue.values||[],t.arrayValue.values||[],ut);case 10:case 11:return(function(s,i){const o=s.mapValue.fields||{},a=i.mapValue.fields||{};if(Fr(o)!==Fr(a))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(a[u]===void 0||!ut(o[u],a[u])))return!1;return!0})(r,t);default:return I(52216,{left:r})}}function ce(r,t){return(r.values||[]).find((e=>ut(e,t)))!==void 0}function Bt(r,t){if(r===t)return 0;const e=Et(r),n=Et(t);if(e!==n)return R(e,n);switch(e){case 0:case 9007199254740991:return 0;case 1:return R(r.booleanValue,t.booleanValue);case 2:return(function(i,o){const a=x(i.integerValue||i.doubleValue),u=x(o.integerValue||o.doubleValue);return a<u?-1:a>u?1:a===u?0:isNaN(a)?isNaN(u)?0:-1:1})(r,t);case 3:return qr(r.timestampValue,t.timestampValue);case 4:return qr(ae(r),ae(t));case 5:return Tn(r.stringValue,t.stringValue);case 6:return(function(i,o){const a=yt(i),u=yt(o);return a.compareTo(u)})(r.bytesValue,t.bytesValue);case 7:return(function(i,o){const a=i.split("/"),u=o.split("/");for(let c=0;c<a.length&&c<u.length;c++){const l=R(a[c],u[c]);if(l!==0)return l}return R(a.length,u.length)})(r.referenceValue,t.referenceValue);case 8:return(function(i,o){const a=R(x(i.latitude),x(o.latitude));return a!==0?a:R(x(i.longitude),x(o.longitude))})(r.geoPointValue,t.geoPointValue);case 9:return Br(r.arrayValue,t.arrayValue);case 10:return(function(i,o){const a=i.fields||{},u=o.fields||{},c=a[Ue]?.arrayValue,l=u[Ue]?.arrayValue,h=R(c?.values?.length||0,l?.values?.length||0);return h!==0?h:Br(c,l)})(r.mapValue,t.mapValue);case 11:return(function(i,o){if(i===Ce.mapValue&&o===Ce.mapValue)return 0;if(i===Ce.mapValue)return 1;if(o===Ce.mapValue)return-1;const a=i.fields||{},u=Object.keys(a),c=o.fields||{},l=Object.keys(c);u.sort(),l.sort();for(let h=0;h<u.length&&h<l.length;++h){const f=Tn(u[h],l[h]);if(f!==0)return f;const _=Bt(a[u[h]],c[l[h]]);if(_!==0)return _}return R(u.length,l.length)})(r.mapValue,t.mapValue);default:throw I(23264,{he:e})}}function qr(r,t){if(typeof r=="string"&&typeof t=="string"&&r.length===t.length)return R(r,t);const e=gt(r),n=gt(t),s=R(e.seconds,n.seconds);return s!==0?s:R(e.nanos,n.nanos)}function Br(r,t){const e=r.values||[],n=t.values||[];for(let s=0;s<e.length&&s<n.length;++s){const i=Bt(e[s],n[s]);if(i)return i}return R(e.length,n.length)}function zt(r){return In(r)}function In(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(e){const n=gt(e);return`time(${n.seconds},${n.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(e){return yt(e).toBase64()})(r.bytesValue):"referenceValue"in r?(function(e){return y.fromName(e).toString()})(r.referenceValue):"geoPointValue"in r?(function(e){return`geo(${e.latitude},${e.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(e){let n="[",s=!0;for(const i of e.values||[])s?s=!1:n+=",",n+=In(i);return n+"]"})(r.arrayValue):"mapValue"in r?(function(e){const n=Object.keys(e.fields||{}).sort();let s="{",i=!0;for(const o of n)i?i=!1:s+=",",s+=`${o}:${In(e.fields[o])}`;return s+"}"})(r.mapValue):I(61005,{value:r})}function De(r){switch(Et(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=Je(r);return t?16+De(t):16;case 5:return 2*r.stringValue.length;case 6:return yt(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(n){return(n.values||[]).reduce(((s,i)=>s+De(i)),0)})(r.arrayValue);case 10:case 11:return(function(n){let s=0;return At(n.fields,((i,o)=>{s+=i.length+De(o)})),s})(r.mapValue);default:throw I(13486,{value:r})}}function qe(r,t){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${t.path.canonicalString()}`}}function An(r){return!!r&&"integerValue"in r}function Un(r){return!!r&&"arrayValue"in r}function zr(r){return!!r&&"nullValue"in r}function $r(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function ke(r){return!!r&&"mapValue"in r}function Bo(r){return(r?.mapValue?.fields||{})[Us]?.stringValue===qs}function ne(r){if(r.geoPointValue)return{geoPointValue:{...r.geoPointValue}};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:{...r.timestampValue}};if(r.mapValue){const t={mapValue:{fields:{}}};return At(r.mapValue.fields,((e,n)=>t.mapValue.fields[e]=ne(n))),t}if(r.arrayValue){const t={arrayValue:{values:[]}};for(let e=0;e<(r.arrayValue.values||[]).length;++e)t.arrayValue.values[e]=ne(r.arrayValue.values[e]);return t}return{...r}}function zo(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue===qo}/**
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
 */class Y{constructor(t){this.value=t}static empty(){return new Y({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let e=this.value;for(let n=0;n<t.length-1;++n)if(e=(e.mapValue.fields||{})[t.get(n)],!ke(e))return null;return e=(e.mapValue.fields||{})[t.lastSegment()],e||null}}set(t,e){this.getFieldsMap(t.popLast())[t.lastSegment()]=ne(e)}setAll(t){let e=$.emptyPath(),n={},s=[];t.forEach(((o,a)=>{if(!e.isImmediateParentOf(a)){const u=this.getFieldsMap(e);this.applyChanges(u,n,s),n={},s=[],e=a.popLast()}o?n[a.lastSegment()]=ne(o):s.push(a.lastSegment())}));const i=this.getFieldsMap(e);this.applyChanges(i,n,s)}delete(t){const e=this.field(t.popLast());ke(e)&&e.mapValue.fields&&delete e.mapValue.fields[t.lastSegment()]}isEqual(t){return ut(this.value,t.value)}getFieldsMap(t){let e=this.value;e.mapValue.fields||(e.mapValue={fields:{}});for(let n=0;n<t.length;++n){let s=e.mapValue.fields[t.get(n)];ke(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},e.mapValue.fields[t.get(n)]=s),e=s}return e.mapValue.fields}applyChanges(t,e,n){At(e,((s,i)=>t[s]=i));for(const s of n)delete t[s]}clone(){return new Y(ne(this.value))}}function Bs(r){const t=[];return At(r.fields,((e,n)=>{const s=new $([e]);if(ke(n)){const i=Bs(n.mapValue).fields;if(i.length===0)t.push(s);else for(const o of i)t.push(s.child(o))}else t.push(s)})),new J(t)}/**
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
 */class j{constructor(t,e,n,s,i,o,a){this.key=t,this.documentType=e,this.version=n,this.readTime=s,this.createTime=i,this.data=o,this.documentState=a}static newInvalidDocument(t){return new j(t,0,A.min(),A.min(),A.min(),Y.empty(),0)}static newFoundDocument(t,e,n,s){return new j(t,1,e,A.min(),n,s,0)}static newNoDocument(t,e){return new j(t,2,e,A.min(),A.min(),Y.empty(),0)}static newUnknownDocument(t,e){return new j(t,3,e,A.min(),A.min(),Y.empty(),2)}convertToFoundDocument(t,e){return!this.createTime.isEqual(A.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=t),this.version=t,this.documentType=1,this.data=e,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=Y.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=Y.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=A.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof j&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new j(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
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
 */class $t{constructor(t,e){this.position=t,this.inclusive=e}}function Gr(r,t,e){let n=0;for(let s=0;s<r.position.length;s++){const i=t[s],o=r.position[s];if(i.field.isKeyField()?n=y.comparator(y.fromName(o.referenceValue),e.key):n=Bt(o,e.data.field(i.field)),i.dir==="desc"&&(n*=-1),n!==0)break}return n}function Qr(r,t){if(r===null)return t===null;if(t===null||r.inclusive!==t.inclusive||r.position.length!==t.position.length)return!1;for(let e=0;e<r.position.length;e++)if(!ut(r.position[e],t.position[e]))return!1;return!0}/**
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
 */class le{constructor(t,e="asc"){this.field=t,this.dir=e}}function $o(r,t){return r.dir===t.dir&&r.field.isEqual(t.field)}/**
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
 */class zs{}class O extends zs{constructor(t,e,n){super(),this.field=t,this.op=e,this.value=n}static create(t,e,n){return t.isKeyField()?e==="in"||e==="not-in"?this.createKeyFieldInFilter(t,e,n):new Qo(t,e,n):e==="array-contains"?new Wo(t,n):e==="in"?new Ho(t,n):e==="not-in"?new Yo(t,n):e==="array-contains-any"?new Xo(t,n):new O(t,e,n)}static createKeyFieldInFilter(t,e,n){return e==="in"?new jo(t,n):new Ko(t,n)}matches(t){const e=t.data.field(this.field);return this.op==="!="?e!==null&&e.nullValue===void 0&&this.matchesComparison(Bt(e,this.value)):e!==null&&Et(this.value)===Et(e)&&this.matchesComparison(Bt(e,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return t===0;case"!=":return t!==0;case">":return t>0;case">=":return t>=0;default:return I(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class et extends zs{constructor(t,e){super(),this.filters=t,this.op=e,this.Pe=null}static create(t,e){return new et(t,e)}matches(t){return $s(this)?this.filters.find((e=>!e.matches(t)))===void 0:this.filters.find((e=>e.matches(t)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((t,e)=>t.concat(e.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function $s(r){return r.op==="and"}function Gs(r){return Go(r)&&$s(r)}function Go(r){for(const t of r.filters)if(t instanceof et)return!1;return!0}function wn(r){if(r instanceof O)return r.field.canonicalString()+r.op.toString()+zt(r.value);if(Gs(r))return r.filters.map((t=>wn(t))).join(",");{const t=r.filters.map((e=>wn(e))).join(",");return`${r.op}(${t})`}}function Qs(r,t){return r instanceof O?(function(n,s){return s instanceof O&&n.op===s.op&&n.field.isEqual(s.field)&&ut(n.value,s.value)})(r,t):r instanceof et?(function(n,s){return s instanceof et&&n.op===s.op&&n.filters.length===s.filters.length?n.filters.reduce(((i,o,a)=>i&&Qs(o,s.filters[a])),!0):!1})(r,t):void I(19439)}function js(r){return r instanceof O?(function(e){return`${e.field.canonicalString()} ${e.op} ${zt(e.value)}`})(r):r instanceof et?(function(e){return e.op.toString()+" {"+e.getFilters().map(js).join(" ,")+"}"})(r):"Filter"}class Qo extends O{constructor(t,e,n){super(t,e,n),this.key=y.fromName(n.referenceValue)}matches(t){const e=y.comparator(t.key,this.key);return this.matchesComparison(e)}}class jo extends O{constructor(t,e){super(t,"in",e),this.keys=Ks("in",e)}matches(t){return this.keys.some((e=>e.isEqual(t.key)))}}class Ko extends O{constructor(t,e){super(t,"not-in",e),this.keys=Ks("not-in",e)}matches(t){return!this.keys.some((e=>e.isEqual(t.key)))}}function Ks(r,t){return(t.arrayValue?.values||[]).map((e=>y.fromName(e.referenceValue)))}class Wo extends O{constructor(t,e){super(t,"array-contains",e)}matches(t){const e=t.data.field(this.field);return Un(e)&&ce(e.arrayValue,this.value)}}class Ho extends O{constructor(t,e){super(t,"in",e)}matches(t){const e=t.data.field(this.field);return e!==null&&ce(this.value.arrayValue,e)}}class Yo extends O{constructor(t,e){super(t,"not-in",e)}matches(t){if(ce(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const e=t.data.field(this.field);return e!==null&&e.nullValue===void 0&&!ce(this.value.arrayValue,e)}}class Xo extends O{constructor(t,e){super(t,"array-contains-any",e)}matches(t){const e=t.data.field(this.field);return!(!Un(e)||!e.arrayValue.values)&&e.arrayValue.values.some((n=>ce(this.value.arrayValue,n)))}}/**
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
 */class Jo{constructor(t,e=null,n=[],s=[],i=null,o=null,a=null){this.path=t,this.collectionGroup=e,this.orderBy=n,this.filters=s,this.limit=i,this.startAt=o,this.endAt=a,this.Te=null}}function jr(r,t=null,e=[],n=[],s=null,i=null,o=null){return new Jo(r,t,e,n,s,i,o)}function qn(r){const t=v(r);if(t.Te===null){let e=t.path.canonicalString();t.collectionGroup!==null&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map((n=>wn(n))).join(","),e+="|ob:",e+=t.orderBy.map((n=>(function(i){return i.field.canonicalString()+i.dir})(n))).join(","),Ye(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map((n=>zt(n))).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map((n=>zt(n))).join(",")),t.Te=e}return t.Te}function Bn(r,t){if(r.limit!==t.limit||r.orderBy.length!==t.orderBy.length)return!1;for(let e=0;e<r.orderBy.length;e++)if(!$o(r.orderBy[e],t.orderBy[e]))return!1;if(r.filters.length!==t.filters.length)return!1;for(let e=0;e<r.filters.length;e++)if(!Qs(r.filters[e],t.filters[e]))return!1;return r.collectionGroup===t.collectionGroup&&!!r.path.isEqual(t.path)&&!!Qr(r.startAt,t.startAt)&&Qr(r.endAt,t.endAt)}function vn(r){return y.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}/**
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
 */class wt{constructor(t,e=null,n=[],s=[],i=null,o="F",a=null,u=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=n,this.filters=s,this.limit=i,this.limitType=o,this.startAt=a,this.endAt=u,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function Zo(r,t,e,n,s,i,o,a){return new wt(r,t,e,n,s,i,o,a)}function Ze(r){return new wt(r)}function Kr(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function zn(r){return r.collectionGroup!==null}function Ft(r){const t=v(r);if(t.Ie===null){t.Ie=[];const e=new Set;for(const i of t.explicitOrderBy)t.Ie.push(i),e.add(i.field.canonicalString());const n=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new U($.comparator);return o.filters.forEach((u=>{u.getFlattenedFilters().forEach((c=>{c.isInequality()&&(a=a.add(c.field))}))})),a})(t).forEach((i=>{e.has(i.canonicalString())||i.isKeyField()||t.Ie.push(new le(i,n))})),e.has($.keyField().canonicalString())||t.Ie.push(new le($.keyField(),n))}return t.Ie}function st(r){const t=v(r);return t.Ee||(t.Ee=ta(t,Ft(r))),t.Ee}function ta(r,t){if(r.limitType==="F")return jr(r.path,r.collectionGroup,t,r.filters,r.limit,r.startAt,r.endAt);{t=t.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new le(s.field,i)}));const e=r.endAt?new $t(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new $t(r.startAt.position,r.startAt.inclusive):null;return jr(r.path,r.collectionGroup,t,r.filters,r.limit,e,n)}}function Rn(r,t){const e=r.filters.concat([t]);return new wt(r.path,r.collectionGroup,r.explicitOrderBy.slice(),e,r.limit,r.limitType,r.startAt,r.endAt)}function Be(r,t,e){return new wt(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),t,e,r.startAt,r.endAt)}function tn(r,t){return Bn(st(r),st(t))&&r.limitType===t.limitType}function Ws(r){return`${qn(st(r))}|lt:${r.limitType}`}function Mt(r){return`Query(target=${(function(e){let n=e.path.canonicalString();return e.collectionGroup!==null&&(n+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(n+=`, filters: [${e.filters.map((s=>js(s))).join(", ")}]`),Ye(e.limit)||(n+=", limit: "+e.limit),e.orderBy.length>0&&(n+=`, orderBy: [${e.orderBy.map((s=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(s))).join(", ")}]`),e.startAt&&(n+=", startAt: ",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map((s=>zt(s))).join(",")),e.endAt&&(n+=", endAt: ",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map((s=>zt(s))).join(",")),`Target(${n})`})(st(r))}; limitType=${r.limitType})`}function en(r,t){return t.isFoundDocument()&&(function(n,s){const i=s.key.path;return n.collectionGroup!==null?s.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(i):y.isDocumentKey(n.path)?n.path.isEqual(i):n.path.isImmediateParentOf(i)})(r,t)&&(function(n,s){for(const i of Ft(n))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(r,t)&&(function(n,s){for(const i of n.filters)if(!i.matches(s))return!1;return!0})(r,t)&&(function(n,s){return!(n.startAt&&!(function(o,a,u){const c=Gr(o,a,u);return o.inclusive?c<=0:c<0})(n.startAt,Ft(n),s)||n.endAt&&!(function(o,a,u){const c=Gr(o,a,u);return o.inclusive?c>=0:c>0})(n.endAt,Ft(n),s))})(r,t)}function ea(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function Hs(r){return(t,e)=>{let n=!1;for(const s of Ft(r)){const i=na(s,t,e);if(i!==0)return i;n=n||s.field.isKeyField()}return 0}}function na(r,t,e){const n=r.field.isKeyField()?y.comparator(t.key,e.key):(function(i,o,a){const u=o.data.field(i),c=a.data.field(i);return u!==null&&c!==null?Bt(u,c):I(42886)})(r.field,t,e);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return I(19790,{direction:r.dir})}}/**
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
 */class Nt{constructor(t,e){this.mapKeyFn=t,this.equalsFn=e,this.inner={},this.innerSize=0}get(t){const e=this.mapKeyFn(t),n=this.inner[e];if(n!==void 0){for(const[s,i]of n)if(this.equalsFn(s,t))return i}}has(t){return this.get(t)!==void 0}set(t,e){const n=this.mapKeyFn(t),s=this.inner[n];if(s===void 0)return this.inner[n]=[[t,e]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],t))return void(s[i]=[t,e]);s.push([t,e]),this.innerSize++}delete(t){const e=this.mapKeyFn(t),n=this.inner[e];if(n===void 0)return!1;for(let s=0;s<n.length;s++)if(this.equalsFn(n[s][0],t))return n.length===1?delete this.inner[e]:n.splice(s,1),this.innerSize--,!0;return!1}forEach(t){At(this.inner,((e,n)=>{for(const[s,i]of n)t(s,i)}))}isEmpty(){return ks(this.inner)}size(){return this.innerSize}}/**
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
 */const ra=new D(y.comparator);function ft(){return ra}const Ys=new D(y.comparator);function Zt(...r){let t=Ys;for(const e of r)t=t.insert(e.key,e);return t}function Xs(r){let t=Ys;return r.forEach(((e,n)=>t=t.insert(e,n.overlayedDocument))),t}function Rt(){return re()}function Js(){return re()}function re(){return new Nt((r=>r.toString()),((r,t)=>r.isEqual(t)))}const sa=new D(y.comparator),ia=new U(y.comparator);function V(...r){let t=ia;for(const e of r)t=t.add(e);return t}const oa=new U(R);function aa(){return oa}/**
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
 */function $n(r,t){if(r.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Le(t)?"-0":t}}function Zs(r){return{integerValue:""+r}}function ti(r,t){return Mo(t)?Zs(t):$n(r,t)}/**
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
 */class nn{constructor(){this._=void 0}}function ua(r,t,e){return r instanceof he?(function(s,i){const o={fields:{[Os]:{stringValue:Ms},[Fs]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&Xe(i)&&(i=Je(i)),i&&(o.fields[Ls]=i),{mapValue:o}})(e,t):r instanceof de?ni(r,t):r instanceof fe?ri(r,t):(function(s,i){const o=ei(s,i),a=Wr(o)+Wr(s.Ae);return An(o)&&An(s.Ae)?Zs(a):$n(s.serializer,a)})(r,t)}function ca(r,t,e){return r instanceof de?ni(r,t):r instanceof fe?ri(r,t):e}function ei(r,t){return r instanceof me?(function(n){return An(n)||(function(i){return!!i&&"doubleValue"in i})(n)})(t)?t:{integerValue:0}:null}class he extends nn{}class de extends nn{constructor(t){super(),this.elements=t}}function ni(r,t){const e=si(t);for(const n of r.elements)e.some((s=>ut(s,n)))||e.push(n);return{arrayValue:{values:e}}}class fe extends nn{constructor(t){super(),this.elements=t}}function ri(r,t){let e=si(t);for(const n of r.elements)e=e.filter((s=>!ut(s,n)));return{arrayValue:{values:e}}}class me extends nn{constructor(t,e){super(),this.serializer=t,this.Ae=e}}function Wr(r){return x(r.integerValue||r.doubleValue)}function si(r){return Un(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
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
 */class ii{constructor(t,e){this.field=t,this.transform=e}}function la(r,t){return r.field.isEqual(t.field)&&(function(n,s){return n instanceof de&&s instanceof de||n instanceof fe&&s instanceof fe?qt(n.elements,s.elements,ut):n instanceof me&&s instanceof me?ut(n.Ae,s.Ae):n instanceof he&&s instanceof he})(r.transform,t.transform)}class ha{constructor(t,e){this.version=t,this.transformResults=e}}class K{constructor(t,e){this.updateTime=t,this.exists=e}static none(){return new K}static exists(t){return new K(void 0,t)}static updateTime(t){return new K(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function xe(r,t){return r.updateTime!==void 0?t.isFoundDocument()&&t.version.isEqual(r.updateTime):r.exists===void 0||r.exists===t.isFoundDocument()}class rn{}function oi(r,t){if(!r.hasLocalMutations||t&&t.fields.length===0)return null;if(t===null)return r.isNoDocument()?new sn(r.key,K.none()):new pe(r.key,r.data,K.none());{const e=r.data,n=Y.empty();let s=new U($.comparator);for(let i of t.fields)if(!s.has(i)){let o=e.field(i);o===null&&i.length>1&&(i=i.popLast(),o=e.field(i)),o===null?n.delete(i):n.set(i,o),s=s.add(i)}return new vt(r.key,n,new J(s.toArray()),K.none())}}function da(r,t,e){r instanceof pe?(function(s,i,o){const a=s.value.clone(),u=Yr(s.fieldTransforms,i,o.transformResults);a.setAll(u),i.convertToFoundDocument(o.version,a).setHasCommittedMutations()})(r,t,e):r instanceof vt?(function(s,i,o){if(!xe(s.precondition,i))return void i.convertToUnknownDocument(o.version);const a=Yr(s.fieldTransforms,i,o.transformResults),u=i.data;u.setAll(ai(s)),u.setAll(a),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()})(r,t,e):(function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()})(0,t,e)}function se(r,t,e,n){return r instanceof pe?(function(i,o,a,u){if(!xe(i.precondition,o))return a;const c=i.value.clone(),l=Xr(i.fieldTransforms,u,o);return c.setAll(l),o.convertToFoundDocument(o.version,c).setHasLocalMutations(),null})(r,t,e,n):r instanceof vt?(function(i,o,a,u){if(!xe(i.precondition,o))return a;const c=Xr(i.fieldTransforms,u,o),l=o.data;return l.setAll(ai(i)),l.setAll(c),o.convertToFoundDocument(o.version,l).setHasLocalMutations(),a===null?null:a.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((h=>h.field)))})(r,t,e,n):(function(i,o,a){return xe(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):a})(r,t,e)}function fa(r,t){let e=null;for(const n of r.fieldTransforms){const s=t.data.field(n.field),i=ei(n.transform,s||null);i!=null&&(e===null&&(e=Y.empty()),e.set(n.field,i))}return e||null}function Hr(r,t){return r.type===t.type&&!!r.key.isEqual(t.key)&&!!r.precondition.isEqual(t.precondition)&&!!(function(n,s){return n===void 0&&s===void 0||!(!n||!s)&&qt(n,s,((i,o)=>la(i,o)))})(r.fieldTransforms,t.fieldTransforms)&&(r.type===0?r.value.isEqual(t.value):r.type!==1||r.data.isEqual(t.data)&&r.fieldMask.isEqual(t.fieldMask))}class pe extends rn{constructor(t,e,n,s=[]){super(),this.key=t,this.value=e,this.precondition=n,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class vt extends rn{constructor(t,e,n,s,i=[]){super(),this.key=t,this.data=e,this.fieldMask=n,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function ai(r){const t=new Map;return r.fieldMask.fields.forEach((e=>{if(!e.isEmpty()){const n=r.data.field(e);t.set(e,n)}})),t}function Yr(r,t,e){const n=new Map;S(r.length===e.length,32656,{Re:e.length,Ve:r.length});for(let s=0;s<e.length;s++){const i=r[s],o=i.transform,a=t.data.field(i.field);n.set(i.field,ca(o,a,e[s]))}return n}function Xr(r,t,e){const n=new Map;for(const s of r){const i=s.transform,o=e.data.field(s.field);n.set(s.field,ua(i,o,t))}return n}class sn extends rn{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class ma extends rn{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
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
 */class _a{constructor(t,e,n,s){this.batchId=t,this.localWriteTime=e,this.baseMutations=n,this.mutations=s}applyToRemoteDocument(t,e){const n=e.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(t.key)&&da(i,t,n[s])}}applyToLocalView(t,e){for(const n of this.baseMutations)n.key.isEqual(t.key)&&(e=se(n,t,e,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(t.key)&&(e=se(n,t,e,this.localWriteTime));return e}applyToLocalDocumentSet(t,e){const n=Js();return this.mutations.forEach((s=>{const i=t.get(s.key),o=i.overlayedDocument;let a=this.applyToLocalView(o,i.mutatedFields);a=e.has(s.key)?null:a;const u=oi(o,a);u!==null&&n.set(s.key,u),o.isValidDocument()||o.convertToNoDocument(A.min())})),n}keys(){return this.mutations.reduce(((t,e)=>t.add(e.key)),V())}isEqual(t){return this.batchId===t.batchId&&qt(this.mutations,t.mutations,((e,n)=>Hr(e,n)))&&qt(this.baseMutations,t.baseMutations,((e,n)=>Hr(e,n)))}}class Gn{constructor(t,e,n,s){this.batch=t,this.commitVersion=e,this.mutationResults=n,this.docVersions=s}static from(t,e,n){S(t.mutations.length===n.length,58842,{me:t.mutations.length,fe:n.length});let s=(function(){return sa})();const i=t.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,n[o].version);return new Gn(t,e,n,s)}}/**
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
 */class pa{constructor(t,e){this.largestBatchId=t,this.mutation=e}getKey(){return this.mutation.key}isEqual(t){return t!==null&&this.mutation===t.mutation}toString(){return`Overlay{
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
 */class ga{constructor(t,e){this.count=t,this.unchangedNames=e}}/**
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
 */var M,P;function ya(r){switch(r){case d.OK:return I(64938);case d.CANCELLED:case d.UNKNOWN:case d.DEADLINE_EXCEEDED:case d.RESOURCE_EXHAUSTED:case d.INTERNAL:case d.UNAVAILABLE:case d.UNAUTHENTICATED:return!1;case d.INVALID_ARGUMENT:case d.NOT_FOUND:case d.ALREADY_EXISTS:case d.PERMISSION_DENIED:case d.FAILED_PRECONDITION:case d.ABORTED:case d.OUT_OF_RANGE:case d.UNIMPLEMENTED:case d.DATA_LOSS:return!0;default:return I(15467,{code:r})}}function ui(r){if(r===void 0)return dt("GRPC error has no .code"),d.UNKNOWN;switch(r){case M.OK:return d.OK;case M.CANCELLED:return d.CANCELLED;case M.UNKNOWN:return d.UNKNOWN;case M.DEADLINE_EXCEEDED:return d.DEADLINE_EXCEEDED;case M.RESOURCE_EXHAUSTED:return d.RESOURCE_EXHAUSTED;case M.INTERNAL:return d.INTERNAL;case M.UNAVAILABLE:return d.UNAVAILABLE;case M.UNAUTHENTICATED:return d.UNAUTHENTICATED;case M.INVALID_ARGUMENT:return d.INVALID_ARGUMENT;case M.NOT_FOUND:return d.NOT_FOUND;case M.ALREADY_EXISTS:return d.ALREADY_EXISTS;case M.PERMISSION_DENIED:return d.PERMISSION_DENIED;case M.FAILED_PRECONDITION:return d.FAILED_PRECONDITION;case M.ABORTED:return d.ABORTED;case M.OUT_OF_RANGE:return d.OUT_OF_RANGE;case M.UNIMPLEMENTED:return d.UNIMPLEMENTED;case M.DATA_LOSS:return d.DATA_LOSS;default:return I(39323,{code:r})}}(P=M||(M={}))[P.OK=0]="OK",P[P.CANCELLED=1]="CANCELLED",P[P.UNKNOWN=2]="UNKNOWN",P[P.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",P[P.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",P[P.NOT_FOUND=5]="NOT_FOUND",P[P.ALREADY_EXISTS=6]="ALREADY_EXISTS",P[P.PERMISSION_DENIED=7]="PERMISSION_DENIED",P[P.UNAUTHENTICATED=16]="UNAUTHENTICATED",P[P.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",P[P.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",P[P.ABORTED=10]="ABORTED",P[P.OUT_OF_RANGE=11]="OUT_OF_RANGE",P[P.UNIMPLEMENTED=12]="UNIMPLEMENTED",P[P.INTERNAL=13]="INTERNAL",P[P.UNAVAILABLE=14]="UNAVAILABLE",P[P.DATA_LOSS=15]="DATA_LOSS";/**
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
 */function Ea(){return new TextEncoder}/**
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
 */const Ta=new Vt([4294967295,4294967295],0);function Jr(r){const t=Ea().encode(r),e=new ho;return e.update(t),new Uint8Array(e.digest())}function Zr(r){const t=new DataView(r.buffer),e=t.getUint32(0,!0),n=t.getUint32(4,!0),s=t.getUint32(8,!0),i=t.getUint32(12,!0);return[new Vt([e,n],0),new Vt([s,i],0)]}class Qn{constructor(t,e,n){if(this.bitmap=t,this.padding=e,this.hashCount=n,e<0||e>=8)throw new te(`Invalid padding: ${e}`);if(n<0)throw new te(`Invalid hash count: ${n}`);if(t.length>0&&this.hashCount===0)throw new te(`Invalid hash count: ${n}`);if(t.length===0&&e!==0)throw new te(`Invalid padding when bitmap length is 0: ${e}`);this.ge=8*t.length-e,this.pe=Vt.fromNumber(this.ge)}ye(t,e,n){let s=t.add(e.multiply(Vt.fromNumber(n)));return s.compare(Ta)===1&&(s=new Vt([s.getBits(0),s.getBits(1)],0)),s.modulo(this.pe).toNumber()}we(t){return!!(this.bitmap[Math.floor(t/8)]&1<<t%8)}mightContain(t){if(this.ge===0)return!1;const e=Jr(t),[n,s]=Zr(e);for(let i=0;i<this.hashCount;i++){const o=this.ye(n,s,i);if(!this.we(o))return!1}return!0}static create(t,e,n){const s=t%8==0?0:8-t%8,i=new Uint8Array(Math.ceil(t/8)),o=new Qn(i,s,e);return n.forEach((a=>o.insert(a))),o}insert(t){if(this.ge===0)return;const e=Jr(t),[n,s]=Zr(e);for(let i=0;i<this.hashCount;i++){const o=this.ye(n,s,i);this.Se(o)}}Se(t){const e=Math.floor(t/8),n=t%8;this.bitmap[e]|=1<<n}}class te extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
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
 */class on{constructor(t,e,n,s,i){this.snapshotVersion=t,this.targetChanges=e,this.targetMismatches=n,this.documentUpdates=s,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(t,e,n){const s=new Map;return s.set(t,ge.createSynthesizedTargetChangeForCurrentChange(t,e,n)),new on(A.min(),s,new D(R),ft(),V())}}class ge{constructor(t,e,n,s,i){this.resumeToken=t,this.current=e,this.addedDocuments=n,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(t,e,n){return new ge(n,e,V(),V(),V())}}/**
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
 */class Me{constructor(t,e,n,s){this.be=t,this.removedTargetIds=e,this.key=n,this.De=s}}class ci{constructor(t,e){this.targetId=t,this.Ce=e}}class li{constructor(t,e,n=G.EMPTY_BYTE_STRING,s=null){this.state=t,this.targetIds=e,this.resumeToken=n,this.cause=s}}class ts{constructor(){this.ve=0,this.Fe=es(),this.Me=G.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(t){t.approximateByteSize()>0&&(this.Oe=!0,this.Me=t)}ke(){let t=V(),e=V(),n=V();return this.Fe.forEach(((s,i)=>{switch(i){case 0:t=t.add(s);break;case 2:e=e.add(s);break;case 1:n=n.add(s);break;default:I(38017,{changeType:i})}})),new ge(this.Me,this.xe,t,e,n)}qe(){this.Oe=!1,this.Fe=es()}Qe(t,e){this.Oe=!0,this.Fe=this.Fe.insert(t,e)}$e(t){this.Oe=!0,this.Fe=this.Fe.remove(t)}Ue(){this.ve+=1}Ke(){this.ve-=1,S(this.ve>=0,3241,{ve:this.ve})}We(){this.Oe=!0,this.xe=!0}}class Ia{constructor(t){this.Ge=t,this.ze=new Map,this.je=ft(),this.Je=be(),this.He=be(),this.Ye=new D(R)}Ze(t){for(const e of t.be)t.De&&t.De.isFoundDocument()?this.Xe(e,t.De):this.et(e,t.key,t.De);for(const e of t.removedTargetIds)this.et(e,t.key,t.De)}tt(t){this.forEachTarget(t,(e=>{const n=this.nt(e);switch(t.state){case 0:this.rt(e)&&n.Le(t.resumeToken);break;case 1:n.Ke(),n.Ne||n.qe(),n.Le(t.resumeToken);break;case 2:n.Ke(),n.Ne||this.removeTarget(e);break;case 3:this.rt(e)&&(n.We(),n.Le(t.resumeToken));break;case 4:this.rt(e)&&(this.it(e),n.Le(t.resumeToken));break;default:I(56790,{state:t.state})}}))}forEachTarget(t,e){t.targetIds.length>0?t.targetIds.forEach(e):this.ze.forEach(((n,s)=>{this.rt(s)&&e(s)}))}st(t){const e=t.targetId,n=t.Ce.count,s=this.ot(e);if(s){const i=s.target;if(vn(i))if(n===0){const o=new y(i.path);this.et(e,o,j.newNoDocument(o,A.min()))}else S(n===1,20013,{expectedCount:n});else{const o=this._t(e);if(o!==n){const a=this.ut(t),u=a?this.ct(a,t,o):1;if(u!==0){this.it(e);const c=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ye=this.Ye.insert(e,c)}}}}}ut(t){const e=t.Ce.unchangedNames;if(!e||!e.bits)return null;const{bits:{bitmap:n="",padding:s=0},hashCount:i=0}=e;let o,a;try{o=yt(n).toUint8Array()}catch(u){if(u instanceof xs)return ie("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{a=new Qn(o,s,i)}catch(u){return ie(u instanceof te?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return a.ge===0?null:a}ct(t,e,n){return e.Ce.count===n-this.Pt(t,e.targetId)?0:2}Pt(t,e){const n=this.Ge.getRemoteKeysForTarget(e);let s=0;return n.forEach((i=>{const o=this.Ge.ht(),a=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;t.mightContain(a)||(this.et(e,i,null),s++)})),s}Tt(t){const e=new Map;this.ze.forEach(((i,o)=>{const a=this.ot(o);if(a){if(i.current&&vn(a.target)){const u=new y(a.target.path);this.It(u).has(o)||this.Et(o,u)||this.et(o,u,j.newNoDocument(u,t))}i.Be&&(e.set(o,i.ke()),i.qe())}}));let n=V();this.He.forEach(((i,o)=>{let a=!0;o.forEachWhile((u=>{const c=this.ot(u);return!c||c.purpose==="TargetPurposeLimboResolution"||(a=!1,!1)})),a&&(n=n.add(i))})),this.je.forEach(((i,o)=>o.setReadTime(t)));const s=new on(t,e,this.Ye,this.je,n);return this.je=ft(),this.Je=be(),this.He=be(),this.Ye=new D(R),s}Xe(t,e){if(!this.rt(t))return;const n=this.Et(t,e.key)?2:0;this.nt(t).Qe(e.key,n),this.je=this.je.insert(e.key,e),this.Je=this.Je.insert(e.key,this.It(e.key).add(t)),this.He=this.He.insert(e.key,this.dt(e.key).add(t))}et(t,e,n){if(!this.rt(t))return;const s=this.nt(t);this.Et(t,e)?s.Qe(e,1):s.$e(e),this.He=this.He.insert(e,this.dt(e).delete(t)),this.He=this.He.insert(e,this.dt(e).add(t)),n&&(this.je=this.je.insert(e,n))}removeTarget(t){this.ze.delete(t)}_t(t){const e=this.nt(t).ke();return this.Ge.getRemoteKeysForTarget(t).size+e.addedDocuments.size-e.removedDocuments.size}Ue(t){this.nt(t).Ue()}nt(t){let e=this.ze.get(t);return e||(e=new ts,this.ze.set(t,e)),e}dt(t){let e=this.He.get(t);return e||(e=new U(R),this.He=this.He.insert(t,e)),e}It(t){let e=this.Je.get(t);return e||(e=new U(R),this.Je=this.Je.insert(t,e)),e}rt(t){const e=this.ot(t)!==null;return e||g("WatchChangeAggregator","Detected inactive target",t),e}ot(t){const e=this.ze.get(t);return e&&e.Ne?null:this.Ge.At(t)}it(t){this.ze.set(t,new ts),this.Ge.getRemoteKeysForTarget(t).forEach((e=>{this.et(t,e,null)}))}Et(t,e){return this.Ge.getRemoteKeysForTarget(t).has(e)}}function be(){return new D(y.comparator)}function es(){return new D(y.comparator)}const Aa={asc:"ASCENDING",desc:"DESCENDING"},wa={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},va={and:"AND",or:"OR"};class Ra{constructor(t,e){this.databaseId=t,this.useProto3Json=e}}function Vn(r,t){return r.useProto3Json||Ye(t)?t:{value:t}}function ze(r,t){return r.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function hi(r,t){return r.useProto3Json?t.toBase64():t.toUint8Array()}function Va(r,t){return ze(r,t.toTimestamp())}function it(r){return S(!!r,49232),A.fromTimestamp((function(e){const n=gt(e);return new b(n.seconds,n.nanos)})(r))}function jn(r,t){return Pn(r,t).canonicalString()}function Pn(r,t){const e=(function(s){return new C(["projects",s.projectId,"databases",s.database])})(r).child("documents");return t===void 0?e:e.child(t)}function di(r){const t=C.fromString(r);return S(gi(t),10190,{key:t.toString()}),t}function Sn(r,t){return jn(r.databaseId,t.path)}function _n(r,t){const e=di(t);if(e.get(1)!==r.databaseId.projectId)throw new p(d.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+e.get(1)+" vs "+r.databaseId.projectId);if(e.get(3)!==r.databaseId.database)throw new p(d.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+e.get(3)+" vs "+r.databaseId.database);return new y(mi(e))}function fi(r,t){return jn(r.databaseId,t)}function Pa(r){const t=di(r);return t.length===4?C.emptyPath():mi(t)}function Cn(r){return new C(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function mi(r){return S(r.length>4&&r.get(4)==="documents",29091,{key:r.toString()}),r.popFirst(5)}function ns(r,t,e){return{name:Sn(r,t),fields:e.value.mapValue.fields}}function Sa(r,t){let e;if("targetChange"in t){t.targetChange;const n=(function(c){return c==="NO_CHANGE"?0:c==="ADD"?1:c==="REMOVE"?2:c==="CURRENT"?3:c==="RESET"?4:I(39313,{state:c})})(t.targetChange.targetChangeType||"NO_CHANGE"),s=t.targetChange.targetIds||[],i=(function(c,l){return c.useProto3Json?(S(l===void 0||typeof l=="string",58123),G.fromBase64String(l||"")):(S(l===void 0||l instanceof Buffer||l instanceof Uint8Array,16193),G.fromUint8Array(l||new Uint8Array))})(r,t.targetChange.resumeToken),o=t.targetChange.cause,a=o&&(function(c){const l=c.code===void 0?d.UNKNOWN:ui(c.code);return new p(l,c.message||"")})(o);e=new li(n,s,i,a||null)}else if("documentChange"in t){t.documentChange;const n=t.documentChange;n.document,n.document.name,n.document.updateTime;const s=_n(r,n.document.name),i=it(n.document.updateTime),o=n.document.createTime?it(n.document.createTime):A.min(),a=new Y({mapValue:{fields:n.document.fields}}),u=j.newFoundDocument(s,i,o,a),c=n.targetIds||[],l=n.removedTargetIds||[];e=new Me(c,l,u.key,u)}else if("documentDelete"in t){t.documentDelete;const n=t.documentDelete;n.document;const s=_n(r,n.document),i=n.readTime?it(n.readTime):A.min(),o=j.newNoDocument(s,i),a=n.removedTargetIds||[];e=new Me([],a,o.key,o)}else if("documentRemove"in t){t.documentRemove;const n=t.documentRemove;n.document;const s=_n(r,n.document),i=n.removedTargetIds||[];e=new Me([],i,s,null)}else{if(!("filter"in t))return I(11601,{Rt:t});{t.filter;const n=t.filter;n.targetId;const{count:s=0,unchangedNames:i}=n,o=new ga(s,i),a=n.targetId;e=new ci(a,o)}}return e}function Ca(r,t){let e;if(t instanceof pe)e={update:ns(r,t.key,t.value)};else if(t instanceof sn)e={delete:Sn(r,t.key)};else if(t instanceof vt)e={update:ns(r,t.key,t.data),updateMask:Fa(t.fieldMask)};else{if(!(t instanceof ma))return I(16599,{Vt:t.type});e={verify:Sn(r,t.key)}}return t.fieldTransforms.length>0&&(e.updateTransforms=t.fieldTransforms.map((n=>(function(i,o){const a=o.transform;if(a instanceof he)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof de)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof fe)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof me)return{fieldPath:o.field.canonicalString(),increment:a.Ae};throw I(20930,{transform:o.transform})})(0,n)))),t.precondition.isNone||(e.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:Va(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:I(27497)})(r,t.precondition)),e}function ba(r,t){return r&&r.length>0?(S(t!==void 0,14353),r.map((e=>(function(s,i){let o=s.updateTime?it(s.updateTime):it(i);return o.isEqual(A.min())&&(o=it(i)),new ha(o,s.transformResults||[])})(e,t)))):[]}function Na(r,t){return{documents:[fi(r,t.path)]}}function Da(r,t){const e={structuredQuery:{}},n=t.path;let s;t.collectionGroup!==null?(s=n,e.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(s=n.popLast(),e.structuredQuery.from=[{collectionId:n.lastSegment()}]),e.parent=fi(r,s);const i=(function(c){if(c.length!==0)return pi(et.create(c,"and"))})(t.filters);i&&(e.structuredQuery.where=i);const o=(function(c){if(c.length!==0)return c.map((l=>(function(f){return{field:Ot(f.field),direction:Ma(f.dir)}})(l)))})(t.orderBy);o&&(e.structuredQuery.orderBy=o);const a=Vn(r,t.limit);return a!==null&&(e.structuredQuery.limit=a),t.startAt&&(e.structuredQuery.startAt=(function(c){return{before:c.inclusive,values:c.position}})(t.startAt)),t.endAt&&(e.structuredQuery.endAt=(function(c){return{before:!c.inclusive,values:c.position}})(t.endAt)),{ft:e,parent:s}}function ka(r){let t=Pa(r.parent);const e=r.structuredQuery,n=e.from?e.from.length:0;let s=null;if(n>0){S(n===1,65062);const l=e.from[0];l.allDescendants?s=l.collectionId:t=t.child(l.collectionId)}let i=[];e.where&&(i=(function(h){const f=_i(h);return f instanceof et&&Gs(f)?f.getFilters():[f]})(e.where));let o=[];e.orderBy&&(o=(function(h){return h.map((f=>(function(T){return new le(Lt(T.field),(function(E){switch(E){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(T.direction))})(f)))})(e.orderBy));let a=null;e.limit&&(a=(function(h){let f;return f=typeof h=="object"?h.value:h,Ye(f)?null:f})(e.limit));let u=null;e.startAt&&(u=(function(h){const f=!!h.before,_=h.values||[];return new $t(_,f)})(e.startAt));let c=null;return e.endAt&&(c=(function(h){const f=!h.before,_=h.values||[];return new $t(_,f)})(e.endAt)),Zo(t,s,o,i,a,"F",u,c)}function xa(r,t){const e=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return I(28987,{purpose:s})}})(t.purpose);return e==null?null:{"goog-listen-tags":e}}function _i(r){return r.unaryFilter!==void 0?(function(e){switch(e.unaryFilter.op){case"IS_NAN":const n=Lt(e.unaryFilter.field);return O.create(n,"==",{doubleValue:NaN});case"IS_NULL":const s=Lt(e.unaryFilter.field);return O.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=Lt(e.unaryFilter.field);return O.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=Lt(e.unaryFilter.field);return O.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return I(61313);default:return I(60726)}})(r):r.fieldFilter!==void 0?(function(e){return O.create(Lt(e.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return I(58110);default:return I(50506)}})(e.fieldFilter.op),e.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(e){return et.create(e.compositeFilter.filters.map((n=>_i(n))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return I(1026)}})(e.compositeFilter.op))})(r):I(30097,{filter:r})}function Ma(r){return Aa[r]}function Oa(r){return wa[r]}function La(r){return va[r]}function Ot(r){return{fieldPath:r.canonicalString()}}function Lt(r){return $.fromServerFormat(r.fieldPath)}function pi(r){return r instanceof O?(function(e){if(e.op==="=="){if($r(e.value))return{unaryFilter:{field:Ot(e.field),op:"IS_NAN"}};if(zr(e.value))return{unaryFilter:{field:Ot(e.field),op:"IS_NULL"}}}else if(e.op==="!="){if($r(e.value))return{unaryFilter:{field:Ot(e.field),op:"IS_NOT_NAN"}};if(zr(e.value))return{unaryFilter:{field:Ot(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Ot(e.field),op:Oa(e.op),value:e.value}}})(r):r instanceof et?(function(e){const n=e.getFilters().map((s=>pi(s)));return n.length===1?n[0]:{compositeFilter:{op:La(e.op),filters:n}}})(r):I(54877,{filter:r})}function Fa(r){const t=[];return r.fields.forEach((e=>t.push(e.canonicalString()))),{fieldPaths:t}}function gi(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
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
 */class mt{constructor(t,e,n,s,i=A.min(),o=A.min(),a=G.EMPTY_BYTE_STRING,u=null){this.target=t,this.targetId=e,this.purpose=n,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=a,this.expectedCount=u}withSequenceNumber(t){return new mt(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,e){return new mt(this.target,this.targetId,this.purpose,this.sequenceNumber,e,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new mt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new mt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}}/**
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
 */class Ua{constructor(t){this.yt=t}}function qa(r){const t=ka({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?Be(t,t.limit,"L"):t}/**
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
 */class Ba{constructor(){this.Cn=new za}addToCollectionParentIndex(t,e){return this.Cn.add(e),m.resolve()}getCollectionParents(t,e){return m.resolve(this.Cn.getEntries(e))}addFieldIndex(t,e){return m.resolve()}deleteFieldIndex(t,e){return m.resolve()}deleteAllFieldIndexes(t){return m.resolve()}createTargetIndexes(t,e){return m.resolve()}getDocumentsMatchingTarget(t,e){return m.resolve(null)}getIndexType(t,e){return m.resolve(0)}getFieldIndexes(t,e){return m.resolve([])}getNextCollectionGroupToUpdate(t){return m.resolve(null)}getMinOffset(t,e){return m.resolve(pt.min())}getMinOffsetFromCollectionGroup(t,e){return m.resolve(pt.min())}updateCollectionGroup(t,e,n){return m.resolve()}updateIndexEntries(t,e){return m.resolve()}}class za{constructor(){this.index={}}add(t){const e=t.lastSegment(),n=t.popLast(),s=this.index[e]||new U(C.comparator),i=!s.has(n);return this.index[e]=s.add(n),i}has(t){const e=t.lastSegment(),n=t.popLast(),s=this.index[e];return s&&s.has(n)}getEntries(t){return(this.index[t]||new U(C.comparator)).toArray()}}/**
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
 */const rs={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},yi=41943040;class H{static withCacheSize(t){return new H(t,H.DEFAULT_COLLECTION_PERCENTILE,H.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(t,e,n){this.cacheSizeCollectionThreshold=t,this.percentileToCollect=e,this.maximumSequenceNumbersToCollect=n}}/**
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
 */H.DEFAULT_COLLECTION_PERCENTILE=10,H.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,H.DEFAULT=new H(yi,H.DEFAULT_COLLECTION_PERCENTILE,H.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),H.DISABLED=new H(-1,0,0);/**
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
 */class Gt{constructor(t){this.ar=t}next(){return this.ar+=2,this.ar}static ur(){return new Gt(0)}static cr(){return new Gt(-1)}}/**
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
 */const ss="LruGarbageCollector",Ei=1048576;function is([r,t],[e,n]){const s=R(r,e);return s===0?R(t,n):s}class $a{constructor(t){this.Ir=t,this.buffer=new U(is),this.Er=0}dr(){return++this.Er}Ar(t){const e=[t,this.dr()];if(this.buffer.size<this.Ir)this.buffer=this.buffer.add(e);else{const n=this.buffer.last();is(e,n)<0&&(this.buffer=this.buffer.delete(n).add(e))}}get maxValue(){return this.buffer.last()[0]}}class Ga{constructor(t,e,n){this.garbageCollector=t,this.asyncQueue=e,this.localStore=n,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Vr(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Vr(t){g(ss,`Garbage collection scheduled in ${t}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",t,(async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){Wt(e)?g(ss,"Ignoring IndexedDB error during garbage collection: ",e):await Kt(e)}await this.Vr(3e5)}))}}class Qa{constructor(t,e){this.mr=t,this.params=e}calculateTargetCount(t,e){return this.mr.gr(t).next((n=>Math.floor(e/100*n)))}nthSequenceNumber(t,e){if(e===0)return m.resolve(He.ce);const n=new $a(e);return this.mr.forEachTarget(t,(s=>n.Ar(s.sequenceNumber))).next((()=>this.mr.pr(t,(s=>n.Ar(s))))).next((()=>n.maxValue))}removeTargets(t,e,n){return this.mr.removeTargets(t,e,n)}removeOrphanedDocuments(t,e){return this.mr.removeOrphanedDocuments(t,e)}collect(t,e){return this.params.cacheSizeCollectionThreshold===-1?(g("LruGarbageCollector","Garbage collection skipped; disabled"),m.resolve(rs)):this.getCacheSize(t).next((n=>n<this.params.cacheSizeCollectionThreshold?(g("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),rs):this.yr(t,e)))}getCacheSize(t){return this.mr.getCacheSize(t)}yr(t,e){let n,s,i,o,a,u,c;const l=Date.now();return this.calculateTargetCount(t,this.params.percentileToCollect).next((h=>(h>this.params.maximumSequenceNumbersToCollect?(g("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${h}`),s=this.params.maximumSequenceNumbersToCollect):s=h,o=Date.now(),this.nthSequenceNumber(t,s)))).next((h=>(n=h,a=Date.now(),this.removeTargets(t,n,e)))).next((h=>(i=h,u=Date.now(),this.removeOrphanedDocuments(t,n)))).next((h=>(c=Date.now(),xt()<=lt.DEBUG&&g("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-l}ms
	Determined least recently used ${s} in `+(a-o)+`ms
	Removed ${i} targets in `+(u-a)+`ms
	Removed ${h} documents in `+(c-u)+`ms
Total Duration: ${c-l}ms`),m.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:h}))))}}function ja(r,t){return new Qa(r,t)}/**
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
 */class Ka{constructor(){this.changes=new Nt((t=>t.toString()),((t,e)=>t.isEqual(e))),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,e){this.assertNotApplied(),this.changes.set(t,j.newInvalidDocument(t).setReadTime(e))}getEntry(t,e){this.assertNotApplied();const n=this.changes.get(e);return n!==void 0?m.resolve(n):this.getFromCache(t,e)}getEntries(t,e){return this.getAllFromCache(t,e)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}/**
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
 */class Wa{constructor(t,e){this.overlayedDocument=t,this.mutatedFields=e}}/**
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
 */class Ha{constructor(t,e,n,s){this.remoteDocumentCache=t,this.mutationQueue=e,this.documentOverlayCache=n,this.indexManager=s}getDocument(t,e){let n=null;return this.documentOverlayCache.getOverlay(t,e).next((s=>(n=s,this.remoteDocumentCache.getEntry(t,e)))).next((s=>(n!==null&&se(n.mutation,s,J.empty(),b.now()),s)))}getDocuments(t,e){return this.remoteDocumentCache.getEntries(t,e).next((n=>this.getLocalViewOfDocuments(t,n,V()).next((()=>n))))}getLocalViewOfDocuments(t,e,n=V()){const s=Rt();return this.populateOverlays(t,s,e).next((()=>this.computeViews(t,e,s,n).next((i=>{let o=Zt();return i.forEach(((a,u)=>{o=o.insert(a,u.overlayedDocument)})),o}))))}getOverlayedDocuments(t,e){const n=Rt();return this.populateOverlays(t,n,e).next((()=>this.computeViews(t,e,n,V())))}populateOverlays(t,e,n){const s=[];return n.forEach((i=>{e.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(t,s).next((i=>{i.forEach(((o,a)=>{e.set(o,a)}))}))}computeViews(t,e,n,s){let i=ft();const o=re(),a=(function(){return re()})();return e.forEach(((u,c)=>{const l=n.get(c.key);s.has(c.key)&&(l===void 0||l.mutation instanceof vt)?i=i.insert(c.key,c):l!==void 0?(o.set(c.key,l.mutation.getFieldMask()),se(l.mutation,c,l.mutation.getFieldMask(),b.now())):o.set(c.key,J.empty())})),this.recalculateAndSaveOverlays(t,i).next((u=>(u.forEach(((c,l)=>o.set(c,l))),e.forEach(((c,l)=>a.set(c,new Wa(l,o.get(c)??null)))),a)))}recalculateAndSaveOverlays(t,e){const n=re();let s=new D(((o,a)=>o-a)),i=V();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,e).next((o=>{for(const a of o)a.keys().forEach((u=>{const c=e.get(u);if(c===null)return;let l=n.get(u)||J.empty();l=a.applyToLocalView(c,l),n.set(u,l);const h=(s.get(a.batchId)||V()).add(u);s=s.insert(a.batchId,h)}))})).next((()=>{const o=[],a=s.getReverseIterator();for(;a.hasNext();){const u=a.getNext(),c=u.key,l=u.value,h=Js();l.forEach((f=>{if(!i.has(f)){const _=oi(e.get(f),n.get(f));_!==null&&h.set(f,_),i=i.add(f)}})),o.push(this.documentOverlayCache.saveOverlays(t,c,h))}return m.waitFor(o)})).next((()=>n))}recalculateAndSaveOverlaysForDocumentKeys(t,e){return this.remoteDocumentCache.getEntries(t,e).next((n=>this.recalculateAndSaveOverlays(t,n)))}getDocumentsMatchingQuery(t,e,n,s){return(function(o){return y.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0})(e)?this.getDocumentsMatchingDocumentQuery(t,e.path):zn(e)?this.getDocumentsMatchingCollectionGroupQuery(t,e,n,s):this.getDocumentsMatchingCollectionQuery(t,e,n,s)}getNextDocuments(t,e,n,s){return this.remoteDocumentCache.getAllFromCollectionGroup(t,e,n,s).next((i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,e,n.largestBatchId,s-i.size):m.resolve(Rt());let a=oe,u=i;return o.next((c=>m.forEach(c,((l,h)=>(a<h.largestBatchId&&(a=h.largestBatchId),i.get(l)?m.resolve():this.remoteDocumentCache.getEntry(t,l).next((f=>{u=u.insert(l,f)}))))).next((()=>this.populateOverlays(t,c,i))).next((()=>this.computeViews(t,u,c,V()))).next((l=>({batchId:a,changes:Xs(l)})))))}))}getDocumentsMatchingDocumentQuery(t,e){return this.getDocument(t,new y(e)).next((n=>{let s=Zt();return n.isFoundDocument()&&(s=s.insert(n.key,n)),s}))}getDocumentsMatchingCollectionGroupQuery(t,e,n,s){const i=e.collectionGroup;let o=Zt();return this.indexManager.getCollectionParents(t,i).next((a=>m.forEach(a,(u=>{const c=(function(h,f){return new wt(f,null,h.explicitOrderBy.slice(),h.filters.slice(),h.limit,h.limitType,h.startAt,h.endAt)})(e,u.child(i));return this.getDocumentsMatchingCollectionQuery(t,c,n,s).next((l=>{l.forEach(((h,f)=>{o=o.insert(h,f)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(t,e,n,s){let i;return this.documentOverlayCache.getOverlaysForCollection(t,e.path,n.largestBatchId).next((o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(t,e,n,i,s)))).next((o=>{i.forEach(((u,c)=>{const l=c.getKey();o.get(l)===null&&(o=o.insert(l,j.newInvalidDocument(l)))}));let a=Zt();return o.forEach(((u,c)=>{const l=i.get(u);l!==void 0&&se(l.mutation,c,J.empty(),b.now()),en(e,c)&&(a=a.insert(u,c))})),a}))}}/**
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
 */class Ya{constructor(t){this.serializer=t,this.Lr=new Map,this.kr=new Map}getBundleMetadata(t,e){return m.resolve(this.Lr.get(e))}saveBundleMetadata(t,e){return this.Lr.set(e.id,(function(s){return{id:s.id,version:s.version,createTime:it(s.createTime)}})(e)),m.resolve()}getNamedQuery(t,e){return m.resolve(this.kr.get(e))}saveNamedQuery(t,e){return this.kr.set(e.name,(function(s){return{name:s.name,query:qa(s.bundledQuery),readTime:it(s.readTime)}})(e)),m.resolve()}}/**
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
 */class Xa{constructor(){this.overlays=new D(y.comparator),this.qr=new Map}getOverlay(t,e){return m.resolve(this.overlays.get(e))}getOverlays(t,e){const n=Rt();return m.forEach(e,(s=>this.getOverlay(t,s).next((i=>{i!==null&&n.set(s,i)})))).next((()=>n))}saveOverlays(t,e,n){return n.forEach(((s,i)=>{this.St(t,e,i)})),m.resolve()}removeOverlaysForBatchId(t,e,n){const s=this.qr.get(n);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.qr.delete(n)),m.resolve()}getOverlaysForCollection(t,e,n){const s=Rt(),i=e.length+1,o=new y(e.child("")),a=this.overlays.getIteratorFrom(o);for(;a.hasNext();){const u=a.getNext().value,c=u.getKey();if(!e.isPrefixOf(c.path))break;c.path.length===i&&u.largestBatchId>n&&s.set(u.getKey(),u)}return m.resolve(s)}getOverlaysForCollectionGroup(t,e,n,s){let i=new D(((c,l)=>c-l));const o=this.overlays.getIterator();for(;o.hasNext();){const c=o.getNext().value;if(c.getKey().getCollectionGroup()===e&&c.largestBatchId>n){let l=i.get(c.largestBatchId);l===null&&(l=Rt(),i=i.insert(c.largestBatchId,l)),l.set(c.getKey(),c)}}const a=Rt(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((c,l)=>a.set(c,l))),!(a.size()>=s)););return m.resolve(a)}St(t,e,n){const s=this.overlays.get(n.key);if(s!==null){const o=this.qr.get(s.largestBatchId).delete(n.key);this.qr.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new pa(e,n));let i=this.qr.get(e);i===void 0&&(i=V(),this.qr.set(e,i)),this.qr.set(e,i.add(n.key))}}/**
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
 */class Ja{constructor(){this.sessionToken=G.EMPTY_BYTE_STRING}getSessionToken(t){return m.resolve(this.sessionToken)}setSessionToken(t,e){return this.sessionToken=e,m.resolve()}}/**
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
 */class Kn{constructor(){this.Qr=new U(q.$r),this.Ur=new U(q.Kr)}isEmpty(){return this.Qr.isEmpty()}addReference(t,e){const n=new q(t,e);this.Qr=this.Qr.add(n),this.Ur=this.Ur.add(n)}Wr(t,e){t.forEach((n=>this.addReference(n,e)))}removeReference(t,e){this.Gr(new q(t,e))}zr(t,e){t.forEach((n=>this.removeReference(n,e)))}jr(t){const e=new y(new C([])),n=new q(e,t),s=new q(e,t+1),i=[];return this.Ur.forEachInRange([n,s],(o=>{this.Gr(o),i.push(o.key)})),i}Jr(){this.Qr.forEach((t=>this.Gr(t)))}Gr(t){this.Qr=this.Qr.delete(t),this.Ur=this.Ur.delete(t)}Hr(t){const e=new y(new C([])),n=new q(e,t),s=new q(e,t+1);let i=V();return this.Ur.forEachInRange([n,s],(o=>{i=i.add(o.key)})),i}containsKey(t){const e=new q(t,0),n=this.Qr.firstAfterOrEqual(e);return n!==null&&t.isEqual(n.key)}}class q{constructor(t,e){this.key=t,this.Yr=e}static $r(t,e){return y.comparator(t.key,e.key)||R(t.Yr,e.Yr)}static Kr(t,e){return R(t.Yr,e.Yr)||y.comparator(t.key,e.key)}}/**
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
 */class Za{constructor(t,e){this.indexManager=t,this.referenceDelegate=e,this.mutationQueue=[],this.tr=1,this.Zr=new U(q.$r)}checkEmpty(t){return m.resolve(this.mutationQueue.length===0)}addMutationBatch(t,e,n,s){const i=this.tr;this.tr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new _a(i,e,n,s);this.mutationQueue.push(o);for(const a of s)this.Zr=this.Zr.add(new q(a.key,i)),this.indexManager.addToCollectionParentIndex(t,a.key.path.popLast());return m.resolve(o)}lookupMutationBatch(t,e){return m.resolve(this.Xr(e))}getNextMutationBatchAfterBatchId(t,e){const n=e+1,s=this.ei(n),i=s<0?0:s;return m.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return m.resolve(this.mutationQueue.length===0?Fn:this.tr-1)}getAllMutationBatches(t){return m.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,e){const n=new q(e,0),s=new q(e,Number.POSITIVE_INFINITY),i=[];return this.Zr.forEachInRange([n,s],(o=>{const a=this.Xr(o.Yr);i.push(a)})),m.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(t,e){let n=new U(R);return e.forEach((s=>{const i=new q(s,0),o=new q(s,Number.POSITIVE_INFINITY);this.Zr.forEachInRange([i,o],(a=>{n=n.add(a.Yr)}))})),m.resolve(this.ti(n))}getAllMutationBatchesAffectingQuery(t,e){const n=e.path,s=n.length+1;let i=n;y.isDocumentKey(i)||(i=i.child(""));const o=new q(new y(i),0);let a=new U(R);return this.Zr.forEachWhile((u=>{const c=u.key.path;return!!n.isPrefixOf(c)&&(c.length===s&&(a=a.add(u.Yr)),!0)}),o),m.resolve(this.ti(a))}ti(t){const e=[];return t.forEach((n=>{const s=this.Xr(n);s!==null&&e.push(s)})),e}removeMutationBatch(t,e){S(this.ni(e.batchId,"removed")===0,55003),this.mutationQueue.shift();let n=this.Zr;return m.forEach(e.mutations,(s=>{const i=new q(s.key,e.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(t,s.key)})).next((()=>{this.Zr=n}))}ir(t){}containsKey(t,e){const n=new q(e,0),s=this.Zr.firstAfterOrEqual(n);return m.resolve(e.isEqual(s&&s.key))}performConsistencyCheck(t){return this.mutationQueue.length,m.resolve()}ni(t,e){return this.ei(t)}ei(t){return this.mutationQueue.length===0?0:t-this.mutationQueue[0].batchId}Xr(t){const e=this.ei(t);return e<0||e>=this.mutationQueue.length?null:this.mutationQueue[e]}}/**
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
 */class tu{constructor(t){this.ri=t,this.docs=(function(){return new D(y.comparator)})(),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,e){const n=e.key,s=this.docs.get(n),i=s?s.size:0,o=this.ri(e);return this.docs=this.docs.insert(n,{document:e.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(t,n.path.popLast())}removeEntry(t){const e=this.docs.get(t);e&&(this.docs=this.docs.remove(t),this.size-=e.size)}getEntry(t,e){const n=this.docs.get(e);return m.resolve(n?n.document.mutableCopy():j.newInvalidDocument(e))}getEntries(t,e){let n=ft();return e.forEach((s=>{const i=this.docs.get(s);n=n.insert(s,i?i.document.mutableCopy():j.newInvalidDocument(s))})),m.resolve(n)}getDocumentsMatchingQuery(t,e,n,s){let i=ft();const o=e.path,a=new y(o.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(a);for(;u.hasNext();){const{key:c,value:{document:l}}=u.getNext();if(!o.isPrefixOf(c.path))break;c.path.length>o.length+1||No(bo(l),n)<=0||(s.has(l.key)||en(e,l))&&(i=i.insert(l.key,l.mutableCopy()))}return m.resolve(i)}getAllFromCollectionGroup(t,e,n,s){I(9500)}ii(t,e){return m.forEach(this.docs,(n=>e(n)))}newChangeBuffer(t){return new eu(this)}getSize(t){return m.resolve(this.size)}}class eu extends Ka{constructor(t){super(),this.Nr=t}applyChanges(t){const e=[];return this.changes.forEach(((n,s)=>{s.isValidDocument()?e.push(this.Nr.addEntry(t,s)):this.Nr.removeEntry(n)})),m.waitFor(e)}getFromCache(t,e){return this.Nr.getEntry(t,e)}getAllFromCache(t,e){return this.Nr.getEntries(t,e)}}/**
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
 */class nu{constructor(t){this.persistence=t,this.si=new Nt((e=>qn(e)),Bn),this.lastRemoteSnapshotVersion=A.min(),this.highestTargetId=0,this.oi=0,this._i=new Kn,this.targetCount=0,this.ai=Gt.ur()}forEachTarget(t,e){return this.si.forEach(((n,s)=>e(s))),m.resolve()}getLastRemoteSnapshotVersion(t){return m.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return m.resolve(this.oi)}allocateTargetId(t){return this.highestTargetId=this.ai.next(),m.resolve(this.highestTargetId)}setTargetsMetadata(t,e,n){return n&&(this.lastRemoteSnapshotVersion=n),e>this.oi&&(this.oi=e),m.resolve()}Pr(t){this.si.set(t.target,t);const e=t.targetId;e>this.highestTargetId&&(this.ai=new Gt(e),this.highestTargetId=e),t.sequenceNumber>this.oi&&(this.oi=t.sequenceNumber)}addTargetData(t,e){return this.Pr(e),this.targetCount+=1,m.resolve()}updateTargetData(t,e){return this.Pr(e),m.resolve()}removeTargetData(t,e){return this.si.delete(e.target),this._i.jr(e.targetId),this.targetCount-=1,m.resolve()}removeTargets(t,e,n){let s=0;const i=[];return this.si.forEach(((o,a)=>{a.sequenceNumber<=e&&n.get(a.targetId)===null&&(this.si.delete(o),i.push(this.removeMatchingKeysForTargetId(t,a.targetId)),s++)})),m.waitFor(i).next((()=>s))}getTargetCount(t){return m.resolve(this.targetCount)}getTargetData(t,e){const n=this.si.get(e)||null;return m.resolve(n)}addMatchingKeys(t,e,n){return this._i.Wr(e,n),m.resolve()}removeMatchingKeys(t,e,n){this._i.zr(e,n);const s=this.persistence.referenceDelegate,i=[];return s&&e.forEach((o=>{i.push(s.markPotentiallyOrphaned(t,o))})),m.waitFor(i)}removeMatchingKeysForTargetId(t,e){return this._i.jr(e),m.resolve()}getMatchingKeysForTargetId(t,e){const n=this._i.Hr(e);return m.resolve(n)}containsKey(t,e){return m.resolve(this._i.containsKey(e))}}/**
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
 */class Ti{constructor(t,e){this.ui={},this.overlays={},this.ci=new He(0),this.li=!1,this.li=!0,this.hi=new Ja,this.referenceDelegate=t(this),this.Pi=new nu(this),this.indexManager=new Ba,this.remoteDocumentCache=(function(s){return new tu(s)})((n=>this.referenceDelegate.Ti(n))),this.serializer=new Ua(e),this.Ii=new Ya(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.li=!1,Promise.resolve()}get started(){return this.li}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let e=this.overlays[t.toKey()];return e||(e=new Xa,this.overlays[t.toKey()]=e),e}getMutationQueue(t,e){let n=this.ui[t.toKey()];return n||(n=new Za(e,this.referenceDelegate),this.ui[t.toKey()]=n),n}getGlobalsCache(){return this.hi}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ii}runTransaction(t,e,n){g("MemoryPersistence","Starting transaction:",t);const s=new ru(this.ci.next());return this.referenceDelegate.Ei(),n(s).next((i=>this.referenceDelegate.di(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}Ai(t,e){return m.or(Object.values(this.ui).map((n=>()=>n.containsKey(t,e))))}}class ru extends ko{constructor(t){super(),this.currentSequenceNumber=t}}class Wn{constructor(t){this.persistence=t,this.Ri=new Kn,this.Vi=null}static mi(t){return new Wn(t)}get fi(){if(this.Vi)return this.Vi;throw I(60996)}addReference(t,e,n){return this.Ri.addReference(n,e),this.fi.delete(n.toString()),m.resolve()}removeReference(t,e,n){return this.Ri.removeReference(n,e),this.fi.add(n.toString()),m.resolve()}markPotentiallyOrphaned(t,e){return this.fi.add(e.toString()),m.resolve()}removeTarget(t,e){this.Ri.jr(e.targetId).forEach((s=>this.fi.add(s.toString())));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(t,e.targetId).next((s=>{s.forEach((i=>this.fi.add(i.toString())))})).next((()=>n.removeTargetData(t,e)))}Ei(){this.Vi=new Set}di(t){const e=this.persistence.getRemoteDocumentCache().newChangeBuffer();return m.forEach(this.fi,(n=>{const s=y.fromPath(n);return this.gi(t,s).next((i=>{i||e.removeEntry(s,A.min())}))})).next((()=>(this.Vi=null,e.apply(t))))}updateLimboDocument(t,e){return this.gi(t,e).next((n=>{n?this.fi.delete(e.toString()):this.fi.add(e.toString())}))}Ti(t){return 0}gi(t,e){return m.or([()=>m.resolve(this.Ri.containsKey(e)),()=>this.persistence.getTargetCache().containsKey(t,e),()=>this.persistence.Ai(t,e)])}}class $e{constructor(t,e){this.persistence=t,this.pi=new Nt((n=>Oo(n.path)),((n,s)=>n.isEqual(s))),this.garbageCollector=ja(this,e)}static mi(t,e){return new $e(t,e)}Ei(){}di(t){return m.resolve()}forEachTarget(t,e){return this.persistence.getTargetCache().forEachTarget(t,e)}gr(t){const e=this.wr(t);return this.persistence.getTargetCache().getTargetCount(t).next((n=>e.next((s=>n+s))))}wr(t){let e=0;return this.pr(t,(n=>{e++})).next((()=>e))}pr(t,e){return m.forEach(this.pi,((n,s)=>this.br(t,n,s).next((i=>i?m.resolve():e(s)))))}removeTargets(t,e,n){return this.persistence.getTargetCache().removeTargets(t,e,n)}removeOrphanedDocuments(t,e){let n=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.ii(t,(o=>this.br(t,o,e).next((a=>{a||(n++,i.removeEntry(o,A.min()))})))).next((()=>i.apply(t))).next((()=>n))}markPotentiallyOrphaned(t,e){return this.pi.set(e,t.currentSequenceNumber),m.resolve()}removeTarget(t,e){const n=e.withSequenceNumber(t.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(t,n)}addReference(t,e,n){return this.pi.set(n,t.currentSequenceNumber),m.resolve()}removeReference(t,e,n){return this.pi.set(n,t.currentSequenceNumber),m.resolve()}updateLimboDocument(t,e){return this.pi.set(e,t.currentSequenceNumber),m.resolve()}Ti(t){let e=t.key.toString().length;return t.isFoundDocument()&&(e+=De(t.data.value)),e}br(t,e,n){return m.or([()=>this.persistence.Ai(t,e),()=>this.persistence.getTargetCache().containsKey(t,e),()=>{const s=this.pi.get(e);return m.resolve(s!==void 0&&s>n)}])}getCacheSize(t){return this.persistence.getRemoteDocumentCache().getSize(t)}}/**
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
 */class Hn{constructor(t,e,n,s){this.targetId=t,this.fromCache=e,this.Es=n,this.ds=s}static As(t,e){let n=V(),s=V();for(const i of e.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new Hn(t,e.fromCache,n,s)}}/**
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
 */class su{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}/**
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
 */class iu{constructor(){this.Rs=!1,this.Vs=!1,this.fs=100,this.gs=(function(){return co()?8:xo(lo())>0?6:4})()}initialize(t,e){this.ps=t,this.indexManager=e,this.Rs=!0}getDocumentsMatchingQuery(t,e,n,s){const i={result:null};return this.ys(t,e).next((o=>{i.result=o})).next((()=>{if(!i.result)return this.ws(t,e,s,n).next((o=>{i.result=o}))})).next((()=>{if(i.result)return;const o=new su;return this.Ss(t,e,o).next((a=>{if(i.result=a,this.Vs)return this.bs(t,e,o,a.size)}))})).next((()=>i.result))}bs(t,e,n,s){return n.documentReadCount<this.fs?(xt()<=lt.DEBUG&&g("QueryEngine","SDK will not create cache indexes for query:",Mt(e),"since it only creates cache indexes for collection contains","more than or equal to",this.fs,"documents"),m.resolve()):(xt()<=lt.DEBUG&&g("QueryEngine","Query:",Mt(e),"scans",n.documentReadCount,"local documents and returns",s,"documents as results."),n.documentReadCount>this.gs*s?(xt()<=lt.DEBUG&&g("QueryEngine","The SDK decides to create cache indexes for query:",Mt(e),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,st(e))):m.resolve())}ys(t,e){if(Kr(e))return m.resolve(null);let n=st(e);return this.indexManager.getIndexType(t,n).next((s=>s===0?null:(e.limit!==null&&s===1&&(e=Be(e,null,"F"),n=st(e)),this.indexManager.getDocumentsMatchingTarget(t,n).next((i=>{const o=V(...i);return this.ps.getDocuments(t,o).next((a=>this.indexManager.getMinOffset(t,n).next((u=>{const c=this.Ds(e,a);return this.Cs(e,c,o,u.readTime)?this.ys(t,Be(e,null,"F")):this.vs(t,c,e,u)}))))})))))}ws(t,e,n,s){return Kr(e)||s.isEqual(A.min())?m.resolve(null):this.ps.getDocuments(t,n).next((i=>{const o=this.Ds(e,i);return this.Cs(e,o,n,s)?m.resolve(null):(xt()<=lt.DEBUG&&g("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Mt(e)),this.vs(t,o,e,Co(s,oe)).next((a=>a)))}))}Ds(t,e){let n=new U(Hs(t));return e.forEach(((s,i)=>{en(t,i)&&(n=n.add(i))})),n}Cs(t,e,n,s){if(t.limit===null)return!1;if(n.size!==e.size)return!0;const i=t.limitType==="F"?e.last():e.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Ss(t,e,n){return xt()<=lt.DEBUG&&g("QueryEngine","Using full collection scan to execute query:",Mt(e)),this.ps.getDocumentsMatchingQuery(t,e,pt.min(),n)}vs(t,e,n,s){return this.ps.getDocumentsMatchingQuery(t,n,s).next((i=>(e.forEach((o=>{i=i.insert(o.key,o)})),i)))}}/**
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
 */const Yn="LocalStore",ou=3e8;class au{constructor(t,e,n,s){this.persistence=t,this.Fs=e,this.serializer=s,this.Ms=new D(R),this.xs=new Nt((i=>qn(i)),Bn),this.Os=new Map,this.Ns=t.getRemoteDocumentCache(),this.Pi=t.getTargetCache(),this.Ii=t.getBundleCache(),this.Bs(n)}Bs(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new Ha(this.Ns,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ns.setIndexManager(this.indexManager),this.Fs.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(e=>t.collect(e,this.Ms)))}}function uu(r,t,e,n){return new au(r,t,e,n)}async function Ii(r,t){const e=v(r);return await e.persistence.runTransaction("Handle user change","readonly",(n=>{let s;return e.mutationQueue.getAllMutationBatches(n).next((i=>(s=i,e.Bs(t),e.mutationQueue.getAllMutationBatches(n)))).next((i=>{const o=[],a=[];let u=V();for(const c of s){o.push(c.batchId);for(const l of c.mutations)u=u.add(l.key)}for(const c of i){a.push(c.batchId);for(const l of c.mutations)u=u.add(l.key)}return e.localDocuments.getDocuments(n,u).next((c=>({Ls:c,removedBatchIds:o,addedBatchIds:a})))}))}))}function cu(r,t){const e=v(r);return e.persistence.runTransaction("Acknowledge batch","readwrite-primary",(n=>{const s=t.batch.keys(),i=e.Ns.newChangeBuffer({trackRemovals:!0});return(function(a,u,c,l){const h=c.batch,f=h.keys();let _=m.resolve();return f.forEach((T=>{_=_.next((()=>l.getEntry(u,T))).next((w=>{const E=c.docVersions.get(T);S(E!==null,48541),w.version.compareTo(E)<0&&(h.applyToRemoteDocument(w,c),w.isValidDocument()&&(w.setReadTime(c.commitVersion),l.addEntry(w)))}))})),_.next((()=>a.mutationQueue.removeMutationBatch(u,h)))})(e,n,t,i).next((()=>i.apply(n))).next((()=>e.mutationQueue.performConsistencyCheck(n))).next((()=>e.documentOverlayCache.removeOverlaysForBatchId(n,s,t.batch.batchId))).next((()=>e.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,(function(a){let u=V();for(let c=0;c<a.mutationResults.length;++c)a.mutationResults[c].transformResults.length>0&&(u=u.add(a.batch.mutations[c].key));return u})(t)))).next((()=>e.localDocuments.getDocuments(n,s)))}))}function Ai(r){const t=v(r);return t.persistence.runTransaction("Get last remote snapshot version","readonly",(e=>t.Pi.getLastRemoteSnapshotVersion(e)))}function lu(r,t){const e=v(r),n=t.snapshotVersion;let s=e.Ms;return e.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const o=e.Ns.newChangeBuffer({trackRemovals:!0});s=e.Ms;const a=[];t.targetChanges.forEach(((l,h)=>{const f=s.get(h);if(!f)return;a.push(e.Pi.removeMatchingKeys(i,l.removedDocuments,h).next((()=>e.Pi.addMatchingKeys(i,l.addedDocuments,h))));let _=f.withSequenceNumber(i.currentSequenceNumber);t.targetMismatches.get(h)!==null?_=_.withResumeToken(G.EMPTY_BYTE_STRING,A.min()).withLastLimboFreeSnapshotVersion(A.min()):l.resumeToken.approximateByteSize()>0&&(_=_.withResumeToken(l.resumeToken,n)),s=s.insert(h,_),(function(w,E,N){return w.resumeToken.approximateByteSize()===0||E.snapshotVersion.toMicroseconds()-w.snapshotVersion.toMicroseconds()>=ou?!0:N.addedDocuments.size+N.modifiedDocuments.size+N.removedDocuments.size>0})(f,_,l)&&a.push(e.Pi.updateTargetData(i,_))}));let u=ft(),c=V();if(t.documentUpdates.forEach((l=>{t.resolvedLimboDocuments.has(l)&&a.push(e.persistence.referenceDelegate.updateLimboDocument(i,l))})),a.push(hu(i,o,t.documentUpdates).next((l=>{u=l.ks,c=l.qs}))),!n.isEqual(A.min())){const l=e.Pi.getLastRemoteSnapshotVersion(i).next((h=>e.Pi.setTargetsMetadata(i,i.currentSequenceNumber,n)));a.push(l)}return m.waitFor(a).next((()=>o.apply(i))).next((()=>e.localDocuments.getLocalViewOfDocuments(i,u,c))).next((()=>u))})).then((i=>(e.Ms=s,i)))}function hu(r,t,e){let n=V(),s=V();return e.forEach((i=>n=n.add(i))),t.getEntries(r,n).next((i=>{let o=ft();return e.forEach(((a,u)=>{const c=i.get(a);u.isFoundDocument()!==c.isFoundDocument()&&(s=s.add(a)),u.isNoDocument()&&u.version.isEqual(A.min())?(t.removeEntry(a,u.readTime),o=o.insert(a,u)):!c.isValidDocument()||u.version.compareTo(c.version)>0||u.version.compareTo(c.version)===0&&c.hasPendingWrites?(t.addEntry(u),o=o.insert(a,u)):g(Yn,"Ignoring outdated watch update for ",a,". Current version:",c.version," Watch version:",u.version)})),{ks:o,qs:s}}))}function du(r,t){const e=v(r);return e.persistence.runTransaction("Get next mutation batch","readonly",(n=>(t===void 0&&(t=Fn),e.mutationQueue.getNextMutationBatchAfterBatchId(n,t))))}function fu(r,t){const e=v(r);return e.persistence.runTransaction("Allocate target","readwrite",(n=>{let s;return e.Pi.getTargetData(n,t).next((i=>i?(s=i,m.resolve(s)):e.Pi.allocateTargetId(n).next((o=>(s=new mt(t,o,"TargetPurposeListen",n.currentSequenceNumber),e.Pi.addTargetData(n,s).next((()=>s)))))))})).then((n=>{const s=e.Ms.get(n.targetId);return(s===null||n.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(e.Ms=e.Ms.insert(n.targetId,n),e.xs.set(t,n.targetId)),n}))}async function bn(r,t,e){const n=v(r),s=n.Ms.get(t),i=e?"readwrite":"readwrite-primary";try{e||await n.persistence.runTransaction("Release target",i,(o=>n.persistence.referenceDelegate.removeTarget(o,s)))}catch(o){if(!Wt(o))throw o;g(Yn,`Failed to update sequence numbers for target ${t}: ${o}`)}n.Ms=n.Ms.remove(t),n.xs.delete(s.target)}function os(r,t,e){const n=v(r);let s=A.min(),i=V();return n.persistence.runTransaction("Execute query","readwrite",(o=>(function(u,c,l){const h=v(u),f=h.xs.get(l);return f!==void 0?m.resolve(h.Ms.get(f)):h.Pi.getTargetData(c,l)})(n,o,st(t)).next((a=>{if(a)return s=a.lastLimboFreeSnapshotVersion,n.Pi.getMatchingKeysForTargetId(o,a.targetId).next((u=>{i=u}))})).next((()=>n.Fs.getDocumentsMatchingQuery(o,t,e?s:A.min(),e?i:V()))).next((a=>(mu(n,ea(t),a),{documents:a,Qs:i})))))}function mu(r,t,e){let n=r.Os.get(t)||A.min();e.forEach(((s,i)=>{i.readTime.compareTo(n)>0&&(n=i.readTime)})),r.Os.set(t,n)}class as{constructor(){this.activeTargetIds=aa()}zs(t){this.activeTargetIds=this.activeTargetIds.add(t)}js(t){this.activeTargetIds=this.activeTargetIds.delete(t)}Gs(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class _u{constructor(){this.Mo=new as,this.xo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,e,n){}addLocalQueryTarget(t,e=!0){return e&&this.Mo.zs(t),this.xo[t]||"not-current"}updateQueryState(t,e,n){this.xo[t]=e}removeLocalQueryTarget(t){this.Mo.js(t)}isLocalQueryTarget(t){return this.Mo.activeTargetIds.has(t)}clearQueryState(t){delete this.xo[t]}getAllActiveQueryTargets(){return this.Mo.activeTargetIds}isActiveQueryTarget(t){return this.Mo.activeTargetIds.has(t)}start(){return this.Mo=new as,Promise.resolve()}handleUserChange(t,e,n){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}/**
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
 */class pu{Oo(t){}shutdown(){}}/**
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
 */const us="ConnectivityMonitor";class cs{constructor(){this.No=()=>this.Bo(),this.Lo=()=>this.ko(),this.qo=[],this.Qo()}Oo(t){this.qo.push(t)}shutdown(){window.removeEventListener("online",this.No),window.removeEventListener("offline",this.Lo)}Qo(){window.addEventListener("online",this.No),window.addEventListener("offline",this.Lo)}Bo(){g(us,"Network connectivity changed: AVAILABLE");for(const t of this.qo)t(0)}ko(){g(us,"Network connectivity changed: UNAVAILABLE");for(const t of this.qo)t(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
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
 */let Ne=null;function Nn(){return Ne===null?Ne=(function(){return 268435456+Math.round(2147483648*Math.random())})():Ne++,"0x"+Ne.toString(16)}/**
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
 */const pn="RestConnection",gu={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class yu{get $o(){return!1}constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const e=t.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Uo=e+"://"+t.host,this.Ko=`projects/${n}/databases/${s}`,this.Wo=this.databaseId.database===Fe?`project_id=${n}`:`project_id=${n}&database_id=${s}`}Go(t,e,n,s,i){const o=Nn(),a=this.zo(t,e.toUriEncodedString());g(pn,`Sending RPC '${t}' ${o}:`,a,n);const u={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Wo};this.jo(u,s,i);const{host:c}=new URL(a),l=Ps(c);return this.Jo(t,a,u,n,l).then((h=>(g(pn,`Received RPC '${t}' ${o}: `,h),h)),(h=>{throw ie(pn,`RPC '${t}' ${o} failed with error: `,h,"url: ",a,"request:",n),h}))}Ho(t,e,n,s,i,o){return this.Go(t,e,n,s,i)}jo(t,e,n){t["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+jt})(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),e&&e.headers.forEach(((s,i)=>t[i]=s)),n&&n.headers.forEach(((s,i)=>t[i]=s))}zo(t,e){const n=gu[t];return`${this.Uo}/v1/${e}:${n}`}terminate(){}}/**
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
 */class Eu{constructor(t){this.Yo=t.Yo,this.Zo=t.Zo}Xo(t){this.e_=t}t_(t){this.n_=t}r_(t){this.i_=t}onMessage(t){this.s_=t}close(){this.Zo()}send(t){this.Yo(t)}o_(){this.e_()}__(){this.n_()}a_(t){this.i_(t)}u_(t){this.s_(t)}}/**
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
 */const Q="WebChannelConnection";class Tu extends yu{constructor(t){super(t),this.c_=[],this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}Jo(t,e,n,s,i){const o=Nn();return new Promise(((a,u)=>{const c=new fo;c.setWithCredentials(!0),c.listenOnce(mo.COMPLETE,(()=>{try{switch(c.getLastErrorCode()){case fn.NO_ERROR:const h=c.getResponseJson();g(Q,`XHR for RPC '${t}' ${o} received:`,JSON.stringify(h)),a(h);break;case fn.TIMEOUT:g(Q,`RPC '${t}' ${o} timed out`),u(new p(d.DEADLINE_EXCEEDED,"Request time out"));break;case fn.HTTP_ERROR:const f=c.getStatus();if(g(Q,`RPC '${t}' ${o} failed with status:`,f,"response text:",c.getResponseText()),f>0){let _=c.getResponseJson();Array.isArray(_)&&(_=_[0]);const T=_?.error;if(T&&T.status&&T.message){const w=(function(N){const F=N.toLowerCase().replace(/_/g,"-");return Object.values(d).indexOf(F)>=0?F:d.UNKNOWN})(T.status);u(new p(w,T.message))}else u(new p(d.UNKNOWN,"Server responded with status "+c.getStatus()))}else u(new p(d.UNAVAILABLE,"Connection failed."));break;default:I(9055,{l_:t,streamId:o,h_:c.getLastErrorCode(),P_:c.getLastError()})}}finally{g(Q,`RPC '${t}' ${o} completed.`)}}));const l=JSON.stringify(s);g(Q,`RPC '${t}' ${o} sending request:`,s),c.send(e,"POST",l,n,15)}))}T_(t,e,n){const s=Nn(),i=[this.Uo,"/","google.firestore.v1.Firestore","/",t,"/channel"],o=_o(),a=po(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;c!==void 0&&(u.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(u.useFetchStreams=!0),this.jo(u.initMessageHeaders,e,n),u.encodeInitMessageHeaders=!0;const l=i.join("");g(Q,`Creating RPC '${t}' stream ${s}: ${l}`,u);const h=o.createWebChannel(l,u);this.I_(h);let f=!1,_=!1;const T=new Eu({Yo:E=>{_?g(Q,`Not sending because RPC '${t}' stream ${s} is closed:`,E):(f||(g(Q,`Opening RPC '${t}' stream ${s} transport.`),h.open(),f=!0),g(Q,`RPC '${t}' stream ${s} sending:`,E),h.send(E))},Zo:()=>h.close()}),w=(E,N,F)=>{E.listen(N,(B=>{try{F(B)}catch(kt){setTimeout((()=>{throw kt}),0)}}))};return w(h,Pe.EventType.OPEN,(()=>{_||(g(Q,`RPC '${t}' stream ${s} transport opened.`),T.o_())})),w(h,Pe.EventType.CLOSE,(()=>{_||(_=!0,g(Q,`RPC '${t}' stream ${s} transport closed`),T.a_(),this.E_(h))})),w(h,Pe.EventType.ERROR,(E=>{_||(_=!0,ie(Q,`RPC '${t}' stream ${s} transport errored. Name:`,E.name,"Message:",E.message),T.a_(new p(d.UNAVAILABLE,"The operation could not be completed")))})),w(h,Pe.EventType.MESSAGE,(E=>{if(!_){const N=E.data[0];S(!!N,16349);const F=N,B=F?.error||F[0]?.error;if(B){g(Q,`RPC '${t}' stream ${s} received error:`,B);const kt=B.status;let Xt=(function(Zi){const Vr=M[Zi];if(Vr!==void 0)return ui(Vr)})(kt),Jt=B.message;Xt===void 0&&(Xt=d.INTERNAL,Jt="Unknown error status: "+kt+" with message "+B.message),_=!0,T.a_(new p(Xt,Jt)),h.close()}else g(Q,`RPC '${t}' stream ${s} received:`,N),T.u_(N)}})),w(a,go.STAT_EVENT,(E=>{E.stat===Sr.PROXY?g(Q,`RPC '${t}' stream ${s} detected buffering proxy`):E.stat===Sr.NOPROXY&&g(Q,`RPC '${t}' stream ${s} detected no buffering proxy`)})),setTimeout((()=>{T.__()}),0),T}terminate(){this.c_.forEach((t=>t.close())),this.c_=[]}I_(t){this.c_.push(t)}E_(t){this.c_=this.c_.filter((e=>e===t))}}function gn(){return typeof document<"u"?document:null}/**
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
 */function an(r){return new Ra(r,!0)}/**
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
 */class wi{constructor(t,e,n=1e3,s=1.5,i=6e4){this.Mi=t,this.timerId=e,this.d_=n,this.A_=s,this.R_=i,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(t){this.cancel();const e=Math.floor(this.V_+this.y_()),n=Math.max(0,Date.now()-this.f_),s=Math.max(0,e-n);s>0&&g("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.V_} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,s,(()=>(this.f_=Date.now(),t()))),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}/**
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
 */const ls="PersistentStream";class vi{constructor(t,e,n,s,i,o,a,u){this.Mi=t,this.S_=n,this.b_=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=a,this.listener=u,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new wi(t,e)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Mi.enqueueAfterDelay(this.S_,6e4,(()=>this.k_())))}q_(t){this.Q_(),this.stream.send(t)}async k_(){if(this.O_())return this.close(0)}Q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(t,e){this.Q_(),this.U_(),this.M_.cancel(),this.D_++,t!==4?this.M_.reset():e&&e.code===d.RESOURCE_EXHAUSTED?(dt(e.toString()),dt("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):e&&e.code===d.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.K_(),this.stream.close(),this.stream=null),this.state=t,await this.listener.r_(e)}K_(){}auth(){this.state=1;const t=this.W_(this.D_),e=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([n,s])=>{this.D_===e&&this.G_(n,s)}),(n=>{t((()=>{const s=new p(d.UNKNOWN,"Fetching auth token failed: "+n.message);return this.z_(s)}))}))}G_(t,e){const n=this.W_(this.D_);this.stream=this.j_(t,e),this.stream.Xo((()=>{n((()=>this.listener.Xo()))})),this.stream.t_((()=>{n((()=>(this.state=2,this.v_=this.Mi.enqueueAfterDelay(this.b_,1e4,(()=>(this.O_()&&(this.state=3),Promise.resolve()))),this.listener.t_())))})),this.stream.r_((s=>{n((()=>this.z_(s)))})),this.stream.onMessage((s=>{n((()=>++this.F_==1?this.J_(s):this.onNext(s)))}))}N_(){this.state=5,this.M_.p_((async()=>{this.state=0,this.start()}))}z_(t){return g(ls,`close with error: ${t}`),this.stream=null,this.close(4,t)}W_(t){return e=>{this.Mi.enqueueAndForget((()=>this.D_===t?e():(g(ls,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class Iu extends vi{constructor(t,e,n,s,i,o){super(t,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",e,n,s,o),this.serializer=i}j_(t,e){return this.connection.T_("Listen",t,e)}J_(t){return this.onNext(t)}onNext(t){this.M_.reset();const e=Sa(this.serializer,t),n=(function(i){if(!("targetChange"in i))return A.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?A.min():o.readTime?it(o.readTime):A.min()})(t);return this.listener.H_(e,n)}Y_(t){const e={};e.database=Cn(this.serializer),e.addTarget=(function(i,o){let a;const u=o.target;if(a=vn(u)?{documents:Na(i,u)}:{query:Da(i,u).ft},a.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){a.resumeToken=hi(i,o.resumeToken);const c=Vn(i,o.expectedCount);c!==null&&(a.expectedCount=c)}else if(o.snapshotVersion.compareTo(A.min())>0){a.readTime=ze(i,o.snapshotVersion.toTimestamp());const c=Vn(i,o.expectedCount);c!==null&&(a.expectedCount=c)}return a})(this.serializer,t);const n=xa(this.serializer,t);n&&(e.labels=n),this.q_(e)}Z_(t){const e={};e.database=Cn(this.serializer),e.removeTarget=t,this.q_(e)}}class Au extends vi{constructor(t,e,n,s,i,o){super(t,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",e,n,s,o),this.serializer=i}get X_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}K_(){this.X_&&this.ea([])}j_(t,e){return this.connection.T_("Write",t,e)}J_(t){return S(!!t.streamToken,31322),this.lastStreamToken=t.streamToken,S(!t.writeResults||t.writeResults.length===0,55816),this.listener.ta()}onNext(t){S(!!t.streamToken,12678),this.lastStreamToken=t.streamToken,this.M_.reset();const e=ba(t.writeResults,t.commitTime),n=it(t.commitTime);return this.listener.na(n,e)}ra(){const t={};t.database=Cn(this.serializer),this.q_(t)}ea(t){const e={streamToken:this.lastStreamToken,writes:t.map((n=>Ca(this.serializer,n)))};this.q_(e)}}/**
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
 */class wu{}class vu extends wu{constructor(t,e,n,s){super(),this.authCredentials=t,this.appCheckCredentials=e,this.connection=n,this.serializer=s,this.ia=!1}sa(){if(this.ia)throw new p(d.FAILED_PRECONDITION,"The client has already been terminated.")}Go(t,e,n,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.Go(t,Pn(e,n),s,i,o))).catch((i=>{throw i.name==="FirebaseError"?(i.code===d.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new p(d.UNKNOWN,i.toString())}))}Ho(t,e,n,s,i){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,a])=>this.connection.Ho(t,Pn(e,n),s,o,a,i))).catch((o=>{throw o.name==="FirebaseError"?(o.code===d.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new p(d.UNKNOWN,o.toString())}))}terminate(){this.ia=!0,this.connection.terminate()}}class Ru{constructor(t,e){this.asyncQueue=t,this.onlineStateHandler=e,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve()))))}ha(t){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.ca("Offline")))}set(t){this.Pa(),this.oa=0,t==="Online"&&(this.aa=!1),this.ca(t)}ca(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}la(t){const e=`Could not reach Cloud Firestore backend. ${t}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(dt(e),this.aa=!1):g("OnlineStateTracker",e)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
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
 */const bt="RemoteStore";class Vu{constructor(t,e,n,s,i){this.localStore=t,this.datastore=e,this.asyncQueue=n,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.da=[],this.Aa=i,this.Aa.Oo((o=>{n.enqueueAndForget((async()=>{Dt(this)&&(g(bt,"Restarting streams for network reachability change."),await(async function(u){const c=v(u);c.Ea.add(4),await ye(c),c.Ra.set("Unknown"),c.Ea.delete(4),await un(c)})(this))}))})),this.Ra=new Ru(n,s)}}async function un(r){if(Dt(r))for(const t of r.da)await t(!0)}async function ye(r){for(const t of r.da)await t(!1)}function Ri(r,t){const e=v(r);e.Ia.has(t.targetId)||(e.Ia.set(t.targetId,t),tr(e)?Zn(e):Ht(e).O_()&&Jn(e,t))}function Xn(r,t){const e=v(r),n=Ht(e);e.Ia.delete(t),n.O_()&&Vi(e,t),e.Ia.size===0&&(n.O_()?n.L_():Dt(e)&&e.Ra.set("Unknown"))}function Jn(r,t){if(r.Va.Ue(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(A.min())>0){const e=r.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(e)}Ht(r).Y_(t)}function Vi(r,t){r.Va.Ue(t),Ht(r).Z_(t)}function Zn(r){r.Va=new Ia({getRemoteKeysForTarget:t=>r.remoteSyncer.getRemoteKeysForTarget(t),At:t=>r.Ia.get(t)||null,ht:()=>r.datastore.serializer.databaseId}),Ht(r).start(),r.Ra.ua()}function tr(r){return Dt(r)&&!Ht(r).x_()&&r.Ia.size>0}function Dt(r){return v(r).Ea.size===0}function Pi(r){r.Va=void 0}async function Pu(r){r.Ra.set("Online")}async function Su(r){r.Ia.forEach(((t,e)=>{Jn(r,t)}))}async function Cu(r,t){Pi(r),tr(r)?(r.Ra.ha(t),Zn(r)):r.Ra.set("Unknown")}async function bu(r,t,e){if(r.Ra.set("Online"),t instanceof li&&t.state===2&&t.cause)try{await(async function(s,i){const o=i.cause;for(const a of i.targetIds)s.Ia.has(a)&&(await s.remoteSyncer.rejectListen(a,o),s.Ia.delete(a),s.Va.removeTarget(a))})(r,t)}catch(n){g(bt,"Failed to remove targets %s: %s ",t.targetIds.join(","),n),await Ge(r,n)}else if(t instanceof Me?r.Va.Ze(t):t instanceof ci?r.Va.st(t):r.Va.tt(t),!e.isEqual(A.min()))try{const n=await Ai(r.localStore);e.compareTo(n)>=0&&await(function(i,o){const a=i.Va.Tt(o);return a.targetChanges.forEach(((u,c)=>{if(u.resumeToken.approximateByteSize()>0){const l=i.Ia.get(c);l&&i.Ia.set(c,l.withResumeToken(u.resumeToken,o))}})),a.targetMismatches.forEach(((u,c)=>{const l=i.Ia.get(u);if(!l)return;i.Ia.set(u,l.withResumeToken(G.EMPTY_BYTE_STRING,l.snapshotVersion)),Vi(i,u);const h=new mt(l.target,u,c,l.sequenceNumber);Jn(i,h)})),i.remoteSyncer.applyRemoteEvent(a)})(r,e)}catch(n){g(bt,"Failed to raise snapshot:",n),await Ge(r,n)}}async function Ge(r,t,e){if(!Wt(t))throw t;r.Ea.add(1),await ye(r),r.Ra.set("Offline"),e||(e=()=>Ai(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{g(bt,"Retrying IndexedDB access"),await e(),r.Ea.delete(1),await un(r)}))}function Si(r,t){return t().catch((e=>Ge(r,e,t)))}async function cn(r){const t=v(r),e=Tt(t);let n=t.Ta.length>0?t.Ta[t.Ta.length-1].batchId:Fn;for(;Nu(t);)try{const s=await du(t.localStore,n);if(s===null){t.Ta.length===0&&e.L_();break}n=s.batchId,Du(t,s)}catch(s){await Ge(t,s)}Ci(t)&&bi(t)}function Nu(r){return Dt(r)&&r.Ta.length<10}function Du(r,t){r.Ta.push(t);const e=Tt(r);e.O_()&&e.X_&&e.ea(t.mutations)}function Ci(r){return Dt(r)&&!Tt(r).x_()&&r.Ta.length>0}function bi(r){Tt(r).start()}async function ku(r){Tt(r).ra()}async function xu(r){const t=Tt(r);for(const e of r.Ta)t.ea(e.mutations)}async function Mu(r,t,e){const n=r.Ta.shift(),s=Gn.from(n,t,e);await Si(r,(()=>r.remoteSyncer.applySuccessfulWrite(s))),await cn(r)}async function Ou(r,t){t&&Tt(r).X_&&await(async function(n,s){if((function(o){return ya(o)&&o!==d.ABORTED})(s.code)){const i=n.Ta.shift();Tt(n).B_(),await Si(n,(()=>n.remoteSyncer.rejectFailedWrite(i.batchId,s))),await cn(n)}})(r,t),Ci(r)&&bi(r)}async function hs(r,t){const e=v(r);e.asyncQueue.verifyOperationInProgress(),g(bt,"RemoteStore received new credentials");const n=Dt(e);e.Ea.add(3),await ye(e),n&&e.Ra.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.Ea.delete(3),await un(e)}async function Lu(r,t){const e=v(r);t?(e.Ea.delete(2),await un(e)):t||(e.Ea.add(2),await ye(e),e.Ra.set("Unknown"))}function Ht(r){return r.ma||(r.ma=(function(e,n,s){const i=v(e);return i.sa(),new Iu(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Xo:Pu.bind(null,r),t_:Su.bind(null,r),r_:Cu.bind(null,r),H_:bu.bind(null,r)}),r.da.push((async t=>{t?(r.ma.B_(),tr(r)?Zn(r):r.Ra.set("Unknown")):(await r.ma.stop(),Pi(r))}))),r.ma}function Tt(r){return r.fa||(r.fa=(function(e,n,s){const i=v(e);return i.sa(),new Au(n,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(r.datastore,r.asyncQueue,{Xo:()=>Promise.resolve(),t_:ku.bind(null,r),r_:Ou.bind(null,r),ta:xu.bind(null,r),na:Mu.bind(null,r)}),r.da.push((async t=>{t?(r.fa.B_(),await cn(r)):(await r.fa.stop(),r.Ta.length>0&&(g(bt,`Stopping write stream with ${r.Ta.length} pending writes`),r.Ta=[]))}))),r.fa}/**
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
 */class er{constructor(t,e,n,s,i){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=n,this.op=s,this.removalCallback=i,this.deferred=new ht,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(t,e,n,s,i){const o=Date.now()+n,a=new er(t,e,o,s,i);return a.start(n),a}start(t){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new p(d.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((t=>this.deferred.resolve(t)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function nr(r,t){if(dt("AsyncQueue",`${t}: ${r}`),Wt(r))return new p(d.UNAVAILABLE,`${t}: ${r}`);throw r}/**
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
 */class Ut{static emptySet(t){return new Ut(t.comparator)}constructor(t){this.comparator=t?(e,n)=>t(e,n)||y.comparator(e.key,n.key):(e,n)=>y.comparator(e.key,n.key),this.keyedMap=Zt(),this.sortedSet=new D(this.comparator)}has(t){return this.keyedMap.get(t)!=null}get(t){return this.keyedMap.get(t)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(t){const e=this.keyedMap.get(t);return e?this.sortedSet.indexOf(e):-1}get size(){return this.sortedSet.size}forEach(t){this.sortedSet.inorderTraversal(((e,n)=>(t(e),!1)))}add(t){const e=this.delete(t.key);return e.copy(e.keyedMap.insert(t.key,t),e.sortedSet.insert(t,null))}delete(t){const e=this.get(t);return e?this.copy(this.keyedMap.remove(t),this.sortedSet.remove(e)):this}isEqual(t){if(!(t instanceof Ut)||this.size!==t.size)return!1;const e=this.sortedSet.getIterator(),n=t.sortedSet.getIterator();for(;e.hasNext();){const s=e.getNext().key,i=n.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const t=[];return this.forEach((e=>{t.push(e.toString())})),t.length===0?"DocumentSet ()":`DocumentSet (
  `+t.join(`  
`)+`
)`}copy(t,e){const n=new Ut;return n.comparator=this.comparator,n.keyedMap=t,n.sortedSet=e,n}}/**
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
 */class ds{constructor(){this.ga=new D(y.comparator)}track(t){const e=t.doc.key,n=this.ga.get(e);n?t.type!==0&&n.type===3?this.ga=this.ga.insert(e,t):t.type===3&&n.type!==1?this.ga=this.ga.insert(e,{type:n.type,doc:t.doc}):t.type===2&&n.type===2?this.ga=this.ga.insert(e,{type:2,doc:t.doc}):t.type===2&&n.type===0?this.ga=this.ga.insert(e,{type:0,doc:t.doc}):t.type===1&&n.type===0?this.ga=this.ga.remove(e):t.type===1&&n.type===2?this.ga=this.ga.insert(e,{type:1,doc:n.doc}):t.type===0&&n.type===1?this.ga=this.ga.insert(e,{type:2,doc:t.doc}):I(63341,{Rt:t,pa:n}):this.ga=this.ga.insert(e,t)}ya(){const t=[];return this.ga.inorderTraversal(((e,n)=>{t.push(n)})),t}}class Qt{constructor(t,e,n,s,i,o,a,u,c){this.query=t,this.docs=e,this.oldDocs=n,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=a,this.excludesMetadataChanges=u,this.hasCachedResults=c}static fromInitialDocuments(t,e,n,s,i){const o=[];return e.forEach((a=>{o.push({type:0,doc:a})})),new Qt(t,e,Ut.emptySet(e),o,n,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(t){if(!(this.fromCache===t.fromCache&&this.hasCachedResults===t.hasCachedResults&&this.syncStateChanged===t.syncStateChanged&&this.mutatedKeys.isEqual(t.mutatedKeys)&&tn(this.query,t.query)&&this.docs.isEqual(t.docs)&&this.oldDocs.isEqual(t.oldDocs)))return!1;const e=this.docChanges,n=t.docChanges;if(e.length!==n.length)return!1;for(let s=0;s<e.length;s++)if(e[s].type!==n[s].type||!e[s].doc.isEqual(n[s].doc))return!1;return!0}}/**
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
 */class Fu{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some((t=>t.Da()))}}class Uu{constructor(){this.queries=fs(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(e,n){const s=v(e),i=s.queries;s.queries=fs(),i.forEach(((o,a)=>{for(const u of a.Sa)u.onError(n)}))})(this,new p(d.ABORTED,"Firestore shutting down"))}}function fs(){return new Nt((r=>Ws(r)),tn)}async function rr(r,t){const e=v(r);let n=3;const s=t.query;let i=e.queries.get(s);i?!i.ba()&&t.Da()&&(n=2):(i=new Fu,n=t.Da()?0:1);try{switch(n){case 0:i.wa=await e.onListen(s,!0);break;case 1:i.wa=await e.onListen(s,!1);break;case 2:await e.onFirstRemoteStoreListen(s)}}catch(o){const a=nr(o,`Initialization of query '${Mt(t.query)}' failed`);return void t.onError(a)}e.queries.set(s,i),i.Sa.push(t),t.va(e.onlineState),i.wa&&t.Fa(i.wa)&&ir(e)}async function sr(r,t){const e=v(r),n=t.query;let s=3;const i=e.queries.get(n);if(i){const o=i.Sa.indexOf(t);o>=0&&(i.Sa.splice(o,1),i.Sa.length===0?s=t.Da()?0:1:!i.ba()&&t.Da()&&(s=2))}switch(s){case 0:return e.queries.delete(n),e.onUnlisten(n,!0);case 1:return e.queries.delete(n),e.onUnlisten(n,!1);case 2:return e.onLastRemoteStoreUnlisten(n);default:return}}function qu(r,t){const e=v(r);let n=!1;for(const s of t){const i=s.query,o=e.queries.get(i);if(o){for(const a of o.Sa)a.Fa(s)&&(n=!0);o.wa=s}}n&&ir(e)}function Bu(r,t,e){const n=v(r),s=n.queries.get(t);if(s)for(const i of s.Sa)i.onError(e);n.queries.delete(t)}function ir(r){r.Ca.forEach((t=>{t.next()}))}var Dn,ms;(ms=Dn||(Dn={})).Ma="default",ms.Cache="cache";class or{constructor(t,e,n){this.query=t,this.xa=e,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=n||{}}Fa(t){if(!this.options.includeMetadataChanges){const n=[];for(const s of t.docChanges)s.type!==3&&n.push(s);t=new Qt(t.query,t.docs,t.oldDocs,n,t.mutatedKeys,t.fromCache,t.syncStateChanged,!0,t.hasCachedResults)}let e=!1;return this.Oa?this.Ba(t)&&(this.xa.next(t),e=!0):this.La(t,this.onlineState)&&(this.ka(t),e=!0),this.Na=t,e}onError(t){this.xa.error(t)}va(t){this.onlineState=t;let e=!1;return this.Na&&!this.Oa&&this.La(this.Na,t)&&(this.ka(this.Na),e=!0),e}La(t,e){if(!t.fromCache||!this.Da())return!0;const n=e!=="Offline";return(!this.options.qa||!n)&&(!t.docs.isEmpty()||t.hasCachedResults||e==="Offline")}Ba(t){if(t.docChanges.length>0)return!0;const e=this.Na&&this.Na.hasPendingWrites!==t.hasPendingWrites;return!(!t.syncStateChanged&&!e)&&this.options.includeMetadataChanges===!0}ka(t){t=Qt.fromInitialDocuments(t.query,t.docs,t.mutatedKeys,t.fromCache,t.hasCachedResults),this.Oa=!0,this.xa.next(t)}Da(){return this.options.source!==Dn.Cache}}/**
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
 */class Ni{constructor(t){this.key=t}}class Di{constructor(t){this.key=t}}class zu{constructor(t,e){this.query=t,this.Ya=e,this.Za=null,this.hasCachedResults=!1,this.current=!1,this.Xa=V(),this.mutatedKeys=V(),this.eu=Hs(t),this.tu=new Ut(this.eu)}get nu(){return this.Ya}ru(t,e){const n=e?e.iu:new ds,s=e?e.tu:this.tu;let i=e?e.mutatedKeys:this.mutatedKeys,o=s,a=!1;const u=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,c=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(t.inorderTraversal(((l,h)=>{const f=s.get(l),_=en(this.query,h)?h:null,T=!!f&&this.mutatedKeys.has(f.key),w=!!_&&(_.hasLocalMutations||this.mutatedKeys.has(_.key)&&_.hasCommittedMutations);let E=!1;f&&_?f.data.isEqual(_.data)?T!==w&&(n.track({type:3,doc:_}),E=!0):this.su(f,_)||(n.track({type:2,doc:_}),E=!0,(u&&this.eu(_,u)>0||c&&this.eu(_,c)<0)&&(a=!0)):!f&&_?(n.track({type:0,doc:_}),E=!0):f&&!_&&(n.track({type:1,doc:f}),E=!0,(u||c)&&(a=!0)),E&&(_?(o=o.add(_),i=w?i.add(l):i.delete(l)):(o=o.delete(l),i=i.delete(l)))})),this.query.limit!==null)for(;o.size>this.query.limit;){const l=this.query.limitType==="F"?o.last():o.first();o=o.delete(l.key),i=i.delete(l.key),n.track({type:1,doc:l})}return{tu:o,iu:n,Cs:a,mutatedKeys:i}}su(t,e){return t.hasLocalMutations&&e.hasCommittedMutations&&!e.hasLocalMutations}applyChanges(t,e,n,s){const i=this.tu;this.tu=t.tu,this.mutatedKeys=t.mutatedKeys;const o=t.iu.ya();o.sort(((l,h)=>(function(_,T){const w=E=>{switch(E){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return I(20277,{Rt:E})}};return w(_)-w(T)})(l.type,h.type)||this.eu(l.doc,h.doc))),this.ou(n),s=s??!1;const a=e&&!s?this._u():[],u=this.Xa.size===0&&this.current&&!s?1:0,c=u!==this.Za;return this.Za=u,o.length!==0||c?{snapshot:new Qt(this.query,t.tu,i,o,t.mutatedKeys,u===0,c,!1,!!n&&n.resumeToken.approximateByteSize()>0),au:a}:{au:a}}va(t){return this.current&&t==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new ds,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{au:[]}}uu(t){return!this.Ya.has(t)&&!!this.tu.has(t)&&!this.tu.get(t).hasLocalMutations}ou(t){t&&(t.addedDocuments.forEach((e=>this.Ya=this.Ya.add(e))),t.modifiedDocuments.forEach((e=>{})),t.removedDocuments.forEach((e=>this.Ya=this.Ya.delete(e))),this.current=t.current)}_u(){if(!this.current)return[];const t=this.Xa;this.Xa=V(),this.tu.forEach((n=>{this.uu(n.key)&&(this.Xa=this.Xa.add(n.key))}));const e=[];return t.forEach((n=>{this.Xa.has(n)||e.push(new Di(n))})),this.Xa.forEach((n=>{t.has(n)||e.push(new Ni(n))})),e}cu(t){this.Ya=t.Qs,this.Xa=V();const e=this.ru(t.documents);return this.applyChanges(e,!0)}lu(){return Qt.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Za===0,this.hasCachedResults)}}const ar="SyncEngine";class $u{constructor(t,e,n){this.query=t,this.targetId=e,this.view=n}}class Gu{constructor(t){this.key=t,this.hu=!1}}class Qu{constructor(t,e,n,s,i,o){this.localStore=t,this.remoteStore=e,this.eventManager=n,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Pu={},this.Tu=new Nt((a=>Ws(a)),tn),this.Iu=new Map,this.Eu=new Set,this.du=new D(y.comparator),this.Au=new Map,this.Ru=new Kn,this.Vu={},this.mu=new Map,this.fu=Gt.cr(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function ju(r,t,e=!0){const n=Fi(r);let s;const i=n.Tu.get(t);return i?(n.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.lu()):s=await ki(n,t,e,!0),s}async function Ku(r,t){const e=Fi(r);await ki(e,t,!0,!1)}async function ki(r,t,e,n){const s=await fu(r.localStore,st(t)),i=s.targetId,o=r.sharedClientState.addLocalQueryTarget(i,e);let a;return n&&(a=await Wu(r,t,i,o==="current",s.resumeToken)),r.isPrimaryClient&&e&&Ri(r.remoteStore,s),a}async function Wu(r,t,e,n,s){r.pu=(h,f,_)=>(async function(w,E,N,F){let B=E.view.ru(N);B.Cs&&(B=await os(w.localStore,E.query,!1).then((({documents:Rr})=>E.view.ru(Rr,B))));const kt=F&&F.targetChanges.get(E.targetId),Xt=F&&F.targetMismatches.get(E.targetId)!=null,Jt=E.view.applyChanges(B,w.isPrimaryClient,kt,Xt);return ps(w,E.targetId,Jt.au),Jt.snapshot})(r,h,f,_);const i=await os(r.localStore,t,!0),o=new zu(t,i.Qs),a=o.ru(i.documents),u=ge.createSynthesizedTargetChangeForCurrentChange(e,n&&r.onlineState!=="Offline",s),c=o.applyChanges(a,r.isPrimaryClient,u);ps(r,e,c.au);const l=new $u(t,e,o);return r.Tu.set(t,l),r.Iu.has(e)?r.Iu.get(e).push(t):r.Iu.set(e,[t]),c.snapshot}async function Hu(r,t,e){const n=v(r),s=n.Tu.get(t),i=n.Iu.get(s.targetId);if(i.length>1)return n.Iu.set(s.targetId,i.filter((o=>!tn(o,t)))),void n.Tu.delete(t);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(s.targetId),n.sharedClientState.isActiveQueryTarget(s.targetId)||await bn(n.localStore,s.targetId,!1).then((()=>{n.sharedClientState.clearQueryState(s.targetId),e&&Xn(n.remoteStore,s.targetId),kn(n,s.targetId)})).catch(Kt)):(kn(n,s.targetId),await bn(n.localStore,s.targetId,!0))}async function Yu(r,t){const e=v(r),n=e.Tu.get(t),s=e.Iu.get(n.targetId);e.isPrimaryClient&&s.length===1&&(e.sharedClientState.removeLocalQueryTarget(n.targetId),Xn(e.remoteStore,n.targetId))}async function Xu(r,t,e){const n=sc(r);try{const s=await(function(o,a){const u=v(o),c=b.now(),l=a.reduce(((_,T)=>_.add(T.key)),V());let h,f;return u.persistence.runTransaction("Locally write mutations","readwrite",(_=>{let T=ft(),w=V();return u.Ns.getEntries(_,l).next((E=>{T=E,T.forEach(((N,F)=>{F.isValidDocument()||(w=w.add(N))}))})).next((()=>u.localDocuments.getOverlayedDocuments(_,T))).next((E=>{h=E;const N=[];for(const F of a){const B=fa(F,h.get(F.key).overlayedDocument);B!=null&&N.push(new vt(F.key,B,Bs(B.value.mapValue),K.exists(!0)))}return u.mutationQueue.addMutationBatch(_,c,N,a)})).next((E=>{f=E;const N=E.applyToLocalDocumentSet(h,w);return u.documentOverlayCache.saveOverlays(_,E.batchId,N)}))})).then((()=>({batchId:f.batchId,changes:Xs(h)})))})(n.localStore,t);n.sharedClientState.addPendingMutation(s.batchId),(function(o,a,u){let c=o.Vu[o.currentUser.toKey()];c||(c=new D(R)),c=c.insert(a,u),o.Vu[o.currentUser.toKey()]=c})(n,s.batchId,e),await Ee(n,s.changes),await cn(n.remoteStore)}catch(s){const i=nr(s,"Failed to persist write");e.reject(i)}}async function xi(r,t){const e=v(r);try{const n=await lu(e.localStore,t);t.targetChanges.forEach(((s,i)=>{const o=e.Au.get(i);o&&(S(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.hu=!0:s.modifiedDocuments.size>0?S(o.hu,14607):s.removedDocuments.size>0&&(S(o.hu,42227),o.hu=!1))})),await Ee(e,n,t)}catch(n){await Kt(n)}}function _s(r,t,e){const n=v(r);if(n.isPrimaryClient&&e===0||!n.isPrimaryClient&&e===1){const s=[];n.Tu.forEach(((i,o)=>{const a=o.view.va(t);a.snapshot&&s.push(a.snapshot)})),(function(o,a){const u=v(o);u.onlineState=a;let c=!1;u.queries.forEach(((l,h)=>{for(const f of h.Sa)f.va(a)&&(c=!0)})),c&&ir(u)})(n.eventManager,t),s.length&&n.Pu.H_(s),n.onlineState=t,n.isPrimaryClient&&n.sharedClientState.setOnlineState(t)}}async function Ju(r,t,e){const n=v(r);n.sharedClientState.updateQueryState(t,"rejected",e);const s=n.Au.get(t),i=s&&s.key;if(i){let o=new D(y.comparator);o=o.insert(i,j.newNoDocument(i,A.min()));const a=V().add(i),u=new on(A.min(),new Map,new D(R),o,a);await xi(n,u),n.du=n.du.remove(i),n.Au.delete(t),ur(n)}else await bn(n.localStore,t,!1).then((()=>kn(n,t,e))).catch(Kt)}async function Zu(r,t){const e=v(r),n=t.batch.batchId;try{const s=await cu(e.localStore,t);Oi(e,n,null),Mi(e,n),e.sharedClientState.updateMutationState(n,"acknowledged"),await Ee(e,s)}catch(s){await Kt(s)}}async function tc(r,t,e){const n=v(r);try{const s=await(function(o,a){const u=v(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",(c=>{let l;return u.mutationQueue.lookupMutationBatch(c,a).next((h=>(S(h!==null,37113),l=h.keys(),u.mutationQueue.removeMutationBatch(c,h)))).next((()=>u.mutationQueue.performConsistencyCheck(c))).next((()=>u.documentOverlayCache.removeOverlaysForBatchId(c,l,a))).next((()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(c,l))).next((()=>u.localDocuments.getDocuments(c,l)))}))})(n.localStore,t);Oi(n,t,e),Mi(n,t),n.sharedClientState.updateMutationState(t,"rejected",e),await Ee(n,s)}catch(s){await Kt(s)}}function Mi(r,t){(r.mu.get(t)||[]).forEach((e=>{e.resolve()})),r.mu.delete(t)}function Oi(r,t,e){const n=v(r);let s=n.Vu[n.currentUser.toKey()];if(s){const i=s.get(t);i&&(e?i.reject(e):i.resolve(),s=s.remove(t)),n.Vu[n.currentUser.toKey()]=s}}function kn(r,t,e=null){r.sharedClientState.removeLocalQueryTarget(t);for(const n of r.Iu.get(t))r.Tu.delete(n),e&&r.Pu.yu(n,e);r.Iu.delete(t),r.isPrimaryClient&&r.Ru.jr(t).forEach((n=>{r.Ru.containsKey(n)||Li(r,n)}))}function Li(r,t){r.Eu.delete(t.path.canonicalString());const e=r.du.get(t);e!==null&&(Xn(r.remoteStore,e),r.du=r.du.remove(t),r.Au.delete(e),ur(r))}function ps(r,t,e){for(const n of e)n instanceof Ni?(r.Ru.addReference(n.key,t),ec(r,n)):n instanceof Di?(g(ar,"Document no longer in limbo: "+n.key),r.Ru.removeReference(n.key,t),r.Ru.containsKey(n.key)||Li(r,n.key)):I(19791,{wu:n})}function ec(r,t){const e=t.key,n=e.path.canonicalString();r.du.get(e)||r.Eu.has(n)||(g(ar,"New document in limbo: "+e),r.Eu.add(n),ur(r))}function ur(r){for(;r.Eu.size>0&&r.du.size<r.maxConcurrentLimboResolutions;){const t=r.Eu.values().next().value;r.Eu.delete(t);const e=new y(C.fromString(t)),n=r.fu.next();r.Au.set(n,new Gu(e)),r.du=r.du.insert(e,n),Ri(r.remoteStore,new mt(st(Ze(e.path)),n,"TargetPurposeLimboResolution",He.ce))}}async function Ee(r,t,e){const n=v(r),s=[],i=[],o=[];n.Tu.isEmpty()||(n.Tu.forEach(((a,u)=>{o.push(n.pu(u,t,e).then((c=>{if((c||e)&&n.isPrimaryClient){const l=c?!c.fromCache:e?.targetChanges.get(u.targetId)?.current;n.sharedClientState.updateQueryState(u.targetId,l?"current":"not-current")}if(c){s.push(c);const l=Hn.As(u.targetId,c);i.push(l)}})))})),await Promise.all(o),n.Pu.H_(s),await(async function(u,c){const l=v(u);try{await l.persistence.runTransaction("notifyLocalViewChanges","readwrite",(h=>m.forEach(c,(f=>m.forEach(f.Es,(_=>l.persistence.referenceDelegate.addReference(h,f.targetId,_))).next((()=>m.forEach(f.ds,(_=>l.persistence.referenceDelegate.removeReference(h,f.targetId,_)))))))))}catch(h){if(!Wt(h))throw h;g(Yn,"Failed to update sequence numbers: "+h)}for(const h of c){const f=h.targetId;if(!h.fromCache){const _=l.Ms.get(f),T=_.snapshotVersion,w=_.withLastLimboFreeSnapshotVersion(T);l.Ms=l.Ms.insert(f,w)}}})(n.localStore,i))}async function nc(r,t){const e=v(r);if(!e.currentUser.isEqual(t)){g(ar,"User change. New user:",t.toKey());const n=await Ii(e.localStore,t);e.currentUser=t,(function(i,o){i.mu.forEach((a=>{a.forEach((u=>{u.reject(new p(d.CANCELLED,o))}))})),i.mu.clear()})(e,"'waitForPendingWrites' promise is rejected due to a user change."),e.sharedClientState.handleUserChange(t,n.removedBatchIds,n.addedBatchIds),await Ee(e,n.Ls)}}function rc(r,t){const e=v(r),n=e.Au.get(t);if(n&&n.hu)return V().add(n.key);{let s=V();const i=e.Iu.get(t);if(!i)return s;for(const o of i){const a=e.Tu.get(o);s=s.unionWith(a.view.nu)}return s}}function Fi(r){const t=v(r);return t.remoteStore.remoteSyncer.applyRemoteEvent=xi.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=rc.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=Ju.bind(null,t),t.Pu.H_=qu.bind(null,t.eventManager),t.Pu.yu=Bu.bind(null,t.eventManager),t}function sc(r){const t=v(r);return t.remoteStore.remoteSyncer.applySuccessfulWrite=Zu.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=tc.bind(null,t),t}class Qe{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(t){this.serializer=an(t.databaseInfo.databaseId),this.sharedClientState=this.Du(t),this.persistence=this.Cu(t),await this.persistence.start(),this.localStore=this.vu(t),this.gcScheduler=this.Fu(t,this.localStore),this.indexBackfillerScheduler=this.Mu(t,this.localStore)}Fu(t,e){return null}Mu(t,e){return null}vu(t){return uu(this.persistence,new iu,t.initialUser,this.serializer)}Cu(t){return new Ti(Wn.mi,this.serializer)}Du(t){return new _u}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Qe.provider={build:()=>new Qe};class ic extends Qe{constructor(t){super(),this.cacheSizeBytes=t}Fu(t,e){S(this.persistence.referenceDelegate instanceof $e,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new Ga(n,t.asyncQueue,e)}Cu(t){const e=this.cacheSizeBytes!==void 0?H.withCacheSize(this.cacheSizeBytes):H.DEFAULT;return new Ti((n=>$e.mi(n,e)),this.serializer)}}class xn{async initialize(t,e){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(e),this.remoteStore=this.createRemoteStore(e),this.eventManager=this.createEventManager(e),this.syncEngine=this.createSyncEngine(e,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>_s(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=nc.bind(null,this.syncEngine),await Lu(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return(function(){return new Uu})()}createDatastore(t){const e=an(t.databaseInfo.databaseId),n=(function(i){return new Tu(i)})(t.databaseInfo);return(function(i,o,a,u){return new vu(i,o,a,u)})(t.authCredentials,t.appCheckCredentials,n,e)}createRemoteStore(t){return(function(n,s,i,o,a){return new Vu(n,s,i,o,a)})(this.localStore,this.datastore,t.asyncQueue,(e=>_s(this.syncEngine,e,0)),(function(){return cs.v()?new cs:new pu})())}createSyncEngine(t,e){return(function(s,i,o,a,u,c,l){const h=new Qu(s,i,o,a,u,c);return l&&(h.gu=!0),h})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,e)}async terminate(){await(async function(e){const n=v(e);g(bt,"RemoteStore shutting down."),n.Ea.add(5),await ye(n),n.Aa.shutdown(),n.Ra.set("Unknown")})(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}}xn.provider={build:()=>new xn};/**
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
 */class cr{constructor(t){this.observer=t,this.muted=!1}next(t){this.muted||this.observer.next&&this.Ou(this.observer.next,t)}error(t){this.muted||(this.observer.error?this.Ou(this.observer.error,t):dt("Uncaught Error in snapshot listener:",t.toString()))}Nu(){this.muted=!0}Ou(t,e){setTimeout((()=>{this.muted||t(e)}),0)}}/**
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
 */const It="FirestoreClient";class oc{constructor(t,e,n,s,i){this.authCredentials=t,this.appCheckCredentials=e,this.asyncQueue=n,this.databaseInfo=s,this.user=W.UNAUTHENTICATED,this.clientId=Ln.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,(async o=>{g(It,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(n,(o=>(g(It,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}terminate(){this.asyncQueue.enterRestrictedMode();const t=new ht;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(e){const n=nr(e,"Failed to shutdown persistence");t.reject(n)}})),t.promise}}async function yn(r,t){r.asyncQueue.verifyOperationInProgress(),g(It,"Initializing OfflineComponentProvider");const e=r.configuration;await t.initialize(e);let n=e.initialUser;r.setCredentialChangeListener((async s=>{n.isEqual(s)||(await Ii(t.localStore,s),n=s)})),t.persistence.setDatabaseDeletedListener((()=>r.terminate())),r._offlineComponents=t}async function gs(r,t){r.asyncQueue.verifyOperationInProgress();const e=await ac(r);g(It,"Initializing OnlineComponentProvider"),await t.initialize(e,r.configuration),r.setCredentialChangeListener((n=>hs(t.remoteStore,n))),r.setAppCheckTokenChangeListener(((n,s)=>hs(t.remoteStore,s))),r._onlineComponents=t}async function ac(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){g(It,"Using user provided OfflineComponentProvider");try{await yn(r,r._uninitializedComponentsProvider._offline)}catch(t){const e=t;if(!(function(s){return s.name==="FirebaseError"?s.code===d.FAILED_PRECONDITION||s.code===d.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(e))throw e;ie("Error using user provided cache. Falling back to memory cache: "+e),await yn(r,new Qe)}}else g(It,"Using default OfflineComponentProvider"),await yn(r,new ic(void 0));return r._offlineComponents}async function Ui(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(g(It,"Using user provided OnlineComponentProvider"),await gs(r,r._uninitializedComponentsProvider._online)):(g(It,"Using default OnlineComponentProvider"),await gs(r,new xn))),r._onlineComponents}function uc(r){return Ui(r).then((t=>t.syncEngine))}async function je(r){const t=await Ui(r),e=t.eventManager;return e.onListen=ju.bind(null,t.syncEngine),e.onUnlisten=Hu.bind(null,t.syncEngine),e.onFirstRemoteStoreListen=Ku.bind(null,t.syncEngine),e.onLastRemoteStoreUnlisten=Yu.bind(null,t.syncEngine),e}function cc(r,t,e={}){const n=new ht;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,a,u,c){const l=new cr({next:f=>{l.Nu(),o.enqueueAndForget((()=>sr(i,h)));const _=f.docs.has(a);!_&&f.fromCache?c.reject(new p(d.UNAVAILABLE,"Failed to get document because the client is offline.")):_&&f.fromCache&&u&&u.source==="server"?c.reject(new p(d.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):c.resolve(f)},error:f=>c.reject(f)}),h=new or(Ze(a.path),l,{includeMetadataChanges:!0,qa:!0});return rr(i,h)})(await je(r),r.asyncQueue,t,e,n))),n.promise}function lc(r,t,e={}){const n=new ht;return r.asyncQueue.enqueueAndForget((async()=>(function(i,o,a,u,c){const l=new cr({next:f=>{l.Nu(),o.enqueueAndForget((()=>sr(i,h))),f.fromCache&&u.source==="server"?c.reject(new p(d.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):c.resolve(f)},error:f=>c.reject(f)}),h=new or(a,l,{includeMetadataChanges:!0,qa:!0});return rr(i,h)})(await je(r),r.asyncQueue,t,e,n))),n.promise}/**
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
 */function qi(r){const t={};return r.timeoutSeconds!==void 0&&(t.timeoutSeconds=r.timeoutSeconds),t}/**
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
 */const ys=new Map;/**
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
 */const hc="firestore.googleapis.com",Es=!0;class Ts{constructor(t){if(t.host===void 0){if(t.ssl!==void 0)throw new p(d.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=hc,this.ssl=Es}else this.host=t.host,this.ssl=t.ssl??Es;if(this.isUsingEmulator=t.emulatorOptions!==void 0,this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=yi;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<Ei)throw new p(d.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}So("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=qi(t.experimentalLongPollingOptions??{}),(function(n){if(n.timeoutSeconds!==void 0){if(isNaN(n.timeoutSeconds))throw new p(d.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (must not be NaN)`);if(n.timeoutSeconds<5)throw new p(d.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (minimum allowed value is 5)`);if(n.timeoutSeconds>30)throw new p(d.INVALID_ARGUMENT,`invalid long polling timeout: ${n.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&(function(n,s){return n.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class lr{constructor(t,e,n,s){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=n,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new Ts({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new p(d.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new p(d.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new Ts(t),this._emulatorOptions=t.emulatorOptions||{},t.credentials!==void 0&&(this._authCredentials=(function(n){if(!n)return new Eo;switch(n.type){case"firstParty":return new Ao(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new p(d.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(t.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(e){const n=ys.get(e);n&&(g("ComponentProvider","Removing Datastore"),ys.delete(e),n.terminate())})(this),Promise.resolve()}}/**
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
 */class nt{constructor(t,e,n){this.converter=e,this._query=n,this.type="query",this.firestore=t}withConverter(t){return new nt(this.firestore,t,this._query)}}class k{constructor(t,e,n){this.converter=e,this._key=n,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new _t(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new k(this.firestore,t,this._key)}toJSON(){return{type:k._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(t,e,n){if(_e(e,k._jsonSchema))return new k(t,n||null,new y(C.fromString(e.referencePath)))}}k._jsonSchemaVersion="firestore/documentReference/1.0",k._jsonSchema={type:L("string",k._jsonSchemaVersion),referencePath:L("string")};class _t extends nt{constructor(t,e,n){super(t,e,Ze(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new k(this.firestore,null,new y(t))}withConverter(t){return new _t(this.firestore,t,this._path)}}function Sc(r,t,...e){if(r=Z(r),Cs("collection","path",t),r instanceof lr){const n=C.fromString(t,...e);return xr(n),new _t(r,null,n)}{if(!(r instanceof k||r instanceof _t))throw new p(d.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(C.fromString(t,...e));return xr(n),new _t(r.firestore,null,n)}}function dc(r,t,...e){if(r=Z(r),arguments.length===1&&(t=Ln.newId()),Cs("doc","path",t),r instanceof lr){const n=C.fromString(t,...e);return kr(n),new k(r,null,new y(n))}{if(!(r instanceof k||r instanceof _t))throw new p(d.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(C.fromString(t,...e));return kr(n),new k(r.firestore,r instanceof _t?r.converter:null,new y(n))}}/**
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
 */const Is="AsyncQueue";class As{constructor(t=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new wi(this,"async_queue_retry"),this._c=()=>{const n=gn();n&&g(Is,"Visibility state changed to "+n.visibilityState),this.M_.w_()},this.ac=t;const e=gn();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.uc(),this.cc(t)}enterRestrictedMode(t){if(!this.ec){this.ec=!0,this.sc=t||!1;const e=gn();e&&typeof e.removeEventListener=="function"&&e.removeEventListener("visibilitychange",this._c)}}enqueue(t){if(this.uc(),this.ec)return new Promise((()=>{}));const e=new ht;return this.cc((()=>this.ec&&this.sc?Promise.resolve():(t().then(e.resolve,e.reject),e.promise))).then((()=>e.promise))}enqueueRetryable(t){this.enqueueAndForget((()=>(this.Xu.push(t),this.lc())))}async lc(){if(this.Xu.length!==0){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(t){if(!Wt(t))throw t;g(Is,"Operation failed with retryable error: "+t)}this.Xu.length>0&&this.M_.p_((()=>this.lc()))}}cc(t){const e=this.ac.then((()=>(this.rc=!0,t().catch((n=>{throw this.nc=n,this.rc=!1,dt("INTERNAL UNHANDLED ERROR: ",ws(n)),n})).then((n=>(this.rc=!1,n))))));return this.ac=e,e}enqueueAfterDelay(t,e,n){this.uc(),this.oc.indexOf(t)>-1&&(e=0);const s=er.createAndSchedule(this,t,e,n,(i=>this.hc(i)));return this.tc.push(s),s}uc(){this.nc&&I(47125,{Pc:ws(this.nc)})}verifyOperationInProgress(){}async Tc(){let t;do t=this.ac,await t;while(t!==this.ac)}Ic(t){for(const e of this.tc)if(e.timerId===t)return!0;return!1}Ec(t){return this.Tc().then((()=>{this.tc.sort(((e,n)=>e.targetTimeMs-n.targetTimeMs));for(const e of this.tc)if(e.skipDelay(),t!=="all"&&e.timerId===t)break;return this.Tc()}))}dc(t){this.oc.push(t)}hc(t){const e=this.tc.indexOf(t);this.tc.splice(e,1)}}function ws(r){let t=r.message||"";return r.stack&&(t=r.stack.includes(r.message)?r.stack:r.message+`
`+r.stack),t}/**
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
 */function vs(r){return(function(e,n){if(typeof e!="object"||e===null)return!1;const s=e;for(const i of n)if(i in s&&typeof s[i]=="function")return!0;return!1})(r,["next","error","complete"])}class ct extends lr{constructor(t,e,n,s){super(t,e,n,s),this.type="firestore",this._queue=new As,this._persistenceKey=s?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new As(t),this._firestoreClient=void 0,await t}}}function Cc(r,t,e){e||(e=Fe);const n=no(r,"firestore");if(n.isInitialized(e)){const s=n.getImmediate({identifier:e}),i=n.getOptions(e);if(ao(i,t))return s;throw new p(d.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(t.cacheSizeBytes!==void 0&&t.localCache!==void 0)throw new p(d.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(t.cacheSizeBytes!==void 0&&t.cacheSizeBytes!==-1&&t.cacheSizeBytes<Ei)throw new p(d.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return t.host&&Ps(t.host)&&uo(t.host),n.initialize({options:t,instanceIdentifier:e})}function Te(r){if(r._terminated)throw new p(d.FAILED_PRECONDITION,"The client has already been terminated.");return r._firestoreClient||fc(r),r._firestoreClient}function fc(r){const t=r._freezeSettings(),e=(function(s,i,o,a){return new Uo(s,i,o,a.host,a.ssl,a.experimentalForceLongPolling,a.experimentalAutoDetectLongPolling,qi(a.experimentalLongPollingOptions),a.useFetchStreams,a.isUsingEmulator)})(r._databaseId,r._app?.options.appId||"",r._persistenceKey,t);r._componentsProvider||t.localCache?._offlineComponentProvider&&t.localCache?._onlineComponentProvider&&(r._componentsProvider={_offline:t.localCache._offlineComponentProvider,_online:t.localCache._onlineComponentProvider}),r._firestoreClient=new oc(r._authCredentials,r._appCheckCredentials,r._queue,e,r._componentsProvider&&(function(s){const i=s?._online.build();return{_offline:s?._offline.build(i),_online:i}})(r._componentsProvider))}/**
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
 */class tt{constructor(t){this._byteString=t}static fromBase64String(t){try{return new tt(G.fromBase64String(t))}catch(e){throw new p(d.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new tt(G.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}toJSON(){return{type:tt._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(t){if(_e(t,tt._jsonSchema))return tt.fromBase64String(t.bytes)}}tt._jsonSchemaVersion="firestore/bytes/1.0",tt._jsonSchema={type:L("string",tt._jsonSchemaVersion),bytes:L("string")};/**
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
 */class Ie{constructor(...t){for(let e=0;e<t.length;++e)if(t[e].length===0)throw new p(d.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new $(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
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
 */class Ae{constructor(t){this._methodName=t}}/**
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
 */class ot{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new p(d.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new p(d.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}_compareTo(t){return R(this._lat,t._lat)||R(this._long,t._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:ot._jsonSchemaVersion}}static fromJSON(t){if(_e(t,ot._jsonSchema))return new ot(t.latitude,t.longitude)}}ot._jsonSchemaVersion="firestore/geoPoint/1.0",ot._jsonSchema={type:L("string",ot._jsonSchemaVersion),latitude:L("number"),longitude:L("number")};/**
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
 */class at{constructor(t){this._values=(t||[]).map((e=>e))}toArray(){return this._values.map((t=>t))}isEqual(t){return(function(n,s){if(n.length!==s.length)return!1;for(let i=0;i<n.length;++i)if(n[i]!==s[i])return!1;return!0})(this._values,t._values)}toJSON(){return{type:at._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(t){if(_e(t,at._jsonSchema)){if(Array.isArray(t.vectorValues)&&t.vectorValues.every((e=>typeof e=="number")))return new at(t.vectorValues);throw new p(d.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}at._jsonSchemaVersion="firestore/vectorValue/1.0",at._jsonSchema={type:L("string",at._jsonSchemaVersion),vectorValues:L("object")};/**
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
 */const mc=/^__.*__$/;class _c{constructor(t,e,n){this.data=t,this.fieldMask=e,this.fieldTransforms=n}toMutation(t,e){return this.fieldMask!==null?new vt(t,this.data,this.fieldMask,e,this.fieldTransforms):new pe(t,this.data,e,this.fieldTransforms)}}class Bi{constructor(t,e,n){this.data=t,this.fieldMask=e,this.fieldTransforms=n}toMutation(t,e){return new vt(t,this.data,this.fieldMask,e,this.fieldTransforms)}}function zi(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw I(40011,{Ac:r})}}class hr{constructor(t,e,n,s,i,o){this.settings=t,this.databaseId=e,this.serializer=n,this.ignoreUndefinedProperties=s,i===void 0&&this.Rc(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get Ac(){return this.settings.Ac}Vc(t){return new hr({...this.settings,...t},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}mc(t){const e=this.path?.child(t),n=this.Vc({path:e,fc:!1});return n.gc(t),n}yc(t){const e=this.path?.child(t),n=this.Vc({path:e,fc:!1});return n.Rc(),n}wc(t){return this.Vc({path:void 0,fc:!0})}Sc(t){return Ke(t,this.settings.methodName,this.settings.bc||!1,this.path,this.settings.Dc)}contains(t){return this.fieldMask.find((e=>t.isPrefixOf(e)))!==void 0||this.fieldTransforms.find((e=>t.isPrefixOf(e.field)))!==void 0}Rc(){if(this.path)for(let t=0;t<this.path.length;t++)this.gc(this.path.get(t))}gc(t){if(t.length===0)throw this.Sc("Document fields must not be empty");if(zi(this.Ac)&&mc.test(t))throw this.Sc('Document fields cannot begin and end with "__"')}}class pc{constructor(t,e,n){this.databaseId=t,this.ignoreUndefinedProperties=e,this.serializer=n||an(t)}Cc(t,e,n,s=!1){return new hr({Ac:t,methodName:e,Dc:n,path:$.emptyPath(),fc:!1,bc:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Yt(r){const t=r._freezeSettings(),e=an(r._databaseId);return new pc(r._databaseId,!!t.ignoreUndefinedProperties,e)}function dr(r,t,e,n,s,i={}){const o=r.Cc(i.merge||i.mergeFields?2:0,t,e,s);_r("Data must be an object, but it was:",o,n);const a=ji(n,o);let u,c;if(i.merge)u=new J(o.fieldMask),c=o.fieldTransforms;else if(i.mergeFields){const l=[];for(const h of i.mergeFields){const f=Mn(t,h,e);if(!o.contains(f))throw new p(d.INVALID_ARGUMENT,`Field '${f}' is specified in your field mask but missing from your input data.`);Wi(l,f)||l.push(f)}u=new J(l),c=o.fieldTransforms.filter((h=>u.covers(h.field)))}else u=null,c=o.fieldTransforms;return new _c(new Y(a),u,c)}class we extends Ae{_toFieldTransform(t){if(t.Ac!==2)throw t.Ac===1?t.Sc(`${this._methodName}() can only appear at the top level of your update data`):t.Sc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return t.fieldMask.push(t.path),null}isEqual(t){return t instanceof we}}class fr extends Ae{_toFieldTransform(t){return new ii(t.path,new he)}isEqual(t){return t instanceof fr}}class mr extends Ae{constructor(t,e){super(t),this.Fc=e}_toFieldTransform(t){const e=new me(t.serializer,ti(t.serializer,this.Fc));return new ii(t.path,e)}isEqual(t){return t instanceof mr&&this.Fc===t.Fc}}function $i(r,t,e,n){const s=r.Cc(1,t,e);_r("Data must be an object, but it was:",s,n);const i=[],o=Y.empty();At(n,((u,c)=>{const l=pr(t,u,e);c=Z(c);const h=s.yc(l);if(c instanceof we)i.push(l);else{const f=ve(c,h);f!=null&&(i.push(l),o.set(l,f))}}));const a=new J(i);return new Bi(o,a,s.fieldTransforms)}function Gi(r,t,e,n,s,i){const o=r.Cc(1,t,e),a=[Mn(t,n,e)],u=[s];if(i.length%2!=0)throw new p(d.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let f=0;f<i.length;f+=2)a.push(Mn(t,i[f])),u.push(i[f+1]);const c=[],l=Y.empty();for(let f=a.length-1;f>=0;--f)if(!Wi(c,a[f])){const _=a[f];let T=u[f];T=Z(T);const w=o.yc(_);if(T instanceof we)c.push(_);else{const E=ve(T,w);E!=null&&(c.push(_),l.set(_,E))}}const h=new J(c);return new Bi(l,h,o.fieldTransforms)}function Qi(r,t,e,n=!1){return ve(e,r.Cc(n?4:3,t))}function ve(r,t){if(Ki(r=Z(r)))return _r("Unsupported field value:",t,r),ji(r,t);if(r instanceof Ae)return(function(n,s){if(!zi(s.Ac))throw s.Sc(`${n._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Sc(`${n._methodName}() is not currently supported inside arrays`);const i=n._toFieldTransform(s);i&&s.fieldTransforms.push(i)})(r,t),null;if(r===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),r instanceof Array){if(t.settings.fc&&t.Ac!==4)throw t.Sc("Nested arrays are not supported");return(function(n,s){const i=[];let o=0;for(const a of n){let u=ve(a,s.wc(o));u==null&&(u={nullValue:"NULL_VALUE"}),i.push(u),o++}return{arrayValue:{values:i}}})(r,t)}return(function(n,s){if((n=Z(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return ti(s.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const i=b.fromDate(n);return{timestampValue:ze(s.serializer,i)}}if(n instanceof b){const i=new b(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:ze(s.serializer,i)}}if(n instanceof ot)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof tt)return{bytesValue:hi(s.serializer,n._byteString)};if(n instanceof k){const i=s.databaseId,o=n.firestore._databaseId;if(!o.isEqual(i))throw s.Sc(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${i.projectId}/${i.database}`);return{referenceValue:jn(n.firestore._databaseId||s.databaseId,n._key.path)}}if(n instanceof at)return(function(o,a){return{mapValue:{fields:{[Us]:{stringValue:qs},[Ue]:{arrayValue:{values:o.toArray().map((c=>{if(typeof c!="number")throw a.Sc("VectorValues must only contain numeric values.");return $n(a.serializer,c)}))}}}}}})(n,s);throw s.Sc(`Unsupported field value: ${We(n)}`)})(r,t)}function ji(r,t){const e={};return ks(r)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):At(r,((n,s)=>{const i=ve(s,t.mc(n));i!=null&&(e[n]=i)})),{mapValue:{fields:e}}}function Ki(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof b||r instanceof ot||r instanceof tt||r instanceof k||r instanceof Ae||r instanceof at)}function _r(r,t,e){if(!Ki(e)||!bs(e)){const n=We(e);throw n==="an object"?t.Sc(r+" a custom object"):t.Sc(r+" "+n)}}function Mn(r,t,e){if((t=Z(t))instanceof Ie)return t._internalPath;if(typeof t=="string")return pr(r,t);throw Ke("Field path arguments must be of type string or ",r,!1,void 0,e)}const gc=new RegExp("[~\\*/\\[\\]]");function pr(r,t,e){if(t.search(gc)>=0)throw Ke(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,e);try{return new Ie(...t.split("."))._internalPath}catch{throw Ke(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,e)}}function Ke(r,t,e,n,s){const i=n&&!n.isEmpty(),o=s!==void 0;let a=`Function ${t}() called with invalid data`;e&&(a+=" (via `toFirestore()`)"),a+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${n}`),o&&(u+=` in document ${s}`),u+=")"),new p(d.INVALID_ARGUMENT,a+r+u)}function Wi(r,t){return r.some((e=>e.isEqual(t)))}/**
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
 */class gr{constructor(t,e,n,s,i){this._firestore=t,this._userDataWriter=e,this._key=n,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new k(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new yc(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const e=this._document.data.field(ln("DocumentSnapshot.get",t));if(e!==null)return this._userDataWriter.convertValue(e)}}}class yc extends gr{data(){return super.data()}}function ln(r,t){return typeof t=="string"?pr(r,t):t instanceof Ie?t._internalPath:t._delegate._internalPath}/**
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
 */function Hi(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new p(d.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class yr{}class Re extends yr{}function bc(r,t,...e){let n=[];t instanceof yr&&n.push(t),n=n.concat(e),(function(i){const o=i.filter((u=>u instanceof Er)).length,a=i.filter((u=>u instanceof hn)).length;if(o>1||o>0&&a>0)throw new p(d.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(n);for(const s of n)r=s._apply(r);return r}class hn extends Re{constructor(t,e,n){super(),this._field=t,this._op=e,this._value=n,this.type="where"}static _create(t,e,n){return new hn(t,e,n)}_apply(t){const e=this._parse(t);return Xi(t._query,e),new nt(t.firestore,t.converter,Rn(t._query,e))}_parse(t){const e=Yt(t.firestore);return(function(i,o,a,u,c,l,h){let f;if(c.isKeyField()){if(l==="array-contains"||l==="array-contains-any")throw new p(d.INVALID_ARGUMENT,`Invalid Query. You can't perform '${l}' queries on documentId().`);if(l==="in"||l==="not-in"){Vs(h,l);const T=[];for(const w of h)T.push(Rs(u,i,w));f={arrayValue:{values:T}}}else f=Rs(u,i,h)}else l!=="in"&&l!=="not-in"&&l!=="array-contains-any"||Vs(h,l),f=Qi(a,o,h,l==="in"||l==="not-in");return O.create(c,l,f)})(t._query,"where",e,t.firestore._databaseId,this._field,this._op,this._value)}}function Nc(r,t,e){const n=t,s=ln("where",r);return hn._create(s,n,e)}class Er extends yr{constructor(t,e){super(),this.type=t,this._queryConstraints=e}static _create(t,e){return new Er(t,e)}_parse(t){const e=this._queryConstraints.map((n=>n._parse(t))).filter((n=>n.getFilters().length>0));return e.length===1?e[0]:et.create(e,this._getOperator())}_apply(t){const e=this._parse(t);return e.getFilters().length===0?t:((function(s,i){let o=s;const a=i.getFlattenedFilters();for(const u of a)Xi(o,u),o=Rn(o,u)})(t._query,e),new nt(t.firestore,t.converter,Rn(t._query,e)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Tr extends Re{constructor(t,e){super(),this._field=t,this._direction=e,this.type="orderBy"}static _create(t,e){return new Tr(t,e)}_apply(t){const e=(function(s,i,o){if(s.startAt!==null)throw new p(d.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new p(d.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new le(i,o)})(t._query,this._field,this._direction);return new nt(t.firestore,t.converter,(function(s,i){const o=s.explicitOrderBy.concat([i]);return new wt(s.path,s.collectionGroup,o,s.filters.slice(),s.limit,s.limitType,s.startAt,s.endAt)})(t._query,e))}}function Dc(r,t="asc"){const e=t,n=ln("orderBy",r);return Tr._create(n,e)}class dn extends Re{constructor(t,e,n){super(),this.type=t,this._limit=e,this._limitType=n}static _create(t,e,n){return new dn(t,e,n)}_apply(t){return new nt(t.firestore,t.converter,Be(t._query,this._limit,this._limitType))}}function kc(r){return Ns("limit",r),dn._create("limit",r,"F")}function xc(r){return Ns("limitToLast",r),dn._create("limitToLast",r,"L")}class Ir extends Re{constructor(t,e,n){super(),this.type=t,this._docOrFields=e,this._inclusive=n}static _create(t,e,n){return new Ir(t,e,n)}_apply(t){const e=Yi(t,this.type,this._docOrFields,this._inclusive);return new nt(t.firestore,t.converter,(function(s,i){return new wt(s.path,s.collectionGroup,s.explicitOrderBy.slice(),s.filters.slice(),s.limit,s.limitType,i,s.endAt)})(t._query,e))}}function Mc(...r){return Ir._create("startAfter",r,!1)}class Ar extends Re{constructor(t,e,n){super(),this.type=t,this._docOrFields=e,this._inclusive=n}static _create(t,e,n){return new Ar(t,e,n)}_apply(t){const e=Yi(t,this.type,this._docOrFields,this._inclusive);return new nt(t.firestore,t.converter,(function(s,i){return new wt(s.path,s.collectionGroup,s.explicitOrderBy.slice(),s.filters.slice(),s.limit,s.limitType,s.startAt,i)})(t._query,e))}}function Oc(...r){return Ar._create("endBefore",r,!1)}function Yi(r,t,e,n){if(e[0]=Z(e[0]),e[0]instanceof gr)return(function(i,o,a,u,c){if(!u)throw new p(d.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${a}().`);const l=[];for(const h of Ft(i))if(h.field.isKeyField())l.push(qe(o,u.key));else{const f=u.data.field(h.field);if(Xe(f))throw new p(d.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+h.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(f===null){const _=h.field.canonicalString();throw new p(d.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${_}' (used as the orderBy) does not exist.`)}l.push(f)}return new $t(l,c)})(r._query,r.firestore._databaseId,t,e[0]._document,n);{const s=Yt(r.firestore);return(function(o,a,u,c,l,h){const f=o.explicitOrderBy;if(l.length>f.length)throw new p(d.INVALID_ARGUMENT,`Too many arguments provided to ${c}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const _=[];for(let T=0;T<l.length;T++){const w=l[T];if(f[T].field.isKeyField()){if(typeof w!="string")throw new p(d.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${c}(), but got a ${typeof w}`);if(!zn(o)&&w.indexOf("/")!==-1)throw new p(d.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${c}() must be a plain document ID, but '${w}' contains a slash.`);const E=o.path.child(C.fromString(w));if(!y.isDocumentKey(E))throw new p(d.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${c}() must result in a valid document path, but '${E}' is not because it contains an odd number of segments.`);const N=new y(E);_.push(qe(a,N))}else{const E=Qi(u,c,w);_.push(E)}}return new $t(_,h)})(r._query,r.firestore._databaseId,s,t,e,n)}}function Rs(r,t,e){if(typeof(e=Z(e))=="string"){if(e==="")throw new p(d.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!zn(t)&&e.indexOf("/")!==-1)throw new p(d.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${e}' contains a '/' character.`);const n=t.path.child(C.fromString(e));if(!y.isDocumentKey(n))throw new p(d.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return qe(r,new y(n))}if(e instanceof k)return qe(r,e._key);throw new p(d.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${We(e)}.`)}function Vs(r,t){if(!Array.isArray(r)||r.length===0)throw new p(d.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function Xi(r,t){const e=(function(s,i){for(const o of s)for(const a of o.getFlattenedFilters())if(i.indexOf(a.op)>=0)return a.op;return null})(r.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(t.op));if(e!==null)throw e===t.op?new p(d.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new p(d.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${e.toString()}' filters.`)}class Ec{convertValue(t,e="none"){switch(Et(t)){case 0:return null;case 1:return t.booleanValue;case 2:return x(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,e);case 5:return t.stringValue;case 6:return this.convertBytes(yt(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,e);case 11:return this.convertObject(t.mapValue,e);case 10:return this.convertVectorValue(t.mapValue);default:throw I(62114,{value:t})}}convertObject(t,e){return this.convertObjectMap(t.fields,e)}convertObjectMap(t,e="none"){const n={};return At(t,((s,i)=>{n[s]=this.convertValue(i,e)})),n}convertVectorValue(t){const e=t.fields?.[Ue].arrayValue?.values?.map((n=>x(n.doubleValue)));return new at(e)}convertGeoPoint(t){return new ot(x(t.latitude),x(t.longitude))}convertArray(t,e){return(t.values||[]).map((n=>this.convertValue(n,e)))}convertServerTimestamp(t,e){switch(e){case"previous":const n=Je(t);return n==null?null:this.convertValue(n,e);case"estimate":return this.convertTimestamp(ae(t));default:return null}}convertTimestamp(t){const e=gt(t);return new b(e.seconds,e.nanos)}convertDocumentKey(t,e){const n=C.fromString(t);S(gi(n),9688,{name:t});const s=new ue(n.get(1),n.get(3)),i=new y(n.popFirst(5));return s.isEqual(e)||dt(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`),i}}/**
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
 */function wr(r,t,e){let n;return n=r?e&&(e.merge||e.mergeFields)?r.toFirestore(t,e):r.toFirestore(t):t,n}class ee{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class Pt extends gr{constructor(t,e,n,s,i,o){super(t,e,n,s,o),this._firestore=t,this._firestoreImpl=t,this.metadata=i}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new Oe(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const n=this._document.data.field(ln("DocumentSnapshot.get",t));if(n!==null)return this._userDataWriter.convertValue(n,e.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new p(d.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t=this._document,e={};return e.type=Pt._jsonSchemaVersion,e.bundle="",e.bundleSource="DocumentSnapshot",e.bundleName=this._key.toString(),!t||!t.isValidDocument()||!t.isFoundDocument()?e:(this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields,"previous"),e.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),e)}}Pt._jsonSchemaVersion="firestore/documentSnapshot/1.0",Pt._jsonSchema={type:L("string",Pt._jsonSchemaVersion),bundleSource:L("string","DocumentSnapshot"),bundleName:L("string"),bundle:L("string")};class Oe extends Pt{data(t={}){return super.data(t)}}class St{constructor(t,e,n,s){this._firestore=t,this._userDataWriter=e,this._snapshot=s,this.metadata=new ee(s.hasPendingWrites,s.fromCache),this.query=n}get docs(){const t=[];return this.forEach((e=>t.push(e))),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,e){this._snapshot.docs.forEach((n=>{t.call(e,new Oe(this._firestore,this._userDataWriter,n.key,n,new ee(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new p(d.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map((a=>{const u=new Oe(s._firestore,s._userDataWriter,a.doc.key,a.doc,new ee(s._snapshot.mutatedKeys.has(a.doc.key),s._snapshot.fromCache),s.query.converter);return a.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}}))}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((a=>i||a.type!==3)).map((a=>{const u=new Oe(s._firestore,s._userDataWriter,a.doc.key,a.doc,new ee(s._snapshot.mutatedKeys.has(a.doc.key),s._snapshot.fromCache),s.query.converter);let c=-1,l=-1;return a.type!==0&&(c=o.indexOf(a.doc.key),o=o.delete(a.doc.key)),a.type!==1&&(o=o.add(a.doc),l=o.indexOf(a.doc.key)),{type:Tc(a.type),doc:u,oldIndex:c,newIndex:l}}))}})(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new p(d.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t={};t.type=St._jsonSchemaVersion,t.bundleSource="QuerySnapshot",t.bundleName=Ln.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const e=[],n=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(e.push(i._document),n.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),t.bundle=(this._firestore,this.query._query,t.bundleName,"NOT SUPPORTED"),t}}function Tc(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return I(61501,{type:r})}}/**
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
 */function Lc(r){r=X(r,k);const t=X(r.firestore,ct);return cc(Te(t),r._key).then((e=>Ji(t,r,e)))}St._jsonSchemaVersion="firestore/querySnapshot/1.0",St._jsonSchema={type:L("string",St._jsonSchemaVersion),bundleSource:L("string","QuerySnapshot"),bundleName:L("string"),bundle:L("string")};class vr extends Ec{constructor(t){super(),this.firestore=t}convertBytes(t){return new tt(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new k(this.firestore,null,e)}}function Fc(r){r=X(r,nt);const t=X(r.firestore,ct),e=Te(t),n=new vr(t);return Hi(r._query),lc(e,r._query).then((s=>new St(t,n,r,s)))}function Uc(r,t,e){r=X(r,k);const n=X(r.firestore,ct),s=wr(r.converter,t,e);return Ve(n,[dr(Yt(n),"setDoc",r._key,s,r.converter!==null,e).toMutation(r._key,K.none())])}function qc(r,t,e,...n){r=X(r,k);const s=X(r.firestore,ct),i=Yt(s);let o;return o=typeof(t=Z(t))=="string"||t instanceof Ie?Gi(i,"updateDoc",r._key,t,e,n):$i(i,"updateDoc",r._key,t),Ve(s,[o.toMutation(r._key,K.exists(!0))])}function Bc(r){return Ve(X(r.firestore,ct),[new sn(r._key,K.none())])}function zc(r,t){const e=X(r.firestore,ct),n=dc(r),s=wr(r.converter,t);return Ve(e,[dr(Yt(r.firestore),"addDoc",n._key,s,r.converter!==null,{}).toMutation(n._key,K.exists(!1))]).then((()=>n))}function $c(r,...t){r=Z(r);let e={includeMetadataChanges:!1,source:"default"},n=0;typeof t[n]!="object"||vs(t[n])||(e=t[n++]);const s={includeMetadataChanges:e.includeMetadataChanges,source:e.source};if(vs(t[n])){const u=t[n];t[n]=u.next?.bind(u),t[n+1]=u.error?.bind(u),t[n+2]=u.complete?.bind(u)}let i,o,a;if(r instanceof k)o=X(r.firestore,ct),a=Ze(r._key.path),i={next:u=>{t[n]&&t[n](Ji(o,r,u))},error:t[n+1],complete:t[n+2]};else{const u=X(r,nt);o=X(u.firestore,ct),a=u._query;const c=new vr(o);i={next:l=>{t[n]&&t[n](new St(o,c,u,l))},error:t[n+1],complete:t[n+2]},Hi(r._query)}return(function(c,l,h,f){const _=new cr(f),T=new or(l,_,h);return c.asyncQueue.enqueueAndForget((async()=>rr(await je(c),T))),()=>{_.Nu(),c.asyncQueue.enqueueAndForget((async()=>sr(await je(c),T)))}})(Te(o),a,s,i)}function Ve(r,t){return(function(n,s){const i=new ht;return n.asyncQueue.enqueueAndForget((async()=>Xu(await uc(n),s,i))),i.promise})(Te(r),t)}function Ji(r,t,e){const n=e.docs.get(t._key),s=new vr(r);return new Pt(r,s,t._key,n,new ee(e.hasPendingWrites,e.fromCache),t.converter)}/**
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
 */class Ic{constructor(t,e){this._firestore=t,this._commitHandler=e,this._mutations=[],this._committed=!1,this._dataReader=Yt(t)}set(t,e,n){this._verifyNotCommitted();const s=En(t,this._firestore),i=wr(s.converter,e,n),o=dr(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,n);return this._mutations.push(o.toMutation(s._key,K.none())),this}update(t,e,n,...s){this._verifyNotCommitted();const i=En(t,this._firestore);let o;return o=typeof(e=Z(e))=="string"||e instanceof Ie?Gi(this._dataReader,"WriteBatch.update",i._key,e,n,s):$i(this._dataReader,"WriteBatch.update",i._key,e),this._mutations.push(o.toMutation(i._key,K.exists(!0))),this}delete(t){this._verifyNotCommitted();const e=En(t,this._firestore);return this._mutations=this._mutations.concat(new sn(e._key,K.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new p(d.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function En(r,t){if((r=Z(r)).firestore!==t)throw new p(d.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return r}/**
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
 */function Gc(){return new we("deleteField")}function Qc(){return new fr("serverTimestamp")}function jc(r){return new mr("increment",r)}/**
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
 */function Kc(r){return Te(r=X(r,ct)),new Ic(r,(t=>Ve(r,t)))}(function(t,e=!0){(function(s){jt=s})(ro),to(new so("firestore",((n,{instanceIdentifier:s,options:i})=>{const o=n.getProvider("app").getImmediate(),a=new ct(new To(n.getProvider("auth-internal")),new wo(o,n.getProvider("app-check-internal")),(function(c,l){if(!Object.prototype.hasOwnProperty.apply(c.options,["projectId"]))throw new p(d.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ue(c.options.projectId,l)})(o,s),o);return i={useFetchStreams:e,...i},a._setSettings(i),a}),"PUBLIC").setMultipleInstances(!0)),Pr(Cr,br,t),Pr(Cr,br,"esm2020")})();export{b as T,$c as a,zc as b,Sc as c,dc as d,Mc as e,jc as f,Fc as g,Lc as h,Cc as i,Kc as j,Bc as k,kc as l,Gc as m,Uc as n,Dc as o,xc as p,bc as q,Oc as r,Qc as s,qc as u,Nc as w};
