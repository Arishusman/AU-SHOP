'use client'; import {useMemo,useState} from 'react'; import {useSearchParams,useRouter} from 'next/navigation'; import {products} from '@/lib/products'; import {getCart,money} from '@/lib/store'; export default function CheckoutClient(){const sp=useSearchParams();const router=useRouter();const buy=Number(sp.get('buy')||0);const items=useMemo(()=>buy?[products.find(p=>p.id===buy)].filter(Boolean).map(p=>({...p,qty:1})):getCart(),[buy]);const[sub,setSub]=useState({name:'',phone:'',address:'',quantity:1});const[method,setMethod]=useState<'COD'|'PAID'>('COD');const delivery=255,total=items.reduce((a:any,p:any)=>a+p.price*(p.qty||sub.quantity),0)+delivery;const go=async()=>{
  const id='AU-'+Date.now().toString(36).toUpperCase();
  const payment=method==='COD'?'COD':'in review';

  try{
    const r=await fetch((process.env.NEXT_PUBLIC_API_URL||'')+'/api/orders',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        order_id:id,
        name:sub.name,
        phone:sub.phone,
        address:sub.address,
        total,
        payment_status:payment,
        delivery_status:'in progress',
        cancelled:false,
        items:items.map((p:any)=>({
          id:p.id,
          name:p.name,
          price:p.price,
          qty:p.qty||sub.quantity
        }))
      })
    });

    const j=await r.json();

    if(!r.ok||!j.ok){
      alert(j.error||'Order could not be placed. Please try again.');
      return;
    }

    localStorage.setItem('au-last-order',JSON.stringify({
      id,
      items,
      customer:sub,
      delivery,
      total,
      payment,
      status:'in progress'
    }));

    router.push(`/payment/success?id=${id}`);
  }catch{
    alert('Unable to connect to the server. Please try again.');
  }
};return <div className="detail"><div className="summary"><h2>Order summary</h2>{items.map((p:any)=><div className="row" key={p.id}><span>{p.name} × {p.qty||sub.quantity}</span><b>{money(p.price*(p.qty||sub.quantity))}</b></div>)}<div className="row"><span>Delivery charges</span><b>{money(delivery)}</b></div><div className="row"><b>Total</b><b>{money(total)}</b></div></div><div className="summary"><h2>Checkout details</h2><div className="form"><input placeholder="Full name" value={sub.name} onChange={e=>setSub({...sub,name:e.target.value})}/><input placeholder="Phone number" value={sub.phone} onChange={e=>setSub({...sub,phone:e.target.value})}/><input placeholder="Quantity" type="number" min="1" value={sub.quantity} onChange={e=>setSub({...sub,quantity:Number(e.target.value)})}/><textarea placeholder="Full delivery address" rows={4} value={sub.address} onChange={e=>setSub({...sub,address:e.target.value})}/><button className={`btn ${method==='COD'?'primary':''}`} onClick={()=>setMethod('COD')}>Cash on Delivery</button><button className={`btn ${method==='PAID'?'primary':''}`} onClick={()=>setMethod('PAID')}>Pay now</button>{method==='PAID'&&<div className="notice">Upload payment screenshot and enter TX ID here. In production this is stored in Supabase Storage and payment remains <b>in review</b> until admin approval.<input type="file" accept="image/*" style={{marginTop:10}}/><input placeholder="Transaction ID" style={{marginTop:10}}/></div>}<button className="btn primary" disabled={!sub.name||!sub.phone||!sub.address} onClick={go}>Confirm order</button></div></div></div>}
