import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export async function POST(req: Request){const parsed=loginSchema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:'Invalid input'},{status:400});const user=await db.user.findUnique({where:{email:parsed.data.email}});if(!user||user.passwordHash!==hashPassword(parsed.data.password)||!user.isActive){return NextResponse.json({error:'Invalid credentials'},{status:401});}await createSession(user.id,user.role);return NextResponse.json({ok:true,redirectTo:user.role==='ADMIN'?'/admin':'/account'});}
