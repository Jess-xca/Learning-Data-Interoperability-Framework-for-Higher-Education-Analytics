import { MainContent, Card } from '..';

export default function CoursesPage() {
  return (
    <MainContent>
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold text-primary">Courses</h1>
        <p className="text-lg text-on-surface-variant">
          Manage course offerings and schedules
        </p>
      </div>

      <Card className="p-8 text-center">
        <p className="text-on-surface-variant">Courses page coming soon...</p>
      </Card>
    </MainContent>
  );
}
