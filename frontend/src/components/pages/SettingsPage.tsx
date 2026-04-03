import { MainContent, Card } from '..';

export default function SettingsPage() {
  return (
    <MainContent>
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold text-primary">Settings</h1>
        <p className="text-lg text-on-surface-variant">
          Configure system preferences and user settings
        </p>
      </div>

      <Card className="p-8 text-center">
        <p className="text-on-surface-variant">Settings page coming soon...</p>
      </Card>
    </MainContent>
  );
}
