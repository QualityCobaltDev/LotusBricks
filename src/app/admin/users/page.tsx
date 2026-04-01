import { requireAdmin } from "@/server/guards";
import { db } from "@/lib/db";

export default async function AdminUsers(){await requireAdmin();const users=await db.user.findMany({orderBy:{createdAt:'desc'}});return <section><h1>Users</h1><ul>{users.map((u)=><li key={u.id}>{u.email} · {u.role}</li>)}</ul></section>}
