import { MainContent, Card } from '..';

export default function StudentsPage() {
  return (
    <MainContent>
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold text-primary">Students</h1>
        <p className="text-lg text-on-surface-variant">
          Manage and view student records
        </p>
      </div>

      <Card className="p-8 text-center">
        <p className="text-on-surface-variant">Students page coming soon...</p>
      </Card>
    </MainContent>
  );
}
