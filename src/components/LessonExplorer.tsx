
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronRight, Search, Book, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonData {
  assessment: string;
  topic: string;
  lesson: number;
  title: string;
  chapters: string[];
  microCredential?: string;
}

const lessonData: LessonData[] = [
  {
    assessment: 'Starting Lesson + Assessment',
    topic: 'Setting the Scene',
    lesson: 1,
    title: 'Introduction to Financial Literacy',
    chapters: [
      'The Big Question... What Actually Is Money?',
      'What Does It Mean To "Learn About Money"?',
      'Why Is Learning About Money Important?'
    ]
  },
  {
    assessment: 'Level 1 MC',
    topic: 'Budgeting Level 1',
    lesson: 2,
    title: 'Basic Budgeting',
    chapters: [
      'What Actually Is Budgeting?',
      'Why Am I Budgeting At School?',
      'How Do I Structure a Budget Plan?',
      'What Is My Personal Financial Ecosystem?',
      'What Budgeting Maths Do I Need?',
      'How Do I Build A Weekly Budget?',
      'How Do I Use My Weekly Budget In My Real Life?'
    ],
    microCredential: 'Budgeting Level 1'
  },
  {
    assessment: 'Level 1 MC',
    topic: 'Spending',
    lesson: 3,
    title: 'Expenses Deep Dive',
    chapters: [
      'What Expenses Will I Have At Different Life Stages?',
      'How Do I Predict & Plan My Expenses?',
      'Do I Need It Or Want It? Should I Buy It?',
      'How Do I Track My Spending?'
    ],
    microCredential: 'Spending'
  },
  // ... continuing with all lessons
  {
    assessment: 'Level 4 MC',
    topic: 'Investing',
    lesson: 42,
    title: 'Property Investment',
    chapters: [
      'What Is The Property Market?',
      'How Do I Buy a Property?',
      'How Do Investment Properties Work?',
      'How Do I Choose An Investment Property?'
    ],
    microCredential: 'Investing'
  }
];

// Add all the lesson data from your provided structure
const allLessons: LessonData[] = [
  {
    assessment: 'Starting Lesson + Assessment',
    topic: 'Setting the Scene',
    lesson: 1,
    title: 'Introduction to Financial Literacy',
    chapters: [
      'The Big Question... What Actually Is Money?',
      'What Does It Mean To "Learn About Money"?',
      'Why Is Learning About Money Important?'
    ]
  },
  {
    assessment: 'Level 1 MC',
    topic: 'Budgeting Level 1',
    lesson: 2,
    title: 'Basic Budgeting',
    microCredential: 'Budgeting Level 1',
    chapters: [
      'What Actually Is Budgeting?',
      'Why Am I Budgeting At School?',
      'How Do I Structure a Budget Plan?',
      'What Is My Personal Financial Ecosystem?',
      'What Budgeting Maths Do I Need?',
      'How Do I Build A Weekly Budget?',
      'How Do I Use My Weekly Budget In My Real Life?'
    ]
  },
  {
    assessment: 'Level 1 MC',
    topic: 'Spending',
    lesson: 3,
    title: 'Expenses Deep Dive',
    microCredential: 'Spending',
    chapters: [
      'What Expenses Will I Have At Different Life Stages?',
      'How Do I Predict & Plan My Expenses?',
      'Do I Need It Or Want It? Should I Buy It?',
      'How Do I Track My Spending?'
    ]
  },
  {
    assessment: 'Level 1 MC',
    topic: 'Spending',
    lesson: 4,
    title: 'Smart Spending',
    microCredential: 'Spending',
    chapters: [
      'How do I Interpret shopping prices?',
      'How Do Make Purchase Decisions?',
      'How Do I Shop Online Responsibly?',
      'How Do I Reduce Spending?'
    ]
  },
  {
    assessment: 'Level 1 MC',
    topic: 'Super',
    lesson: 5,
    title: 'Introduction To Super',
    microCredential: 'Super',
    chapters: [
      'How Does Australia\'s Superannuation System Work?',
      'What Is The Super Guarantee?',
      'How Does The Super Guarantee Maths Work?',
      'What Are The Pros & Cons Of Super In Australia?'
    ]
  },
  // Continue with remaining lessons...
];

export const LessonExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMicroCredential, setSelectedMicroCredential] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [showVideoEmbed, setShowVideoEmbed] = useState(false);

  const microCredentials = Array.from(new Set(allLessons.map(l => l.microCredential).filter(Boolean)));
  const topics = Array.from(new Set(allLessons.map(l => l.topic)));

  const filteredLessons = allLessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.chapters.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMicroCredential = selectedMicroCredential === 'all' || lesson.microCredential === selectedMicroCredential;
    const matchesTopic = selectedTopic === 'all' || lesson.topic === selectedTopic;
    
    return matchesSearch && matchesMicroCredential && matchesTopic;
  });

  return (
    <div className="space-y-8">
      {/* Video Embeds Section */}
      <Card className="p-6 bg-white border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Program Materials Preview</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Teacher Pass & Textbook</h3>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Play className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Teacher Pass Video</p>
                <p className="text-sm text-gray-500">Embed teacher preview video here</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              More Teacher Info ↓
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Student Pass & Textbook</h3>
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Play className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Student Pass Video</p>
                <p className="text-sm text-gray-500">Embed student preview video here</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              More Student Info ↓
            </Button>
          </div>
        </div>

        {/* Textbook Preview */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Interactive Textbook Preview</h3>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">FlipHTML5 Textbook Embed</p>
              <p className="text-sm text-gray-500">Interactive textbook preview will appear here</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Lesson Explorer */}
      <Card className="p-6 bg-white border border-gray-200">
        <div className="flex items-center space-x-2 mb-6">
          <Book className="h-6 w-6 text-orange-600" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Explore All 42 Lessons
          </h2>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedMicroCredential} onValueChange={setSelectedMicroCredential}>
            <SelectTrigger>
              <SelectValue placeholder="Micro-Credential" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Micro-Credentials</SelectItem>
              {microCredentials.map(mc => (
                <SelectItem key={mc} value={mc!}>{mc}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger>
              <SelectValue placeholder="Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {topics.map(topic => (
                <SelectItem key={topic} value={topic}>{topic}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Badge variant="outline" className="flex items-center justify-center">
            {filteredLessons.length} lessons found
          </Badge>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          {filteredLessons.map((lesson) => (
            <Card key={lesson.lesson} className="border border-gray-200">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedLesson(expandedLesson === lesson.lesson ? null : lesson.lesson)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {lesson.lesson}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">{lesson.topic}</Badge>
                        {lesson.microCredential && (
                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                            {lesson.microCredential}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {expandedLesson === lesson.lesson ? 
                    <ChevronDown className="h-5 w-5 text-gray-400" /> : 
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  }
                </div>
              </div>

              {expandedLesson === lesson.lesson && (
                <div className="border-t bg-gray-50 p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Learning Chapters:</h4>
                  <div className="space-y-2">
                    {lesson.chapters.map((chapter, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700 text-sm">{chapter}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Textbook pages for this lesson:</p>
                    <div className="bg-white border border-gray-200 rounded p-3 text-center">
                      <p className="text-gray-500 text-sm">Textbook page embed placeholder</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};
