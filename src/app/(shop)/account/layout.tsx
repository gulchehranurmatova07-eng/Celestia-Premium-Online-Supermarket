import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/auth";
import { AccountNav } from "@/components/account/AccountNav";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getCustomerSession();
  if (!session) redirect("/login?next=/account");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        <AccountNav name={session.name} phone={session.phone} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
