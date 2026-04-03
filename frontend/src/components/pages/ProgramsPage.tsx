import { MainContent, Card } from '..';

export default function ProgramsPage() {
  return (
    <MainContent>
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold text-primary">Programs</h1>
        <p className="text-lg text-on-surface-variant">
          View and manage academic programs
        </p>
      </div>

      <Card className="p-8 text-center">
        <p className="text-on-surface-variant">Programs page coming soon...</p>
      </Card>
    </MainContent>
  );
}
