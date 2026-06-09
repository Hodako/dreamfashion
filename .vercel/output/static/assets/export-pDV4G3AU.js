function l(c,a,r){const n=t=>`"${String(t).replace(/"/g,'""')}"`,s=[a.map(n).join(","),...r.map(t=>t.map(n).join(","))].join(`
`),i=new Blob(["\uFEFF"+s],{type:"text/csv;charset=utf-8;"}),o=URL.createObjectURL(i),e=document.createElement("a");e.href=o,e.download=c,e.click(),URL.revokeObjectURL(o)}function p(){return new Date().toISOString().slice(0,10)}export{l as d,p as e};
