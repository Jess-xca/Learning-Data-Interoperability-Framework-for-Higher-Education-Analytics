import { MainContent, Card } from '..';

export default function ReportsPage() {
  return (
    <MainContent>
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold text-primary">Reports</h1>
        <p className="text-lg text-on-surface-variant">
          Generate and manage institutional reports
        </p>
      </div>

      <Card className="p-8 text-center">
        <p className="text-on-surface-variant">Reports page coming soon...</p>
      </Card>
    </MainContent>
  );
}
