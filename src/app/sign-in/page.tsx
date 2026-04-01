"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function SignIn(){const router=useRouter();const [error,setError]=useState('');async function onSubmit(formData:FormData){const res=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:formData.get('email'),password:formData.get('password')})});const data=await res.json();if(!res.ok){setError(data.error);return;}router.push(data.redirectTo);}return <section><h1>Sign In</h1><form action={onSubmit}><input name='email' type='email' required/><input name='password' type='password' required/><button className='btn'>Sign in</button>{error&&<p>{error}</p>}</form></section>}
