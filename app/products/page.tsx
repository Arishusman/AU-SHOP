import {ProductCard} from '@/components/ProductCard';
import {SearchBar} from '@/components/SearchBar';

async function getProducts(){
  try{
    const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`,{
      cache:'no-store'
    });
    if(!res.ok)return [];
    const json=await res.json();
    return (json?.data?.items||[]).map((p:any)=>({
      ...p,
      slug:p.slug||p.name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''),
      forWho:p.for_who
    }));
  }catch{
    return [];
  }
}

export default async function Products(){
  const products=await getProducts();

  return <main className="container page">
    <div className="sectionHead">
      <div>
        <div className="eyebrow">Catalog</div>
        <h1 style={{fontSize:50}}>All products</h1>
        <p className="muted">{products.length} products in the launch catalog.</p>
      </div>
    </div>
    <SearchBar/>
    <div className="grid">
      {products.map((p:any)=><ProductCard key={p.id} p={p}/>)}
    </div>
  </main>
}
