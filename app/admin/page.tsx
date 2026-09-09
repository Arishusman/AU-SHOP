'use client'; const API=process.env.NEXT_PUBLIC_API_URL||''; import {useMemo,useState,useEffect} from 'react'; import {products} from '@/lib/products'; import {categories} from '@/lib/categories'; import {money} from '@/lib/store'; import {Menu,X,Sun,Moon,Package,ShoppingCart,Star,FolderKanban} from 'lucide-react';
export default function Admin(){const[auth,setAuth]=useState(false);useEffect(()=>{if(localStorage.getItem('au_admin_token'))setAuth(true)},[]);const[step,setStep]=useState(0);const[user,setUser]=useState('');const[pass,setPass]=useState('');const[code,setCode]=useState('');const[challenge,setChallenge]=useState('');const[tab,setTab]=useState('home');const[side,setSide]=useState(false);const[theme,setTheme]=useState('dark');const[prod,setProd]=useState(products);const[cat,setCat]=useState(categories);const login=async()=>{try{const r=await fetch(API+'/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:user,password:pass})});const j=await r.json();if(!r.ok)throw new Error(j.error||'Login failed');setChallenge(j.data?.challenge||'');setStep(1)}catch(e){alert(e instanceof Error?e.message:'Login failed')}};if(!auth)return <main className="container page"><div className="summary" style={{maxWidth:460,margin:'70px auto'}}><div className="eyebrow">A.U SHOP ADMIN</div><h1 style={{fontSize:46}}>Dashboard login</h1>{step===0?<div className="form"><input placeholder="Username or admin email" value={user} onChange={e=>setUser(e.target.value)}/><input type="password" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)}/><button className="btn primary" onClick={login}>Continue</button></div>:<div className="form"><div className="notice">Verification code sent to <b>arishusm12an@gmail.com</b> via email. This code expires in 10 minutes.</div><input placeholder="6-digit code" value={code} onChange={e=>setCode(e.target.value)}/><button className="btn primary" onClick={async()=>{try{const r=await fetch(API+'/api/admin/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,challenge})});const j=await r.json();if(!r.ok)throw new Error(j.error||'Verification failed');localStorage.setItem('au_admin_token',j.data.token);setAuth(true)}catch(e){alert(e instanceof Error?e.message:'Verification failed')}}}>Open dashboard</button></div>}</div></main>;
const nav=[['home','Dashboard Home'],['orders','Orders'],['products','Products'],['categories','Categories'],['reviews','Reviews'],['blogs','Blogs'],['payments','Payments']];return <div className="adminShell"><header className="adminTop"><button className="iconbtn" onClick={()=>setSide(!side)}>{side?<X/>:<Menu/>}</button><b>A.U SHOP ADMIN</b><div style={{display:'flex',gap:8}}><button className="iconbtn" onClick={()=>{const n=theme==='dark'?'light':'dark';document.documentElement.dataset.theme=n;setTheme(n)}}>{theme==='dark'?<Sun/>:<Moon/>}</button><button className="btn" onClick={()=>{localStorage.removeItem("au_admin_token");setAuth(false);setStep(0);setCode("");setChallenge("")}}>Logout</button></div></header><div className="adminLayout"><aside className="adminSide">{nav.map(n=><a href={`#${n[0]}`} key={n[0]} onClick={e=>{e.preventDefault();setTab(n[0])}}>{n[1]}</a>)}</aside>{side&&<div className="drawer" onClick={()=>setSide(false)}><div className="drawerPanel" onClick={e=>e.stopPropagation()}><button className="iconbtn close" onClick={()=>setSide(false)}><X/></button><h2 style={{marginTop:50}}>Admin</h2>{nav.map(n=><a key={n[0]} href="#" onClick={()=>{setTab(n[0]);setSide(false)}}>{n[1]}</a>)}</div></div>}<main className="adminMain">{tab==='home'&&<Home products={prod} setTab={setTab}/>} {tab==='home-products'&&<HomePageProducts products={prod}/>} {tab==='home-categories'&&<HomePageCategories categories={cat}/>}  {tab==='orders'&&<Orders/>}{tab==='products'&&<Products products={prod} setProducts={setProd}/>} {tab==='categories'&&<CategoriesAdmin categories={cat} setCategories={setCat}/>} {tab==='reviews'&&<Reviews/>}{tab==='blogs'&&<Blogs/>}{tab==='payments'&&<Payments/>}</main></div></div>}
function Home({products,setTab}:{products:any[];setTab:(tab:string)=>void}){const[rows,setRows]=useState<any[]>([]);const[loading,setLoading]=useState(true);useEffect(()=>{const token=localStorage.getItem('au_admin_token')||'';fetch(API+'/api/orders',{headers:{Authorization:'Bearer '+token}}).then(r=>r.json()).then(j=>{if(j.ok)setRows(Array.isArray(j.data)?j.data:[])}).catch(()=>{}).finally(()=>setLoading(false))},[]);const active=rows.filter(r=>!r.cancelled);const totalSale=active.reduce((sum,r)=>sum+(Number(r.total)||0),0);const today=new Date().toDateString();const todayOrders=active.filter(r=>r.created_at&&new Date(r.created_at).toDateString()===today).length;const shipping=active.filter(r=>String(r.delivery_status||'').toLowerCase()!=='delivered').length;const delivered=rows.filter(r=>!r.cancelled&&String(r.delivery_status||'').toLowerCase()==='delivered').length;return <><div className='eyebrow'>Dashboard Home</div><h1 style={{fontSize:46}}>Overview</h1><div className='stats'><div className='stat'><span className='muted'>Total sale</span><h2>{money(totalSale)}</h2></div><div className='stat'><span className='muted'>Today order</span><h2>{todayOrders}</h2></div><div className='stat'><span className='muted'>In shipping</span><h2>{shipping}</h2></div><div className='stat'><span className='muted'>Delivered orders</span><h2>{delivered}</h2></div></div><div style={{display:'flex',gap:10,flexWrap:'wrap',margin:'20px 0'}}><button className="btn primary" onClick={()=>setTab('home-products')}>Home page product</button><button className="btn primary" onClick={()=>setTab('home-categories')}>Home page category</button></div><div className='section'><h2>New orders</h2>{loading?<div className='empty'>Loading orders...</div>:active.length===0?<div className='empty'>No live orders yet.</div>:<div className='table'><table><thead><tr><th>Order</th><th>Product</th><th>Buyer</th><th>Total</th><th>Delivery</th></tr></thead><tbody>{active.slice(0,5).map(r=>{const it=Array.isArray(r.order_items)&&r.order_items.length?r.order_items[0]:null;return <tr key={r.id}><td>{r.order_id}</td><td>{it?.name||'Order'}</td><td>{r.name||'—'}</td><td>{money(r.total||0)}</td><td>{r.delivery_status||'—'}</td></tr>})}</tbody></table></div>}</div></>}function Orders(){const[rows,setRows]=useState<any[]>([]);const[loading,setLoading]=useState(true);const[menu,setMenu]=useState<number|null>(null);const token=()=>localStorage.getItem('au_admin_token')||'';const load=()=>{fetch(API+'/api/orders',{headers:{Authorization:'Bearer '+token()}}).then(r=>r.json()).then(j=>{if(j.ok)setRows(Array.isArray(j.data)?j.data:[]);else alert(j.error||'Orders could not be loaded')}).catch(()=>alert('Unable to load orders')).finally(()=>setLoading(false))};useEffect(()=>{load()},[]);const updateStatus=async(id:number,field:string,value:string)=>{try{const r=await fetch(API+'/api/orders/'+id+'/status',{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token()},body:JSON.stringify({[field]:value})});const j=await r.json();if(!r.ok)throw new Error(j.error||'Status update failed');setRows(rows.map(x=>x.id===id?j.data:x));setMenu(null)}catch(e){alert(e instanceof Error?e.message:'Status update failed')}};const cancelOrder=async(id:number)=>{if(!confirm('Cancel this order?'))return;try{const r=await fetch(API+'/api/orders/'+id+'/cancel',{method:'POST',headers:{Authorization:'Bearer '+token()}});const j=await r.json();if(!r.ok)throw new Error(j.error||'Cancel failed');setRows(rows.map(x=>x.id===id?j.data:x));setMenu(null)}catch(e){alert(e instanceof Error?e.message:'Cancel failed')}};const printInvoice=(r:any)=>{const w=window.open('','_blank','width=700,height=800');if(!w){alert('Please allow pop-ups to print the invoice');return}const items=Array.isArray(r.order_items)&&r.order_items.length?r.order_items:[{name:'Order '+r.order_id,quantity:1,price:r.total||0}];w.document.write('<html><head><title>Invoice '+r.order_id+'</title><style>body{font-family:Arial;padding:30px}h1{margin-bottom:4px}.muted{color:#666}.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #ddd}.total{font-size:20px;font-weight:bold;margin-top:20px;text-align:right}</style></head><body><h1>A.U SHOP</h1><div class="muted">Invoice: '+r.order_id+'</div><p>Customer: '+(r.name||'—')+'<br>Phone: '+(r.phone||'—')+'<br>Address: '+(r.address||'—')+'</p><h3>Items</h3>'+items.map((it:any)=>'<div class="row"><span>'+String(it.name||'Product')+' × '+String(it.quantity||1)+'</span><span>'+money(Number(it.price||0)*Number(it.quantity||1))+'</span></div>').join('')+'<div class="total">Total: '+money(r.total||0)+'</div><p class="muted">Payment: '+(r.payment_status||'—')+'<br>Delivery: '+(r.delivery_status||'—')+'</p></body></html>');w.document.close();w.focus();setTimeout(()=>w.print(),300)};const active=rows.filter(r=>!r.cancelled);const cancelled=rows.filter(r=>r.cancelled);return <><div className='sectionHead'><h1>Orders</h1><span className='muted'>Quantity · Product · Buyer · Payment · Delivery · Actions</span></div>{loading?<div className='empty'>Loading orders...</div>:active.length===0?<div className='empty'>No live orders yet.</div>:<div className='table'><table><thead><tr><th>Qty</th><th>Product</th><th>Buyer</th><th>Payment</th><th>Delivery</th><th>•••</th></tr></thead><tbody>{active.map(r=>{const items=Array.isArray(r.order_items)&&r.order_items.length?r.order_items:[{name:'Order '+r.order_id,quantity:1}];return items.map((it:any,i:number)=><tr key={r.id+'-'+i}><td>{it.quantity||1}</td><td>{it.name||'Product'}</td><td>{r.name||'—'}<br/><span className='muted'>{r.phone||''}</span></td><td>{r.payment_status||'—'}</td><td>{r.delivery_status||'—'}</td><td style={{position:'relative'}}><button className='btn' onClick={()=>setMenu(menu===r.id?null:r.id)}>•••</button>{menu===r.id&&<div style={{position:'absolute',right:0,top:'100%',zIndex:20,background:'#fff',border:'1px solid #ddd',borderRadius:10,padding:8,minWidth:190,boxShadow:'0 8px 24px rgba(0,0,0,.12)'}}><button className='btn' style={{display:'block',width:'100%',marginBottom:6}} onClick={()=>printInvoice(r)}>Print Invoice</button><button className='btn' style={{display:'block',width:'100%',marginBottom:6}} onClick={()=>{const v=prompt('Payment status: COD, in review, rejected, approved',r.payment_status||'COD');if(v)updateStatus(r.id,'payment_status',v)}}>Change Payment Status</button><button className='btn' style={{display:'block',width:'100%',marginBottom:6}} onClick={()=>{const v=prompt('Delivery status: in progress, in shipping, delivered',r.delivery_status||'in progress');if(v)updateStatus(r.id,'delivery_status',v)}}>Change Delivery Status</button><button className='btn' style={{display:'block',width:'100%'}} onClick={()=>cancelOrder(r.id)}>Cancel Order</button></div>}</td></tr>)})}</tbody></table></div>}<div className='section'><h2>Cancelled orders</h2>{cancelled.length===0?<div className='empty'>Cancelled orders will appear here.</div>:<div className='table'><table><thead><tr><th>Order</th><th>Buyer</th><th>Total</th></tr></thead><tbody>{cancelled.map(r=><tr key={r.id}><td>{r.order_id}</td><td>{r.name||'—'}</td><td>{money(r.total||0)}</td></tr>)}</tbody></table></div>}</div></>}function Products({products,setProducts}:{products:any[];setProducts:(x:any[])=>void}){const[showCategory,setShowCategory]=useState(false);const[categoryList,setCategoryList]=useState<any[]>([]);const[selectedCategory,setSelectedCategory]=useState('');const[productSearch,setProductSearch]=useState('');const[assigned,setAssigned]=useState<string[]>([]);const[categoryLoading,setCategoryLoading]=useState(false);const[toggling,setToggling]=useState<string>('');

const loadCategoryData=async()=>{setCategoryLoading(true);try{const[cr,pr]=await Promise.all([fetch(API+'/api/categories'),fetch(API+'/api/products')]);const cj=await cr.json();const pj=await pr.json();if(cj.ok){const list=Array.isArray(cj.data)?cj.data:[];setCategoryList(list);if(list.length){const current=selectedCategory||String(list[0].id);setSelectedCategory(current);const c=list.find((x:any)=>String(x.id)===String(current))||list[0];setAssigned((c?.category_products||[]).map((x:any)=>String(x.product_id)));}}if(pj.ok&&Array.isArray(pj.data?.items))setProducts(pj.data.items)}catch(e){console.error(e)}finally{setCategoryLoading(false)}};

const openCategoryManager=async()=>{setShowCategory(true);await loadCategoryData()};

const changeCategory=(id:string)=>{setSelectedCategory(id);const c=categoryList.find(x=>String(x.id)===String(id));setAssigned((c?.category_products||[]).map((x:any)=>String(x.product_id)))};

const toggleProduct=async(productId:any)=>{if(!selectedCategory)return;const id=String(productId);const enabled=!assigned.includes(id);setToggling(id);try{const r=await fetch(API+'/api/categories/'+selectedCategory+'/products',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+localStorage.getItem('au_admin_token')},body:JSON.stringify({product_id:productId,enabled})});const j=await r.json();if(j.ok){setAssigned(prev=>enabled?[...prev.filter(x=>x!==id),id]:prev.filter(x=>x!==id));setCategoryList(prev=>prev.map(c=>{if(String(c.id)!==String(selectedCategory))return c;const current=(c.category_products||[]).filter((x:any)=>String(x.product_id)!==id);return{...c,category_products:enabled?[...current,{product_id:productId}]:current}}))}else alert(j.error||'Unable to update category')}catch(e){alert('Unable to update category')}finally{setToggling('')}};

