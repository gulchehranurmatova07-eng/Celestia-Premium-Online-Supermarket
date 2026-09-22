import { getCustomerSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AddressManager } from "./AddressManager";

export default async function AddressesPage() {
  const session = await getCustomerSession();
  const addresses = await db.address.findMany({ where: { userId: session!.userId }, orderBy: { isDefault: "desc" } });

  return (
    <div>
      <h1 className="mb-5 font-display text-2xl font-semibold text-navy-900">Мои адреса</h1>
      <AddressManager initialAddresses={addresses} />
    </div>
  );
}
