'use client';

import {useMemo,useState} from 'react';
import {useSearchParams,useRouter} from 'next/navigation';
import {products} from '@/lib/products';
import {getCart,money} from '@/lib/store';

const API=process.env.NEXT_PUBLIC_API_URL||'';

export default function CheckoutClient(){
  const sp=useSearchParams();
  const router=useRouter();
  const buy=Number(sp.get('buy')||0);
  const items=useMemo(()=>buy?[products.find(p=>p.id===buy)].filter(Boolean).map(p=>({...p,qty:1})):getCart(),[buy]);

  const[sub,setSub]=useState({name:'',phone:'',address:'',quantity:1});
  const[method,setMethod]=useState<'COD'|'PAID'>('COD');
  const[transactionId,setTransactionId]=useState('');
  const[paymentFile,setPaymentFile]=useState<File|null>(null);
  const[saving,setSaving]=useState(false);

  const delivery=255;
  const total=items.reduce((a:any,p:any)=>a+p.price*(p.qty||sub.quantity),0)+delivery;

  const go=async()=>{
    if(method==='PAID'&&(!paymentFile||!transactionId.trim())){
      alert('Please upload payment screenshot and enter Transaction ID.');
      return;
    }

    setSaving(true);

    try{
      let paymentScreenshot='';

      if(method==='PAID'&&paymentFile){
        const fd=new FormData();
        fd.append('image',paymentFile);

        const ur=await fetch(API+'/api/upload/payment-screenshot',{
          method:'POST',
          body:fd
        });

        const uj=await ur.json();

        if(!ur.ok||!uj.ok){
          throw new Error(uj.error||'Payment screenshot upload failed');
        }

        paymentScreenshot=uj.data.url;
      }

      const id='AU-'+Date.now().toString(36).toUpperCase();
      const payment=method==='COD'?'COD':'in review';

      const r=await fetch(API+'/api/orders',{
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
          transaction_id:method==='PAID'?transactionId.trim():null,
          payment_screenshot:method==='PAID'?paymentScreenshot:null,
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
        transactionId:method==='PAID'?transactionId.trim():'',
        paymentScreenshot,
        status:'in progress'
      }));

      router.push(`/payment/success?id=${id}`);
    }catch(e){
      alert(e instanceof Error?e.message:'Unable to connect to the server. Please try again.');
    }finally{
      setSaving(false);
    }
  };

  return <div className="detail">
    <div className="summary">
      <h2>Order summary</h2>

      {items.map((p:any)=><div className="row" key={p.id}>
        <span>{p.name} × {p.qty||sub.quantity}</span>
        <b>{money(p.price*(p.qty||sub.quantity))}</b>
      </div>)}

      <div className="row">
        <span>Delivery charges</span>
        <b>{money(delivery)}</b>
      </div>

      <div className="row">
        <b>Total</b>
        <b>{money(total)}</b>
      </div>
    </div>

    <div className="summary">
      <h2>Checkout details</h2>

      <div className="form">
        <input placeholder="Full name" value={sub.name} onChange={e=>setSub({...sub,name:e.target.value})}/>

        <input placeholder="Phone number" value={sub.phone} onChange={e=>setSub({...sub,phone:e.target.value})}/>

        <input placeholder="Quantity" type="number" min="1" value={sub.quantity} onChange={e=>setSub({...sub,quantity:Number(e.target.value)})}/>

        <textarea placeholder="Full delivery address" rows={4} value={sub.address} onChange={e=>setSub({...sub,address:e.target.value})}/>

        <button className={`btn ${method==='COD'?'primary':''}`} onClick={()=>setMethod('COD')} disabled={saving}>
          Cash on Delivery
        </button>

        <button className={`btn ${method==='PAID'?'primary':''}`} onClick={()=>setMethod('PAID')} disabled={saving}>
          Pay now
        </button>

        {method==='PAID'&&<div className="notice">
          Upload your payment screenshot and enter the Transaction ID.

          <input
            type="file"
            accept="image/*"
            style={{marginTop:10}}
            onChange={e=>setPaymentFile(e.target.files?.[0]||null)}
          />

          <input
            placeholder="Transaction ID"
            value={transactionId}
            onChange={e=>setTransactionId(e.target.value)}
            style={{marginTop:10}}
          />
        </div>}

        <button className="btn primary" disabled={saving||!sub.name||!sub.phone||!sub.address} onClick={go}>
          {saving?'Processing...':'Confirm order'}
        </button>
      </div>
    </div>
  </div>;
}
