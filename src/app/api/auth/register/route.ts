import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession, hashPassword } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";

export async function POST(req: Request){const parsed=registerSchema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:'Invalid input'},{status:400});const exists=await db.user.findUnique({where:{email:parsed.data.email}});if(exists)return NextResponse.json({error:'Email already used'},{status:409});const user=await db.user.create({data:{email:parsed.data.email,fullName:parsed.data.fullName,passwordHash:hashPassword(parsed.data.password),role:'CUSTOMER'}});await createSession(user.id,'CUSTOMER');return NextResponse.json({ok:true,redirectTo:'/account'});}
