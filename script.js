const DEFAULT = {
  "siteName": "Kho Cá Nhân",
  "owner": "Hùng Hoàng",
  "heroTitle": "Kho cá nhân của tôi",
  "heroDesc": "Một nơi để lưu nhạc, ứng dụng, nguồn tài nguyên và các liên kết yêu thích.",
  "ownerBio": "Personal collection",
  "about": "Website tĩnh, tối ưu cho GitHub Pages. Nội dung có thể quản lý bằng bảng điều khiển và lưu trên thiết bị bằng LocalStorage.",
  "music": [
    {"id":"m1","title":"Bài nhạc mẫu","artist":"Your Artist","url":"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3","cover":""}
  ],
  "apps": [
    {"id":"a1","title":"Ứng dụng mẫu","desc":"Thêm mô tả ứng dụng tại đây.","icon":"","url":"https://example.com","type":"Web"},
    {"id":"a2","title":"Nguồn ứng dụng mẫu","desc":"Kho hoặc nguồn tải ứng dụng.","icon":"","url":"https://example.com","type":"Source"}
  ],
  "links": [
    {"id":"l1","title":"GitHub","desc":"Mã nguồn website","url":"https://github.com/"},
    {"id":"l2","title":"Telegram","desc":"Kênh của tôi","url":"https://t.me/"}
  ]
};
const KEY="personal_hub_data_v1";
let data;
try{data=JSON.parse(localStorage.getItem(KEY))||structuredClone(DEFAULT)}catch{data=structuredClone(DEFAULT)}

