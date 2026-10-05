(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const PHONE='0393639596', ZALO='https://zalo.me/'+PHONE;

/* ====== Ảnh: sửa tên file / tiêu đề tại đây ====== */
const PHOTOS=[
 {src:'images/lan-01.jpg',cat:'khaitruong',t:'Lễ khai trương – ra mắt dự án',d:'Hai lân đỏ – vàng chào mừng khách tại sự kiện ngoài trời.'},
 {src:'images/lan-02.jpg',cat:'trungthu',t:'Lân về lớp học – Vui Tết Trung Thu',d:'Các bé hào hứng chạm vào chú lân ngay trong lớp.'},
 {src:'images/lan-03.jpg',cat:'sukien',t:'Sân khấu Trung Thu “Hạnh Phúc Tròn Như Trăng”',d:'Hai lân, đội trống cùng linh vật trên sân khấu lớn.'},
 {src:'images/lan-04.jpg',cat:'trungthu',t:'Rước đèn đêm Trung Thu',d:'Đoàn lân, Ông Địa và đèn ông sao diễu hành trên phố.'},
 {src:'images/lan-05.jpg',cat:'truonghoc',t:'Lân múa giữa sân trường',d:'Hàng trăm học sinh vây quanh chú lân đỏ.'},
 {src:'images/lan-06.jpg',cat:'truonghoc',t:'Lân vàng cùng các bé múa đèn',d:'Tiết mục phối hợp với đội văn nghệ của trường.'},
 {src:'images/lan-07.jpg',cat:'trungthu',t:'Mầm non đón Trung Thu',d:'Lân – Ông Địa và mâm cỗ trái cây tạo hình rực rỡ.'},
 {src:'images/lan-10.jpg',cat:'sukien',t:'Hội thao – Lân và Thần Tài',d:'Mở màn hội thao cán bộ, viên chức trên sân khấu hội trường.'},
 {src:'images/lan-11.jpg',cat:'truonghoc',t:'Lồng đèn cho em',d:'Lân nâng cao, múa cùng đội thiếu nhi.'},
 {src:'images/lan-12.jpg',cat:'khaitruong',t:'Khai trương cửa hàng – Thần Tài & lân',d:'Linh vật Thần Tài và hai lân chúc mừng khai trương.'}
];
const CATS={khaitruong:'Khai trương',trungthu:'Trung Thu',truonghoc:'Trường học',sukien:'Sự kiện'};

window.fallback=function(img){ // ảnh chưa có -> hiện khung chờ
  const ph=document.createElement('div');ph.className='tile ph';ph.style.cursor='default';ph.textContent='Thêm ảnh: '+img.getAttribute('src');
  img.replaceWith(ph);
};
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2400)}

/* ====== Theme ====== */
const root=document.documentElement;
function setTheme(d){root.classList.toggle('dark',d);$('#theme use').setAttribute('href',d?'#sun':'#moon');try{localStorage.setItem('theme',d?'dark':'light')}catch(e){}}
let saved=null;try{saved=localStorage.getItem('theme')}catch(e){}
setTheme(saved?saved==='dark':matchMedia('(prefers-color-scheme: dark)').matches);
$('#theme').onclick=()=>setTheme(!root.classList.contains('dark'));
$('#yr').textContent=new Date().getFullYear();

