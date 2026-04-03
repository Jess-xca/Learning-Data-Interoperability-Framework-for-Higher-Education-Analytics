import { MainContent, Card } from '..';

export default function AnalyticsPage() {
  return (
    <MainContent>
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold text-primary">Analytics</h1>
        <p className="text-lg text-on-surface-variant">
          View advanced institutional analytics and reports
        </p>
      </div>

      <Card className="p-8 text-center">
        <p className="text-on-surface-variant">Analytics page coming soon...</p>
      </Card>
    </MainContent>
  );
}
