import PageHeader from "@/components/admin/shared/PageHeader";
import AccountsClient from "@/components/admin/accounts/AccountsClient";

export default function AdminAccountsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Accounts"
        description="Add expenses, income, stock purchases and dues by hand. Website sales are included automatically."
      />

      <AccountsClient />
    </div>
  );
}
