'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const API=process.env.NEXT_PUBLIC_API_URL||'http://localhost:3000';

export default function EditProductPage(){
  const params=useParams();
  const router=useRouter();
  const id=String(params.id||'');

  const [form,setForm]=useState({
    name:'',
    price:'',
    use:'',
    benefit:'',
    for_who:'',
    stock:'0',
    available:true,
    image:''
  });
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [imageFile,setImageFile]=useState<File|null>(null);

  const change=(key:string,value:any)=>setForm({...form,[key]:value});

  useEffect(()=>{
    fetch(API+'/api/products')
      .then(r=>r.json())
      .then(j=>{
        if(!j.ok)throw new Error(j.error||'Products could not be loaded');

        const p=(Array.isArray(j.data?.items)?j.data.items:[]).find(
          (x:any)=>String(x.id)===id
        );

        if(!p)throw new Error('Product not found');

        setForm({
          name:p.name||'',
          price:String(p.price??''),
          use:p.use||'',
          benefit:p.benefit||'',
          for_who:p.for_who||'',
          stock:String(p.stock??0),
          available:p.available!==false,
          image:p.image||''
        });
      })
      .catch(e=>{
        alert(e instanceof Error?e.message:'Product could not be loaded');
        router.back();
      })
      .finally(()=>setLoading(false));
  },[id,router]);

  const save=async()=>{
    if(!form.name.trim())return alert('Product name is required');

    setSaving(true);

    try{
      const token=localStorage.getItem('au_admin_token')||'';
      let image=form.image;

      if(imageFile){
        const fd=new FormData();
        fd.append('image',imageFile);

        const ur=await fetch(API+'/api/upload/product-image',{
          method:'POST',
          headers:{Authorization:'Bearer '+token},
          body:fd
        });

        const uj=await ur.json();

        if(!ur.ok)throw new Error(uj.error||'Image upload failed');

        image=uj.data.url;
      }

      const r=await fetch(API+'/api/products/'+id,{
        method:'PATCH',
        headers:{
          'Content-Type':'application/json',
          Authorization:'Bearer '+token
        },
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

      if(!r.ok)throw new Error(j.error||'Product could not be updated');

      alert('Product updated successfully');
      router.push('/admin');
    }catch(e){
      alert(e instanceof Error?e.message:'Product could not be updated');
    }finally{
      setSaving(false);
    }
  };

  if(loading){
    return <main style={{maxWidth:900,margin:'0 auto',padding:'30px 20px'}}>
      <div className="empty">Loading product...</div>
    </main>;
  }

  return <main style={{maxWidth:900,margin:'0 auto',padding:'30px 20px'}}>
    <div className="sectionHead">
      <div>
        <div className="eyebrow">Product Management</div>
        <h1>Edit Product</h1>
      </div>
      <button className="btn" onClick={()=>router.back()}>Back</button>
    </div>

    <div className="section">
      <div style={{display:'grid',gap:16}}>

        <label>
          Product Name
          <input
            className="input"
            value={form.name}
            onChange={e=>change('name',e.target.value)}
            placeholder="Product name"
          />
        </label>

        <label>
          Price
          <input
            className="input"
            type="number"
            min="0"
            value={form.price}
            onChange={e=>change('price',e.target.value)}
            placeholder="0"
          />
        </label>

        <label>
          Description / Use
          <textarea
            className="input"
            rows={4}
            value={form.use}
            onChange={e=>change('use',e.target.value)}
            placeholder="Describe what the product is used for"
          />
        </label>

        <label>
          Benefits
          <textarea
            className="input"
            rows={4}
            value={form.benefit}
            onChange={e=>change('benefit',e.target.value)}
            placeholder="Product benefits"
          />
        </label>

        <label>
          For Who
          <input
            className="input"
            value={form.for_who}
            onChange={e=>change('for_who',e.target.value)}
            placeholder="Who should use this product?"
          />
        </label>

        <label>
          Stock
          <input
            className="input"
            type="number"
            min="0"
            value={form.stock}
            onChange={e=>change('stock',e.target.value)}
            placeholder="0"
          />
        </label>

        <label>
          Product Image
          <input
            className="input"
            type="file"
            accept="image/*"
            onChange={e=>setImageFile(e.target.files?.[0]||null)}
          />
        </label>

        {form.image&&(
          <div>
            <div className="muted" style={{marginBottom:8}}>Current image</div>
            <img
              src={form.image}
              alt={form.name}
              style={{
                width:140,
                height:140,
                objectFit:'cover',
                borderRadius:12
              }}
            />
          </div>
        )}

        <label style={{display:'flex',alignItems:'center',gap:10}}>
          <input
            type="checkbox"
            checked={form.available}
            onChange={e=>change('available',e.target.checked)}
          />
          Available for sale
        </label>

        <div style={{display:'flex',gap:10}}>
          <button
            className="btn primary"
            disabled={saving}
            onClick={save}
          >
            {saving?'Saving...':'Save Changes'}
          </button>

          <button
            className="btn"
            disabled={saving}
            onClick={()=>router.back()}
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  </main>;
}
