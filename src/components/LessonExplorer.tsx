
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Expand, Minimize2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const lessonsByMicroCredential = {
  'Level 1 - Foundations': [
    { lesson: 1, title: 'Introduction to Financial Literacy', topic: 'Setting the Scene', completed: true },
    { lesson: 2, title: 'Basic Budgeting', topic: 'Budgeting Level 1', completed: true },
    { lesson: 3, title: 'Expenses Deep Dive', topic: 'Spending', completed: true },
    { lesson: 4, title: 'Smart Spending', topic: 'Spending', completed: true },
    { lesson: 5, title: 'Introduction to Super', topic: 'Super', completed: true },
    { lesson: 6, title: 'Super Fund Basics', topic: 'Super', completed: true },
    { lesson: 7, title: 'Choosing Your Super Fund', topic: 'Super', completed: true },
    { lesson: 8, title: 'Intro to Tax', topic: 'Tax', completed: false },
    { lesson: 9, title: 'Income Tax Basics', topic: 'Tax', completed: false },
    { lesson: 10, title: 'Tax Returns', topic: 'Tax', completed: false }
  ],
  'Level 2 - Building Skills': [
    { lesson: 11, title: 'Intermediate Budgeting', topic: 'Budgeting Level 2', completed: false },
    { lesson: 12, title: 'Planning Your Future', topic: 'Saving', completed: false },
    { lesson: 13, title: 'Setting Savings Goals', topic: 'Saving', completed: false },
    { lesson: 14, title: 'Career & Education Choices', topic: 'Employment', completed: false },
    { lesson: 15, title: 'Prepping For Job Applications', topic: 'Employment', completed: false },
    { lesson: 16, title: 'Interview Skills', topic: 'Employment', completed: false },
    { lesson: 17, title: 'Starting Your Job', topic: 'Employment', completed: false },
    { lesson: 18, title: 'Buying & Owning a Car', topic: 'Real World', completed: false },
    { lesson: 19, title: 'Tech & Phone Plans', topic: 'Real World', completed: false },
    { lesson: 20, title: 'Travel Money', topic: 'Real World', completed: false },
    { lesson: 21, title: 'Moving Out', topic: 'Real World', completed: false }
  ],
  'Level 3 - Advanced Topics': [
    { lesson: 22, title: 'Advanced Budgeting', topic: 'Budgeting Level 3', completed: false },
    { lesson: 23, title: 'Introduction To Interest', topic: 'Systems', completed: false },
    { lesson: 24, title: 'Compound Interest', topic: 'Systems', completed: false },
    { lesson: 25, title: 'Financial Products', topic: 'Systems', completed: false },
    { lesson: 26, title: 'Banking & Products', topic: 'Systems', completed: false },
    { lesson: 27, title: 'Money In An Equal Society', topic: 'Systems', completed: false },
    { lesson: 28, title: 'Peaceful Money Mind', topic: 'Safety', completed: false },
    { lesson: 29, title: 'Insurance & Health Care', topic: 'Safety', completed: false },
    { lesson: 30, title: 'Staying Safe', topic: 'Safety', completed: false },
    { lesson: 31, title: 'Getting Organised & Supported', topic: 'Safety', completed: false }
  ],
  'Level 4 - Mastery': [
    { lesson: 32, title: 'Building Wealth', topic: 'Wealth', completed: false },
    { lesson: 33, title: 'Generating Income', topic: 'Wealth', completed: false },
    { lesson: 34, title: 'Intro to Debt', topic: 'Debt', completed: false },
    { lesson: 35, title: 'Key Debt Products', topic: 'Debt', completed: false },
    { lesson: 36, title: 'Being a Smart Borrower', topic: 'Debt', completed: false },
    { lesson: 37, title: 'Investing Basics', topic: 'Investing', completed: false },
    { lesson: 38, title: 'Investing Performance', topic: 'Investing', completed: false },
    { lesson: 39, title: 'Risk, Return & Diversity', topic: 'Investing', completed: false },
    { lesson: 40, title: 'Intro to Shares', topic: 'Investing', completed: false },
    { lesson: 41, title: 'Choosing & Buying Shares', topic: 'Investing', completed: false },
    { lesson: 42, title: 'Property Investment', topic: 'Investing', completed: false }
  ]
};

