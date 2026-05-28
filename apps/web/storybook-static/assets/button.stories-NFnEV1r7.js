import{j as e,T as ie,b as le,P as ce,c as de,S as me}from"./index-wuuIeaMp.js";import{within as g,expect as r,userEvent as ue}from"./index-DgAF9SIF.js";import{c as pe,a as be,b as a,C as ve}from"./ContractTokenTable-CstqZNbS.js";import{r as ye}from"./index-ClcD9ViR.js";import"./iframe-gXbLLbqQ.js";import"./index-BrKcqHra.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-Bhelpi4i.js";import"./index-DrFu-skq.js";const ge=be("ds-button",{variants:{variant:{primary:"ds-button--primary",secondary:"ds-button--secondary",ghost:"ds-button--ghost",destructive:"ds-button--destructive"},size:{sm:"ds-button--sm",md:"ds-button--md",lg:"ds-button--lg"},iconOnly:{true:"ds-button--icon-only"},fullWidth:{true:"ds-button--full-width"}},defaultVariants:{variant:"primary",size:"md"}}),s=ye.forwardRef(({label:n,variant:o,size:t,loading:h=!1,iconOnly:x=!1,fullWidth:ae=!1,iconStart:f,iconEnd:z,disabled:ne,className:te,...se},re)=>{const oe=ne||h;return e.jsx("button",{ref:re,className:pe(ge({variant:o,size:t,iconOnly:x,fullWidth:ae}),te),disabled:oe,"aria-label":x?n:void 0,"aria-busy":h||void 0,...se,children:h?e.jsx("span",{className:"ds-button__spinner","aria-hidden":"true"}):e.jsxs(e.Fragment,{children:[f&&e.jsx("span",{className:"ds-button__icon ds-button__icon--start","aria-hidden":"true",children:f}),!x&&e.jsx("span",{className:"ds-button__label",children:n}),z&&e.jsx("span",{className:"ds-button__icon ds-button__icon--end","aria-hidden":"true",children:z})]})})});s.displayName="Button";s.__docgenInfo={description:"",methods:[],displayName:"Button",props:{label:{required:!0,tsType:{name:"string"},description:"Visible button text. Also used as accessible label when iconOnly is true."},variant:{required:!1,tsType:{name:"union",raw:'"primary" | "secondary" | "ghost" | "destructive"',elements:[{name:"literal",value:'"primary"'},{name:"literal",value:'"secondary"'},{name:"literal",value:'"ghost"'},{name:"literal",value:'"destructive"'}]},description:""},size:{required:!1,tsType:{name:"union",raw:'"sm" | "md" | "lg"',elements:[{name:"literal",value:'"sm"'},{name:"literal",value:'"md"'},{name:"literal",value:'"lg"'}]},description:""},loading:{required:!1,tsType:{name:"boolean"},description:"Replaces label with a loading spinner and prevents interaction.",defaultValue:{value:"false",computed:!1}},iconOnly:{required:!1,tsType:{name:"boolean"},description:"Renders as a square icon button. Label becomes the aria-label.",defaultValue:{value:"false",computed:!1}},fullWidth:{required:!1,tsType:{name:"boolean"},description:"Stretches the button to fill its container.",defaultValue:{value:"false",computed:!1}},iconStart:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Icon rendered before the label. Pass an SVG element or icon component."},iconEnd:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Icon rendered after the label."}},composes:["Omit"]};var w,B,j;const Ce={title:"Components/Button",component:s,tags:["autodocs"],parameters:{docs:{description:{component:[a.description??"","","### Usage",((w=a.usage)==null?void 0:w.summary)??"","","**Do**",(((B=a.usage)==null?void 0:B.do)??[]).map(n=>`- ${n}`).join(`
`),"","**Don't**",(((j=a.usage)==null?void 0:j.dont)??[]).map(n=>`- ${n}`).join(`
`),"",`**Contract version:** ${a.version??"—"} · **Status:** ${a.status??"—"}`].join(`
`)},page:()=>e.jsxs(e.Fragment,{children:[e.jsx(ie,{}),e.jsx(le,{}),e.jsx(ce,{}),e.jsx(de,{}),e.jsx(me,{}),e.jsx(ve,{tokens:a.tokens})]})}},argTypes:{variant:{control:"select",options:a.props.variant.values,description:a.props.variant.description},size:{control:"select",options:a.props.size.values,description:a.props.size.description},label:{control:"text",description:a.props.label.description},loading:{control:"boolean",description:a.props.loading.description},disabled:{control:"boolean"},iconOnly:{control:"boolean",description:a.props.iconOnly.description},fullWidth:{control:"boolean",description:a.props.fullWidth.description}}},i={args:{variant:"primary",size:"md",label:"Continue"},play:async({canvasElement:n})=>{const t=g(n).getByRole("button",{name:"Continue"});await r(t).toBeInTheDocument(),await r(t).not.toBeDisabled(),await ue.click(t)}},l={args:{variant:"secondary",size:"md",label:"Cancel"}},c={args:{variant:"ghost",size:"md",label:"More options"}},d={args:{variant:"destructive",size:"md",label:"Delete"},parameters:{docs:{description:{story:"For irreversible actions. Always pair with a confirmation step."}}}},m={args:{variant:"primary",size:"md",label:"Saving",loading:!0},play:async({canvasElement:n})=>{const t=g(n).getByRole("button");await r(t).toBeDisabled(),await r(t).toHaveAttribute("aria-busy","true")}},u={args:{variant:"primary",size:"md",label:"Continue",disabled:!0},play:async({canvasElement:n})=>{const t=g(n).getByRole("button",{name:"Continue"});await r(t).toBeDisabled()}},p={args:{variant:"ghost",size:"md",iconOnly:!0,label:"Close"},play:async({canvasElement:n})=>{const t=g(n).getByRole("button",{name:"Close"});await r(t).toBeInTheDocument()}},b={args:{variant:"primary",size:"md",label:"Get started",fullWidth:!0}},v={args:{label:"Medium",variant:"primary",size:"md"},render:()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx(s,{variant:"primary",size:"sm",label:"Small"}),e.jsx(s,{variant:"primary",size:"md",label:"Medium"}),e.jsx(s,{variant:"primary",size:"lg",label:"Large"})]})},y={args:{label:"Primary",variant:"primary",size:"md"},render:()=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"12px"},children:[e.jsx(s,{variant:"primary",label:"Primary"}),e.jsx(s,{variant:"secondary",label:"Secondary"}),e.jsx(s,{variant:"ghost",label:"Ghost"}),e.jsx(s,{variant:"destructive",label:"Destructive"})]})};var S,D,C;i.parameters={...i.parameters,docs:{...(S=i.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    variant: "primary",
    size: "md",
    label: "Continue"
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", {
      name: "Continue"
    });
    await expect(button).toBeInTheDocument();
    await expect(button).not.toBeDisabled();
    await userEvent.click(button);
  }
}`,...(C=(D=i.parameters)==null?void 0:D.docs)==null?void 0:C.source}}};var R,T,_;l.parameters={...l.parameters,docs:{...(R=l.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    variant: "secondary",
    size: "md",
    label: "Cancel"
  }
}`,...(_=(T=l.parameters)==null?void 0:T.docs)==null?void 0:_.source}}};var E,I,N;c.parameters={...c.parameters,docs:{...(E=c.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    variant: "ghost",
    size: "md",
    label: "More options"
  }
}`,...(N=(I=c.parameters)==null?void 0:I.docs)==null?void 0:N.source}}};var O,q,P;d.parameters={...d.parameters,docs:{...(O=d.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    variant: "destructive",
    size: "md",
    label: "Delete"
  },
  parameters: {
    docs: {
      description: {
        story: "For irreversible actions. Always pair with a confirmation step."
      }
    }
  }
}`,...(P=(q=d.parameters)==null?void 0:q.docs)==null?void 0:P.source}}};var V,W,A;m.parameters={...m.parameters,docs:{...(V=m.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    variant: "primary",
    size: "md",
    label: "Saving",
    loading: true
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute("aria-busy", "true");
  }
}`,...(A=(W=m.parameters)==null?void 0:W.docs)==null?void 0:A.source}}};var G,F,L;u.parameters={...u.parameters,docs:{...(G=u.parameters)==null?void 0:G.docs,source:{originalSource:`{
  args: {
    variant: "primary",
    size: "md",
    label: "Continue",
    disabled: true
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", {
      name: "Continue"
    });
    await expect(button).toBeDisabled();
  }
}`,...(L=(F=u.parameters)==null?void 0:F.docs)==null?void 0:L.source}}};var M,k,$;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    variant: "ghost",
    size: "md",
    iconOnly: true,
    label: "Close"
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    // Label becomes aria-label when iconOnly is true
    const button = canvas.getByRole("button", {
      name: "Close"
    });
    await expect(button).toBeInTheDocument();
  }
}`,...($=(k=p.parameters)==null?void 0:k.docs)==null?void 0:$.source}}};var H,U,J;b.parameters={...b.parameters,docs:{...(H=b.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    variant: "primary",
    size: "md",
    label: "Get started",
    fullWidth: true
  }
}`,...(J=(U=b.parameters)==null?void 0:U.docs)==null?void 0:J.source}}};var K,Q,X;v.parameters={...v.parameters,docs:{...(K=v.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    label: "Medium",
    variant: "primary",
    size: "md"
  },
  render: () => <div style={{
    display: "flex",
    alignItems: "center",
    gap: "12px"
  }}>
      <Button variant="primary" size="sm" label="Small" />
      <Button variant="primary" size="md" label="Medium" />
      <Button variant="primary" size="lg" label="Large" />
    </div>
}`,...(X=(Q=v.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,ee;y.parameters={...y.parameters,docs:{...(Y=y.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    label: "Primary",
    variant: "primary",
    size: "md"
  },
  render: () => <div style={{
    display: "flex",
    alignItems: "center",
    gap: "12px"
  }}>
      <Button variant="primary" label="Primary" />
      <Button variant="secondary" label="Secondary" />
      <Button variant="ghost" label="Ghost" />
      <Button variant="destructive" label="Destructive" />
    </div>
}`,...(ee=(Z=y.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};const Re=["Primary","Secondary","Ghost","Destructive","Loading","Disabled","IconOnly","FullWidth","SizeScale","AllVariants"];export{y as AllVariants,d as Destructive,u as Disabled,b as FullWidth,c as Ghost,p as IconOnly,m as Loading,i as Primary,l as Secondary,v as SizeScale,Re as __namedExportsOrder,Ce as default};
