'use client';

import {useEffect,useState} from 'react';

const API=process.env.NEXT_PUBLIC_API_URL||'';

export default function RegisteredPersonDetail(){
  const[id,setId]=useState('');
  const[data,setData]=useState<any>(null);
  const[loading,setLoading]=useState(true);
  const[screenshots,setScreenshots]=useState<Record<string,string>>({});

  useEffect(()=>{
    const parts=window.location.pathname.split('/');
    const profileId=decodeURIComponent(parts[parts.length-1]||'');
    setId(profileId);

    const token=localStorage.getItem('au_admin_token')||'';

    fetch(API+'/api/admin/profiles/'+encodeURIComponent(profileId),{
      headers:{
        Authorization:'Bearer '+token
      }
    })
      .then(r=>r.json())
      .then(async j=>{
        if(!j.ok){
          alert(j.error||'Customer details could not be loaded');
          return;
        }

        setData(j.data);

        const orders=Array.isArray(j.data?.orders)?j.data.orders:[];

        const secure=await Promise.all(
          orders.map(async(order:any)=>{
            if(!order.payment_screenshot)return null;

            try{
              const r=await fetch(
                API+'/api/payment-screenshot?url='+
                encodeURIComponent(order.payment_screenshot),
                {
                  headers:{
                    Authorization:'Bearer '+token
                  }
                }
              );

              const x=await r.json();

              if(x.ok&&x.data?.url){
                return [String(order.id),x.data.url];
              }
            }catch{}

            return null;
          })
        );

        const map:Record<string,string>={};

        for(const item of secure){
          if(item){
            map[item[0]]=item[1];
          }
        }

        setScreenshots(map);
      })
      .catch(()=>{
        alert('Unable to load customer details');
      })
      .finally(()=>{
        setLoading(false);
      });
  },[]);

  if(loading){
    return <main className="container page">
      <div className="empty">Loading customer details...</div>
    </main>;
  }

  if(!data){
    return <main className="container page">
      <button
        className="btn"
        onClick={()=>window.location.href='/admin/registered-persons'}
      >
        ← Registered Persons
      </button>

      <div className="empty" style={{marginTop:20}}>
        Customer not found.
      </div>
    </main>;
  }

  const profile=data.profile||{};
  const orders=Array.isArray(data.orders)?data.orders:[];
  const reviews=Array.isArray(data.reviews)?data.reviews:[];

  return <main className="container page">

    <button
      className="btn"
      onClick={()=>window.location.href='/admin/registered-persons'}
    >
      ← Registered Persons
    </button>

    <div className="sectionHead" style={{marginTop:20}}>
      <div>
        <div className="eyebrow">Registered Person</div>
        <h1>{profile.email||'Customer'}</h1>
      </div>
    </div>

    <div className="section">
      <h2>Account Information</h2>

      <div style={{display:'grid',gap:10,marginTop:14}}>
        <div>
          <b>Email:</b> {profile.email||'—'}
        </div>

        <div>
          <b>Name:</b> {profile.name||'—'}
        </div>

        <div>
          <b>Phone:</b> {profile.phone||'—'}
        </div>

        <div>
          <b>Address:</b> {profile.address||'—'}
        </div>

        <div>
          <b>Registered:</b>{' '}
          {profile.created_at
            ?new Date(profile.created_at).toLocaleString()
            :'—'}
        </div>
      </div>
    </div>

    <div className="section">
      <div className="sectionHead">
        <h2>Orders</h2>
        <span className="muted">
          {orders.length} order{orders.length===1?'':'s'}
        </span>
      </div>

      {orders.length===0?
        <div className="empty">No orders from this customer.</div>
      :
        <div style={{display:'grid',gap:18}}>
          {orders.map((order:any)=>
            <div
              key={order.id}
              style={{
                border:'1px solid rgba(128,128,128,.25)',
                borderRadius:14,
                padding:18
              }}
            >
              <div style={{
                display:'flex',
                justifyContent:'space-between',
                gap:12,
                flexWrap:'wrap'
              }}>
                <div>
                  <h3 style={{marginBottom:5}}>
                    {order.order_id||'Order'}
                  </h3>

                  <div className="muted">
                    {order.created_at
                      ?new Date(order.created_at).toLocaleString()
                      :'—'}
                  </div>
                </div>

                <b>{order.total||0}</b>
              </div>

              <div style={{marginTop:14,display:'grid',gap:7}}>
                <div>
                  <b>Customer:</b> {order.name||'—'}
                </div>

                <div>
                  <b>Phone:</b> {order.phone||'—'}
                </div>

                <div>
                  <b>Address:</b> {order.address||'—'}
                </div>

                <div>
                  <b>Payment:</b> {order.payment_status||'—'}
                </div>

                <div>
                  <b>Delivery:</b> {order.delivery_status||'—'}
                </div>

                <div>
                  <b>Transaction ID:</b> {order.transaction_id||'—'}
                </div>
              </div>

              {Array.isArray(order.order_items)&&
                order.order_items.length>0&&
                <div style={{marginTop:16}}>
                  <h4>Products</h4>

                  <div style={{display:'grid',gap:7}}>
                    {order.order_items.map((item:any)=>
                      <div
                        key={item.id}
                        style={{
                          display:'flex',
                          justifyContent:'space-between',
                          gap:12,
                          padding:'8px 0',
                          borderBottom:'1px solid rgba(128,128,128,.15)'
                        }}
                      >
                        <span>
                          {item.name||'Product'} × {item.quantity||1}
                        </span>

                        <span>
                          {item.price||0}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              }

              {screenshots[String(order.id)]&&
                <div style={{marginTop:18}}>
                  <h4>Payment Screenshot</h4>

                  <a
                    href={screenshots[String(order.id)]}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={screenshots[String(order.id)]}
                      alt="Payment screenshot"
                      style={{
                        width:'100%',
                        maxWidth:520,
                        maxHeight:520,
                        objectFit:'contain',
                        borderRadius:12,
                        border:'1px solid #ddd',
                        marginTop:8
                      }}
                    />
                  </a>
                </div>
              }
            </div>
          )}
        </div>
      }
    </div>

    <div className="section">
      <div className="sectionHead">
        <h2>Reviews</h2>
        <span className="muted">
          {reviews.length} review{reviews.length===1?'':'s'}
        </span>
      </div>

      {reviews.length===0?
        <div className="empty">No reviews from this customer.</div>
      :
        <div style={{display:'grid',gap:14}}>
          {reviews.map((review:any)=>
            <div
              key={review.id}
              style={{
                border:'1px solid rgba(128,128,128,.25)',
                borderRadius:14,
                padding:16
              }}
            >
              <div>
                <b>Rating:</b> {review.rating||'—'} / 5
              </div>

              <div style={{marginTop:8}}>
                <b>Product ID:</b> {review.product_id||'—'}
              </div>

              <div style={{marginTop:8,lineHeight:1.6}}>
                <b>Review:</b> {review.comment||review.body||'—'}
              </div>

              <div className="muted" style={{marginTop:8}}>
                {review.created_at
                  ?new Date(review.created_at).toLocaleString()
                  :'—'}
              </div>
            </div>
          )}
        </div>
      }
    </div>

  </main>;
}
