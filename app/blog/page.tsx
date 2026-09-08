import Link from 'next/link';

const API=process.env.NEXT_PUBLIC_API_URL||'';

async function getBlogs(){
  try{
    const r=await fetch(API+'/api/blogs',{cache:'no-store'});
    const j=await r.json();
    return j.ok&&Array.isArray(j.data)?j.data:[];
  }catch{
    return [];
  }
}

export default async function BlogPage(){
  const blogs=await getBlogs();

  return <main className="container page">
    <div className="eyebrow">A.U SHOP</div>
    <h1 style={{fontSize:46}}>Blog</h1>
    <p className="muted">Latest articles, tips and updates from A.U SHOP.</p>

    {blogs.length===0?
      <div className="empty" style={{marginTop:30}}>No blog posts yet.</div>
      :
      <div className="grid" style={{marginTop:30}}>
        {blogs.map((blog:any)=>
          <article className="card" key={blog.id} style={{overflow:'hidden'}}>
            {blog.image_url&&
              <img
                src={blog.image_url}
                alt={blog.title}
                style={{width:'100%',height:220,objectFit:'cover',borderRadius:12}}
              />
            }
            <div style={{paddingTop:16}}>
              <div className="muted" style={{fontSize:13}}>
                {blog.created_at?new Date(blog.created_at).toLocaleDateString():'A.U SHOP'}
              </div>
              <h2 style={{margin:'8px 0'}}>{blog.title}</h2>
              <p className="muted">
                {String(blog.content||'').slice(0,180)}
                {String(blog.content||'').length>180?'…':''}
              </p>
              <Link className="btn primary" href={'/blog/'+blog.slug}>
                Read more
              </Link>
            </div>
          </article>
        )}
      </div>
    }
  </main>;
}
