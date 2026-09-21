'use client';

import {useEffect,useState} from 'react';

const API=process.env.NEXT_PUBLIC_API_URL||'';

export default function Profile(){
  const[name,setName]=useState('');
  const[email,setEmail]=useState('');
  const[phone,setPhone]=useState('');
  const[loading,setLoading]=useState(true);
  const[saving,setSaving]=useState(false);

  useEffect(()=>{
    const raw=localStorage.getItem('au-user')||'';

    if(!raw){
      location.href='/account';
      return;
    }

    let user:any=null;

    try{
      user=JSON.parse(raw);
    }catch{
      location.href='/account';
      return;
    }

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
        const p=j?.data;

        if(p){
          setEmail(p.email||user.email||'');
          setName(p.name||'');
          setPhone(p.phone||'');
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
    const token=String(user?.token||'').trim();

    if(!profileId||!token){
      alert('Please login first');
      return;
    }

    if(!name.trim()||!phone.trim()){
      alert('Name and phone are required');
      return;
    }

    setSaving(true);

    try{
      const r=await fetch(API+'/api/profile',{
        method:'PATCH',
        headers:{
          'Content-Type':'application/json',
          Authorization:'Bearer '+token
        },
        body:JSON.stringify({
          profile_id:profileId,
          name:name.trim(),
          phone:phone.trim()
        })
      });

      const j=await r.json();

      if(!r.ok||!j.ok){
        alert(j.error||'Unable to save profile');
        return;
      }

      alert('Profile saved');
    }catch{
      alert('Unable to save profile');
    }finally{
      setSaving(false);
    }
  }

  if(loading){
    return <main className="container page"><div className="empty">Loading profile...</div></main>;
  }

  return <main className="container page">
    <h1>Profile</h1>

    <div className="summary form">
      <input
        placeholder="Email"
        value={email}
        readOnly
      />

      <input
        placeholder="Full name"
        value={name}
        onChange={e=>setName(e.target.value)}
      />

      <input
        placeholder="Phone number"
        value={phone}
        onChange={e=>setPhone(e.target.value)}
      />

      <button
        className="btn primary"
        disabled={saving}
        onClick={save}
      >
        {saving?'Saving...':'Save profile'}
      </button>

      <button
        className="btn"
        onClick={()=>{
          localStorage.removeItem('au-user');
          location.href='/account';
        }}
      >
        Logout
      </button>
    </div>
  </main>;
}
