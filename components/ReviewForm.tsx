'use client';

import {useState} from 'react';

const API=process.env.NEXT_PUBLIC_API_URL||'';

export function ReviewForm({productId}:{productId:number}){
  const[name,setName]=useState('');
  const[email,setEmail]=useState('');
  const[rating,setRating]=useState(5);
  const[comment,setComment]=useState('');
  const[saving,setSaving]=useState(false);
  const[message,setMessage]=useState('');

  const submit=async()=>{
    if(!name.trim()||!comment.trim()){
      setMessage('Name and comment are required.');
      return;
    }

    setSaving(true);
    setMessage('');

    try{
      const r=await fetch(API+'/api/reviews',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          product_id:productId,
          name:name.trim(),
          email:email.trim(),
          rating,
          comment:comment.trim(),
          approved:true
        })
      });

      const j=await r.json();

      if(!r.ok||!j.ok){
        setMessage(j.error||'Review could not be submitted.');
        return;
      }

      setName('');
      setEmail('');
      setRating(5);
      setComment('');
      setMessage('Thank you! Your review has been submitted.');
    }catch{
      setMessage('Unable to connect to the server. Please try again.');
    }finally{
      setSaving(false);
    }
  };

  return <div className="section">
    <div className="sectionHead">
      <div>
        <div className="eyebrow">Customer voice</div>
        <h3>Write a Review</h3>
      </div>
    </div>

    <div className="summary">
      <div className="form">
        <input
          placeholder="Your name"
          value={name}
          onChange={e=>setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={e=>setEmail(e.target.value)}
        />

        <select value={rating} onChange={e=>setRating(Number(e.target.value))}>
          <option value={5}>★★★★★ — 5 stars</option>
          <option value={4}>★★★★☆ — 4 stars</option>
          <option value={3}>★★★☆☆ — 3 stars</option>
          <option value={2}>★★☆☆☆ — 2 stars</option>
          <option value={1}>★☆☆☆☆ — 1 star</option>
        </select>

        <textarea
          placeholder="Write your review"
          rows={5}
          value={comment}
          onChange={e=>setComment(e.target.value)}
        />

        <button className="btn primary" disabled={saving} onClick={submit}>
          {saving?'Submitting...':'Submit Review'}
        </button>

        {message&&<div className="notice">{message}</div>}
      </div>
    </div>
  </div>;
}
