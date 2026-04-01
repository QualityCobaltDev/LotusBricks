import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(){return NextResponse.json(await db.siteContent.findMany());}
export async function POST(req:Request){const session=await getSession();if(session?.role!=='ADMIN')return NextResponse.json({error:'Forbidden'},{status:403});const body=await req.json();if(!body.key||!body.title||!body.body)return NextResponse.json({error:'Invalid payload'},{status:400});const result=await db.siteContent.upsert({where:{key:body.key},update:{title:body.title,body:body.body,meta:body.meta??null},create:{key:body.key,title:body.title,body:body.body,meta:body.meta??null}});return NextResponse.json(result);}
