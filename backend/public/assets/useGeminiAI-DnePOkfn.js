import{c as a,t as o,r as c}from"./index-CQCKluQG.js";/**
 * @license lucide-react v0.395.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=a("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]),i="http://localhost:3000/api/ai";class l{async generateResponse(r){var t;try{return(await o.post(`${i}/chat`,{message:r},{withCredentials:!0,headers:{"Content-Type":"application/json"}})).data.reply}catch(e){return console.error("AI Service Error:",((t=e.response)==null?void 0:t.data)||e.message),"Sorry, AI is currently unavailable."}}}const p=new l,d=()=>{const[s,r]=c.useState(!1);return{generateContent:async e=>{try{return r(!0),await p.generateResponse(e)}catch(n){return console.error("AI Hook Error:",n),"Sorry, something went wrong."}finally{r(!1)}},loading:s}};export{u as U,d as u};
