'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';

const API=process.env.NEXT_PUBLIC_API_URL||'';

export default function Orders(){
  const[orders,setOrders]=useState<any[]>([]);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState('');

  useEffect(()=>{
    const load=async()=>{
      try{
        const saved=JSON.parse(localStorage.getItem('au-user')||'{}');
        const token=String(saved.token||'').trim();

        if(!token){
          setLoading(false);
          return;
        }

        const r=await fetch(API+'/api/customer/orders',{
          headers:{
            Authorization:'Bearer '+token
          }
        });

        const j=await r.json();

        if(!r.ok){
          throw new Error(j?.error||'Unable to load orders');
        }

        setOrders(Array.isArray(j)?j:[]);
      }catch(e:any){
        setError(e?.message||'Unable to load orders');
      }finally{
        setLoading(false);
      }
    };

    load();
  },[]);

  return <main className="container page">
    <div className="eyebrow">My account</div>
    <h1>Orders</h1>

    {loading&&<div className="summary"><div className="empty">Loading orders...</div></div>}

    {!loading&&error&&<div className="summary"><div className="empty">{error}</div></div>}

    {!loading&&!error&&!orders.length&&<div className="summary"><div className="empty">No orders yet.</div></div>}

    {!loading&&!error&&orders.map((o:any)=>(
      <div className="summary" key={o.id}>
        <div className="row">
          <b>{o.id}</b>
          <span>{o.status}</span>
        </div>

        {o.order_items?.length>0&&(
          <p>
            {o.order_items.map((item:any,index:number)=>(
              <span key={index}>
                {item.product_name||item.name||'Product'}{index<o.order_items.length-1?', ':''}
              </span>
            ))}
          </p>
        )}

        <Link className="btn primary" href={`/track?order=${o.id}`}>
          Track
        </Link>
      </div>
    ))}
  </main>;
}