const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
function save(){localStorage.setItem(KEY,JSON.stringify(data)); render(); updatePreview()}
function render(){
  $("#siteName").textContent=data.siteName; $("#heroTitle").textContent=data.heroTitle;
  $("#heroDesc").textContent=data.heroDesc; $("#ownerName").textContent=data.owner;
  $("#ownerBio").textContent=data.ownerBio; $("#avatar").textContent=(data.owner||"H").trim()[0]?.toUpperCase()||"H";
  $("#aboutText").textContent=data.about; $("#copyright").textContent="© "+new Date().getFullYear()+" "+data.owner;
  $("#musicCount").textContent=data.music.length+" bài"; $("#appCount").textContent=data.apps.length+" mục";
  $("#musicList").innerHTML=data.music.map((x,i)=>`<article class="card"><div class="card-top"><div class="card-icon">${x.cover?`<img src="${esc(x.cover)}" alt="">`:"♫"}</div><div><h3>${esc(x.title)}</h3><p>${esc(x.artist||"Unknown")}</p></div></div><div class="card-actions"><button class="small-btn" onclick="playMusic(${i})">▶ Phát</button><a class="small-btn" href="${esc(x.url)}" target="_blank" rel="noopener">Mở link</a></div></article>`).join("");
  renderApps();
  $("#linkList").innerHTML=data.links.map(x=>`<a class="link-item" href="${esc(x.url)}" target="_blank" rel="noopener"><div><b>${esc(x.title)}</b><span>${esc(x.desc||x.url)}</span></div><span>↗</span></a>`).join("");
  renderAdmin();
}
function renderApps(){
  const q=($("#search")?.value||"").toLowerCase().trim();
  const arr=data.apps.filter(x=>(x.title+" "+x.desc+" "+x.type).toLowerCase().includes(q));
  $("#appList").innerHTML=arr.map(x=>`<article class="card"><div class="card-top"><div class="card-icon">${x.icon?`<img src="${esc(x.icon)}" alt="">`:"▦"}</div><div><h3>${esc(x.title)}</h3><p>${esc(x.desc||"")}</p><span class="tag">${esc(x.type||"APP")}</span></div></div><div class="card-actions"><a class="small-btn" href="${esc(x.url)}" target="_blank" rel="noopener">Mở / Tải</a></div></article>`).join("");
}
function renderAdmin(){
  $("#musicAdmin").innerHTML=data.music.map((x,i)=>`<div class="admin-row"><div class="meta"><strong>${esc(x.title)}</strong><small>${esc(x.artist||"")} · ${esc(x.url)}</small></div><div class="admin-actions"><button class="small-btn" onclick="editMusic(${i})">Sửa</button><button class="small-btn" onclick="delItem('music',${i})">Xóa</button></div></div>`).join("");
  $("#appAdmin").innerHTML=data.apps.map((x,i)=>`<div class="admin-row"><div class="meta"><strong>${esc(x.title)}</strong><small>${esc(x.type||"")} · ${esc(x.url)}</small></div><div class="admin-actions"><button class="small-btn" onclick="editApp(${i})">Sửa</button><button class="small-btn" onclick="delItem('apps',${i})">Xóa</button></div></div>`).join("");
  $("#linkAdmin").innerHTML=data.links.map((x,i)=>`<div class="admin-row"><div class="meta"><strong>${esc(x.title)}</strong><small>${esc(x.url)}</small></div><div class="admin-actions"><button class="small-btn" onclick="editLink(${i})">Sửa</button><button class="small-btn" onclick="delItem('links',${i})">Xóa</button></div></div>`).join("");
}
window.playMusic=i=>{const x=data.music[i];$("#audio").src=x.url;$("#nowTitle").textContent=x.title;$("#nowArtist").textContent=x.artist||"—";$("#cover").innerHTML=x.cover?`<img src="${esc(x.cover)}" alt="">`:"♫";$("#audio").play().catch(()=>{});};
window.delItem=(key,i)=>{if(confirm("Xóa mục này?")){data[key].splice(i,1);save()}};
function editMusic(i){const x=data.music[i];$("#mId").value=x.id;$("#mTitle").value=x.title;$("#mArtist").value=x.artist||"";$("#mUrl").value=x.url;$("#mCover").value=x.cover||""}
function editApp(i){const x=data.apps[i];$("#aId").value=x.id;$("#aTitle").value=x.title;$("#aDesc").value=x.desc||"";$("#aIcon").value=x.icon||"";$("#aUrl").value=x.url;$("#aType").value=x.type||""}
function editLink(i){const x=data.links[i];$("#lId").value=x.id;$("#lTitle").value=x.title;$("#lDesc").value=x.desc||"";$("#lUrl").value=x.url}
function clearForm(id){$(id).reset();$(id).querySelector("input[type=hidden]").value=""}
$("#editBtn").onclick=()=>{$("#modal").classList.add("show");fillSettings();updatePreview()};
$("#closeBtn").onclick=()=>$("#modal").classList.remove("show");
$("#modal").onclick=e=>{if(e.target.id==="modal")$("#modal").classList.remove("show")};
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab,.tab-content").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#"+b.dataset.tab).classList.add("active");updatePreview()});
function fillSettings(){$("#sSiteName").value=data.siteName;$("#sOwner").value=data.owner;$("#sDesc").value=data.heroDesc;$("#sAbout").value=data.about}
$("#saveSettings").onclick=()=>{data.siteName=$("#sSiteName").value;data.owner=$("#sOwner").value;data.heroDesc=$("#sDesc").value;data.heroTitle=data.heroTitle||"Kho cá nhân của tôi";data.about=$("#sAbout").value;save();alert("Đã lưu trên thiết bị.")};
$("#musicForm").onsubmit=e=>{e.preventDefault();const id=$("#mId").value||crypto.randomUUID();const x={id,title:$("#mTitle").value,artist:$("#mArtist").value,url:$("#mUrl").value,cover:$("#mCover").value};const i=data.music.findIndex(a=>a.id===id);i>=0?data.music[i]=x:data.music.push(x);clearForm("#musicForm");save()};
$("#appForm").onsubmit=e=>{e.preventDefault();const id=$("#aId").value||crypto.randomUUID();const x={id,title:$("#aTitle").value,desc:$("#aDesc").value,icon:$("#aIcon").value,url:$("#aUrl").value,type:$("#aType").value};const i=data.apps.findIndex(a=>a.id===id);i>=0?data.apps[i]=x:data.apps.push(x);clearForm("#appForm");save()};
$("#linkForm").onsubmit=e=>{e.preventDefault();const id=$("#lId").value||crypto.randomUUID();const x={id,title:$("#lTitle").value,desc:$("#lDesc").value,url:$("#lUrl").value};const i=data.links.findIndex(a=>a.id===id);i>=0?data.links[i]=x:data.links.push(x);clearForm("#linkForm");save()};
$("#mCancel").onclick=()=>clearForm("#musicForm");$("#aCancel").onclick=()=>clearForm("#appForm");$("#lCancel").onclick=()=>clearForm("#linkForm");
$("#search").oninput=renderApps;
function updatePreview(){$("#dataPreview").textContent=JSON.stringify(data,null,2)}
$("#exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="data.json";a.click();URL.revokeObjectURL(a.href)};
$("#importFile").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!x.music||!x.apps||!x.links)throw Error();data=x;save();alert("Đã nhập dữ liệu.")}catch{alert("File JSON không hợp lệ.")}};r.readAsText(f)};
$("#resetBtn").onclick=()=>{if(confirm("Khôi phục dữ liệu mẫu?")){data=structuredClone(DEFAULT);save()}};
render(); updatePreview();
