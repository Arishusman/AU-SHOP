'use client';
import Link from 'next/link'; import {useEffect,useState} from 'react'; import {Menu,ShoppingBag,Sun,Moon,ArrowUp,Home,Grid2X2,UserRound,Search,X} from 'lucide-react'; import {cartCount,themeInit,toggleTheme} from '@/lib/store';
export function SiteChrome({children}:{children:React.ReactNode}){const [open,setOpen]=useState(false);const[count,setCount]=useState(0);const[theme,setTheme]=useState('dark');useEffect(()=>{themeInit();setTheme(document.documentElement.dataset.theme||'dark');const f=()=>setCount(cartCount());f();addEventListener('cart:changed',f);return()=>removeEventListener('cart:changed',f)},[]);const close=()=>setOpen(false);return <><header className="topbar"><div className="container" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><button className="iconbtn" onClick={()=>setOpen(true)} aria-label="Menu"><Menu/></button><Link href="/" className="brand">A.U SHOP</Link><div className="actions"><Link className="iconbtn" href="/cart"><ShoppingBag size={19}/><span style={{fontSize:10}}>{count}</span></Link><button className="iconbtn" onClick={()=>{toggleTheme();setTheme(document.documentElement.dataset.theme||'dark')}}>{theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}</button></div></div></header>
<div className="au-beauty-marquee" aria-label="Beauty announcement">
  <div className="au-beauty-marquee-track">
    <span className="au-beauty-marquee-text">
      ✦ Reveal Your Natural Glow • Discover Beauty Essentials • Premium Makeup &amp; Skincare • New Arrivals • Your Beauty, Your Way ✦
    </span>
    <span className="au-beauty-marquee-text">
      ✦ Reveal Your Natural Glow • Discover Beauty Essentials • Premium Makeup &amp; Skincare • New Arrivals • Your Beauty, Your Way ✦
    </span>
  </div>
</div>
{open&&<div className="drawer" onClick={close}><div className="drawerPanel" onClick={e=>e.stopPropagation()}><button className="iconbtn close" onClick={close}><X/></button><h2 style={{marginTop:55}}>A.U SHOP</h2><p className="muted">The Brand Shopping Store</p>{[['/','Home'],['/categories','Categories'],['/products','Products'],['/blog','Blog'],['/contact','Contact'],['/location','Location'],['/account','Account']].map(([href,label])=><Link key={href} href={href} onClick={close}>{label}</Link>)}<div style={{marginTop:18}}><Link className="btn primary" href="/account" onClick={close}>Login / Sign Up</Link></div></div></div>}{children}<footer className="footer"><div className="container"><div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr 1fr',gap:25,alignItems:'start'}}><div><h2 style={{margin:'0 0 8px',color:'var(--text)'}}>A.U SHOP</h2><p style={{margin:0,lineHeight:1.7}}>The Brand Shopping Store</p><p style={{margin:'8px 0 0',lineHeight:1.7}}>Tehsil Road, Sharaqpur Sharif<br/>District Sheikhupura, Pakistan</p></div><div><h3 style={{margin:'0 0 10px',color:'var(--text)'}}>Company</h3><Link href="/about" style={{display:'block',padding:'5px 0',color:'var(--muted)',textDecoration:'none'}}>About Us</Link><Link href="/contact" style={{display:'block',padding:'5px 0',color:'var(--muted)',textDecoration:'none'}}>Contact</Link><Link href="/location" style={{display:'block',padding:'5px 0',color:'var(--muted)',textDecoration:'none'}}>Location</Link><Link href="/blog" style={{display:'block',padding:'5px 0',color:'var(--muted)',textDecoration:'none'}}>Blog</Link></div><div><h3 style={{margin:'0 0 10px',color:'var(--text)'}}>Customer Information</h3><Link href="/privacy-policy" style={{display:'block',padding:'5px 0',color:'var(--muted)',textDecoration:'none'}}>Privacy Policy</Link><Link href="/terms" style={{display:'block',padding:'5px 0',color:'var(--muted)',textDecoration:'none'}}>Terms & Conditions</Link><Link href="/return-refund" style={{display:'block',padding:'5px 0',color:'var(--muted)',textDecoration:'none'}}>Return & Refund Policy</Link><Link href="/shipping" style={{display:'block',padding:'5px 0',color:'var(--muted)',textDecoration:'none'}}>Shipping & Delivery</Link></div></div><p style={{margin:'30px 0 0',paddingTop:18,borderTop:'1px solid var(--line)',fontSize:13}}>© {new Date().getFullYear()} A.U SHOP. All rights reserved.</p></div></footer><button
  type="button"
  className="globalBackToTop"
  onClick={() => window.scrollTo({top:0, behavior:'smooth'})}
  aria-label="Back to top"
>
  <ArrowUp size={22}/>
</button><a
  className="floatingWhatsapp"
  href="https://wa.me/923160478318?text=Assalam%20o%20Alaikum!%20Mujhe%20A.U%20SHOP%20ke%20products%20ke%20baare%20mein%20maloomat%20chahiye."
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Chat with A.U SHOP on WhatsApp"
>
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <path fill="currentColor" d="M19.11 17.19c-.27-.14-1.58-.78-1.83-.87-.25-.09-.43-.14-.61.14-.18.27-.7.87-.86 1.05-.16.18-.32.2-.59.07-.27-.14-1.13-.42-2.15-1.33-.79-.7-1.32-1.56-1.48-1.83-.16-.27-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.26s.98 2.62 1.11 2.8c.14.18 1.93 2.95 4.68 4.14.65.28 1.16.45 1.73.11.53-.08 1.58-.65 1.8-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32z"/>
    <path fill="currentColor" d="M16.02 3.2c-7.08 0-12.84 5.76-12.84 12.84 0 2.27.6 4.48 1.74 6.43L3.2 28.8l6.5-1.7a12.8 12.8 0 0 0 6.32 1.66h.01c7.08 0 12.84-5.76 12.84-12.84S23.1 3.2 16.02 3.2zm0 23.4h-.01c-2.03 0-4.02-.55-5.76-1.59l-.41-.24-3.86 1.01 1.03-3.76-.27-.39a10.66 10.66 0 0 1-1.64-5.59c0-5.87 4.78-10.65 10.66-10.65 2.84 0 5.5 1.11 7.5 3.11a10.6 10.6 0 0 1 3.12 7.54c0 5.78-4.78 10.56-10.66 10.56z"/>
  </svg>
</a><nav className="bottomNav"><Link href="/"><Home size={18}/><b>Home</b></Link><Link href="/products"><Grid2X2 size={18}/><b>Products</b></Link><Link href="/cart"><ShoppingBag size={18}/><b>Cart {count?`(${count})`:''}</b></Link><Link href="/account"><UserRound size={18}/><b>Account</b></Link></nav></>}
