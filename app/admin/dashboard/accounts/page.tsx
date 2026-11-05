import PageHeader from "@/components/admin/shared/PageHeader";
import AccountsClient from "@/components/admin/accounts/AccountsClient";

export default function AdminAccountsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Accounts (Hisaab)"
        description="Kharcha, aamdani, stock kharidi aur udhaar manually chadhao. Website ki sales apne aap judti hain."
      />

      <AccountsClient />
    </div>
  );
}
