import { MainContent, Card } from '..';

export default function GovernancePage() {
  return (
    <MainContent>
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold text-primary">Governance</h1>
        <p className="text-lg text-on-surface-variant">
          Compliance, audit logs, and governance controls
        </p>
      </div>

      <Card className="p-8 text-center">
        <p className="text-on-surface-variant">Governance page coming soon...</p>
      </Card>
    </MainContent>
  );
}
