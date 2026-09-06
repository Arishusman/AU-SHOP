'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API=process.env.NEXT_PUBLIC_API_URL||'http://localhost:3000';

export default function NewProductPage(){
  const router=useRouter();
  const [form,setForm]=useState({name:'',price:'',use:'',benefit:'',for_who:'',stock:'0',available:true,image:''});
  const [saving,setSaving]=useState(false);
  const [imageFile,setImageFile]=useState<File|null>(null);

  const change=(key:string,value:any)=>setForm({...form,[key]:value});

  const save=async()=>{
    if(!form.name.trim())return alert('Product name is required');
    setSaving(true);
    try{
      const token=localStorage.getItem('au_admin_token')||'';
      let image=form.image;

      if(imageFile){
        const fd=new FormData();
        fd.append('image',imageFile);
        const ur=await fetch(API+'/api/upload/product-image',{method:'POST',headers:{Authorization:'Bearer '+token},body:fd});
        const uj=await ur.json();
        if(!ur.ok)throw new Error(uj.error||'Image upload failed');
        image=uj.data.url;
      }

      const r=await fetch(API+'/api/products',{
        method:'POST',
        headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},
        body:JSON.stringify({
          name:form.name.trim(),
          price:Number(form.price)||0,
          use:form.use,
          benefit:form.benefit,
          for_who:form.for_who,
          stock:Number(form.stock)||0,
          available:form.available,
          image
        })
      });
      const j=await r.json();
      if(!r.ok)throw new Error(j.error||'Product could not be created');
      alert('Product added successfully');
      router.push('/admin');
    }catch(e){
      alert(e instanceof Error?e.message:'Product could not be created');
    }finally{
      setSaving(false);
    }
  };

  return <main style={{maxWidth:900,margin:'0 auto',padding:'30px 20px'}}>
    <div className="sectionHead">
      <div>
        <div className="eyebrow">Product Management</div>
        <h1>Add Product</h1>
      </div>
      <button className="btn" onClick={()=>router.back()}>Back</button>
    </div>

    <div className="section">
      <div style={{display:'grid',gap:16}}>
        <label>Product Name<input className="input" value={form.name} onChange={e=>change('name',e.target.value)} placeholder="Product name"/></label>
        <label>Price<input className="input" type="number" min="0" value={form.price} onChange={e=>change('price',e.target.value)} placeholder="0"/></label>
        <label>Description / Use<textarea className="input" rows={4} value={form.use} onChange={e=>change('use',e.target.value)} placeholder="Describe what the product is used for"/></label>
        <label>Benefits<textarea className="input" rows={4} value={form.benefit} onChange={e=>change('benefit',e.target.value)} placeholder="Product benefits"/></label>
        <label>For Who<input className="input" value={form.for_who} onChange={e=>change('for_who',e.target.value)} placeholder="Who should use this product?"/></label>
        <label>Stock<input className="input" type="number" min="0" value={form.stock} onChange={e=>change('stock',e.target.value)} placeholder="0"/></label>
        <label>Product Image<input className="input" type="file" accept="image/*" onChange={e=>setImageFile(e.target.files?.[0]||null)}/></label>
        <label style={{display:'flex',alignItems:'center',gap:10}}>
          <input type="checkbox" checked={form.available} onChange={e=>change('available',e.target.checked)}/>
          Available for sale
        </label>
        <div style={{display:'flex',gap:10}}>
          <button className="btn primary" disabled={saving} onClick={save}>{saving?'Saving...':'Save Product'}</button>
          <button className="btn" disabled={saving} onClick={()=>router.back()}>Cancel</button>
        </div>
      </div>
    </div>
  </main>;
}
