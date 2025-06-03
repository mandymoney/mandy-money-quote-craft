import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronDown, ChevronUp, Upload, ExternalLink, Play } from 'lucide-react';

interface VideoLinks {
  teacherPassVideo: string;
  studentPassVideo: string;
  microCredentialsVideo: string;
  lessonEmbeds: { [key: number]: string };
}

interface LessonExplorerProps {
  videoLinks?: VideoLinks;
  onVideoLinksChange?: (links: VideoLinks) => void;
}

const allLessons = [
  {
    number: 1,
    title: 'Introduction to Financial Literacy',
    topic: 'Budgeting',
    microCredential: 'Budgeting',
    duration: '45 min',
    description: 'Understand the basics of financial literacy and its importance.',
    outcomes: [
      'Define financial literacy',
      'Explain why financial literacy is important',
      'Identify key components of financial planning'
    ]
  },
  {
    number: 2,
    title: 'Creating a Budget',
    topic: 'Budgeting',
    microCredential: 'Budgeting',
    duration: '60 min',
    description: 'Learn how to create a budget and track your expenses.',
    outcomes: [
      'List income sources',
      'Categorize expenses',
      'Create a balanced budget'
    ]
  },
  {
    number: 3,
    title: 'Saving Strategies',
    topic: 'Budgeting',
    microCredential: 'Budgeting',
    duration: '45 min',
    description: 'Discover effective saving strategies to achieve your financial goals.',
    outcomes: [
      'Identify saving goals',
      'Explore different saving methods',
      'Set up a savings plan'
    ]
  },
  {
    number: 4,
    title: 'Understanding Banking Services',
    topic: 'Banking',
    microCredential: 'Banking & Payments',
    duration: '60 min',
    description: 'Explore the various banking services available and how to use them effectively.',
    outcomes: [
      'Describe different types of bank accounts',
      'Explain how to use online banking',
      'Understand bank fees and charges'
    ]
  },
  {
    number: 5,
    title: 'Making Payments',
    topic: 'Banking',
    microCredential: 'Banking & Payments',
    duration: '45 min',
    description: 'Learn about different payment methods and how to make secure transactions.',
    outcomes: [
      'Compare payment methods',
      'Explain how to use digital wallets',
      'Understand payment security measures'
    ]
  },
  {
    number: 6,
    title: 'Introduction to Credit',
    topic: 'Credit',
    microCredential: 'Credit & Debt',
    duration: '60 min',
    description: 'Understand what credit is and how it works.',
    outcomes: [
      'Define credit and its purpose',
      'Explain how credit scores are calculated',
      'Identify the benefits and risks of using credit'
    ]
  },
  {
    number: 7,
    title: 'Managing Debt',
    topic: 'Credit',
    microCredential: 'Credit & Debt',
    duration: '45 min',
    description: 'Learn strategies for managing debt and avoiding financial problems.',
    outcomes: [
      'Create a debt repayment plan',
      'Explore debt consolidation options',
      'Avoid debt traps'
    ]
  },
  {
    number: 8,
    title: 'Financial Planning Basics',
    topic: 'Planning',
    microCredential: 'Financial Planning',
    duration: '60 min',
    description: 'Get an overview of financial planning and its importance for your future.',
    outcomes: [
      'Define financial planning',
      'Explain the benefits of financial planning',
      'Identify key components of a financial plan'
    ]
  },
  {
    number: 9,
    title: 'Investing for the Future',
    topic: 'Planning',
    microCredential: 'Financial Planning',
    duration: '45 min',
    description: 'Learn about different investment options and how to start investing.',
    outcomes: [
      'Explore different investment options',
      'Understand investment risks and returns',
      'Create an investment plan'
    ]
  }
];

const allTopics = Array.from(new Set(allLessons.map(lesson => lesson.topic)));
const allMicroCredentials = Array.from(new Set(allLessons.map(lesson => lesson.microCredential)));

