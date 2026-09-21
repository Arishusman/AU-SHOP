'use client';

import {useState} from 'react';
import Link from 'next/link';

const API=process.env.NEXT_PUBLIC_API_URL||'';

export default function Account(){
  const[step,setStep]=useState(0);
  const[email,setEmail]=useState('');
  const[code,setCode]=useState('');
  const[challenge,setChallenge]=useState('');
  const[logged,setLogged]=useState(
    ()=>typeof window!=='undefined'&&!!localStorage.getItem('au-user')
  );
  const[loading,setLoading]=useState(false);

  const savedUser=()=>{
    try{
      return JSON.parse(localStorage.getItem('au-user')||'{}');
    }catch{
      return {};
    }
  };

  if(logged){
    const user=savedUser();

    return <main className="container page">
      <div className="eyebrow">My account</div>
      <h1 style={{fontSize:54}}>Account</h1>
      <p className="muted">{user.email||''}</p>

      <div className="grid">
        {[
          ['/account/orders','Orders'],
          ['/cart','Cart'],
          ['/account/reviews','Reviews'],
          ['/account/address','Default address'],
          ['/account/profile','Profile']
        ].map(x=>
          <Link
            className="summary"
            href={x[0]}
            key={x[0]}
            style={{color:'var(--text)',textDecoration:'none'}}
          >
            <h3>{x[1]}</h3>
            <p className="muted">Open {x[1].toLowerCase()}</p>
          </Link>
        )}
      </div>

      <button
        className="btn"
        style={{marginTop:18}}
        onClick={()=>{
          localStorage.removeItem('au-user');
          setLogged(false);
        }}
      >
        Logout
      </button>
    </main>;
  }

  return <main className="container page">
    <div className="summary" style={{maxWidth:520,margin:'40px auto'}}>
      <div className="eyebrow">A.U SHOP account</div>
      <h1 style={{fontSize:44}}>Login / Sign up</h1>

      {step===0&&
        <div className="form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />

          <button
            className="btn primary"
            disabled={!email||loading}
            onClick={async()=>{
              try{
                setLoading(true);

                const r=await fetch(API+'/api/auth/send-code',{
                  method:'POST',
                  headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({email})
                });

                const j=await r.json();

                if(!r.ok)throw new Error(
                  j.error||'Could not send verification code'
                );

                setChallenge(j.data?.challenge||'');
                setStep(1);
              }catch(e){
                alert(
                  e instanceof Error
                    ? e.message
                    : 'Could not send verification code'
                );
              }finally{
                setLoading(false);
              }
            }}
          >
            {loading?'Sending...':'Send code'}
          </button>

          <div className="muted">
            A verification code will be sent to your email.
          </div>
        </div>
      }

      {step===1&&
        <div className="form">
          <input
            placeholder="6-digit code"
            value={code}
            onChange={e=>setCode(e.target.value)}
            inputMode="numeric"
            maxLength={6}
          />

          <button
            className="btn primary"
            disabled={code.length!==6||loading}
            onClick={async()=>{
              try{
                setLoading(true);

                const r=await fetch(API+'/api/auth/verify-code',{
                  method:'POST',
                  headers:{'Content-Type':'application/json'},
                  body:JSON.stringify({
                    email,
                    code,
                    challenge
                  })
                });

                const j=await r.json();

                if(!r.ok)throw new Error(
                  j.error||'Invalid verification code'
                );

                const user=j.data?.user;

                if(!user?.email||!user?.profile_id){
                  throw new Error('Account information was not returned');
                }

                localStorage.setItem(
                  'au-user',
                  JSON.stringify({
                    email:user.email,
                    profile_id:user.profile_id,
                    token:j.data?.token||''
                  })
                );

                setLogged(true);
              }catch(e){
                alert(
                  e instanceof Error
                    ? e.message
                    : 'Invalid verification code'
                );
              }finally{
                setLoading(false);
              }
            }}
          >
            {loading?'Verifying...':'Verify code'}
          </button>
        </div>
      }
    </div>
  </main>;
}
