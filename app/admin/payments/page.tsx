'use client';

import {useEffect,useState} from 'react';

const API=process.env.NEXT_PUBLIC_API_URL||'';

export default function PaymentsPage(){
  const[rows,setRows]=useState<any[]>([]);
  const[loading,setLoading]=useState(true);

  useEffect(()=>{
    const token=localStorage.getItem('au_admin_token')||'';

    fetch(API+'/api/orders',{headers:{Authorization:'Bearer '+token}})
      .then(r=>r.json())
      .then(async j=>{
        if(!j.ok)return;

        const data=Array.isArray(j.data)?j.data:[];
        const payments=data.filter((r:any)=>r.transaction_id||r.payment_screenshot);

        const secured=await Promise.all(
          payments.map(async (r:any)=>{
            if(!r.payment_screenshot)return r;

            try{
              const sr=await fetch(
                API+'/api/payment-screenshot?url='+encodeURIComponent(r.payment_screenshot),
                {headers:{Authorization:'Bearer '+token}}
              );
              const sj=await sr.json();

              return sj.ok
                ? {...r,payment_screenshot_secure:sj.data.url}
                : {...r,payment_screenshot_secure:null};
            }catch{
              return {...r,payment_screenshot_secure:null};
            }
          })
        );

        setRows(secured);
      })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  },[]);

  return <main className="container page">
    <div className="sectionHead">
      <div>
        <div className="eyebrow">Payment Verification</div>
        <h1>Payments</h1>
      </div>
      <span className="muted">{rows.length} payment{rows.length===1?'':'s'}</span>
    </div>

    {loading?<div className="empty">Loading payments...</div>:
      rows.length===0?<div className="empty">No online payment submissions yet.</div>:
      <div className="grid">
        {rows.map((r:any)=><div className="section" key={r.id}>
          <div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'flex-start'}}>
            <div>
              <h2 style={{marginBottom:6}}>{r.order_id}</h2>
              <div className="muted">{r.name||'—'} · {r.phone||'—'}</div>
            </div>
            <b>{r.payment_status||'in review'}</b>
          </div>

          <div style={{marginTop:16}}>
            <div><b>Transaction ID:</b> {r.transaction_id||'—'}</div>
            <div style={{marginTop:8}}><b>Total:</b> {r.total||0}</div>
            <div style={{marginTop:8}}><b>Address:</b> {r.address||'—'}</div>
          </div>

          {r.payment_screenshot&&r.payment_screenshot_secure&&<div style={{marginTop:18}}>
            <div style={{fontWeight:700,marginBottom:8}}>Payment Screenshot</div>
            <a href={r.payment_screenshot_secure} target="_blank" rel="noreferrer">
              <img
                src={r.payment_screenshot_secure}
                alt="Payment screenshot"
                style={{width:'100%',maxWidth:520,maxHeight:520,objectFit:'contain',borderRadius:12,border:'1px solid #ddd'}}
              />
            </a>
          </div>}
        </div>)}
      </div>
    }
  </main>;
}
