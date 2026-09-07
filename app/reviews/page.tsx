"use client";

import {useEffect, useState} from "react";

const API=process.env.NEXT_PUBLIC_API_URL||"";

type Review={
  id:string;
  reviewer_name:string;
  rating:number;
  body:string;
  is_sample?:boolean;
  reviewer_image_url?:string;
  product_id?:number;
};

export default function Reviews(){
  const[rows,setRows]=useState<Review[]>([]);
  const[loading,setLoading]=useState(true);

  useEffect(()=>{
    fetch(API+"/api/reviews")
      .then(r=>r.json())
      .then(j=>{
        if(j.ok)setRows(Array.isArray(j.data)?j.data:[]);
      })
      .catch(()=>{})
      .finally(()=>setLoading(false));
  },[]);

  return (
    <main className="container page">
      <div className="eyebrow">Customer voice</div>
      <h1 style={{fontSize:54}}>Reviews</h1>

      <p className="muted">
        See what customers have to say about A.U SHOP.
      </p>

      {loading ? (
        <p className="muted">Loading reviews...</p>
      ) : rows.length===0 ? (
        <p className="muted">No reviews yet.</p>
      ) : (
        <div className="reviews" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
          {rows.map(r=>(
            <article className="review" key={r.id}>
              {r.reviewer_image_url&&<img src={r.reviewer_image_url} alt={r.reviewer_name||'Reviewer'} style={{width:58,height:58,borderRadius:'50%',objectFit:'cover',marginBottom:12}}/>}
              <div className="stars">
                {"★".repeat(Math.max(0,Math.min(5,Number(r.rating)||0)))}
              </div>
              <p>{r.body}</p>
              
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
