'use client';

import Link from 'next/link';
import {useEffect,useState} from 'react';
import {MessageCircle,ShieldCheck,Truck,Star} from 'lucide-react';
import {SearchBar} from '@/components/SearchBar';
import {ProductCard} from '@/components/ProductCard';

const API=process.env.NEXT_PUBLIC_API_URL||'http://localhost:4000';

const fallback:any={
  brand_name:'A.U SHOP',
  announcement:'✦ Reveal Your Natural Glow • Discover Beauty Essentials • Premium Makeup & Skincare • New Arrivals • Your Beauty, Your Way ✦',
  hero:{
    eyebrow:'A.U SHOP · THE BRAND SHOPPING STORE',
    title:'Beauty, care & everyday essentials — elevated.',
    text:'Shop a curated collection of skincare, beauty, hair care, feminine care and personal essentials with a premium, simple shopping experience.',
    primary_text:'Shop all products',
    primary_href:'/products',
    secondary_text:'Explore categories',
    secondary_href:'/categories'
  },
  showcase:[],
  why:{
    eyebrow:'Why A.U SHOP',
    title:'Quality products. Clear pricing. Easy tracking.',
    text:'A modern beauty storefront designed for simple discovery, easy checkout and clear order tracking.',
    points:['Curated beauty catalog','Delivery tracking','Customer reviews']
  }
};

