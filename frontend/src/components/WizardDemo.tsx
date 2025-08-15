import { useState } from 'react';
import { Button } from './ui/button';
import { CourseCreationWizard } from './CourseCreationWizard';
import { Sparkles, BookOpen } from 'lucide-react';

export function WizardDemo() {
  const [showWizard, setShowWizard] = useState(false);
  const [createdCourse, setCreatedCourse] = useState<any>(null);

  const handleComplete = (course: any) => {
    setCreatedCourse(course);
    setShowWizard(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Course Creation Wizard
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Experience our AI-powered course creation wizard that builds personalized language learning paths.
          </p>
        </div>

        {!createdCourse ? (
          <Button 
            onClick={() => setShowWizard(true)}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-8 py-4 text-lg"
          >
            <Sparkles className="h-6 w-6 mr-3" />
            Create AI Course
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <BookOpen className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">{createdCourse.title}</h3>
              <p className="text-gray-600 mb-4">{createdCourse.description}</p>
              <div className="text-sm text-gray-500">
                Duration: {createdCourse.estimatedDuration} • 
                Lessons: {createdCourse.totalLessons}
              </div>
            </div>
            <Button 
              onClick={() => {
                setCreatedCourse(null);
                setShowWizard(true);
              }}
              variant="outline"
            >
              Create Another Course
            </Button>
          </div>
        )}

        {showWizard && (
          <CourseCreationWizard
            onClose={() => setShowWizard(false)}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  );
}
