import { requireAuth } from "@/server/guards";
import { db } from "@/lib/db";

export default async function AccountPage(){const session=await requireAuth();const user=await db.user.findUnique({where:{id:session.userId}});const favorites=await db.favorite.count({where:{userId:session.userId}});return <section><h1>Account</h1><p>{user?.fullName}</p><p>Saved listings: {favorites}</p></section>}
