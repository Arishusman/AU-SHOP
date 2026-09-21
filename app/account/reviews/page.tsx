'use client';

import {useEffect,useState} from 'react';

const API=process.env.NEXT_PUBLIC_API_URL||'';

export default function Reviews(){
  const[reviews,setReviews]=useState<any[]>([]);
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

        const r=await fetch(API+'/api/customer/reviews',{
          headers:{
            Authorization:'Bearer '+token
          }
        });

        const j=await r.json();

        if(!r.ok){
          throw new Error(j?.error||'Unable to load reviews');
        }

        setReviews(Array.isArray(j)?j:[]);
      }catch(e:any){
        setError(e?.message||'Unable to load reviews');
      }finally{
        setLoading(false);
      }
    };

    load();
  },[]);

  return <main className="container page">
    <div className="eyebrow">My account</div>
    <h1>My Reviews</h1>

    {loading&&(
      <div className="summary">
        <div className="empty">Loading reviews...</div>
      </div>
    )}

    {!loading&&error&&(
      <div className="summary">
        <div className="empty">{error}</div>
      </div>
    )}

    {!loading&&!error&&!reviews.length&&(
      <div className="summary">
        <div className="empty">You have not submitted any reviews yet.</div>
      </div>
    )}

    {!loading&&!error&&reviews.map((review:any)=>(
      <div className="summary" key={review.id}>
        <div className="row">
          <b>{'★'.repeat(Number(review.rating)||0)}</b>
          <span>{review.approved?'Approved':'Pending'}</span>
        </div>

        <p>{review.comment}</p>

        <small>
          {review.created_at
            ?new Date(review.created_at).toLocaleDateString()
            :''
          }
        </small>
      </div>
    ))}
  </main>;
}
