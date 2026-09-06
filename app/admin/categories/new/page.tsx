'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API=process.env.NEXT_PUBLIC_API_URL||'http://localhost:3000';

export default function NewCategoryPage(){
  const router=useRouter();
  const [form,setForm]=useState({
    name:'',
    tagline:'',
    tone:'rose',
    slug:'',
    image:''
  });
  const [saving,setSaving]=useState(false);
  const [imageFile,setImageFile]=useState<File|null>(null);

  const change=(key:string,value:any)=>setForm({...form,[key]:value});

  const save=async()=>{
    if(!form.name.trim())return alert('Category name is required');

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

      const slug=form.slug.trim()||form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

      const r=await fetch(API+'/api/categories',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          Authorization:'Bearer '+token
        },
        body:JSON.stringify({
          name:form.name.trim(),
          tagline:form.tagline.trim(),
          tone:form.tone,
          slug,
          image
        })
      });

      const j=await r.json();

      if(!r.ok)throw new Error(j.error||'Category could not be created');

      alert('Category added successfully');
      router.push('/admin');
    }catch(e){
      alert(e instanceof Error?e.message:'Category could not be created');
    }finally{
      setSaving(false);
    }
  };

  return <main style={{maxWidth:900,margin:'0 auto',padding:'30px 20px'}}>
    <div className="sectionHead">
      <div>
        <div className="eyebrow">Category Management</div>
        <h1>Add Category</h1>
      </div>
      <button className="btn" onClick={()=>router.back()}>Back</button>
    </div>

    <div className="section">
      <div style={{display:'grid',gap:16}}>

        <label>
          Category Name
          <input
            className="input"
            value={form.name}
            onChange={e=>change('name',e.target.value)}
            placeholder="Category name"
          />
        </label>

        <label>
          Tagline / Description
          <textarea
            className="input"
            rows={3}
            value={form.tagline}
            onChange={e=>change('tagline',e.target.value)}
            placeholder="Short category description"
          />
        </label>

        <label>
          Category Slug
          <input
            className="input"
            value={form.slug}
            onChange={e=>change('slug',e.target.value)}
            placeholder="category-slug (optional)"
          />
        </label>

        <label>
          Category Style
          <select
            className="input"
            value={form.tone}
            onChange={e=>change('tone',e.target.value)}
          >
            <option value="rose">Rose</option>
            <option value="blue">Blue</option>
            <option value="violet">Violet</option>
            <option value="emerald">Emerald</option>
            <option value="amber">Amber</option>
            <option value="pink">Pink</option>
          </select>
        </label>

        <label>
          Category Image
          <input
            className="input"
            type="file"
            accept="image/*"
            onChange={e=>setImageFile(e.target.files?.[0]||null)}
          />
        </label>

        <div style={{display:'flex',gap:10}}>
          <button
            className="btn primary"
            disabled={saving}
            onClick={save}
          >
            {saving?'Saving...':'Save Category'}
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
