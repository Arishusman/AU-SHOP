import Link from 'next/link'; import {MessageCircle,ShieldCheck,Truck,Star} from 'lucide-react'; import {products} from '@/lib/products'; import {categories} from '@/lib/categories'; import {SearchBar} from '@/components/SearchBar'; import {CategoryBlock} from '@/components/CategoryBlock';
const reviews=[['Ayesha K.','The packaging was neat and the order arrived quickly.'],['Maham R.','Easy checkout and good product selection.'],['Sana A.','Loved the premium look of the store and the service.'],['Hira M.','Product details were clear and delivery updates helped.'],['Zainab S.','Smooth shopping experience from cart to tracking.']];
async function getHomeProducts(){
  try{
    const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`,{cache:'no-store'});
    if(!res.ok)return products;
    const json=await res.json();
    const items=Array.isArray(json?.data?.items)?json.data.items:[];
    const byId=new Map<string,any>(items.map((p:any)=>[String(p.id),p]));
    return products.map(p=>{
      const live=byId.get(String(p.id));
      return live?.image ? {...p,image:live.image} : p;
    });
  }catch{
    return products;
  }
}

export default async function Home(){
  const homeProducts=await getHomeProducts();
  return <main className="container"><section className="hero"><div className="heroCard"><div className="eyebrow">A.U SHOP · THE BRAND SHOPPING STORE</div><h1>Beauty, care & everyday essentials — elevated.</h1><p>Shop a curated collection of skincare, beauty, hair care, feminine care and personal essentials with a premium, simple shopping experience.</p><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><Link href="/products" className="btn primary">Shop all products</Link><Link href="/categories" className="btn ghost">Explore categories</Link></div></div><div className="heroSide"><div><div className="eyebrow">Why A.U SHOP</div><h2 style={{fontSize:36}}>Quality products. Clear pricing. Easy tracking.</h2><p className="muted">A modern storefront designed mobile-first, with fast discovery, simple checkout and order status visibility.</p></div><div style={{display:'grid',gap:10}}><div className="notice"><ShieldCheck size={18}/> Curated catalog</div><div className="notice"><Truck size={18}/> Delivery tracking</div><div className="notice"><Star size={18}/> Customer reviews</div></div></div></section><SearchBar/>{categories.map(c=><CategoryBlock key={c.id} cat={c} products={homeProducts}/>)}<section className="section"><div className="sectionHead"><div><div className="eyebrow">Community notes</div><h2>What shoppers say</h2></div><Link href="/reviews" className="btn ghost">View more</Link></div><div className="reviews">{reviews.map(r=><article className="review" key={r[0]}><div className="stars">★★★★★</div><p>{r[1]}</p><b>{r[0]}</b><div className="muted" style={{fontSize:11}}>Sample review</div></article>)}</div></section><section className="section"><div className="heroSide"><div><div className="eyebrow">Need help?</div><h2>Chat with A.U SHOP</h2><p className="muted">Ask about products, availability or your order.</p></div><a className="btn primary" href="https://wa.me/923160478318?text=hello%2C%20Can%20I%20get%20more%20information%20about%20this" target="_blank"><MessageCircle size={17}/> WhatsApp us</a></div></section><footer className="footer">© {new Date().getFullYear()} A.U SHOP · The Brand Shopping Store · <a href="mailto:arishusman.web@gmail.com" style={{color:'var(--text)'}}>arishusman.web@gmail.com</a></footer></main>}
