'use client';

import {useEffect,useState} from 'react';

const API=process.env.NEXT_PUBLIC_API_URL||'http://localhost:4000';

const emptySlide=()=>({
  image:'',
  title:'',
  text:'',
  href:'',
  button_text:'Shop now'
});

const defaultData:any={
  brand_name:'A.U SHOP',
  brand_tagline:'The Brand Shopping Store',
  announcement:'✦ Reveal Your Natural Glow • Discover Beauty Essentials • Premium Makeup & Skincare • New Arrivals • Your Beauty, Your Way ✦',
  hero:{
    eyebrow:'A.U SHOP · THE BRAND SHOPPING STORE',
    title:'Beauty, care & everyday essentials — elevated.',
    text:'Shop a curated collection of skincare, beauty, hair care, feminine care and personal essentials with a premium, simple shopping experience.',
    primary_text:'Shop all products',
    primary_href:'/products',
    secondary_text:'Explore categories',
    secondary_href:'/categories'
  },
  showcase:[],
  why:{
    eyebrow:'Why A.U SHOP',
    title:'Quality products. Clear pricing. Easy tracking.',
    text:'A modern beauty storefront designed for simple discovery, easy checkout and clear order tracking.',
    points:['Curated beauty catalog','Delivery tracking','Customer reviews']
  },
  footer:{
    tagline:'The Brand Shopping Store',
    address:'Tehsil Road, Sharaqpur Sharif, District Sheikhupura, Pakistan',
    email:'arishusman.web@gmail.com',
    copyright:'A.U SHOP. All rights reserved.'
  }
};

