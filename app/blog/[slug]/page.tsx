import Link from 'next/link';
import {notFound} from 'next/navigation';

const API=process.env.NEXT_PUBLIC_API_URL||'';

async function getBlog(slug:string){
  try{
    const r=await fetch(API+'/api/blogs',{cache:'no-store'});
    const j=await r.json();
    if(!j.ok||!Array.isArray(j.data))return null;
    return j.data.find((x:any)=>x.slug===slug)||null;
  }catch{
    return null;
  }
}

export default async function BlogArticle({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const blog=await getBlog(slug);

  if(!blog)notFound();

  return <main className="container page">
    <Link href="/blog" className="btn">← Back to Blog</Link>

    <article className="section" style={{maxWidth:900,margin:'24px auto'}}>
      {blog.image_url&&
        <img
          src={blog.image_url}
          alt={blog.title}
          style={{width:'100%',maxHeight:480,objectFit:'cover',borderRadius:16}}
        />
      }

      <div style={{marginTop:24}}>
        <div className="eyebrow">A.U SHOP BLOG</div>
        <h1 style={{fontSize:46,margin:'8px 0 12px'}}>{blog.title}</h1>

        <div className="muted" style={{marginBottom:24}}>
          {blog.created_at?new Date(blog.created_at).toLocaleDateString():''}
        </div>

        <div style={{whiteSpace:'pre-wrap',lineHeight:1.8,fontSize:17}}>
          {blog.content}
        </div>

        <div
          style={{
            marginTop: 40,
            padding: 28,
            borderRadius: 16,
            textAlign: 'center',
            background: '#f8f8f8',
          }}
        >
          <h3 style={{marginBottom: 8}}>Ready to shop?</h3>
          <p className="muted" style={{marginBottom: 18}}>
            Explore our products and find the right care for you.
          </p>

          <Link href="/products" className="btn primary">
            Shop Now →
          </Link>
        </div>
      </div>
    </article>
  </main>;
}
