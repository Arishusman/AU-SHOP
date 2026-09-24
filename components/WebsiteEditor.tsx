'use client';

import {useEffect,useState} from 'react';

const API=process.env.NEXT_PUBLIC_API_URL||'http://localhost:4000';

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
          showcase:Array.isArray(j.data?.showcase)?j.data.showcase:defaultData.showcase
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
      const slides=[...x.showcase];
      slides[index]={...slides[index],[key]:value};

      return {
        ...x,
        showcase:slides
      };
    });
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

      <div className="section">

        <div className="sectionHead">
          <div>
            <h2>Beauty Showcase</h2>
            <p className="muted">These images rotate automatically on the homepage.</p>
          </div>
        </div>

        <div className="form">

          {data.showcase.map((slide:any,index:number)=>(
            <div className="card" key={index}>

              <h3>Image {index+1}</h3>

              <label className="field">
                <span>Image URL</span>
                <input
                  value={slide.image||''}
                  onChange={e=>updateSlide(index,'image',e.target.value)}
                  placeholder="https://..."
                />
              </label>

              <label className="field">
                <span>Image title</span>
                <input
                  value={slide.title||''}
                  onChange={e=>updateSlide(index,'title',e.target.value)}
                />
              </label>

              <label className="field">
                <span>Image description</span>
                <textarea
                  rows={3}
                  value={slide.text||''}
                  onChange={e=>updateSlide(index,'text',e.target.value)}
                />
              </label>

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