const filteredProducts=useMemo(()=>{const q=productSearch.trim().toLowerCase();if(!q)return products;return products.filter((p:any)=>String(p.name||'').toLowerCase().includes(q)||String(p.title||'').toLowerCase().includes(q))},[products,productSearch]);

return <><div className="sectionHead"><h1>Products</h1><div><button className="btn primary" onClick={()=>{window.location.href='/admin/products/new'}}>Add product</button> <button className="btn" onClick={openCategoryManager}>Add product to category</button></div></div><div className="table"><table><thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>{products.map(p=><tr key={p.id}><td>{p.image?<img src={p.image} alt={p.name} style={{width:48,height:48,objectFit:'cover',borderRadius:8}}/>:'Product art'}</td><td>{p.name}</td><td>{money(p.price)}</td><td>{p.stock}</td><td><button className="btn" onClick={()=>{window.location.href='/admin/products/edit/'+p.id}}>Edit</button> <button className="btn" onClick={async()=>{const input=document.createElement('input');input.type='file';input.accept='image/*';input.onchange=async()=>{const file=input.files?.[0];if(!file)return;try{const token=localStorage.getItem('au_admin_token')||'';const form=new FormData();form.append('image',file);const r=await fetch(API+'/api/upload/product-image',{method:'POST',headers:{Authorization:'Bearer '+token},body:form});const j=await r.json();if(!r.ok)throw new Error(j.error||'Upload failed');const r2=await fetch(API+'/api/products/'+p.id,{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({image:j.data.url})});const j2=await r2.json();if(!r2.ok)throw new Error(j2.error||'Image update failed');setProducts(products.map(q=>q.id===p.id?j2.data:q))}catch(e){alert(e instanceof Error?e.message:'Upload failed')}};input.click()}}>Upload image</button> <button className="btn" onClick={async()=>{if(!confirm('Delete product?'))return;try{const token=localStorage.getItem('au_admin_token')||'';const r=await fetch(API+'/api/products/'+p.id,{method:'DELETE',headers:{Authorization:'Bearer '+token}});const j=await r.json();if(!r.ok)throw new Error(j.error||'Delete failed');setProducts(products.filter(q=>q.id!==p.id))}catch(e){alert(e instanceof Error?e.message:'Delete failed')}}}>Delete</button></td></tr>)}</tbody></table></div>{showCategory&&<div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,.7)',display:'flex',alignItems:'center',justifyContent:'center',padding:16}}><div style={{width:'min(900px,100%)',maxHeight:'90vh',overflow:'hidden',background:'var(--panel,#111)',border:'1px solid rgba(255,255,255,.12)',borderRadius:16,display:'flex',flexDirection:'column'}}><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,padding:18,borderBottom:'1px solid rgba(255,255,255,.1)'}}><div><h2 style={{margin:0}}>Add product to category</h2><p className="muted" style={{margin:'5px 0 0'}}>Select category → search product → ✓ add / × remove.</p></div><button className="btn" onClick={()=>setShowCategory(false)}>Close</button></div><div style={{display:'grid',gridTemplateColumns:'minmax(180px,260px) 1fr',gap:12,padding:16,borderBottom:'1px solid rgba(255,255,255,.1)'}}><select className="input" value={selectedCategory} onChange={e=>changeCategory(e.target.value)} disabled={categoryLoading}>{categoryList.length===0&&<option value="">No categories</option>}{categoryList.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><input className="input" value={productSearch} onChange={e=>setProductSearch(e.target.value)} placeholder="Search product..."/></div><div style={{overflowY:'auto',padding:16}}>{categoryLoading?<div className="muted">Loading categories and products...</div>:filteredProducts.length===0?<div className="muted">No products found.</div>:<div style={{display:'grid',gap:8}}>{filteredProducts.map((p:any)=>{const id=String(p.id);const isAssigned=assigned.includes(id);const busy=toggling===id;return <div key={p.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,padding:'12px 14px',border:'1px solid rgba(255,255,255,.1)',borderRadius:10}}><div style={{minWidth:0}}><div style={{fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.name||p.title||'Unnamed product'}</div><div className="muted">{money(p.price)}</div></div><button className="btn" disabled={busy||!selectedCategory} onClick={()=>toggleProduct(p.id)} title={isAssigned?'Remove from category':'Add to category'} style={{minWidth:42,fontSize:20,lineHeight:1}}>{busy?'…':isAssigned?'×':'✓'}</button></div>})}</div>}</div></div></div>}</>}function CategoriesAdmin({categories,setCategories}:{categories:any[];setCategories:(x:any[])=>void}){const[busy,setBusy]=useState<number|null>(null);const remove=async(c:any)=>{if(!confirm('Delete this category?'))return;setBusy(c.id);try{const token=localStorage.getItem('au_admin_token')||'';const r=await fetch(API+'/api/categories/'+c.id,{method:'DELETE',headers:{Authorization:'Bearer '+token}});const j=await r.json();if(!r.ok)throw new Error(j.error||'Delete failed');setCategories(categories.filter(x=>x.id!==c.id));}catch(e){alert(e instanceof Error?e.message:'Delete failed')}finally{setBusy(null)}};return <><div className="sectionHead"><h1>Categories</h1><button className="btn primary" onClick={()=>{window.location.href='/admin/categories/new'}}>Add category</button></div><div className="grid">{categories.map(c=><div className={`catBanner ${c.tone}`} key={c.id}><div className="catContent"><h3>{c.name}</h3><p>{(c.subs||[]).join(' · ')}</p><button className="btn" disabled={busy===c.id} onClick={()=>remove(c)}>{busy===c.id?'Deleting...':'Delete'}</button></div></div>)}</div></>}
function Reviews(){const[rows,setRows]=useState<any[]>([]);const[loading,setLoading]=useState(true);const[editing,setEditing]=useState<any|null>(null);const[uploading,setUploading]=useState(false);const load=()=>{fetch(API+"/api/reviews").then(r=>r.json()).then(j=>{if(j.ok)setRows(Array.isArray(j.data)?j.data:[])}).catch(()=>{}).finally(()=>setLoading(false))};useEffect(()=>{load()},[]);const uploadImage=async(file:File)=>{setUploading(true);try{const form=new FormData();form.append('image',file);const r=await fetch(API+'/api/upload/review-image',{method:'POST',headers:{Authorization:'Bearer '+(localStorage.getItem('au_admin_token')||'')},body:form});const j=await r.json();if(r.status<200||r.status>=300)throw new Error(j.error||'Image upload failed');setEditing((x:any)=>({...x,reviewer_image_url:j.data.url}))}catch(e){alert(e instanceof Error?e.message:'Image upload failed')}finally{setUploading(false)}};const update=async(id:string,body:any)=>{try{const r=await fetch(API+"/api/reviews/"+id,{method:"PATCH",headers:{"Content-Type":"application/json",Authorization:"Bearer "+(localStorage.getItem("au_admin_token")||"")},body:JSON.stringify(body)});const j=await r.json();if(!r.ok)throw new Error(j.error||"Update failed");setRows(rows.map(x=>x.id===id?j.data:x));setEditing(null)}catch(e){alert(e instanceof Error?e.message:"Update failed")}};const remove=async(id:string)=>{if(!confirm("Delete this review?"))return;try{const r=await fetch(API+"/api/reviews/"+id,{method:"DELETE",headers:{Authorization:"Bearer "+(localStorage.getItem("au_admin_token")||"")}});const j=await r.json();if(!r.ok)throw new Error(j.error||"Delete failed");setRows(rows.filter(x=>x.id!==id))}catch(e){alert(e instanceof Error?e.message:"Delete failed")}};return <><div className="sectionHead"><h1>Reviews</h1><span className="muted">{rows.length} review{rows.length===1?"":"s"}</span></div>{loading?<div className="empty">Loading reviews...</div>:rows.length===0?<div className="empty">No customer reviews yet.</div>:<div className="table"><table><thead><tr><th>Photo</th><th>Rating</th><th>Review</th><th>Customer</th><th>Product</th><th>Actions</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{r.reviewer_image_url?<img src={r.reviewer_image_url} alt={r.reviewer_name||'Reviewer'} style={{width:44,height:44,borderRadius:'50%',objectFit:'cover'}}/>:<span className='muted'>—</span>}</td><td>{"★".repeat(Math.max(0,Math.min(5,Number(r.rating)||0)))}</td><td>{r.body||"—"}</td><td>{r.reviewer_name||"—"}</td><td>{r.product_id||"—"}</td><td><button className="btn" onClick={()=>setEditing({...r})}>Edit</button> <button className="btn" onClick={()=>remove(r.id)}>Delete</button></td></tr>)}</tbody></table></div>}{editing&&<div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}><div className="card" style={{width:"100%",maxWidth:520,background:"var(--surface)",padding:24,borderRadius:18}}><h2>Edit Review</h2>{editing.reviewer_image_url&&<img src={editing.reviewer_image_url} alt='Reviewer' style={{width:72,height:72,borderRadius:'50%',objectFit:'cover',marginBottom:12}}/>}<label className='field'><span>Customer photo</span><input type='file' accept='image/*' disabled={uploading} onChange={e=>{const f=e.target.files&&e.target.files[0];if(f)uploadImage(f)}}/>{uploading&&<small className='muted'>Uploading...</small>}</label><label className="field"><span>Customer name</span><input value={editing.reviewer_name||""} onChange={e=>setEditing({...editing,reviewer_name:e.target.value})}/></label><label className="field"><span>Review</span><textarea rows={5} value={editing.body||""} onChange={e=>setEditing({...editing,body:e.target.value})}/></label><label className="field"><span>Rating</span><select value={editing.rating||5} onChange={e=>setEditing({...editing,rating:Number(e.target.value)})}><option value={5}>5 stars</option><option value={4}>4 stars</option><option value={3}>3 stars</option><option value={2}>2 stars</option><option value={1}>1 star</option></select></label><div style={{display:"flex",gap:8,marginTop:16}}><button className="btn primary" onClick={()=>update(editing.id,{reviewer_name:editing.reviewer_name,body:editing.body,rating:Number(editing.rating),reviewer_image_url:editing.reviewer_image_url||null})}>Save</button><button className="btn" onClick={()=>setEditing(null)}>Cancel</button></div></div></div>}</>}function Blogs(){
const[rows,setRows]=useState<any[]>([]);
const[loading,setLoading]=useState(true);
const[editing,setEditing]=useState<any|null>(null);
const[form,setForm]=useState({title:'',image_url:'',content:''});
const[saving,setSaving]=useState(false);
const[uploading,setUploading]=useState(false);

const token=()=>localStorage.getItem('au_admin_token')||'';

const load=()=>{
fetch(API+'/api/blogs')
.then(r=>r.json())
.then(j=>{if(j.ok)setRows(Array.isArray(j.data)?j.data:[]);else alert(j.error||'Blogs could not be loaded')})
.catch(()=>alert('Unable to load blogs'))
.finally(()=>setLoading(false))
};

useEffect(()=>{load()},[]);

const startAdd=()=>{
setEditing(null);
setForm({title:'',image_url:'',content:''});
};

const startEdit=(r:any)=>{
setEditing(r);
setForm({title:r.title||'',image_url:r.image_url||'',content:r.content||''});
};

const uploadImage=async(file:File)=>{
setUploading(true);
try{
const fd=new FormData();
fd.append('image',file);
const r=await fetch(API+'/api/upload/blog-image',{method:'POST',headers:{Authorization:'Bearer '+token()},body:fd});
const j=await r.json();
if(!r.ok)throw new Error(j.error||'Image upload failed');
setForm(x=>({...x,image_url:j.data.url}));
}catch(e){alert(e instanceof Error?e.message:'Image upload failed')}
finally{setUploading(false)}
};

const save=async()=>{
if(!form.title.trim()){alert('Blog title is required');return}
if(!form.content.trim()){alert('Blog content is required');return}
setSaving(true);
try{
const body={title:form.title.trim(),image_url:form.image_url.trim()||null,content:form.content.trim()};
const r=await fetch(editing?API+'/api/blogs/'+editing.id:API+'/api/blogs',{
method:editing?'PATCH':'POST',
headers:{'Content-Type':'application/json',Authorization:'Bearer '+token()},
body:JSON.stringify(editing?body:{...body,slug:form.title.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'-'+Date.now()})
});
const j=await r.json();
if(!r.ok)throw new Error(j.error||'Blog save failed');
if(editing)setRows(rows.map(x=>x.id===editing.id?j.data:x));
else setRows([j.data,...rows]);
setEditing(null);
setForm({title:'',image_url:'',content:''});
}catch(e){alert(e instanceof Error?e.message:'Blog save failed')}
finally{setSaving(false)}
};

const remove=async(id:number)=>{
if(!confirm('Delete this blog?'))return;
try{
const r=await fetch(API+'/api/blogs/'+id,{method:'DELETE',headers:{Authorization:'Bearer '+token()}});
const j=await r.json();
if(!r.ok)throw new Error(j.error||'Delete failed');
setRows(rows.filter(x=>x.id!==id));
}catch(e){alert(e instanceof Error?e.message:'Delete failed')}
};

return <><div className="sectionHead"><div><h1>Blogs</h1><span className="muted">Manage website blog articles</span></div><button className="btn primary" onClick={startAdd}>Add blog</button></div>{true?<div className="section"><h2>{editing?'Edit Blog':'Add Blog'}</h2><div className="form"><label className="field"><span>Title</span><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Blog title"/></label><label className="field"><span>Blog image</span><input type="file" accept="image/*" disabled={uploading} onChange={e=>{const f=e.target.files&&e.target.files[0];if(f)uploadImage(f)}}/>{uploading&&<small className="muted">Uploading...</small>}{form.image_url&&<img src={form.image_url} alt="Blog" style={{width:180,height:100,objectFit:'cover',borderRadius:10,marginTop:8}}/>}</label><label className="field"><span>Content</span><textarea rows={12} value={form.content} onChange={e=>setForm({...form,content:e.target.value})} placeholder="Write your blog content..."/></label><div style={{display:'flex',gap:8}}><button className="btn primary" disabled={saving||uploading} onClick={save}>{saving?'Saving...':'Save blog'}</button><button className="btn" onClick={()=>{setEditing(null);setForm({title:'',image_url:'',content:''})}}>Cancel</button></div></div></div>:null}{loading?<div className="empty">Loading blogs...</div>:rows.length===0?<div className="empty">No blogs yet. Add your first blog.</div>:<div className="table"><table><thead><tr><th>Image</th><th>Title</th><th>Created</th><th>Actions</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{r.image_url?<img src={r.image_url} alt={r.title} style={{width:72,height:48,objectFit:'cover',borderRadius:8}}/>:<span className="muted">—</span>}</td><td>{r.title}</td><td>{r.created_at?new Date(r.created_at).toLocaleDateString():'—'}</td><td><button className="btn" onClick={()=>startEdit(r)}>Edit</button> <button className="btn" onClick={()=>remove(r.id)}>Delete</button></td></tr>)}</tbody></table></div>}</>
}function Payments(){if(typeof window!=='undefined'){window.location.href='/admin/payments';}return null}

function HomePageCategories({categories}:{categories:any[]}){
  const[items,setItems]=useState<any[]>([]);
  const[dbCategories,setDbCategories]=useState<any[]>([]);
  const[loading,setLoading]=useState(true);
  const[busy,setBusy]=useState('');
  const[showAvailable,setShowAvailable]=useState(false);

  const load=async()=>{
    try{
      const [rConfig,rCats]=await Promise.all([fetch(API+'/api/home-config'),fetch(API+'/api/categories')]);
      const j=await rConfig.json();
      const cj=await rCats.json();
      const dbCats=Array.isArray(cj?.data)?cj.data:[];
      setDbCategories(dbCats);
      if(j.ok){
        const ids=(j.data?.categories||[]).sort((a:any,b:any)=>Number(a.sort_order)-Number(b.sort_order)).map((x:any)=>String(x.category_id));
        setItems(ids.map((id:string)=>dbCats.find((c:any)=>String(c.id)===id)).filter(Boolean));
      }
    }catch(e){console.error(e)}
    finally{setLoading(false)}
  };

  useEffect(()=>{load()},[categories]);

  const saveOrder=async(next:any[])=>{
    setItems(next);
    try{
      await fetch(API+'/api/home-categories/order',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({items:next.map((c:any,i:number)=>({category_id:c.id,sort_order:i}))})
      });
    }catch(e){console.error(e)}
  };

  const add=async(c:any)=>{
    setBusy(String(c.id));
    try{
      const r=await fetch(API+'/api/home-categories',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({category_id:c.id,enabled:true,sort_order:items.length})
      });
      const j=await r.json();
      if(j.ok)setItems([...items,c]);
      else alert(j.error||'Unable to add category');
    }catch(e){alert('Unable to add category')}
    finally{setBusy('')}
  };

  const remove=async(c:any)=>{
    setBusy(String(c.id));
    try{
      const r=await fetch(API+'/api/home-categories',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({category_id:c.id,enabled:false})
      });
      const j=await r.json();
      if(j.ok)await saveOrder(items.filter(x=>String(x.id)!==String(c.id)));
      else alert(j.error||'Unable to remove category');
    }catch(e){alert('Unable to remove category')}
    finally{setBusy('')}
  };

  const move=async(index:number,direction:number)=>{
    const next=[...items];
    const target=index+direction;
    if(target<0||target>=next.length)return;
    [next[index],next[target]]=[next[target],next[index]];
    await saveOrder(next);
  };

  const available=dbCategories.filter(c=>!items.some(x=>String(x.id)===String(c.id)));

  return <div>
    <div className="sectionHead">
      <div>
        <h1>Home page category</h1>
        <p className="muted">Click a category to remove it. Use ↑ ↓ to change its Home page position.</p>
      </div>
    </div>

    {loading?<div className="empty">Loading Home categories...</div>:<div className="grid">
      {items.map((c:any,index:number)=><div className={'catBanner '+(c.tone||'rose')} key={c.id}>
        <div className="catContent">
          <h3>{c.name}</h3>
          <p>{c.tagline||''}</p>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <button className="btn" disabled={index===0} onClick={()=>move(index,-1)}>↑</button>
            <button className="btn" disabled={index===items.length-1} onClick={()=>move(index,1)}>↓</button>
            <button className="btn" disabled={busy===String(c.id)} onClick={()=>remove(c)}>{busy===String(c.id)?'…':'Remove'}</button>
          </div>
        </div>
      </div>)}

      {available.length>0&&<div className="card" style={{minHeight:150,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',border:'2px dashed rgba(255,255,255,.2)'}} onClick={()=>setShowAvailable(showAvailable===false)}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:42,lineHeight:1}}>+</div>
          <div>Add category</div>
        </div>
      </div>}
    </div>}

    {loading===false&&showAvailable&&available.length>0&&<div className="section" style={{marginTop:20}}>
      <h2>Remaining categories</h2>
      <div style={{display:'grid',gap:8}}>
        {available.map((c:any)=><div key={c.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,padding:'12px 14px',border:'1px solid rgba(255,255,255,.1)',borderRadius:10}}>
          <div><b>{c.name}</b><div className="muted">{c.tagline||''}</div></div>
          <button className="btn primary" disabled={busy===String(c.id)} onClick={()=>add(c)}>{busy===String(c.id)?'…':'+'}</button>
        </div>)}
      </div>
    </div>}
  </div>
}

function HomePageProducts({products}:{products:any[]}){
  const[config,setConfig]=useState<any>({categories:[],products:[]});
  const[categoryList,setCategoryList]=useState<any[]>([]);
  const[loading,setLoading]=useState(true);
  const[busy,setBusy]=useState('');
  const[openAdd,setOpenAdd]=useState<string|null>(null);

  const load=async()=>{
    try{
      const[r1,r2]=await Promise.all([
        fetch(API+'/api/home-config'),
        fetch(API+'/api/categories')
      ]);
      const j1=await r1.json();
      const j2=await r2.json();
      if(j1.ok)setConfig(j1.data||{categories:[],products:[]});
      if(j2.ok)setCategoryList(Array.isArray(j2.data)?j2.data:[]);
    }catch(e){console.error(e)}
    finally{setLoading(false)}
  };

  useEffect(()=>{load()},[]);

  const getProducts=(categoryId:any)=>{
    const rows=(config.products||[])
      .filter((x:any)=>String(x.category_id)===String(categoryId))
      .sort((a:any,b:any)=>Number(a.sort_order)-Number(b.sort_order));

    return rows.map((row:any)=>products.find((p:any)=>String(p.id)===String(row.product_id))).filter(Boolean);
  };

  const add=async(categoryId:any,product:any)=>{
    const key=String(categoryId)+'-'+String(product.id);
    setBusy(key);
    try{
      const current=getProducts(categoryId);
      const r=await fetch(API+'/api/home-category-products',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          category_id:categoryId,
          product_id:product.id,
          enabled:true,
          sort_order:current.length
        })
      });
      const j=await r.json();
      if(j.ok){
        setConfig((old:any)=>({
          ...old,
          products:[
            ...(old.products||[]).filter((x:any)=>!(String(x.category_id)===String(categoryId)&&String(x.product_id)===String(product.id))),
            {category_id:categoryId,product_id:product.id,sort_order:current.length}
          ]
        }));
        setOpenAdd(null);
      }else alert(j.error||'Unable to add product');
    }catch(e){alert('Unable to add product')}
    finally{setBusy('')}
  };

  const remove=async(categoryId:any,product:any)=>{
    const key=String(categoryId)+'-'+String(product.id);
    setBusy(key);
    try{
      const r=await fetch(API+'/api/home-category-products',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({category_id:categoryId,product_id:product.id,enabled:false})
      });
      const j=await r.json();
      if(j.ok){
        const next=getProducts(categoryId).filter((p:any)=>String(p.id)!==String(product.id));
        setConfig((old:any)=>({
          ...old,
          products:(old.products||[]).filter((x:any)=>!(String(x.category_id)===String(categoryId)&&String(x.product_id)===String(product.id)))
        }));
        await saveOrder(categoryId,next);
      }else alert(j.error||'Unable to remove product');
    }catch(e){alert('Unable to remove product')}
    finally{setBusy('')}
  };

  const saveOrder=async(categoryId:any,next:any[])=>{
    setConfig((old:any)=>({
      ...old,
      products:(old.products||[])
        .filter((x:any)=>String(x.category_id)!==String(categoryId))
        .concat(next.map((p:any,i:number)=>({category_id:categoryId,product_id:p.id,sort_order:i})))
    }));
    try{
      await fetch(API+'/api/home-category-products/order',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({items:next.map((p:any,i:number)=>({category_id:categoryId,product_id:p.id,sort_order:i}))})
      });
    }catch(e){console.error(e)}
  };

  const move=async(categoryId:any,index:number,direction:number)=>{
    const current=getProducts(categoryId);
    const target=index+direction;
    if(target<0||target>=current.length)return;
    [current[index],current[target]]=[current[target],current[index]];
    await saveOrder(categoryId,current);
  };

  const homeCategories=(config.categories||[])
    .sort((a:any,b:any)=>Number(a.sort_order)-Number(b.sort_order))
    .map((x:any)=>categoryList.find((c:any)=>String(c.id)===String(x.category_id)))
    .filter(Boolean);

  return <div>
    <div className="sectionHead">
      <div>
        <h1>Home page product</h1>
        <p className="muted">Each category shows its Home products. Use ↑ ↓ to change position.</p>
      </div>
    </div>

    {loading?<div className="empty">Loading Home products...</div>:homeCategories.length===0?
      <div className="empty">No Home page categories selected yet. Add categories first.</div>:
      <div style={{display:'grid',gap:22}}>
        {homeCategories.map((c:any)=>{
          const current=getProducts(c.id);
          const selected=new Set(current.map((p:any)=>String(p.id)));
          const remaining=products.filter((p:any)=>!selected.has(String(p.id)));
          const isOpen=openAdd===String(c.id);

          return <div className="section" key={c.id}>
            <div className="sectionHead">
              <div>
                <h2 style={{marginBottom:4}}>{c.name}</h2>
                <span className="muted">{current.length} Home product{current.length===1?'':'s'}</span>
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))',gap:12}}>
              {current.map((p:any,index:number)=><div className="card" key={p.id} style={{padding:12,cursor:'pointer'}}>
                {p.image?<img src={p.image} alt={p.name} style={{width:'100%',height:120,objectFit:'cover',borderRadius:10}}/>:<div style={{height:120,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(255,255,255,.05)',borderRadius:10}}>Product</div>}
                <div style={{fontWeight:600,marginTop:8}}>{p.name||p.title||'Unnamed product'}</div>
                <div className="muted" style={{marginTop:4}}>{money(p.price)}</div>
                <div style={{display:'flex',gap:6,marginTop:10}}>
                  <button className="btn" disabled={index===0} onClick={()=>move(c.id,index,-1)}>↑</button>
                  <button className="btn" disabled={index===current.length-1} onClick={()=>move(c.id,index,1)}>↓</button>
                  <button className="btn" disabled={busy===String(c.id)+'-'+String(p.id)} onClick={()=>remove(c.id,p)}>×</button>
                </div>
              </div>)}

              <div className="card" style={{minHeight:210,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',border:'2px dashed rgba(255,255,255,.2)'}} onClick={()=>setOpenAdd(isOpen?null:String(c.id))}>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:46,lineHeight:1}}>+</div>
                  <div>Add product</div>
                </div>
              </div>
            </div>

            {isOpen&&<div style={{marginTop:14,padding:14,border:'1px solid rgba(255,255,255,.1)',borderRadius:14}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                <h3 style={{margin:0}}>Remaining products</h3>
                <button className="btn" onClick={()=>setOpenAdd(null)}>Close</button>
              </div>
              {remaining.length===0?<div className="muted">All products are already selected for this category.</div>:
                <div style={{display:'grid',gap:8,maxHeight:360,overflowY:'auto'}}>
                  {remaining.map((p:any)=>{
                    const key=String(c.id)+'-'+String(p.id);
                    return <div key={p.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,padding:'10px 12px',border:'1px solid rgba(255,255,255,.1)',borderRadius:10}}>
                      <div style={{minWidth:0}}>
                        <b>{p.name||p.title||'Unnamed product'}</b>
                        <div className="muted">{money(p.price)}</div>
                      </div>
                      <button className="btn primary" disabled={busy===key} onClick={()=>add(c.id,p)}>{busy===key?'…':'+'}</button>
                    </div>
                  })}
                </div>
              }
            </div>}
          </div>
        })}
      </div>
    }
  </div>
}
