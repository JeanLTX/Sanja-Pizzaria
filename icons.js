(()=>{var t=(e,a,o)=>()=>{if(o)throw o[0];try{return e&&(a=e(e=0)),a}catch(r){throw o=[r],r}};var xe=(e,a)=>()=>{try{return a||e((a={exports:{}}).exports,a),a.exports}catch(o){throw a=0,o}};var d,n=t(()=>{d={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"}});var T,q,b=t(()=>{n();T=([e,a,o])=>{let r=document.createElementNS("http://www.w3.org/2000/svg",e);return Object.keys(a).forEach(f=>{r.setAttribute(f,String(a[f]))}),o?.length&&o.forEach(f=>{let u=T(f);r.appendChild(u)}),r},q=(e,a={})=>{let r={...d,...a};return T(["svg",r,e])}});var U,O=t(()=>{U=(...e)=>e.filter((a,o,r)=>!!a&&a.trim()!==""&&r.indexOf(a)===o).join(" ").trim()});var H,v=t(()=>{H=e=>{for(let a in e)if(a.startsWith("aria-")||a==="role"||a==="title")return!0;return!1}});var G,E=t(()=>{G=e=>{let a="",o=!1;for(let r of e){if(r==="-"||r==="_"||r<=" "){o=a.length>0;continue}a.length===0?a+=r.toLowerCase():a+=o?r.toUpperCase():r,o=!1}return a}});var V,W=t(()=>{E();V=e=>{let a=G(e);return a.charAt(0).toUpperCase()+a.slice(1)}});var ie,I,c,z=t(()=>{b();n();O();v();W();ie=e=>Array.from(e.attributes).reduce((a,o)=>(a[o.name]=o.value,a),{}),I=e=>typeof e=="string"?e:!e||!e.class?"":e.class&&typeof e.class=="string"?e.class.split(" "):e.class&&Array.isArray(e.class)?e.class:"",c=(e,{nameAttr:a,icons:o,attrs:r})=>{let f=e.getAttribute(a);if(f==null)return;let u=V(f),l=o[u];if(!l)return console.warn(`${e.outerHTML} icon name was not found in the provided icons object.`);let s=ie(e),ue=H(s)?{}:{"aria-hidden":"true"},R={...d,"data-lucide":f,...ue,...r,...s},de=I(s),pe=I(r),y=U("lucide",`lucide-${f}`,...de,...pe);y&&Object.assign(R,{class:y});let me=q(l,R);return e.parentNode?.replaceChild(me,e)}});var C,X=t(()=>{C=[["path",{d:"m12 19-7-7 7-7"}],["path",{d:"M19 12H5"}]]});var h,N=t(()=>{h=[["path",{d:"M5 12h14"}],["path",{d:"m12 5 7 7-7 7"}]]});var S,K=t(()=>{S=[["path",{d:"M20 6 9 17l-5-5"}]]});var g,Z=t(()=>{g=[["path",{d:"m6 9 6 6 6-6"}]]});var p,Q=t(()=>{p=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"m16 9-5.5 5.5L8 12"}]]});var m,J=t(()=>{m=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335"}],["path",{d:"m9 11 3 3L22 4"}]]});var x,j=t(()=>{x=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M8 12h8"}],["path",{d:"M12 8v8"}]]});var k,Y=t(()=>{k=[["circle",{cx:"12",cy:"12",r:"10"}],["path",{d:"M12 6v6l4 2"}]]});var w,$=t(()=>{w=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"}],["circle",{cx:"12",cy:"10",r:"3"}]]});var P,_=t(()=>{P=[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"}]]});var A,ee=t(()=>{A=[["path",{d:"m12 14-1 1"}],["path",{d:"m13.75 18.25-1.25 1.42"}],["path",{d:"M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12"}],["path",{d:"M18.8 9.3a1 1 0 0 0 2.1 7.7"}],["path",{d:"M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z"}]]});var M,ae=t(()=>{M=[["path",{d:"M16 10a4 4 0 0 1-8 0"}],["path",{d:"M3.103 6.034h17.794"}],["path",{d:"M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"}]]});var B,re=t(()=>{B=[["path",{d:"m15 11-1 9"}],["path",{d:"m19 11-4-7"}],["path",{d:"M2 11h20"}],["path",{d:"m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"}],["path",{d:"M4.5 15.5h15"}],["path",{d:"m5 11 4-7"}],["path",{d:"m9 11 1 9"}]]});var D,oe=t(()=>{D=[["path",{d:"m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18"}],["path",{d:"M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25"}],["circle",{cx:"18",cy:"20",r:"2"}],["circle",{cx:"8",cy:"20",r:"2"}]]});var i,te=t(()=>{i=[["path",{d:"M10 11v6"}],["path",{d:"M14 11v6"}],["path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"}],["path",{d:"M3 6h18"}],["path",{d:"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}]]});var F,fe=t(()=>{F=[["path",{d:"M18 6 6 18"}],["path",{d:"m6 6 12 12"}]]});var L,le=t(()=>{z();X();N();K();Z();Q();J();j();Y();$();_();ee();ae();re();oe();te();fe();L=({icons:e={},nameAttr:a="data-lucide",attrs:o={},root:r=document,inTemplates:f}={})=>{if(!Object.values(e).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof r>"u")throw new Error("`createIcons()` only works in a browser environment.");if(Array.from(r.querySelectorAll(`[${a}]`)).forEach(l=>c(l,{nameAttr:a,icons:e,attrs:o})),f&&Array.from(r.querySelectorAll("template")).forEach(s=>L({icons:e,nameAttr:a,attrs:o,root:s.content,inTemplates:f})),a==="data-lucide"){let l=r.querySelectorAll("[icon-name]");l.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(l).forEach(s=>c(s,{nameAttr:"icon-name",icons:e,attrs:o})))}}});var ce=xe(()=>{le();var ne={ShoppingCart:D,Clock:k,MapPin:w,ShoppingBag:M,X:F,ArrowRight:h,ArrowLeft:C,Check:S,CheckCircle:m,CheckCircle2:p,Pizza:A,ChevronDown:g,PlusCircle:x,Moon:P,Trash2:i,ShoppingBasket:B};function se(e={}){return L({icons:ne,...e})}window.lucide={createIcons:se};se()});ce();})();
/*! Bundled license information:

lucide/dist/esm/defaultAttributes.mjs:
lucide/dist/esm/createElement.mjs:
lucide/dist/esm/shared/src/utils/mergeClasses.mjs:
lucide/dist/esm/shared/src/utils/hasA11yProp.mjs:
lucide/dist/esm/shared/src/utils/toCamelCase.mjs:
lucide/dist/esm/shared/src/utils/toPascalCase.mjs:
lucide/dist/esm/replaceElement.mjs:
lucide/dist/esm/icons/arrow-left.mjs:
lucide/dist/esm/icons/arrow-right.mjs:
lucide/dist/esm/icons/check.mjs:
lucide/dist/esm/icons/chevron-down.mjs:
lucide/dist/esm/icons/circle-check.mjs:
lucide/dist/esm/icons/circle-check-big.mjs:
lucide/dist/esm/icons/circle-plus.mjs:
lucide/dist/esm/icons/clock.mjs:
lucide/dist/esm/icons/map-pin.mjs:
lucide/dist/esm/icons/moon.mjs:
lucide/dist/esm/icons/pizza.mjs:
lucide/dist/esm/icons/shopping-bag.mjs:
lucide/dist/esm/icons/shopping-basket.mjs:
lucide/dist/esm/icons/shopping-cart.mjs:
lucide/dist/esm/icons/trash.mjs:
lucide/dist/esm/icons/x.mjs:
lucide/dist/esm/lucide.mjs:
  (**
   * @license lucide v1.49.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
