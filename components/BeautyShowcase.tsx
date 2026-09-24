'use client';

import {useEffect, useState} from 'react';

const slides = [
  {
    image:'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=1200&q=85',
    title:'Skincare that feels beautiful',
    text:'Discover everyday essentials for a fresh, healthy-looking glow.'
  },
  {
    image:'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=85',
    title:'Beauty made effortless',
    text:'Explore makeup and beauty essentials selected for your routine.'
  },
  {
    image:'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1200&q=85',
    title:'Everyday beauty, your way',
    text:'Simple products to complete your everyday beauty collection.'
  },
  {
    image:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=85',
    title:'Care from head to toe',
    text:'Beauty, hair care and personal essentials in one place.'
  },
  {
    image:'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=85',
    title:'Your beauty collection',
    text:'Find new favourites and build a routine that feels like you.'
  }
];

export function BeautyShowcase(){
  const [active,setActive]=useState(0);

  useEffect(()=>{
    const timer=setInterval(()=>{
      setActive(prev=>(prev+1)%slides.length);
    },4500);

    return()=>clearInterval(timer);
  },[]);

  return (
    <section className="beautyShowcase" aria-label="Beauty collection">
      <div className="beautyShowcaseFrame">

        <div
          className="beautyShowcaseTrack"
          style={{transform:`translateX(-${active*100}%)`}}
        >
          {slides.map((slide,index)=>(
            <div className="beautySlide" key={slide.image}>
              <img
                src={slide.image}
                alt={slide.title}
                loading={index===0?'eager':'lazy'}
              />

              <div className="beautySlideOverlay">
                <div className="eyebrow">A.U SHOP BEAUTY</div>
                <h2>{slide.title}</h2>
                <p>{slide.text}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      <div className="beautyDots">
        {slides.map((_,index)=>(
          <button
            key={index}
            className={active===index?'active':''}
            onClick={()=>setActive(index)}
            aria-label={`Show beauty image ${index+1}`}
          />
        ))}
      </div>
    </section>
  );
}
