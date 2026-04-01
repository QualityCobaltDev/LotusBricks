import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(){return NextResponse.json(await db.pricingPlan.findMany({orderBy:{sortOrder:'asc'}}));}
export async function POST(req:Request){const session=await getSession();if(session?.role!=='ADMIN')return NextResponse.json({error:'Forbidden'},{status:403});const body=await req.json();if(!body.name||!body.priceLabel)return NextResponse.json({error:'Invalid payload'},{status:400});const row=await db.pricingPlan.create({data:{name:body.name,priceLabel:body.priceLabel,cadence:body.cadence??'monthly',ctaLabel:body.ctaLabel??'Get started',features:body.features??[],sortOrder:body.sortOrder??0,isActive:body.isActive??true}});return NextResponse.json(row,{status:201});}
