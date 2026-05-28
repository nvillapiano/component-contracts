import{j as i,T as ot,b as rt,P as at,c as it,S as st}from"./index-wuuIeaMp.js";import{within as O,expect as x,userEvent as T}from"./index-DgAF9SIF.js";import{r as s,R as C,a as Me}from"./index-ClcD9ViR.js";import"./index-BrKcqHra.js";import{c as Oe,a as De,d as I,C as ct}from"./ContractTokenTable-CstqZNbS.js";import"./iframe-gXbLLbqQ.js";import"./index-Bhelpi4i.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-DrFu-skq.js";function ee(e,t=[]){let n=[];function o(a,l){const c=s.createContext(l),d=n.length;n=[...n,l];const u=m=>{var h;const{scope:g,children:v,...y}=m,b=((h=g==null?void 0:g[e])==null?void 0:h[d])||c,A=s.useMemo(()=>y,Object.values(y));return i.jsx(b.Provider,{value:A,children:v})};u.displayName=a+"Provider";function p(m,g){var b;const v=((b=g==null?void 0:g[e])==null?void 0:b[d])||c,y=s.useContext(v);if(y)return y;if(l!==void 0)return l;throw new Error(`\`${m}\` must be used within \`${a}\``)}return[u,p]}const r=()=>{const a=n.map(l=>s.createContext(l));return function(c){const d=(c==null?void 0:c[e])||a;return s.useMemo(()=>({[`__scope${e}`]:{...c,[e]:d}}),[c,d])}};return r.scopeName=e,[o,lt(r,...t)]}function lt(...e){const t=e[0];if(e.length===1)return t;const n=()=>{const o=e.map(r=>({useScope:r(),scopeName:r.scopeName}));return function(a){const l=o.reduce((c,{useScope:d,scopeName:u})=>{const m=d(a)[`__scope${u}`];return{...c,...m}},{});return s.useMemo(()=>({[`__scope${t.scopeName}`]:l}),[l])}};return n.scopeName=t.scopeName,n}function de(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function ke(...e){return t=>{let n=!1;const o=e.map(r=>{const a=de(r,t);return!n&&typeof a=="function"&&(n=!0),a});if(n)return()=>{for(let r=0;r<o.length;r++){const a=o[r];typeof a=="function"?a():de(e[r],null)}}}}function D(...e){return s.useCallback(ke(...e),e)}function Q(e){const t=dt(e),n=s.forwardRef((o,r)=>{const{children:a,...l}=o,c=s.Children.toArray(a),d=c.find(pt);if(d){const u=d.props.children,p=c.map(m=>m===d?s.Children.count(u)>1?s.Children.only(null):s.isValidElement(u)?u.props.children:null:m);return i.jsx(t,{...l,ref:r,children:s.isValidElement(u)?s.cloneElement(u,void 0,p):null})}return i.jsx(t,{...l,ref:r,children:a})});return n.displayName=`${e}.Slot`,n}function dt(e){const t=s.forwardRef((n,o)=>{const{children:r,...a}=n;if(s.isValidElement(r)){const l=ft(r),c=mt(a,r.props);return r.type!==s.Fragment&&(c.ref=o?ke(o,l):l),s.cloneElement(r,c)}return s.Children.count(r)>1?s.Children.only(null):null});return t.displayName=`${e}.SlotClone`,t}var ut=Symbol("radix.slottable");function pt(e){return s.isValidElement(e)&&typeof e.type=="function"&&"__radixId"in e.type&&e.type.__radixId===ut}function mt(e,t){const n={...t};for(const o in t){const r=e[o],a=t[o];/^on[A-Z]/.test(o)?r&&a?n[o]=(...c)=>{const d=a(...c);return r(...c),d}:r&&(n[o]=r):o==="style"?n[o]={...r,...a}:o==="className"&&(n[o]=[r,a].filter(Boolean).join(" "))}return{...e,...n}}function ft(e){var o,r;let t=(o=Object.getOwnPropertyDescriptor(e.props,"ref"))==null?void 0:o.get,n=t&&"isReactWarning"in t&&t.isReactWarning;return n?e.ref:(t=(r=Object.getOwnPropertyDescriptor(e,"ref"))==null?void 0:r.get,n=t&&"isReactWarning"in t&&t.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}function gt(e){const t=e+"CollectionProvider",[n,o]=ee(t),[r,a]=n(t,{collectionRef:{current:null},itemMap:new Map}),l=b=>{const{scope:A,children:h}=b,f=C.useRef(null),w=C.useRef(new Map).current;return i.jsx(r,{scope:A,itemMap:w,collectionRef:f,children:h})};l.displayName=t;const c=e+"CollectionSlot",d=Q(c),u=C.forwardRef((b,A)=>{const{scope:h,children:f}=b,w=a(c,h),R=D(A,w.collectionRef);return i.jsx(d,{ref:R,children:f})});u.displayName=c;const p=e+"CollectionItemSlot",m="data-radix-collection-item",g=Q(p),v=C.forwardRef((b,A)=>{const{scope:h,children:f,...w}=b,R=C.useRef(null),M=D(A,R),_=a(p,h);return C.useEffect(()=>(_.itemMap.set(R,{ref:R,...w}),()=>void _.itemMap.delete(R))),i.jsx(g,{[m]:"",ref:M,children:f})});v.displayName=p;function y(b){const A=a(e+"CollectionConsumer",b);return C.useCallback(()=>{const f=A.collectionRef.current;if(!f)return[];const w=Array.from(f.querySelectorAll(`[${m}]`));return Array.from(A.itemMap.values()).sort((_,Y)=>w.indexOf(_.ref.current)-w.indexOf(Y.ref.current))},[A.collectionRef,A.itemMap])}return[{Provider:l,Slot:u,ItemSlot:v},y,o]}function He(e,t,{checkForDefaultPrevented:n=!0}={}){return function(r){if(e==null||e(r),n===!1||!r.defaultPrevented)return t==null?void 0:t(r)}}var k=globalThis!=null&&globalThis.document?s.useLayoutEffect:()=>{},vt=Me[" useInsertionEffect ".trim().toString()]||k;function te({prop:e,defaultProp:t,onChange:n=()=>{},caller:o}){const[r,a,l]=xt({defaultProp:t,onChange:n}),c=e!==void 0,d=c?e:r;{const p=s.useRef(e!==void 0);s.useEffect(()=>{const m=p.current;m!==c&&console.warn(`${o} is changing from ${m?"controlled":"uncontrolled"} to ${c?"controlled":"uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`),p.current=c},[c,o])}const u=s.useCallback(p=>{var m;if(c){const g=bt(p)?p(e):p;g!==e&&((m=l.current)==null||m.call(l,g))}else a(p)},[c,e,a,l]);return[d,u]}function xt({defaultProp:e,onChange:t}){const[n,o]=s.useState(e),r=s.useRef(n),a=s.useRef(t);return vt(()=>{a.current=t},[t]),s.useEffect(()=>{var l;r.current!==n&&((l=a.current)==null||l.call(a,n),r.current=n)},[n,r]),[n,o,a]}function bt(e){return typeof e=="function"}var At=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"],H=At.reduce((e,t)=>{const n=Q(`Primitive.${t}`),o=s.forwardRef((r,a)=>{const{asChild:l,...c}=r,d=l?n:t;return typeof window<"u"&&(window[Symbol.for("radix-ui")]=!0),i.jsx(d,{...c,ref:a})});return o.displayName=`Primitive.${t}`,{...e,[t]:o}},{});function Ct(e,t){return s.useReducer((n,o)=>t[n][o]??n,e)}var $e=e=>{const{present:t,children:n}=e,o=ht(t),r=typeof n=="function"?n({present:o.isPresent}):s.Children.only(n),a=D(o.ref,wt(r));return typeof n=="function"||o.isPresent?s.cloneElement(r,{ref:a}):null};$e.displayName="Presence";function ht(e){const[t,n]=s.useState(),o=s.useRef(null),r=s.useRef(e),a=s.useRef("none"),l=e?"mounted":"unmounted",[c,d]=Ct(l,{mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}});return s.useEffect(()=>{const u=B(o.current);a.current=c==="mounted"?u:"none"},[c]),k(()=>{const u=o.current,p=r.current;if(p!==e){const g=a.current,v=B(u);e?d("MOUNT"):v==="none"||(u==null?void 0:u.display)==="none"?d("UNMOUNT"):d(p&&g!==v?"ANIMATION_OUT":"UNMOUNT"),r.current=e}},[e,d]),k(()=>{if(t){let u;const p=t.ownerDocument.defaultView??window,m=v=>{const b=B(o.current).includes(CSS.escape(v.animationName));if(v.target===t&&b&&(d("ANIMATION_END"),!r.current)){const A=t.style.animationFillMode;t.style.animationFillMode="forwards",u=p.setTimeout(()=>{t.style.animationFillMode==="forwards"&&(t.style.animationFillMode=A)})}},g=v=>{v.target===t&&(a.current=B(o.current))};return t.addEventListener("animationstart",g),t.addEventListener("animationcancel",m),t.addEventListener("animationend",m),()=>{p.clearTimeout(u),t.removeEventListener("animationstart",g),t.removeEventListener("animationcancel",m),t.removeEventListener("animationend",m)}}else d("ANIMATION_END")},[t,d]),{isPresent:["mounted","unmountSuspended"].includes(c),ref:s.useCallback(u=>{o.current=u?getComputedStyle(u):null,n(u)},[])}}function B(e){return(e==null?void 0:e.animationName)||"none"}function wt(e){var o,r;let t=(o=Object.getOwnPropertyDescriptor(e.props,"ref"))==null?void 0:o.get,n=t&&"isReactWarning"in t&&t.isReactWarning;return n?e.ref:(t=(r=Object.getOwnPropertyDescriptor(e,"ref"))==null?void 0:r.get,n=t&&"isReactWarning"in t&&t.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}var yt=Me[" useId ".trim().toString()]||(()=>{}),It=0;function Be(e){const[t,n]=s.useState(yt());return k(()=>{n(o=>o??String(It++))},[e]),t?`radix-${t}`:""}var G="Collapsible",[Rt,Ve]=ee(G),[Tt,ne]=Rt(G),Le=s.forwardRef((e,t)=>{const{__scopeCollapsible:n,open:o,defaultOpen:r,disabled:a,onOpenChange:l,...c}=e,[d,u]=te({prop:o,defaultProp:r??!1,onChange:l,caller:G});return i.jsx(Tt,{scope:n,disabled:a,contentId:Be(),open:d,onOpenToggle:s.useCallback(()=>u(p=>!p),[u]),children:i.jsx(H.div,{"data-state":re(d),"data-disabled":a?"":void 0,...c,ref:t})})});Le.displayName=G;var Fe="CollapsibleTrigger",Ue=s.forwardRef((e,t)=>{const{__scopeCollapsible:n,...o}=e,r=ne(Fe,n);return i.jsx(H.button,{type:"button","aria-controls":r.contentId,"aria-expanded":r.open||!1,"data-state":re(r.open),"data-disabled":r.disabled?"":void 0,disabled:r.disabled,...o,ref:t,onClick:He(e.onClick,r.onOpenToggle)})});Ue.displayName=Fe;var oe="CollapsibleContent",We=s.forwardRef((e,t)=>{const{forceMount:n,...o}=e,r=ne(oe,e.__scopeCollapsible);return i.jsx($e,{present:n||r.open,children:({present:a})=>i.jsx(Nt,{...o,ref:t,present:a})})});We.displayName=oe;var Nt=s.forwardRef((e,t)=>{const{__scopeCollapsible:n,present:o,children:r,...a}=e,l=ne(oe,n),[c,d]=s.useState(o),u=s.useRef(null),p=D(t,u),m=s.useRef(0),g=m.current,v=s.useRef(0),y=v.current,b=l.open||c,A=s.useRef(b),h=s.useRef(void 0);return s.useEffect(()=>{const f=requestAnimationFrame(()=>A.current=!1);return()=>cancelAnimationFrame(f)},[]),k(()=>{const f=u.current;if(f){h.current=h.current||{transitionDuration:f.style.transitionDuration,animationName:f.style.animationName},f.style.transitionDuration="0s",f.style.animationName="none";const w=f.getBoundingClientRect();m.current=w.height,v.current=w.width,A.current||(f.style.transitionDuration=h.current.transitionDuration,f.style.animationName=h.current.animationName),d(o)}},[l.open,o]),i.jsx(H.div,{"data-state":re(l.open),"data-disabled":l.disabled?"":void 0,id:l.contentId,hidden:!b,...a,ref:p,style:{"--radix-collapsible-content-height":g?`${g}px`:void 0,"--radix-collapsible-content-width":y?`${y}px`:void 0,...e.style},children:b&&r})});function re(e){return e?"open":"closed"}var Et=Le,_t=Ue,St=We,jt=s.createContext(void 0);function Pt(e){const t=s.useContext(jt);return e||t||"ltr"}var N="Accordion",Mt=["Home","End","ArrowDown","ArrowUp","ArrowLeft","ArrowRight"],[ae,Ot,Dt]=gt(N),[Z]=ee(N,[Dt,Ve]),ie=Ve(),Ke=C.forwardRef((e,t)=>{const{type:n,...o}=e,r=o,a=o;return i.jsx(ae.Provider,{scope:e.__scopeAccordion,children:n==="multiple"?i.jsx(Bt,{...a,ref:t}):i.jsx($t,{...r,ref:t})})});Ke.displayName=N;var[qe,kt]=Z(N),[Ge,Ht]=Z(N,{collapsible:!1}),$t=C.forwardRef((e,t)=>{const{value:n,defaultValue:o,onValueChange:r=()=>{},collapsible:a=!1,...l}=e,[c,d]=te({prop:n,defaultProp:o??"",onChange:r,caller:N});return i.jsx(qe,{scope:e.__scopeAccordion,value:C.useMemo(()=>c?[c]:[],[c]),onItemOpen:d,onItemClose:C.useCallback(()=>a&&d(""),[a,d]),children:i.jsx(Ge,{scope:e.__scopeAccordion,collapsible:a,children:i.jsx(Ze,{...l,ref:t})})})}),Bt=C.forwardRef((e,t)=>{const{value:n,defaultValue:o,onValueChange:r=()=>{},...a}=e,[l,c]=te({prop:n,defaultProp:o??[],onChange:r,caller:N}),d=C.useCallback(p=>c((m=[])=>[...m,p]),[c]),u=C.useCallback(p=>c((m=[])=>m.filter(g=>g!==p)),[c]);return i.jsx(qe,{scope:e.__scopeAccordion,value:l,onItemOpen:d,onItemClose:u,children:i.jsx(Ge,{scope:e.__scopeAccordion,collapsible:!0,children:i.jsx(Ze,{...a,ref:t})})})}),[Vt,z]=Z(N),Ze=C.forwardRef((e,t)=>{const{__scopeAccordion:n,disabled:o,dir:r,orientation:a="vertical",...l}=e,c=C.useRef(null),d=D(c,t),u=Ot(n),m=Pt(r)==="ltr",g=He(e.onKeyDown,v=>{var ce;if(!Mt.includes(v.key))return;const y=v.target,b=u().filter(J=>{var le;return!((le=J.ref.current)!=null&&le.disabled)}),A=b.findIndex(J=>J.ref.current===y),h=b.length;if(A===-1)return;v.preventDefault();let f=A;const w=0,R=h-1,M=()=>{f=A+1,f>R&&(f=w)},_=()=>{f=A-1,f<w&&(f=R)};switch(v.key){case"Home":f=w;break;case"End":f=R;break;case"ArrowRight":a==="horizontal"&&(m?M():_());break;case"ArrowDown":a==="vertical"&&M();break;case"ArrowLeft":a==="horizontal"&&(m?_():M());break;case"ArrowUp":a==="vertical"&&_();break}const Y=f%h;(ce=b[Y].ref.current)==null||ce.focus()});return i.jsx(Vt,{scope:n,disabled:o,direction:r,orientation:a,children:i.jsx(ae.Slot,{scope:n,children:i.jsx(H.div,{...l,"data-orientation":a,ref:d,onKeyDown:o?void 0:g})})})}),q="AccordionItem",[Lt,se]=Z(q),ze=C.forwardRef((e,t)=>{const{__scopeAccordion:n,value:o,...r}=e,a=z(q,n),l=kt(q,n),c=ie(n),d=Be(),u=o&&l.value.includes(o)||!1,p=a.disabled||e.disabled;return i.jsx(Lt,{scope:n,open:u,disabled:p,triggerId:d,children:i.jsx(Et,{"data-orientation":a.orientation,"data-state":tt(u),...c,...r,ref:t,disabled:p,open:u,onOpenChange:m=>{m?l.onItemOpen(o):l.onItemClose(o)}})})});ze.displayName=q;var Ye="AccordionHeader",Je=C.forwardRef((e,t)=>{const{__scopeAccordion:n,...o}=e,r=z(N,n),a=se(Ye,n);return i.jsx(H.h3,{"data-orientation":r.orientation,"data-state":tt(a.open),"data-disabled":a.disabled?"":void 0,...o,ref:t})});Je.displayName=Ye;var X="AccordionTrigger",Qe=C.forwardRef((e,t)=>{const{__scopeAccordion:n,...o}=e,r=z(N,n),a=se(X,n),l=Ht(X,n),c=ie(n);return i.jsx(ae.ItemSlot,{scope:n,children:i.jsx(_t,{"aria-disabled":a.open&&!l.collapsible||void 0,"data-orientation":r.orientation,id:a.triggerId,...c,...o,ref:t})})});Qe.displayName=X;var Xe="AccordionContent",et=C.forwardRef((e,t)=>{const{__scopeAccordion:n,...o}=e,r=z(N,n),a=se(Xe,n),l=ie(n);return i.jsx(St,{role:"region","aria-labelledby":a.triggerId,"data-orientation":r.orientation,...l,...o,ref:t,style:{"--radix-accordion-content-height":"var(--radix-collapsible-content-height)","--radix-accordion-content-width":"var(--radix-collapsible-content-width)",...e.style}})});et.displayName=Xe;function tt(e){return e?"open":"closed"}var Ft=Ke,Ut=ze,Wt=Je,Kt=Qe,qt=et;/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nt=(...e)=>e.filter((t,n,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===n).join(" ").trim();/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gt=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zt=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,n,o)=>o?o.toUpperCase():n.toLowerCase());/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=e=>{const t=Zt(e);return t.charAt(0).toUpperCase()+t.slice(1)};/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var zt={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yt=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1};/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jt=s.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:n=2,absoluteStrokeWidth:o,className:r="",children:a,iconNode:l,...c},d)=>s.createElement("svg",{ref:d,...zt,width:t,height:t,stroke:e,strokeWidth:o?Number(n)*24/Number(t):n,className:nt("lucide",r),...!a&&!Yt(c)&&{"aria-hidden":"true"},...c},[...l.map(([u,p])=>s.createElement(u,p)),...Array.isArray(a)?a:[a]]));/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qt=(e,t)=>{const n=s.forwardRef(({className:o,...r},a)=>s.createElement(Jt,{ref:a,iconNode:t,className:nt(`lucide-${Gt(ue(e))}`,`lucide-${e}`,o),...r}));return n.displayName=ue(e),n};/**
 * @license lucide-react v0.577.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xt=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],en=Qt("chevron-down",Xt),tn=De("ds-accordion__item",{variants:{disabled:{true:"ds-accordion__item--disabled"}}}),nn=De("ds-accordion__trigger",{variants:{disabled:{true:"ds-accordion__trigger--disabled"}}}),E=s.forwardRef(({type:e="single",collapsible:t,value:n,defaultValue:o,onValueChange:r,disabled:a,orientation:l="vertical",className:c,children:d,...u},p)=>i.jsx(Ft,{ref:p,type:e,collapsible:e==="single"?t:void 0,value:n,defaultValue:o,onValueChange:r,disabled:a,orientation:l,className:Oe("ds-accordion",c),...u,children:d}));E.displayName="Accordion";const S=s.forwardRef(({className:e,disabled:t,...n},o)=>i.jsx(Ut,{ref:o,className:tn({disabled:t,className:e}),disabled:t,...n}));S.displayName="AccordionItem";const j=s.forwardRef(({className:e,disabled:t,children:n,...o},r)=>i.jsx(Wt,{className:"ds-accordion__header",children:i.jsxs(Kt,{ref:r,className:nn({disabled:t,className:e}),disabled:t,...o,children:[i.jsx("span",{className:"ds-accordion__label",children:n}),i.jsx("span",{className:"ds-accordion__icon","aria-hidden":"true",children:i.jsx(en,{size:16})})]})}));j.displayName="AccordionTrigger";const P=s.forwardRef(({className:e,children:t,...n},o)=>i.jsx(qt,{ref:o,className:Oe("ds-accordion__content",e),...n,children:i.jsx("div",{className:"ds-accordion__content-inner",children:t})}));P.displayName="AccordionContent";E.__docgenInfo={description:"",methods:[],displayName:"Accordion",props:{type:{defaultValue:{value:'"single"',computed:!1},required:!1},orientation:{defaultValue:{value:'"vertical"',computed:!1},required:!1}}};S.__docgenInfo={description:"",methods:[],displayName:"AccordionItem"};j.__docgenInfo={description:"",methods:[],displayName:"AccordionTrigger"};P.__docgenInfo={description:"",methods:[],displayName:"AccordionContent"};var pe,me,fe;const fn={title:"Molecules/Accordion",component:E,tags:["autodocs"],parameters:{docs:{description:{component:[I.description??"","","### Usage",((pe=I.usage)==null?void 0:pe.summary)??"","","**Do**",(((me=I.usage)==null?void 0:me.do)??[]).map(e=>`- ${e}`).join(`
`),"","**Don't**",(((fe=I.usage)==null?void 0:fe.dont)??[]).map(e=>`- ${e}`).join(`
`),"",`**Contract version:** ${I.version??"—"} · **Status:** ${I.status??"—"}`].join(`
`)},page:()=>i.jsxs(i.Fragment,{children:[i.jsx(ot,{}),i.jsx(rt,{}),i.jsx(at,{}),i.jsx(it,{}),i.jsx(st,{}),i.jsx(ct,{tokens:I.tokens})]})}},argTypes:{type:{control:"select",options:I.props.type.values,description:I.props.type.description},collapsible:{control:"boolean",description:I.props.collapsible.description},orientation:{control:"inline-radio",options:I.props.orientation.values,description:I.props.orientation.description},disabled:{control:"boolean",description:I.props.disabled.description}}},$=()=>i.jsxs(i.Fragment,{children:[i.jsxs(S,{value:"item-1",children:[i.jsx(j,{children:"Section one"}),i.jsx(P,{children:"Content for section one. Keep this concise and scannable."})]}),i.jsxs(S,{value:"item-2",children:[i.jsx(j,{children:"Section two"}),i.jsx(P,{children:"Content for section two. Use accordions for related, optional detail."})]}),i.jsxs(S,{value:"item-3",children:[i.jsx(j,{children:"Section three"}),i.jsx(P,{children:"Content for section three. Prefer short paragraphs over long blocks of text."})]})]}),on=async(e,t)=>{const o=O(e).getByRole("button",{name:/section one/i});await x(o).toBeInTheDocument(),await x(o).toHaveAttribute("aria-expanded","true"),await T.tab(),await x(o).toHaveFocus(),await T.keyboard("{Enter}"),await x(o).toHaveAttribute("aria-expanded","false"),await T.keyboard(" "),await x(o).toHaveAttribute("aria-expanded","true")},V={name:"Single, Non-collapsible",args:{type:"single",collapsible:!1,defaultValue:"item-1",orientation:"vertical"},render:e=>i.jsx(E,{...e,children:i.jsx($,{})}),play:async({canvasElement:e})=>{const t=O(e),n=t.getByRole("button",{name:/section one/i}),o=t.getByRole("button",{name:/section two/i});await x(n).toHaveAttribute("aria-expanded","true"),await x(o).toHaveAttribute("aria-expanded","false"),await T.click(o),await x(n).toHaveAttribute("aria-expanded","false"),await x(o).toHaveAttribute("aria-expanded","true")}},L={name:"Single, Collapsible",args:{type:"single",collapsible:!0,defaultValue:"item-1",orientation:"vertical"},render:e=>i.jsx(E,{...e,children:i.jsx($,{})}),play:async({canvasElement:e})=>{await on(e)}},F={name:"Multiple",args:{type:"multiple",defaultValue:["item-1","item-2"],orientation:"vertical"},render:e=>i.jsx(E,{...e,children:i.jsx($,{})}),play:async({canvasElement:e})=>{const t=O(e),n=t.getByRole("button",{name:/section one/i}),o=t.getByRole("button",{name:/section two/i});await x(n).toBeInTheDocument(),await x(o).toBeInTheDocument(),await x(n).toHaveAttribute("aria-expanded","true"),await x(o).toHaveAttribute("aria-expanded","true"),await T.tab(),await x(n).toHaveFocus(),await T.tab(),await x(o).toHaveFocus(),await T.keyboard("{Enter}"),await x(o).toHaveAttribute("aria-expanded","false"),await T.keyboard("{Enter}"),await x(o).toHaveAttribute("aria-expanded","true")}},U={name:"Disabled",args:{type:"single",collapsible:!0,orientation:"vertical",disabled:!0},render:e=>i.jsx(E,{...e,children:i.jsx($,{})}),play:async({canvasElement:e})=>{const n=O(e).getByRole("button",{name:/section one/i});await x(n).toHaveAttribute("data-disabled","")}},W={name:"All Collapsed",args:{type:"single",collapsible:!0,orientation:"vertical"},render:e=>i.jsx(E,{...e,children:i.jsx($,{})}),play:async({canvasElement:e})=>{const n=O(e).getByRole("button",{name:/section one/i});await x(n).toHaveAttribute("aria-expanded","false")}},K={name:"With Icon in Trigger",args:{type:"multiple",orientation:"vertical"},render:e=>i.jsxs(E,{...e,children:[i.jsxs(S,{value:"item-1",children:[i.jsxs(j,{children:[i.jsx("span",{role:"img","aria-hidden":"true",style:{marginRight:4},children:"ℹ️"}),"Account settings"]}),i.jsx(P,{children:"Use accordions to hide optional or advanced settings that are not needed by most users."})]}),i.jsxs(S,{value:"item-2",children:[i.jsx(j,{children:"Billing details"}),i.jsx(P,{children:"Keep billing preferences and invoices grouped in a single accordion to reduce noise."})]})]}),play:async({canvasElement:e})=>{const n=O(e).getByRole("button",{name:/account settings/i});await x(n).toBeInTheDocument(),await T.tab(),await x(n).toHaveFocus(),await T.keyboard("{Enter}"),await x(n).toHaveAttribute("aria-expanded","true"),await T.keyboard(" "),await x(n).toHaveAttribute("aria-expanded","false")}};var ge,ve,xe;V.parameters={...V.parameters,docs:{...(ge=V.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  name: "Single, Non-collapsible",
  args: {
    type: "single",
    collapsible: false,
    defaultValue: "item-1",
    orientation: "vertical"
  },
  render: args => <Accordion {...args}>
      <ExampleItems />
    </Accordion>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const firstTrigger = canvas.getByRole("button", {
      name: /section one/i
    });
    const secondTrigger = canvas.getByRole("button", {
      name: /section two/i
    });

    // Starts with item-1 expanded because defaultValue includes "item-1"
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(secondTrigger).toHaveAttribute("aria-expanded", "false");

    // In non-collapsible single mode, clicking item-2 moves expansion from item-1 to item-2
    await userEvent.click(secondTrigger);
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "false");
    await expect(secondTrigger).toHaveAttribute("aria-expanded", "true");
  }
}`,...(xe=(ve=V.parameters)==null?void 0:ve.docs)==null?void 0:xe.source}}};var be,Ae,Ce;L.parameters={...L.parameters,docs:{...(be=L.parameters)==null?void 0:be.docs,source:{originalSource:`{
  name: "Single, Collapsible",
  args: {
    type: "single",
    collapsible: true,
    defaultValue: "item-1",
    orientation: "vertical"
  },
  render: args => <Accordion {...args}>
      <ExampleItems />
    </Accordion>,
  play: async ({
    canvasElement
  }) => {
    await focusAndToggleFirstItem(canvasElement, true);
  }
}`,...(Ce=(Ae=L.parameters)==null?void 0:Ae.docs)==null?void 0:Ce.source}}};var he,we,ye;F.parameters={...F.parameters,docs:{...(he=F.parameters)==null?void 0:he.docs,source:{originalSource:`{
  name: "Multiple",
  args: {
    type: "multiple",
    defaultValue: ["item-1", "item-2"],
    orientation: "vertical"
  },
  render: args => <Accordion {...args}>
      <ExampleItems />
    </Accordion>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const firstTrigger = canvas.getByRole("button", {
      name: /section one/i
    });
    const secondTrigger = canvas.getByRole("button", {
      name: /section two/i
    });
    await expect(firstTrigger).toBeInTheDocument();
    await expect(secondTrigger).toBeInTheDocument();

    // First and second items should start expanded based on defaultValue.
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(secondTrigger).toHaveAttribute("aria-expanded", "true");

    // Toggle second item closed, then open again.
    await userEvent.tab();
    await expect(firstTrigger).toHaveFocus();
    await userEvent.tab();
    await expect(secondTrigger).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(secondTrigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.keyboard("{Enter}");
    await expect(secondTrigger).toHaveAttribute("aria-expanded", "true");
  }
}`,...(ye=(we=F.parameters)==null?void 0:we.docs)==null?void 0:ye.source}}};var Ie,Re,Te;U.parameters={...U.parameters,docs:{...(Ie=U.parameters)==null?void 0:Ie.docs,source:{originalSource:`{
  name: "Disabled",
  args: {
    type: "single",
    collapsible: true,
    orientation: "vertical",
    disabled: true
  },
  render: args => <Accordion {...args}>
      <ExampleItems />
    </Accordion>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const firstTrigger = canvas.getByRole("button", {
      name: /section one/i
    });
    await expect(firstTrigger).toHaveAttribute("data-disabled", "");
  }
}`,...(Te=(Re=U.parameters)==null?void 0:Re.docs)==null?void 0:Te.source}}};var Ne,Ee,_e;W.parameters={...W.parameters,docs:{...(Ne=W.parameters)==null?void 0:Ne.docs,source:{originalSource:`{
  name: "All Collapsed",
  args: {
    type: "single",
    collapsible: true,
    orientation: "vertical"
  },
  render: args => <Accordion {...args}>
      <ExampleItems />
    </Accordion>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const firstTrigger = canvas.getByRole("button", {
      name: /section one/i
    });
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "false");
  }
}`,...(_e=(Ee=W.parameters)==null?void 0:Ee.docs)==null?void 0:_e.source}}};var Se,je,Pe;K.parameters={...K.parameters,docs:{...(Se=K.parameters)==null?void 0:Se.docs,source:{originalSource:`{
  name: "With Icon in Trigger",
  args: {
    type: "multiple",
    orientation: "vertical"
  },
  render: args => <Accordion {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <span role="img" aria-hidden="true" style={{
          marginRight: 4
        }}>
            ℹ️
          </span>
          Account settings
        </AccordionTrigger>
        <AccordionContent>
          Use accordions to hide optional or advanced settings that are not needed by most users.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Billing details</AccordionTrigger>
        <AccordionContent>
          Keep billing preferences and invoices grouped in a single accordion to reduce noise.
        </AccordionContent>
      </AccordionItem>
    </Accordion>,
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const firstTrigger = canvas.getByRole("button", {
      name: /account settings/i
    });
    await expect(firstTrigger).toBeInTheDocument();
    await userEvent.tab();
    await expect(firstTrigger).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.keyboard(" ");
    await expect(firstTrigger).toHaveAttribute("aria-expanded", "false");
  }
}`,...(Pe=(je=K.parameters)==null?void 0:je.docs)==null?void 0:Pe.source}}};const gn=["SingleNonCollapsible","SingleCollapsible","Multiple","Disabled","AllCollapsed","WithIconInTrigger"];export{W as AllCollapsed,U as Disabled,F as Multiple,L as SingleCollapsible,V as SingleNonCollapsible,K as WithIconInTrigger,gn as __namedExportsOrder,fn as default};
