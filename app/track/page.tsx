'use client';

import {useEffect,useState} from 'react';

const API=process.env.NEXT_PUBLIC_API_URL||'';

export default function Track(){
  const[id,setId]=useState('');
  const[o,setO]=useState<any>(null);
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState('');

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const order=params.get('order')||'';
    if(order)setId(order);
  },[]);

  const search=async()=>{
    try{
      setLoading(true);
      setError('');
      setO(null);

      const saved=JSON.parse(localStorage.getItem('au-user')||'{}');
      const token=String(saved.token||'').trim();

      if(!token){
        setError('Please login to track your order.');
        return;
      }

      if(!id.trim()){
        setError('Enter an order ID.');
        return;
      }

      const r=await fetch(
        API+'/api/customer/orders',
        {
          headers:{
            Authorization:'Bearer '+token
          }
        }
      );

      const j=await r.json();

      if(!r.ok){
        throw new Error(j?.error||'Unable to load order');
      }

      const orders=Array.isArray(j)?j:[];
      const found=orders.find(
        (order:any)=>
          String(order.id)===id.trim() ||
          String(order.order_id||'')===id.trim()
      );

      if(!found){
        setError('Order not found in your account.');
        return;
      }

      setO(found);
    }catch(e:any){
      setError(e?.message||'Unable to load order');
    }finally{
      setLoading(false);
    }
  };

  return <main className="container page">
    <div className="eyebrow">Order tracking</div>
    <h1 style={{fontSize:54}}>Track an order</h1>

    <div className="summary form">
      <input
        placeholder="Order ID"
        value={id}
        onChange={e=>setId(e.target.value)}
      />

      <button
        className="btn primary"
        onClick={search}
        disabled={loading}
      >
        {loading?'Loading...':'Track'}
      </button>
    </div>

    {error&&(
      <div className="summary" style={{marginTop:15}}>
        <div className="empty">{error}</div>
      </div>
    )}

    {o&&(
      <div className="summary" style={{marginTop:15}}>
        <h2>{o.order_id||o.id}</h2>

        <div className="notice">
          {o.delivery_status||'in progress'}
        </div>

        <p>
          {o.name}<br/>
          {o.phone}<br/>
          {o.address}
        </p>

        {o.order_items?.map((item:any,index:number)=>(
          <div className="row" key={item.id||index}>
            <span>{item.product_name||item.name||'Product'}</span>
            <b>
              Rs {Number(item.price||0).toLocaleString()}
            </b>
          </div>
        ))}
      </div>
    )}
  </main>;
}