export const LessonExplorer: React.FC<LessonExplorerProps> = ({ 
  videoLinks = {
    teacherPassVideo: '',
    studentPassVideo: '',
    microCredentialsVideo: '',
    lessonEmbeds: {}
  },
  onVideoLinksChange 
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [lessonIcons, setLessonIcons] = useState<{ [key: number]: string }>({});
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const microCredentials = Array.from(new Set(allLessons.map(l => l.microCredential)));
  const topics = Array.from(new Set(allLessons.map(l => l.topic)));

  const filteredLessons = selectedTopic === 'all' 
    ? allLessons 
    : allLessons.filter(lesson => lesson.topic === selectedTopic);

  const handleIconUpload = (lessonNumber: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLessonIcons(prev => ({
          ...prev,
          [lessonNumber]: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateVideoLink = (key: string, value: string, lessonNumber?: number) => {
    if (!onVideoLinksChange) return;
    
    if (lessonNumber !== undefined) {
      onVideoLinksChange({
        ...videoLinks,
        lessonEmbeds: {
          ...videoLinks.lessonEmbeds,
          [lessonNumber]: value
        }
      });
    } else {
      onVideoLinksChange({
        ...videoLinks,
        [key]: value
      });
    }
  };

  const toggleExpansion = (lessonNumber: number) => {
    setExpandedLesson(expandedLesson === lessonNumber ? null : lessonNumber);
  };

  return (
    <div className="mt-16 space-y-8">
      {/* Edit Mode Toggle */}
      {onVideoLinksChange && (
        <div className="text-center">
          <Button
            onClick={() => setIsEditMode(!isEditMode)}
            variant={isEditMode ? "default" : "outline"}
            className="mb-4"
          >
            {isEditMode ? 'Exit Edit Mode' : 'Edit Video Links'}
          </Button>
        </div>
      )}

      {/* Teacher Pass Video Section */}
      <Card className="p-6 bg-gradient-to-r from-teal-50 to-teal-100 border-teal-200">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-teal-800 mb-4">Teacher Pass Video</h3>
          {isEditMode && onVideoLinksChange ? (
            <div className="mb-4">
              <Input
                placeholder="Enter teacher pass video URL or embed code"
                value={videoLinks.teacherPassVideo}
                onChange={(e) => updateVideoLink('teacherPassVideo', e.target.value)}
                className="max-w-md mx-auto"
              />
            </div>
          ) : (
            <>
              {videoLinks.teacherPassVideo ? (
                <div className="aspect-video max-w-2xl mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  {videoLinks.teacherPassVideo.includes('iframe') ? (
                    <div dangerouslySetInnerHTML={{ __html: videoLinks.teacherPassVideo }} />
                  ) : (
                    <div className="text-center">
                      <Play className="h-12 w-12 text-teal-600 mx-auto mb-2" />
                      <a href={videoLinks.teacherPassVideo} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800 flex items-center justify-center">
                        Watch Video <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video max-w-2xl mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Embed teacher preview video here</p>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Student Pass Video Section */}
      <Card className="p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-yellow-800 mb-4">Student Pass Video</h3>
          {isEditMode && onVideoLinksChange ? (
            <div className="mb-4">
              <Input
                placeholder="Enter student pass video URL or embed code"
                value={videoLinks.studentPassVideo}
                onChange={(e) => updateVideoLink('studentPassVideo', e.target.value)}
                className="max-w-md mx-auto"
              />
            </div>
          ) : (
            <>
              {videoLinks.studentPassVideo ? (
                <div className="aspect-video max-w-2xl mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  {videoLinks.studentPassVideo.includes('iframe') ? (
                    <div dangerouslySetInnerHTML={{ __html: videoLinks.studentPassVideo }} />
                  ) : (
                    <div className="text-center">
                      <Play className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
                      <a href={videoLinks.studentPassVideo} target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:text-yellow-800 flex items-center justify-center">
                        Watch Video <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video max-w-2xl mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Embed student preview video here</p>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Micro-Credentials Video Section */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-blue-800 mb-4">Canva Public View Link</h3>
          {isEditMode && onVideoLinksChange ? (
            <div className="mb-4">
              <Input
                placeholder="Enter Canva public view link or embed code"
                value={videoLinks.microCredentialsVideo}
                onChange={(e) => updateVideoLink('microCredentialsVideo', e.target.value)}
                className="max-w-md mx-auto"
              />
            </div>
          ) : (
            <>
              {videoLinks.microCredentialsVideo ? (
                <div className="aspect-video max-w-2xl mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  {videoLinks.microCredentialsVideo.includes('iframe') ? (
                    <div dangerouslySetInnerHTML={{ __html: videoLinks.microCredentialsVideo }} />
                  ) : (
                    <div className="text-center">
                      <ExternalLink className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                      <a href={videoLinks.microCredentialsVideo} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center justify-center">
                        View Canva Content <ExternalLink className="h-4 w-4 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video max-w-2xl mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">How micro-credentials work content will appear here</p>
                </div>
              )}
            </>
          )}
        </div>
      </Card>

      {/* Lessons Section */}
      <Card className="p-6">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">Program Lessons</h3>
          <p className="text-gray-600">Explore the complete curriculum structure</p>
        </div>

        {/* Filter Tabs */}
        <Tabs value={selectedTopic} onValueChange={setSelectedTopic} className="mb-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Topics</TabsTrigger>
            {topics.map(topic => (
              <TabsTrigger key={topic} value={topic} className="text-xs">
                {topic}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Micro-Credential Groups */}
        <div className="space-y-8">
          {microCredentials.map((credential, credIndex) => {
            const credentialLessons = filteredLessons.filter(l => l.microCredential === credential);
            if (credentialLessons.length === 0) return null;

            return (
              <div key={credential} className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${
                    credIndex === 0 ? 'bg-green-500' :
                    credIndex === 1 ? 'bg-blue-500' :
                    credIndex === 2 ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`}></div>
                  {credential}
                </h4>
                
                <div className="grid gap-4">
                  {credentialLessons.map((lesson) => (
                    <div key={lesson.number} className="border border-gray-100 rounded-lg">
                      <div 
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleExpansion(lesson.number)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                              {lessonIcons[lesson.number] ? (
                                <img 
                                  src={lessonIcons[lesson.number]} 
                                  alt={`Lesson ${lesson.number}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <>
                                  <span className="text-gray-600 font-semibold text-sm">{lesson.number}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleIconUpload(lesson.number, e)}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </>
                              )}
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-800">Lesson {lesson.number}: {lesson.title}</h5>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {lesson.topic}
                                </Badge>
                                <span className="text-xs text-gray-500">{lesson.duration}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {expandedLesson === lesson.number ? 
                              <ChevronUp className="h-5 w-5 text-gray-400" /> : 
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            }
                          </div>
                        </div>
                      </div>
                      
                      {expandedLesson === lesson.number && (
                        <div className="px-4 pb-4 border-t border-gray-100">
                          <div className="mt-4 space-y-4">
                            <div>
                              <h6 className="font-medium text-gray-700 mb-2">Lesson Overview</h6>
                              <p className="text-sm text-gray-600">{lesson.description}</p>
                            </div>
                            
                            <div>
                              <h6 className="font-medium text-gray-700 mb-2">Learning Outcomes</h6>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {lesson.outcomes.map((outcome, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="text-green-500 mr-2">•</span>
                                    {outcome}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* FlipHTML5 Embed Section */}
                            <div>
                              <h6 className="font-medium text-gray-700 mb-2">FlipHTML5 embed section for Lesson #{lesson.number}</h6>
                              {isEditMode && onVideoLinksChange ? (
                                <Input
                                  placeholder={`Enter FlipHTML5 embed code for Lesson ${lesson.number}`}
                                  value={videoLinks.lessonEmbeds[lesson.number] || ''}
                                  onChange={(e) => updateVideoLink('lessonEmbeds', e.target.value, lesson.number)}
                                  className="mb-2"
                                />
                              ) : (
                                <div className="bg-gray-100 rounded-lg p-4 min-h-32 flex items-center justify-center">
                                  {videoLinks.lessonEmbeds[lesson.number] ? (
                                    videoLinks.lessonEmbeds[lesson.number].includes('iframe') ? (
                                      <div dangerouslySetInnerHTML={{ __html: videoLinks.lessonEmbeds[lesson.number] }} />
                                    ) : (
                                      <a href={videoLinks.lessonEmbeds[lesson.number]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center">
                                        View Lesson Content <ExternalLink className="h-4 w-4 ml-1" />
                                      </a>
                                    )
                                  ) : (
                                    <p className="text-gray-500">FlipHTML5 embed section for Lesson #{lesson.number}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
