import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req:Request){const session=await getSession();if(!session)return NextResponse.json({error:'Unauthorized'},{status:401});const {listingId}=await req.json();if(!listingId)return NextResponse.json({error:'listingId required'},{status:400});const fav=await db.favorite.upsert({where:{userId_listingId:{userId:session.userId,listingId}},update:{},create:{userId:session.userId,listingId}});return NextResponse.json(fav,{status:201});}
