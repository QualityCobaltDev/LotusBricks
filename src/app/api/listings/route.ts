import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { listingSchema } from "@/lib/validators";

export async function GET(){const data=await db.listing.findMany({include:{media:true},orderBy:{updatedAt:'desc'}});return NextResponse.json(data);}

export async function POST(req:Request){const session=await getSession();if(session?.role!=='ADMIN')return NextResponse.json({error:'Forbidden'},{status:403});const parsed=listingSchema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:'Validation failed'},{status:400});const {imageUrl,videoUrl,...payload}=parsed.data;const listing=await db.listing.upsert({where:{slug:payload.slug},update:{...payload,publishedAt:payload.status==='PUBLISHED'?new Date():null},create:{...payload,publishedAt:payload.status==='PUBLISHED'?new Date():null}});await db.listingMedia.deleteMany({where:{listingId:listing.id}});const media=[imageUrl&&{listingId:listing.id,url:imageUrl,kind:'image',sortOrder:1},videoUrl&&{listingId:listing.id,url:videoUrl,kind:'video',sortOrder:2}].filter(Boolean) as {listingId:string;url:string;kind:string;sortOrder:number}[];if(media.length)await db.listingMedia.createMany({data:media});return NextResponse.json(listing);}

export async function DELETE(req:Request){const session=await getSession();if(session?.role!=='ADMIN')return NextResponse.json({error:'Forbidden'},{status:403});const id=new URL(req.url).searchParams.get('id');if(!id)return NextResponse.json({error:'id required'},{status:400});await db.listing.delete({where:{id}});return NextResponse.json({ok:true});}