/* ====== Gallery ====== */
const G=$('#gallery');let cat='all';const adj=PHOTOS.map(()=>({b:100,c:100,s:100}));
function filt(i){const a=adj[i];return `brightness(${a.b}%) contrast(${a.c}%) saturate(${a.s}%)`}
function render(){
  G.innerHTML='';
  PHOTOS.forEach((p,i)=>{
    if(cat!=='all'&&p.cat!==cat)return;
    const b=document.createElement('button');b.className='tile reveal in';b.type='button';b.dataset.i=i;b.setAttribute('aria-label','Xem ảnh: '+p.t);
    b.innerHTML=`<img src="${p.src}" alt="${p.t}" loading="lazy"><span class="zoom"><svg class="i"><use href="#zoom"/></svg></span><span class="ov"><b>${p.t}</b><span><span class="badge sec">${CATS[p.cat]}</span> Bấm để phóng to</span></span>`;
    const im=b.firstChild;im.onerror=()=>{b.classList.add('ph');b.style.cursor='default';b.innerHTML='Thêm ảnh: '+p.src;b.onclick=null;};
    G.appendChild(b);
  });
}
render();
$('#tabs').addEventListener('click',e=>{const t=e.target.closest('.tab');if(!t)return;$$('.tab').forEach(x=>x.setAttribute('aria-selected',x===t));cat=t.dataset.cat;render()});
$('#gb').oninput=e=>root.style.setProperty('--gb',e.target.value/100);
$('#gbReset').onclick=()=>{$('#gb').value=100;root.style.setProperty('--gb',1)};
G.addEventListener('click',e=>{const t=e.target.closest('.tile');if(t&&t.dataset.i!==undefined&&!t.classList.contains('ph'))openLB(+t.dataset.i)});

/* ====== Lightbox ====== */
const dlg=$('#dlg');let cur=0,lastFocus=null;
function apply(){const a=adj[cur];$('#fB').value=a.b;$('#fC').value=a.c;$('#fS').value=a.s;$('#vB').textContent=a.b+'%';$('#vC').textContent=a.c+'%';$('#vS').textContent=a.s+'%';$('#lbImg').style.filter=filt(cur)}
function show(){const p=PHOTOS[cur];$('#lbImg').src=p.src;$('#lbImg').alt=p.t;$('#lbTitle').textContent=p.t;$('#lbDesc').textContent=p.d;$('#lbCat').textContent=CATS[p.cat];apply()}
function openLB(i){lastFocus=document.activeElement;cur=i;show();dlg.classList.add('open');document.body.style.overflow='hidden';$('#lbClose').focus()}
function closeLB(){dlg.classList.remove('open');document.body.style.overflow='';lastFocus&&lastFocus.focus()}
function step(d){cur=(cur+d+PHOTOS.length)%PHOTOS.length;show()}
$('#lbClose').onclick=closeLB;$('#lbPrev').onclick=()=>step(-1);$('#lbNext').onclick=()=>step(1);
dlg.addEventListener('click',e=>{if(e.target===dlg)closeLB()});
$('#lbBook').addEventListener('click',closeLB);
document.addEventListener('keydown',e=>{if(!dlg.classList.contains('open'))return;if(e.key==='Escape')closeLB();if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)});
[['fB','b'],['fC','c'],['fS','s']].forEach(([id,k])=>$('#'+id).oninput=e=>{adj[cur][k]=+e.target.value;apply()});
$$('[data-preset]').forEach(b=>b.onclick=()=>{const m={dark:[65,110,100],orig:[100,100,100],light:[130,95,110]}[b.dataset.preset];adj[cur]={b:m[0],c:m[1],s:m[2]};apply()});

