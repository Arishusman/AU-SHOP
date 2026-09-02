import './globals.css';
import type {Metadata} from 'next';
import {SiteChrome} from '@/components/SiteChrome';
export const metadata:Metadata={title:{default:'A.U SHOP — The Brand Shopping Store',template:'%s | A.U SHOP'},description:'A premium online shopping store for beauty, skincare, hair care and personal care products in Pakistan.',keywords:['AU SHOP','A.U SHOP','cosmetics Pakistan','beauty products','Skin Aqua Clean White','face wash','serum','hair shampoo'],metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'https://example.com'),openGraph:{title:'A.U SHOP — The Brand Shopping Store',description:'Premium beauty & personal care shopping.',type:'website'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-theme="dark"><body><SiteChrome>{children}</SiteChrome></body></html>}
