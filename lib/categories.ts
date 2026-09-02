export const categories=[
{id:'beauty-creams',name:'Beauty Creams',tagline:'Glow, hydration & targeted care',tone:'rose',subs:['Whitening Cream','Pigmentation Care','Moisturizers']},
{id:'face-wash',name:'Face Wash',tagline:'Fresh, clean & balanced skin',tone:'blue',subs:['Charcoal Face Wash','Whitening Face Wash','Acne Face Wash']},
{id:'whitening-serum',name:'Whitening Serum',tagline:'Brightening formulas for a refined glow',tone:'violet',subs:['Vitamin C','Niacinamide','Exfoliating Serum']},
{id:'hair-shampoo',name:'Hair Shampoo',tagline:'Stronger roots, cleaner scalp',tone:'emerald',subs:['Anti-Dandruff','Hair Fall Care','Growth Care']},
{id:'head-lice-treatment',name:'Head Lice Treatment',tagline:'Scalp-focused lice & nit care',tone:'amber',subs:['Anti-Lice Shampoo','Lice Solutions','Scalp Care']},
{id:'feminine-care',name:'Feminine Care',tagline:'Gentle daily hygiene essentials',tone:'pink',subs:['Intimate Wash','Vaginal Care','Daily Hygiene']}
];
export const categoryProducts=(id:string,products:any[])=>{const map:any={
'beauty-creams':products.filter(p=>/cream|moistur|sudocrem|comfort|ethiglo|humactin|sun stop/i.test(p.name+' '+p.use)),
'face-wash':products.filter(p=>/face wash|cleanser/i.test(p.name+' '+p.use)),
'whitening-serum':products.filter(p=>/serum/i.test(p.name+' '+p.use)),
'hair-shampoo':products.filter(p=>/shampoo|hair oil|hair growth|hair loss/i.test(p.name+' '+p.use)),
'head-lice-treatment':products.filter(p=>/lice/i.test(p.name+' '+p.use)),
'feminine-care':products.filter(p=>/vaginal|intimate|feminine|she wash|clinco|revag/i.test(p.name+' '+p.use))}; return map[id]||[]};
