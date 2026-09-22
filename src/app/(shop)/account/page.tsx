import { getCustomerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const session = await getCustomerSession();
  const user = await db.user.findUnique({ where: { id: session!.userId } });

  return (
    <div className="rounded-2xl border border-navy-900/8 bg-white p-6">
      <h1 className="mb-5 font-display text-2xl font-semibold text-navy-900">Profil</h1>
      <ProfileForm name={user!.name} phone={user!.phone} email={user!.email ?? ""} />
    </div>
  );
}
