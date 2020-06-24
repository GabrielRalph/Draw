const PATH = "./smartSvgFolder"

const TAG_NAMES = "path,ellipse,line,rect,g,def,a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,canvas,caption,cite,code,col,colgroup,data,datalist,dd,del,details,dfn,dialog,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,i,iframe,img,input,ins,kbd,label,legend,li,link,main,map,mark,menu,meta,meter,nav,noscript,object,ol,optgroup,option,output,p,param,picture,pre,progress,q,rp,rt,ruby,s,samp,script,section,select,slot,small,source,span,strong,style,sub,summary,sup,svg,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,u,ul,var,video,wbr"

let children = document.getElementsByTagName('*')
// console.log(children);
for (var i in children){

  let child = children[i]
  let name = child.tagName?child.tagName.toLowerCase():"";

  if (TAG_NAMES.indexOf(name) == -1){

    let iframe = document.createElement('iframe');
    iframe.setAttribute('style', 'display: none')
    iframe.setAttribute('src', `${PATH}/${name}.svg`)
    document.body.appendChild(iframe)

    iframe.addEventListener('load', () => {
      let svg = iframe.contentWindow.document.children[0]
      let parent = child.parentNode
      let att = child.attributes;
      for (var i = 0; i < att.length; i++){
        if(att[i].name == 'class'){
          let classes = svg.getAttribute('class') + ' ' + att[i].value
          svg.setAttribute('class', classes)
        }else{
          svg.setAttribute(att[i].name,att[i].value)
        }
      }
      parent.insertBefore(svg, child)
      parent.removeChild(child)
      document.body.removeChild(iframe)
    })
  }
}
