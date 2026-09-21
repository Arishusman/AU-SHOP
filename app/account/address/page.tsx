'use client';

import {useEffect,useState} from 'react';

const API=process.env.NEXT_PUBLIC_API_URL||'';

export default function Address(){
  const[name,setName]=useState('');
  const[phone,setPhone]=useState('');
  const[address,setAddress]=useState('');
  const[loading,setLoading]=useState(true);
  const[saving,setSaving]=useState(false);

  useEffect(()=>{
    const raw=localStorage.getItem('au-user')||'';

    if(!raw){
      setLoading(false);
      return;
    }

    let user:any=null;

    try{
      user=JSON.parse(raw);
    }catch{}

    const profileId=String(user?.profile_id||'').trim();
    const token=String(user?.token||'').trim();

    if(!profileId||!token){
      setLoading(false);
      return;
    }

    fetch(API+'/api/profile/'+profileId,{
      headers:{
        Authorization:'Bearer '+token
      }
    })
      .then(r=>r.json())
      .then(j=>{
        const p=j?.data?.profile;
        if(p){
          setName(p.name||'');
          setPhone(p.phone||'');
          setAddress(p.address||'');
        }
      })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  },[]);

  async function save(){
    const raw=localStorage.getItem('au-user')||'';
    let user:any=null;

    try{
      user=JSON.parse(raw);
    }catch{}

    const profileId=String(user?.profile_id||'').trim();

    if(!profileId){
      alert('Please login first');
      return;
    }

    if(!name.trim()||!phone.trim()||!address.trim()){
      alert('Name, phone and address are required');
      return;
    }

    setSaving(true);

    try{
      const r=await fetch(API+'/api/profile',{
        method:'PATCH',
        headers:{
          'Content-Type':'application/json',
          Authorization:'Bearer '+String(user?.token||'')
        },
        body:JSON.stringify({
          profile_id:profileId,
          name:name.trim(),
          phone:phone.trim(),
          address:address.trim()
        })
      });

      const j=await r.json();

      if(!r.ok||!j.ok){
        alert(j.error||'Unable to save address');
        return;
      }

      alert('Default address saved');
    }catch{
      alert('Unable to save address');
    }finally{
      setSaving(false);
    }
  }

  if(loading){
    return <main className="container page"><div className="empty">Loading...</div></main>;
  }

  return <main className="container page">
    <h1>Default address</h1>

    <div className="summary form">
      <input
        value={name}
        onChange={e=>setName(e.target.value)}
        placeholder="Full name"
      />

      <input
        value={phone}
        onChange={e=>setPhone(e.target.value)}
        placeholder="Phone number"
      />

      <textarea
        rows={6}
        value={address}
        onChange={e=>setAddress(e.target.value)}
        placeholder="House/street, area, city"
      />

      <button
        className="btn primary"
        onClick={save}
        disabled={saving}
      >
        {saving?'Saving...':'Save address'}
      </button>
    </div>
  </main>;
}