const topicColors: { [key: string]: string } = {
  'Setting the Scene': 'bg-purple-100 text-purple-800',
  'Budgeting Level 1': 'bg-blue-100 text-blue-800',
  'Budgeting Level 2': 'bg-blue-100 text-blue-800',
  'Budgeting Level 3': 'bg-blue-100 text-blue-800',
  'Spending': 'bg-red-100 text-red-800',
  'Super': 'bg-green-100 text-green-800',
  'Tax': 'bg-yellow-100 text-yellow-800',
  'Saving': 'bg-emerald-100 text-emerald-800',
  'Employment': 'bg-indigo-100 text-indigo-800',
  'Real World': 'bg-orange-100 text-orange-800',
  'Systems': 'bg-cyan-100 text-cyan-800',
  'Safety': 'bg-pink-100 text-pink-800',
  'Wealth': 'bg-amber-100 text-amber-800',
  'Debt': 'bg-rose-100 text-rose-800',
  'Investing': 'bg-teal-100 text-teal-800'
};

export const LessonExplorer = () => {
  const [openLevels, setOpenLevels] = useState<string[]>(['Level 1 - Foundations']);
  const [expandedEmbeds, setExpandedEmbeds] = useState<{ [key: string]: boolean }>({});

  const toggleLevel = (level: string) => {
    setOpenLevels(prev => 
      prev.includes(level) 
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  const toggleEmbed = (embedKey: string) => {
    setExpandedEmbeds(prev => ({
      ...prev,
      [embedKey]: !prev[embedKey]
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Explore the Mandy Money High School Program
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover our comprehensive financial literacy curriculum with 42 lessons across 4 micro-credential levels, 
          designed to build real-world money skills for high school students.
        </p>
      </div>

      {/* How Do Micro-Credentials Work Section */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-800 flex items-center gap-2">
            📚 How Do Micro-Credentials Work?
          </CardTitle>
          <CardDescription className="text-blue-700">
            Learn about our structured approach to financial literacy education
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <div className={`${expandedEmbeds['micro-credentials'] ? 'fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4' : ''}`}>
                <div className={`${expandedEmbeds['micro-credentials'] ? 'w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-lg overflow-hidden' : 'w-full'}`}>
                  {expandedEmbeds['micro-credentials'] && (
                    <div className="flex justify-end p-4 bg-gray-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEmbed('micro-credentials')}
                        className="flex items-center gap-2"
                      >
                        <Minimize2 className="h-4 w-4" />
                        Minimize
                      </Button>
                    </div>
                  )}
                  <div className={`${expandedEmbeds['micro-credentials'] ? 'p-4 h-full' : ''}`}>
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: expandedEmbeds['micro-credentials'] ? 'calc(100% - 4rem)' : '0',
                      paddingTop: expandedEmbeds['micro-credentials'] ? '0' : '56.25%',
                      paddingBottom: '0',
                      boxShadow: '0 2px 8px 0 rgba(63,69,81,0.16)',
                      marginTop: '1.6em',
                      marginBottom: '0.9em',
                      overflow: 'hidden',
                      borderRadius: '8px',
                      willChange: 'transform'
                    }}>
                      <iframe 
                        loading="lazy" 
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: '100%',
                          top: '0',
                          left: '0',
                          border: 'none',
                          padding: '0',
                          margin: '0'
                        }}
                        src="https://github.com/mandymoney/mandy-money-quote-craft/blob/9c742f2dbc55d06420424f2db3c45f93b51b6123/How%20Does%20The%20Mandy%20Money%20High%20School%20Program%20Work_compressed.pdf"
                        allowFullScreen
                        allow="fullscreen"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {!expandedEmbeds['micro-credentials'] && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleEmbed('micro-credentials')}
                  className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm flex items-center gap-2"
                >
                  <Expand className="h-4 w-4" />
                  Expand
                </Button>
              )}
            </div>
            <a 
              href="https://github.com/mandymoney/mandy-money-quote-craft/blob/9c742f2dbc55d06420424f2db3c45f93b51b6123/How%20Does%20The%20Mandy%20Money%20High%20School%20Program%20Work_compressed.pdf" 
              target="_blank" 
              rel="noopener"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              How Does The Mandy Money High School Program Work?
            </a> by Mandy Money
          </div>
        </CardContent>
      </Card>

      {/* Program Structure Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Program Structure Overview</CardTitle>
          <CardDescription>
            Four progressive levels of financial literacy education
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(lessonsByMicroCredential).map(([level, lessons]) => {
              const completedCount = lessons.filter(l => l.completed).length;
              const progressPercentage = (completedCount / lessons.length) * 100;
              
              return (
                <div key={level} className="p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold text-gray-900 mb-2">{level}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Lessons {lessons[0].lesson}-{lessons[lessons.length - 1].lesson}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {completedCount}/{lessons.length} completed
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Lesson Explorer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Detailed Lesson Explorer</CardTitle>
          <CardDescription>
            Click on each level to explore the specific lessons and topics covered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(lessonsByMicroCredential).map(([level, lessons]) => {
              const completedCount = lessons.filter(l => l.completed).length;
              const isOpen = openLevels.includes(level);
              
              return (
                <div key={level} className="border rounded-lg overflow-hidden">
                  <Collapsible open={isOpen} onOpenChange={() => toggleLevel(level)}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-6 h-auto text-left hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{level}</h3>
                            <p className="text-sm text-gray-600">
                              {lessons.length} lessons • {completedCount} completed
                            </p>
                          </div>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-6 pb-6">
                      <div className="grid gap-3">
                        {lessons.map((lesson) => (
                          <div
                            key={lesson.lesson}
                            className={`p-4 rounded-lg border transition-all duration-200 ${
                              lesson.completed 
                                ? 'bg-green-50 border-green-200' 
                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                                  lesson.completed 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-gray-300 text-gray-600'
                                }`}>
                                  {lesson.lesson}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                  <p className="text-sm text-gray-600">Lesson {lesson.lesson}</p>
                                </div>
                              </div>
                              <Badge className={topicColors[lesson.topic] || 'bg-gray-100 text-gray-800'}>
                                {lesson.topic}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sample Lesson Materials */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Sample Lesson Materials</CardTitle>
          <CardDescription>
            Preview the quality and depth of our lesson materials with these sample resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Student Lesson Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Student Lesson: Basic Budgeting</h3>
              <div className="relative">
                <div className={`${expandedEmbeds['student-lesson'] ? 'fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4' : ''}`}>
                  <div className={`${expandedEmbeds['student-lesson'] ? 'w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-lg overflow-hidden' : 'w-full'}`}>
                    {expandedEmbeds['student-lesson'] && (
                      <div className="flex justify-end p-4 bg-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleEmbed('student-lesson')}
                          className="flex items-center gap-2"
                        >
                          <Minimize2 className="h-4 w-4" />
                          Minimize
                        </Button>
                      </div>
                    )}
                    <div className={`${expandedEmbeds['student-lesson'] ? 'p-4 h-full' : ''}`}>
                      <iframe
                        src="https://view.genially.com/66a6c4a2b9b0890ad9f5da2b"
                        width="100%"
                        height={expandedEmbeds['student-lesson'] ? '100%' : '400'}
                        style={{ 
                          border: 'none',
                          borderRadius: '8px',
                          height: expandedEmbeds['student-lesson'] ? 'calc(100% - 4rem)' : '400px'
                        }}
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
                {!expandedEmbeds['student-lesson'] && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleEmbed('student-lesson')}
                    className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm flex items-center gap-2"
                  >
                    <Expand className="h-4 w-4" />
                    Expand
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Interactive student lesson covering budgeting fundamentals with engaging activities and real-world examples.
              </p>
            </div>

            {/* Teacher Resource Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Teacher Resource: Lesson Plan</h3>
              <div className="relative">
                <div className={`${expandedEmbeds['teacher-resource'] ? 'fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4' : ''}`}>
                  <div className={`${expandedEmbeds['teacher-resource'] ? 'w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-lg overflow-hidden' : 'w-full'}`}>
                    {expandedEmbeds['teacher-resource'] && (
                      <div className="flex justify-end p-4 bg-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleEmbed('teacher-resource')}
                          className="flex items-center gap-2"
                        >
                          <Minimize2 className="h-4 w-4" />
                          Minimize
                        </Button>
                      </div>
                    )}
                    <div className={`${expandedEmbeds['teacher-resource'] ? 'p-4 h-full' : ''}`}>
                      <iframe
                        src="https://view.genially.com/66ac20b2c8b8200ab50b30c9"
                        width="100%"
                        height={expandedEmbeds['teacher-resource'] ? '100%' : '400'}
                        style={{ 
                          border: 'none',
                          borderRadius: '8px',
                          height: expandedEmbeds['teacher-resource'] ? 'calc(100% - 4rem)' : '400px'
                        }}
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
                {!expandedEmbeds['teacher-resource'] && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleEmbed('teacher-resource')}
                    className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm flex items-center gap-2"
                  >
                    <Expand className="h-4 w-4" />
                    Expand
                  </Button>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Comprehensive teacher lesson plan with learning objectives, activities, and assessment guidance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
