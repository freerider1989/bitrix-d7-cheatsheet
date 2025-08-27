let modules = [
  {id:1, name:"main", description:"Ядро Bitrix", example:"Loader::includeModule('main');", x:50, y:50},
  {id:1, name:"main", description:"Ядро Bitrix", example:"Loader::includeModule('main');", x:100, y:100},
  {id:2, name:"crm", description:"CRM сделки и контакты", example:"use Bitrix.Crm.DealTable;", x:200, y:100}
];

const canvas = document.getElementById('canvas');
const sidebar = document.getElementById('details');
let dragTarget = null, offsetX=0, offsetY=0;

function render() {
  canvas.innerHTML = "";
  modules.forEach(m=>{
    let el = document.createElement('div');
    el.className = "module";
    el.style.left = m.x+"px";
    el.style.top = m.y+"px";
    el.textContent = m.name;
    el.onclick = ()=>showDetails(m);
    el.onmousedown = e=>{
      dragTarget = m; offsetX = e.offsetX; offsetY = e.offsetY;
    };
    canvas.appendChild(el);
  });
}
function showDetails(m) {
  sidebar.innerHTML = `
    <h4>${m.name}</h4>
    <p>${m.description}</p>
    <pre>${m.example}</pre>
  `;
}

document.onmousemove = e=>{
  if(dragTarget){
    dragTarget.x = e.pageX - offsetX;
    dragTarget.y = e.pageY - offsetY;
    render();
  }
};
document.onmouseup = ()=>dragTarget=null;

document.getElementById('add').onclick=()=>{
  let id = Date.now();
  modules.push({id, name:"new", description:"Описание", example:"код", x:100, y:100});
  render();
};
document.getElementById('save').onclick=()=>{
  const blob = new Blob([JSON.stringify(modules)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download="modules.json"; a.click();
  URL.revokeObjectURL(url);
};
document.getElementById('load').onchange=(e)=>{
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload=()=>{ modules=JSON.parse(reader.result); render(); };
  reader.readAsText(file);
};

render();
