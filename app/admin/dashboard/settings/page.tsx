import PageHeader from "@/components/admin/shared/PageHeader";
import SettingsTabs from "@/components/admin/settings/SettingsTabs";
import { getSettings } from "@/lib/actions/settings/getSettings";

export default async function SettingsPage() {
  const result = await getSettings();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your store configuration."
      />

      <SettingsTabs settings={result.data || {}} />
    </div>
  );
}