export default function LiveHome(){

  const [site,setSite]=useState<any>(fallback);
  const [categories,setCategories]=useState<any[]>([]);
  const [products,setProducts]=useState<any[]>([]);
  const [homeConfig,setHomeConfig]=useState<any>({categories:[],products:[]});
  const [active,setActive]=useState(0);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    Promise.all([
      fetch(API+'/api/site-content',{cache:'no-store'}).then(r=>r.json()),
      fetch(API+'/api/categories',{cache:'no-store'}).then(r=>r.json()),
      fetch(API+'/api/products',{cache:'no-store'}).then(r=>r.json()),
      fetch(API+'/api/home-config',{cache:'no-store'}).then(r=>r.json())
    ])
    .then(([siteRes,catRes,prodRes,homeRes])=>{
      if(siteRes?.ok){
        setSite({
          ...fallback,
          ...siteRes.data,
          hero:{...fallback.hero,...(siteRes.data?.hero||{})},
          why:{...fallback.why,...(siteRes.data?.why||{})},
          showcase:Array.isArray(siteRes.data?.showcase)
            ?siteRes.data.showcase
            :[]
        });
      }

      const cats=Array.isArray(catRes?.data)
        ?catRes.data
        :Array.isArray(catRes?.data?.items)
        ?catRes.data.items
        :[];

      const prods=Array.isArray(prodRes?.data)
        ?prodRes.data
        :Array.isArray(prodRes?.data?.items)
        ?prodRes.data.items
        :[];

      setCategories(cats);
      setProducts(prods);

      if(homeRes?.ok){
        setHomeConfig({
          categories:Array.isArray(homeRes.data?.categories)
            ?homeRes.data.categories
            :[],
          products:Array.isArray(homeRes.data?.products)
            ?homeRes.data.products
            :[]
        });
      }
    })
    .catch(console.error)
    .finally(()=>setLoading(false));
  },[]);

  useEffect(()=>{
    if(!site.showcase?.length)return;

    const timer=setInterval(()=>{
      setActive(x=>(x+1)%site.showcase.length);
    },4500);

    return()=>clearInterval(timer);
  },[site.showcase]);

  return (
    <main className="container">

      {/* HERO */}

      <section className="hero">

        <div className="heroCard">

          <div className="eyebrow">
            {site.hero.eyebrow}
          </div>

          <h1>
            {site.hero.title}
          </h1>

          <p>
            {site.hero.text}
          </p>

          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>

            <Link
              href={site.hero.primary_href}
              className="btn primary"
            >
              {site.hero.primary_text}
            </Link>

            <Link
              href={site.hero.secondary_href}
              className="btn ghost"
            >
              {site.hero.secondary_text}
            </Link>

          </div>

        </div>

      </section>


      {/* BEAUTY SHOWCASE */}

      {site.showcase.length>0&&(
        <section className="beautyShowcase">

          <div className="beautyShowcaseFrame">

            <div
              className="beautyShowcaseTrack"
              style={{
                transform:`translateX(-${active*100}%)`
              }}
            >

              {site.showcase.map((slide:any,index:number)=>(
                <div
                  className="beautySlide"
                  key={index}
                >

                  <img
                    src={slide.image}
                    alt={slide.title||'A.U SHOP beauty collection'}
                    loading={index===0?'eager':'lazy'}
                  />

                  <div className="beautySlideOverlay">

                    <div className="eyebrow">
                      A.U SHOP BEAUTY
                    </div>

                    <h2>
                      {slide.title}
                    </h2>

                    <p>
                      {slide.text}
                    </p>

                  </div>

                </div>
              ))}

            </div>

          </div>

          <div className="beautyDots">

            {site.showcase.map((_:any,index:number)=>(
              <button
                key={index}
                className={active===index?'active':''}
                onClick={()=>setActive(index)}
                aria-label={`Show image ${index+1}`}
              />
            ))}

          </div>

        </section>
      )}


      {/* WHY A.U SHOP */}

      <section className="section whyAuShop">

        <div className="heroSide">

          <div>

            <div className="eyebrow">
              {site.why.eyebrow}
            </div>

            <h2 style={{fontSize:36}}>
              {site.why.title}
            </h2>

            <p className="muted">
              {site.why.text}
            </p>

          </div>

          <div style={{display:'grid',gap:10}}>

            {(site.why.points||[]).map((point:string,index:number)=>(
              <div className="notice" key={index}>

                {index===0&&<ShieldCheck size={18}/>}
                {index===1&&<Truck size={18}/>}
                {index===2&&<Star size={18}/>}

                {point}

              </div>
            ))}

          </div>

        </div>

      </section>


      <SearchBar/>


      {/* LIVE CATEGORIES */}

      {!loading&&categories
        .filter((cat:any)=>(
          homeConfig.categories.length===0 ||
          homeConfig.categories.some((x:any)=>String(x.category_id)===String(cat.id))
        ))
        .sort((a:any,b:any)=>{
          const ao=homeConfig.categories.find((x:any)=>String(x.category_id)===String(a.id))?.sort_order ?? a.sort_order ?? 0;
          const bo=homeConfig.categories.find((x:any)=>String(x.category_id)===String(b.id))?.sort_order ?? b.sort_order ?? 0;
          return Number(ao)-Number(bo);
        })
        .map((cat:any,index:number)=>{

        const ids=homeConfig.products
          .filter((x:any)=>(
            String(x.category_id)===String(cat.id) &&
            x.enabled!==false
          ))
          .sort((a:any,b:any)=>Number(a.sort_order||0)-Number(b.sort_order||0))
          .map((x:any)=>String(x.product_id));

        const list=products
          .filter((p:any)=>ids.includes(String(p.id)))
          .slice(0,2);

        if(!list.length)return null;

        return (
          <section className="section" key={cat.id}>

            <div className={`catBanner ${cat.tone||'rose'}`}>

              <div className="catContent">

                <div className="eyebrow">
                  Curated category
                </div>

                <h3>{cat.name}</h3>

                <div className="muted">
                  {cat.tagline}
                </div>

              </div>

            </div>

            <div className="sectionHead">

              <div>

                <h2>{cat.name}</h2>

                <div className="muted">
                  {cat.subs?.join(' · ')||''}
                </div>

              </div>

              <Link
                href={`/category/${cat.slug||cat.id}`}
                className="btn ghost"
              >
                View more
              </Link>

            </div>

            <div className="grid">

              {list.map((product:any)=>(
                <ProductCard
                  key={product.id}
                  p={{
                    ...product,
                    slug:product.slug||String(product.id),
                    name:product.name||product.title,
                    use:product.use_text||product.use||''
                  }}
                />
              ))}

            </div>

          </section>
        );
      })}


      {/* HELP */}

      <section className="section">

        <div className="heroSide">

          <div>

            <div className="eyebrow">
              Need help?
            </div>

            <h2>
              Chat with A.U SHOP
            </h2>

            <p className="muted">
              Ask about products, availability or your order.
            </p>

          </div>

          <a
            className="btn primary"
            href="https://wa.me/923160478318?text=hello%2C%20Can%20I%20get%20more%20information%20about%20this"
            target="_blank"
          >
            <MessageCircle size={17}/>
            WhatsApp us
          </a>

        </div>

      </section>

    </main>
  );
}