/* ====== Booking ====== */
const SVCS=['Khai trương','Trung Thu','Tết / Tất niên','Trường học','Sự kiện doanh nghiệp','Ông Địa / Thần Tài','Gói Cơ bản','Gói Nổi bật','Gói Cao cấp'];
$('#svcOpts').innerHTML=SVCS.map((s,i)=>`<label class="opt"><input type="radio" name="svc" value="${s}"><div>${s}</div></label>`).join('');
let stepN=1;const total=4;
function go(n){
  stepN=n;$$('.pane').forEach(p=>p.classList.toggle('on',+p.dataset.p===n));
  $$('.step').forEach(s=>{const k=+s.dataset.s;s.classList.toggle('on',k===n);s.classList.toggle('done',k<n)});
  $('#bar').style.width=(n/total*100)+'%';
  $('#prev').disabled=n===1;$('#actions').style.display=n===4?'none':'flex';
  $('#next').textContent=n===3?'Xem lại & xác nhận':'Tiếp tục';
}
const val=id=>$('#'+id).value.trim();
function setErr(id,m){$('#'+id).textContent=m||'';return !m}
function valid(n){
  if(n===1){return setErr('e1',$('input[name=svc]:checked')?'':'Vui lòng chọn một dịch vụ.')}
  if(n===2){
    let ok=true;
    const d=val('date');ok=setErr('e2a',!d?'Chọn ngày biểu diễn.':(new Date(d)<new Date(new Date().toDateString())?'Ngày không hợp lệ.':''))&&ok;
    ok=setErr('e2b',val('time')?'':'Chọn giờ bắt đầu.')&&ok;
    ok=setErr('e2c',val('place').length<5?'Nhập địa chỉ cụ thể hơn.':'')&&ok;return ok;
  }
  if(n===3){
    let ok=true;
    ok=setErr('e3a',val('name').length<2?'Nhập họ tên.':'')&&ok;
    ok=setErr('e3b',/^(\+?84|0)\d{9}$/.test(val('phone').replace(/[\s.\-]/g,''))?'':'Số điện thoại chưa đúng.')&&ok;return ok;
  }
  return true;
}
function message(){
  const svc=($('input[name=svc]:checked')||{}).value||'';
  const ex=$$('input[name=extra]:checked').map(x=>x.value).join(', ')||'Không';
  const d=val('date').split('-').reverse().join('/');
  return `ĐẶT LỊCH LÂN SƯ RỒNG
• Dịch vụ: ${svc}
• Số đội: ${$('#teams').value}
• Tiết mục thêm: ${ex}
• Ngày giờ: ${val('time')} – ${d}
• Địa điểm: ${val('place')} (${$('#venue').value})
• Khách hàng: ${val('name')} – ${val('phone')}`+(val('note')?`\n• Ghi chú: ${val('note')}`:'');
}
$('#next').onclick=()=>{if(!valid(stepN))return;if(stepN===3){$('#summary').textContent=message()}go(stepN+1)};
$('#prev').onclick=()=>go(stepN-1);
$('#form').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.tagName!=='TEXTAREA'){e.preventDefault();$('#next').click()}});
async function copy(t){try{await navigator.clipboard.writeText(t);return true}catch(e){const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();let ok=false;try{ok=document.execCommand('copy')}catch(_){}a.remove();return ok}}
$('#copyBtn').onclick=async()=>toast(await copy(message())?'Đã sao chép nội dung đặt lịch':'Không sao chép được, hãy chép thủ công');
$('#sendZalo').onclick=async()=>{await copy(message());toast('Đã sao chép – dán vào Zalo để gửi anh Tú');window.open(ZALO,'_blank','noopener')};
// chọn dịch vụ từ các thẻ -> nhảy xuống form
$$('[data-svc]').forEach(b=>b.addEventListener('click',()=>{
  const r=$$('input[name=svc]').find(x=>x.value===b.dataset.svc);if(r)r.checked=true;
  go(1);setErr('e1','');$('#dat-lich').scrollIntoView({behavior:'smooth'});
}));
// ngày tối thiểu = hôm nay
const t=new Date();$('#date').min=t.getFullYear()+'-'+String(t.getMonth()+1).padStart(2,'0')+'-'+String(t.getDate()).padStart(2,'0');
$('#lbBook').addEventListener('click',()=>{const cs={khaitruong:'Khai trương',trungthu:'Trung Thu',truonghoc:'Trường học',sukien:'Sự kiện doanh nghiệp'}[PHOTOS[cur].cat];const r=$$('input[name=svc]').find(x=>x.value===cs);if(r)r.checked=true;go(1)});

/* ====== Reveal ====== */
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12}):null;
$$('.reveal').forEach(el=>io?io.observe(el):el.classList.add('in'));
})();
