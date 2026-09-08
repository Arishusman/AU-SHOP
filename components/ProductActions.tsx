'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {addCart} from '@/lib/store';

export function ProductActions({p}:{p:any}){
  const[added,setAdded]=useState(false);
  const[shared,setShared]=useState(false);
  const router=useRouter();

  const shareProduct=async()=>{
    const url=window.location.href;
    try{
      if(navigator.share){
        await navigator.share({title:p.name,text:`Check out ${p.name} on A.U SHOP`,url});
      }else{
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(()=>setShared(false),2000);
      }
    }catch{}
  };

  return <div style={{display:'flex',gap:10,marginTop:20,flexWrap:'wrap'}}>
    <button className="btn primary" onClick={()=>router.push(`/checkout?buy=${p.id}`)}>Buy now</button>
    <button className="btn" onClick={()=>{addCart(p);setAdded(true)}}>{added?'Added to cart':'Add to cart'}</button>
    <button className="btn" onClick={shareProduct}>{shared?'Link copied':'Share product'}</button>
  </div>
}
