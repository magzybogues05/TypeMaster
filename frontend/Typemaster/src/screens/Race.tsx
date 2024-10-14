import React, {useState } from 'react'
import { useNavigate } from 'react-router-dom';
const INIT_PUBLIC="init_public";
const JOIN_PUBLIC="join_public";
const Race = () => {
  const navigate=useNavigate();
  const [username,setUsername]=useState<string>("John Doe");
  return (
    <div>
        <input className='text-white text-xl p-2' onChange={e=>setUsername(e.target.value)} placeholder='enter username'/>
        <div>
      <button className='mx-1.5 text-2xl' onClick={()=>{
            navigate('/game',{
                state:{
                    type:JOIN_PUBLIC,
                    username
                }
            })
        }
      }>Join Race</button>
      <button className='mx-1.5 text-2xl' onClick={()=>{
            navigate('/game',{
                state:{
                    type:INIT_PUBLIC,
                    username
                }
            })
        }
      }>Create Race</button>
      </div>
    </div>
  )
}

export default Race
