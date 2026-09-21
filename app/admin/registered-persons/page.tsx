'use client';

import {useEffect,useState} from 'react';

const API=process.env.NEXT_PUBLIC_API_URL||'';

type Person={
  id:string;
  email:string;
  created_at?:string;
};

export default function RegisteredPersons(){
  const[rows,setRows]=useState<Person[]>([]);
  const[loading,setLoading]=useState(true);

  useEffect(()=>{
    const token=localStorage.getItem('au_admin_token')||'';

    fetch(API+'/api/admin/profiles',{
      headers:{
        Authorization:'Bearer '+token
      }
    })
      .then(r=>r.json())
      .then(j=>{
        if(!j.ok){
          alert(j.error||'Registered persons could not be loaded');
          return;
        }

        setRows(Array.isArray(j.data)?j.data:[]);
      })
      .catch(()=>{
        alert('Unable to load registered persons');
      })
      .finally(()=>{
        setLoading(false);
      });
  },[]);

  return <main className="container page">
    <div className="sectionHead">
      <div>
        <div className="eyebrow">Customer Accounts</div>
        <h1>Registered Persons</h1>
      </div>

      <span className="muted">
        {rows.length} registered {rows.length===1?'person':'persons'}
      </span>
    </div>

    {loading?
      <div className="empty">Loading registered persons...</div>
    :
      rows.length===0?
        <div className="empty">No registered persons yet.</div>
      :
        <div className="section">
          <div className="table">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                </tr>
              </thead>

              <tbody>
                {rows.map(person=>
                  <tr
                    key={person.id}
                    onClick={()=>{
                      window.location.href=
                        '/admin/registered-persons/'+person.id;
                    }}
                    style={{cursor:'pointer'}}
                  >
                    <td>
                      <b>{person.email}</b>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    }
  </main>;
}