export function WebsiteEditor(){

  const [data,setData]=useState<any>(defaultData);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [uploading,setUploading]=useState<number|null>(null);
  const [message,setMessage]=useState('');

  const load=async()=>{
    try{
      const r=await fetch(API+'/api/site-content',{cache:'no-store'});
      const j=await r.json();

      if(j.ok){
        setData({
          ...defaultData,
          ...j.data,
          hero:{...defaultData.hero,...(j.data?.hero||{})},
          why:{...defaultData.why,...(j.data?.why||{})},
          footer:{...defaultData.footer,...(j.data?.footer||{})},
          showcase:Array.isArray(j.data?.showcase)
            ?j.data.showcase.map((x:any)=>({
                ...emptySlide(),
                ...x
              }))
            :[]
        });
      }
    }catch(e){
      console.error(e);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    load();
  },[]);

  const save=async()=>{
    setSaving(true);
    setMessage('');

    try{
      const token=localStorage.getItem('au_admin_token')||'';

      const r=await fetch(API+'/api/site-content',{
        method:'PATCH',
        headers:{
          'Content-Type':'application/json',
          Authorization:'Bearer '+token
        },
        body:JSON.stringify({content:data})
      });

      const j=await r.json();

      if(!r.ok||j.ok===false){
        throw new Error(j.error||'Unable to save website content');
      }

      setMessage('Website updated successfully.');
    }catch(e){
      setMessage(e instanceof Error?e.message:'Unable to save website content');
    }finally{
      setSaving(false);
    }
  };

  const updateHero=(key:string,value:string)=>{
    setData((x:any)=>({
      ...x,
      hero:{...x.hero,[key]:value}
    }));
  };

  const updateWhy=(key:string,value:any)=>{
    setData((x:any)=>({
      ...x,
      why:{...x.why,[key]:value}
    }));
  };

  const updateFooter=(key:string,value:string)=>{
    setData((x:any)=>({
      ...x,
      footer:{...x.footer,[key]:value}
    }));
  };

  const updateSlide=(index:number,key:string,value:string)=>{
    setData((x:any)=>{
      const slides=[...(x.showcase||[])];
      slides[index]={...emptySlide(),...slides[index],[key]:value};

      return {
        ...x,
        showcase:slides
      };
    });
  };

  const addSlide=()=>{
    setData((x:any)=>({
      ...x,
      showcase:[...(x.showcase||[]),emptySlide()]
    }));
  };

  const removeSlide=(index:number)=>{
    setData((x:any)=>({
      ...x,
      showcase:(x.showcase||[]).filter((_:any,i:number)=>i!==index)
    }));
  };

  const moveSlide=(index:number,direction:'up'|'down')=>{
    setData((x:any)=>{
      const slides=[...(x.showcase||[])];
      const target=direction==='up'?index-1:index+1;

      if(target<0||target>=slides.length)return x;

      [slides[index],slides[target]]=[slides[target],slides[index]];

      return {
        ...x,
        showcase:slides
      };
    });
  };

  const uploadSlide=async(index:number,file:File)=>{
    setUploading(index);
    setMessage('');

    try{
      const token=localStorage.getItem('au_admin_token')||'';

      const form=new FormData();
      form.append('image',file);

      const r=await fetch(API+'/api/upload/product-image',{
        method:'POST',
        headers:{
          Authorization:'Bearer '+token
        },
        body:form
      });

      const j=await r.json();

      if(!r.ok||j.ok===false){
        throw new Error(j.error||'Image upload failed');
      }

      updateSlide(index,'image',j.data?.url||j.url||'');

      setMessage('Showcase image uploaded. Save Changes to publish it.');
    }catch(e){
      setMessage(e instanceof Error?e.message:'Image upload failed');
    }finally{
      setUploading(null);
    }
  };

  if(loading){
    return <div className="empty">Loading website settings...</div>;
  }

  return (
    <div>

      <div className="sectionHead">
        <div>
          <div className="eyebrow">Website CMS</div>
          <h1>Website Editor</h1>
          <p className="muted">
            Changes made here are saved to the API and appear on the client website.
          </p>
        </div>

        <button
          className="btn primary"
          onClick={save}
          disabled={saving}
        >
          {saving?'Saving...':'Save Changes'}
        </button>
      </div>

      {message&&(
        <div className="notice">
          {message}
        </div>
      )}

      <div className="section">

        <h2>Navbar</h2>

        <div className="form">

          <label className="field">
            <span>Brand name</span>
            <input
              value={data.brand_name}
              onChange={e=>setData((x:any)=>({...x,brand_name:e.target.value}))}
            />
          </label>

          <label className="field">
            <span>Brand tagline</span>
            <input
              value={data.brand_tagline}
              onChange={e=>setData((x:any)=>({...x,brand_tagline:e.target.value}))}
            />
          </label>

          <label className="field">
            <span>Moving announcement</span>
            <input
              value={data.announcement}
              onChange={e=>setData((x:any)=>({...x,announcement:e.target.value}))}
            />
          </label>

        </div>
      </div>

      <div className="section">

        <h2>Hero Section</h2>

        <div className="form">

          <label className="field">
            <span>Eyebrow</span>
            <input
              value={data.hero.eyebrow}
              onChange={e=>updateHero('eyebrow',e.target.value)}
            />
          </label>

          <label className="field">
            <span>Main heading</span>
            <input
              value={data.hero.title}
              onChange={e=>updateHero('title',e.target.value)}
            />
          </label>

          <label className="field">
            <span>Description</span>
            <textarea
              rows={4}
              value={data.hero.text}
              onChange={e=>updateHero('text',e.target.value)}
            />
          </label>

          <label className="field">
            <span>Primary button text</span>
            <input
              value={data.hero.primary_text}
              onChange={e=>updateHero('primary_text',e.target.value)}
            />
          </label>

          <label className="field">
            <span>Primary button link</span>
            <input
              value={data.hero.primary_href}
              onChange={e=>updateHero('primary_href',e.target.value)}
            />
          </label>

          <label className="field">
            <span>Secondary button text</span>
            <input
              value={data.hero.secondary_text}
              onChange={e=>updateHero('secondary_text',e.target.value)}
            />
          </label>

          <label className="field">
            <span>Secondary button link</span>
            <input
              value={data.hero.secondary_href}
              onChange={e=>updateHero('secondary_href',e.target.value)}
            />
          </label>

        </div>
      </div>

      {/* SHOWCASE CMS */}

      <div className="section">

        <div className="sectionHead">
          <div>
            <h2>Beauty Showcase</h2>
            <p className="muted">
              Add unlimited showcase slides. Upload images, add text and choose where the image should link.
            </p>
          </div>

          <button
            className="btn primary"
            onClick={addSlide}
            type="button"
          >
            + Add Showcase
          </button>
        </div>

        {data.showcase.length===0&&(
          <div className="empty">
            No showcase images yet.
            <br/>
            <button
              className="btn primary"
              onClick={addSlide}
              type="button"
              style={{marginTop:12}}
            >
              + Add First Showcase
            </button>
          </div>
        )}

        <div className="form">

          {data.showcase.map((slide:any,index:number)=>(
            <div className="card" key={index}>

              <div
                style={{
                  display:'flex',
                  justifyContent:'space-between',
                  alignItems:'center',
                  gap:10,
                  flexWrap:'wrap'
                }}
              >

                <h3 style={{margin:0}}>
                  Showcase {index+1}
                </h3>

                <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>

                  <button
                    className="btn ghost"
                    type="button"
                    disabled={index===0}
                    onClick={()=>moveSlide(index,'up')}
                  >
                    ↑ Up
                  </button>

                  <button
                    className="btn ghost"
                    type="button"
                    disabled={index===data.showcase.length-1}
                    onClick={()=>moveSlide(index,'down')}
                  >
                    ↓ Down
                  </button>

                  <button
                    className="btn ghost"
                    type="button"
                    onClick={()=>removeSlide(index)}
                  >
                    Remove
                  </button>

                </div>

              </div>

              {slide.image&&(
                <div
                  style={{
                    marginTop:12,
                    borderRadius:16,
                    overflow:'hidden',
                    border:'1px solid var(--line)',
                    background:'var(--surface2)'
                  }}
                >
                  <img
                    src={slide.image}
                    alt={slide.title||`Showcase ${index+1}`}
                    style={{
                      width:'100%',
                      height:220,
                      objectFit:'cover',
                      display:'block'
                    }}
                  />
                </div>
              )}

              <div className="form" style={{marginTop:14}}>

                <label className="field">
                  <span>Upload Image</span>

                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading===index}
                    onChange={e=>{
                      const file=e.target.files?.[0];
                      if(file)uploadSlide(index,file);
                      e.currentTarget.value='';
                    }}
                  />

                  {uploading===index&&(
                    <small className="muted">
                      Uploading image...
                    </small>
                  )}
                </label>

                <label className="field">
                  <span>Image URL</span>
                  <input
                    value={slide.image||''}
                    onChange={e=>updateSlide(index,'image',e.target.value)}
                    placeholder="https://..."
                  />
                </label>

                <label className="field">
                  <span>Showcase Name / Title</span>
                  <input
                    value={slide.title||''}
                    onChange={e=>updateSlide(index,'title',e.target.value)}
                    placeholder="New Beauty Collection"
                  />
                </label>

                <label className="field">
                  <span>Description</span>
                  <textarea
                    rows={3}
                    value={slide.text||''}
                    onChange={e=>updateSlide(index,'text',e.target.value)}
                    placeholder="Discover our latest beauty essentials..."
                  />
                </label>

                <label className="field">
                  <span>Link URL</span>
                  <input
                    value={slide.href||''}
                    onChange={e=>updateSlide(index,'href',e.target.value)}
                    placeholder="/products or https://example.com"
                  />
                </label>

                <label className="field">
                  <span>Button Text</span>
                  <input
                    value={slide.button_text||''}
                    onChange={e=>updateSlide(index,'button_text',e.target.value)}
                    placeholder="Shop now"
                  />
                </label>

              </div>

            </div>
          ))}

        </div>

      </div>

      <div className="section">

        <h2>Why A.U SHOP</h2>

        <div className="form">

          <label className="field">
            <span>Eyebrow</span>
            <input
              value={data.why.eyebrow}
              onChange={e=>updateWhy('eyebrow',e.target.value)}
            />
          </label>

          <label className="field">
            <span>Heading</span>
            <input
              value={data.why.title}
              onChange={e=>updateWhy('title',e.target.value)}
            />
          </label>

          <label className="field">
            <span>Description</span>
            <textarea
              rows={4}
              value={data.why.text}
              onChange={e=>updateWhy('text',e.target.value)}
            />
          </label>

          {data.why.points.map((point:string,index:number)=>(
            <label className="field" key={index}>
              <span>Point {index+1}</span>
              <input
                value={point}
                onChange={e=>{
                  const points=[...data.why.points];
                  points[index]=e.target.value;
                  updateWhy('points',points);
                }}
              />
            </label>
          ))}

        </div>
      </div>

      <div className="section">

        <h2>Footer</h2>

        <div className="form">

          <label className="field">
            <span>Tagline</span>
            <input
              value={data.footer.tagline}
              onChange={e=>updateFooter('tagline',e.target.value)}
            />
          </label>

          <label className="field">
            <span>Address</span>
            <textarea
              rows={3}
              value={data.footer.address}
              onChange={e=>updateFooter('address',e.target.value)}
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              value={data.footer.email}
              onChange={e=>updateFooter('email',e.target.value)}
            />
          </label>

          <label className="field">
            <span>Copyright</span>
            <input
              value={data.footer.copyright}
              onChange={e=>updateFooter('copyright',e.target.value)}
            />
          </label>

        </div>
      </div>

      <div style={{display:'flex',justifyContent:'flex-end',padding:'10px 0 40px'}}>
        <button
          className="btn primary"
          onClick={save}
          disabled={saving}
        >
          {saving?'Saving...':'Save All Website Changes'}
        </button>
      </div>

    </div>
  );
}
