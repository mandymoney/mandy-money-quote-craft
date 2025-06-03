
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronRight, Search, Book, Play, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LessonData {
  microCredential: string;
  topic: string;
  lesson: number;
  title: string;
  chapters: string[];
  icon?: string;
}

const allLessons: LessonData[] = [
  {
    microCredential: 'Level 1',
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
    microCredential: 'Level 1',
    topic: 'Budgeting',
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
    ]
  },
  {
    microCredential: 'Level 1',
    topic: 'Spending',
    lesson: 3,
    title: 'Expenses Deep Dive',
    chapters: [
      'What Expenses Will I Have At Different Life Stages?',
      'How Do I Predict & Plan My Expenses?',
      'Do I Need It Or Want It? Should I Buy It?',
      'How Do I Track My Spending?'
    ]
  },
  {
    microCredential: 'Level 1',
    topic: 'Spending',
    lesson: 4,
    title: 'Smart Spending',
    chapters: [
      'How do I Interpret shopping prices?',
      'How Do I Make Purchase Decisions?',
      'How Do I Shop Online Responsibly?',
      'How Do I Reduce Spending?'
    ]
  },
  {
    microCredential: 'Level 1',
    topic: 'Super',
    lesson: 5,
    title: 'Introduction to Super',
    chapters: [
      'How Does Australia\'s Superannuation System Work?',
      'What Is The Super Guarantee?',
      'How Does The Super Guarantee Maths Work?',
      'What Are The Pros & Cons Of Super In Australia?'
    ]
  },
  {
    microCredential: 'Level 1',
    topic: 'Super',
    lesson: 6,
    title: 'Super Fund Basics',
    chapters: [
      'What Actually Is a Super Fund?',
      'How Does Super Fund Investment Work?',
      'How Do Super Returns & Fees Impact My Super?',
      'How Do I Calculate Net Returns?'
    ]
  },
  {
    microCredential: 'Level 1',
    topic: 'Super',
    lesson: 7,
    title: 'Choosing Your Super Fund',
    chapters: [
      'How Do I Research For a Super Fund?',
      'How Do I Compare Super Funds?',
      'How Do I Apply For a New Super Fund?',
      'How Do I Pick My Super Fund Investment Options?'
    ]
  },
  {
    microCredential: 'Level 1',
    topic: 'Tax',
    lesson: 8,
    title: 'Intro to Tax',
    chapters: [
      'What Actually Is Tax?',
      'How Does Tax Work?',
      'How Is Tax Used In Economics?',
      'What Are Your Thoughts On Tax?'
    ]
  },
  {
    microCredential: 'Level 1',
    topic: 'Tax',
    lesson: 9,
    title: 'Income Tax Basics',
    chapters: [
      'What Is Income Tax?',
      'How Does Tax Impact My Job?',
      'How Does The Progressive Tax System Work?',
      'What Documents Do I Need To Sort My Tax?'
    ]
  },
  {
    microCredential: 'Level 1',
    topic: 'Tax',
    lesson: 10,
    title: 'Tax Returns',
    chapters: [
      'How Do Tax Returns Work?',
      'How Can I Lower My Tax Bill Through Deductions?',
      'What\'s The Difference Between a Tax Bill & Return?',
      'How Do You Actually Submit a Tax Return?'
    ]
  },
  {
    microCredential: 'Level 2',
    topic: 'Budgeting',
    lesson: 11,
    title: 'Intermediate Budgeting',
    chapters: [
      'If I Earn Enough, Surely I Don\'t Need To Budget?',
      'How Do I Build a Monthly Budget?',
      'How Do I Use Excel To Budget Plan?',
      'How Do I Build a Long Term Budget?',
      'How Do I Budget When Things Don\'t Go To Plan?',
      'How Do I Interpret Banking Data?',
      'How Do I Review My Budget?'
    ]
  },
  {
    microCredential: 'Level 2',
    topic: 'Saving',
    lesson: 12,
    title: 'Planning Your Future',
    chapters: [
      'Why Is It Worth Taking The Time To Set Goals?',
      'How Do I Make My Goals Meaningful?',
      'How Do I Figure Out My North Star, My Purpose?',
      'Why Should I Practice Delayed Gratification?'
    ]
  },
  {
    microCredential: 'Level 2',
    topic: 'Saving',
    lesson: 13,
    title: 'Setting Savings Goals',
    chapters: [
      'Why Does Saving Even Matter?',
      'How Do I Set SMART Money Goals?',
      'How Do I Build Savings Into My Budget?',
      'How Do I Become Better At Saving?'
    ]
  },
  {
    microCredential: 'Level 2',
    topic: 'Employment',
    lesson: 14,
    title: 'Career & Education Choices',
    chapters: [
      'What Career Options Are Available To Me?',
      'What Job Or Career Should I Choose?',
      'How Do Study Loans Work?',
      'What Skills Will I Need For The Future Of Work?'
    ]
  },
  {
    microCredential: 'Level 2',
    topic: 'Employment',
    lesson: 15,
    title: 'Prepping For Job Applications',
    chapters: [
      'What Is The Process Of Getting a Job?',
      'How Do I Put Together an A-Class Resume?',
      'How Do I Write an A-Class Cover Letter?'
    ]
  },
  {
    microCredential: 'Level 2',
    topic: 'Employment',
    lesson: 16,
    title: 'Interview Skills',
    chapters: [
      'How Do I Ace My Job Interview?',
      'How Do I Communicate Who I Am In 30 Seconds?',
      'How Do I Prep For Job Interview Questions?'
    ]
  },
  {
    microCredential: 'Level 2',
    topic: 'Employment',
    lesson: 17,
    title: 'Starting Your Job',
    chapters: [
      'What Do I Need To Look For Before Signing My Job Contract?',
      'How Is My Pay Check Impacted by Tax & Super?',
      'What Admin Obligations Do I Have When Starting a New Job?',
      'How Do I Interpret My PaySlip?'
    ]
  },
  {
    microCredential: 'Level 2',
    topic: 'Real World',
    lesson: 18,
    title: 'Buying & Owning a Car',
    chapters: [
      'How Do I Buy A Car?',
      'What Costs Does Owning & Insuring a Car Involve?',
      'What Is The True Cost Of Car Ownership?'
    ]
  },
  {
    microCredential: 'Level 2',
    topic: 'Real World',
    lesson: 19,
    title: 'Tech & Phone Plans',
    chapters: [
      'How Do I Buy Tech?',
      'How Do I Choose A Phone Plan?'
    ]
  },
  {
    microCredential: 'Level 2',
    topic: 'Real World',
    lesson: 20,
    title: 'Travel Money',
    chapters: [
      'How Much Does It Cost To Travel?',
      'How Do I Set-Up a Holiday Budget?',
      'How Do Exchange Rates Impact My Travels?',
      'How Do I Travel Smart?'
    ]
  },
  {
    microCredential: 'Level 2',
    topic: 'Real World',
    lesson: 21,
    title: 'Moving Out',
    chapters: [
      'How Much Does It Cost To Move Out Of Home?',
      'Should I Buy My Home Or Rent?',
      'How Do I Move Out Of Home?',
      'How Do I Pay & Split Bills With Housemates?'
    ]
  },
  {
    microCredential: 'Level 3',
    topic: 'Budgeting',
    lesson: 22,
    title: 'Advanced Budgeting',
    chapters: [
      'Why Does Budgeting Become Important Once I Leave School?',
      'What Are Fixed & Variable Expenses?',
      'How Do I Build Fixed & Variable Expenses Into My Budget?',
      'How Do I Level Up My Ecosystem?',
      'How Do I Build a Year-Long Budget?',
      'How Do I Use My Budget In Real Life?',
      'Can I See A Budget In Action?'
    ]
  },
  {
    microCredential: 'Level 3',
    topic: 'Systems',
    lesson: 23,
    title: 'Introduction To Interest',
    chapters: [
      'What Actually Is Interest?',
      'How Does A Bank Work?',
      'How Do Interest Rates Impact Inflation?',
      'How Are Interest Rates Decided?'
    ]
  },
  {
    microCredential: 'Level 3',
    topic: 'Systems',
    lesson: 24,
    title: 'Compound Interest',
    chapters: [
      'What\'s The Difference Between Compound & Simple Interest?',
      'Calculating Compound Interest?',
      'How Is Interest Both "Good" and "Bad"?',
      'How Do I Choose Whether To Invest Or Pay Off Debt?'
    ]
  },
  {
    microCredential: 'Level 3',
    topic: 'Systems',
    lesson: 25,
    title: 'Financial Products',
    chapters: [
      'What Are Financial Products?',
      'What Financial Products Help Me Grow My Money?',
      'What Financial Products Help Me Borrow Money?',
      'What\'s a Neutral Product That Lets Me Store Money?'
    ]
  },
  {
    microCredential: 'Level 3',
    topic: 'Systems',
    lesson: 26,
    title: 'Banking & Products',
    chapters: [
      'Why Are Banks Useful & Which One Do I Choose?',
      'How Do Bank Accounts Work?',
      'Which Products Do I Choose For My Ecosystem?'
    ]
  },
  {
    microCredential: 'Level 3',
    topic: 'Systems',
    lesson: 27,
    title: 'Money In An Equal Society',
    chapters: [
      'How Does Money Contribute To An Unequal World?',
      'How Does Economic Policy Play A Role In Creating Equity?',
      'Why Can\'t We Fix Social Inequalities Overnight?',
      'How Do We Solve Social Inequalities Using The IEEJ Scale?'
    ]
  },
  {
    microCredential: 'Level 3',
    topic: 'Safety',
    lesson: 28,
    title: 'Peaceful Money Mind',
    chapters: [
      'How Does Money Impact My Mental Health?',
      'What Shapes My Money Mindset?',
      'What Does A Healthy Money Mindset Look Like?',
      'How Do I Build A Healthy Relationship With Money?'
    ]
  },
  {
    microCredential: 'Level 3',
    topic: 'Safety',
    lesson: 29,
    title: 'Insurance & Health Care',
    chapters: [
      'What Is Insurance?',
      'How Do I Pay For Health Services?',
      'What Is Private Health Insurance?'
    ]
  },
  {
    microCredential: 'Level 3',
    topic: 'Safety',
    lesson: 30,
    title: 'Staying Safe',
    chapters: [
      'What Rights Do I Have As a Consumer?',
      'How Do I Spot & Deal With Scams?',
      'What Can I Do To Avoid Scams?',
      'Are The Gambling Odds Ever In My Favour?'
    ]
  },
  {
    microCredential: 'Level 3',
    topic: 'Safety',
    lesson: 31,
    title: 'Getting Organised & Supported',
    chapters: [
      'How Do I Organise My Money & Admin Life?',
      'How Do I Use MyGov & MyID?',
      'Where Do I Go & Who Do I Ask For Help With My Money?'
    ]
  },
  {
    microCredential: 'Level 4',
    topic: 'Wealth',
    lesson: 32,
    title: 'Building Wealth',
    chapters: [
      'What Actually Is Wealth?',
      'How Does Wealth Building Work?',
      'How Do My Choices Impact My Long Term Financial Freedom?'
    ]
  },
  {
    microCredential: 'Level 4',
    topic: 'Wealth',
    lesson: 33,
    title: 'Generating Income',
    chapters: [
      'Is Being Employed The Only Way To Make Money?',
      'How Can I Make Extra Money?',
      'How Do I Build An Entrepreneurial Mindset?'
    ]
  },
  {
    microCredential: 'Level 4',
    topic: 'Debt',
    lesson: 34,
    title: 'Intro to Debt',
    chapters: [
      'What Actually Is Debt?',
      'When Do I Use Debt? When Do I Not?',
      'What Are Principal, Interest, Fees?',
      'What Is A Credit Score And Why Does It Matter?'
    ]
  },
  {
    microCredential: 'Level 4',
    topic: 'Debt',
    lesson: 35,
    title: 'Key Debt Products',
    chapters: [
      'How Do Bank Loans Work?',
      'How Do Credit Cards Work?',
      'How Does Buy Now Pay Later Work?',
      'How Do Pay Day Loans Work?'
    ]
  },
  {
    microCredential: 'Level 4',
    topic: 'Debt',
    lesson: 36,
    title: 'Being a Smart Borrower',
    chapters: [
      'How Do I Choose The Right Debt?',
      'How Do I Get The Best Deal For A Loan?',
      'How Can I Be Smart With Debt?',
      'How Do I Recover From Debt?'
    ]
  },
  {
    microCredential: 'Level 4',
    topic: 'Investing',
    lesson: 37,
    title: 'Investing Basics',
    chapters: [
      'What Actually Is Investing?',
      'Why Is Investing Worth My Time?',
      'How Do Key Investing Concepts & Terms Fit Together?',
      'What Does Investing Look Like At Different Life Stages?'
    ]
  },
  {
    microCredential: 'Level 4',
    topic: 'Investing',
    lesson: 38,
    title: 'Investing Performance',
    chapters: [
      'How Do I Measure an Investment\'s Performance?',
      'How Do I Make Sense Of Investing Numbers?',
      'How Do I Interpret Investing News?'
    ]
  },
  {
    microCredential: 'Level 4',
    topic: 'Investing',
    lesson: 39,
    title: 'Risk, Return & Diversity',
    chapters: [
      'How Risky Is My Investment?',
      'What About Crypto Currency?',
      'What Is a Diverse Investment Portfolio?',
      'What Is an Investment Fund?',
      'How Do I Invest Into a Fund?'
    ]
  },
  {
    microCredential: 'Level 4',
    topic: 'Investing',
    lesson: 40,
    title: 'Intro to Shares',
    chapters: [
      'What Are Shares?',
      'What Is The Share Market?',
      'How Can Shares Earn Me Money?',
      'How Do Shares Change Value?'
    ]
  },
  {
    microCredential: 'Level 4',
    topic: 'Investing',
    lesson: 41,
    title: 'Choosing & Buying Shares',
    chapters: [
      'How Do I Choose Shares To Buy?',
      'How Do I Invest Ethically?',
      'When Do I Buy & Sell Shares?'
    ]
  },
  {
    microCredential: 'Level 4',
    topic: 'Investing',
    lesson: 42,
    title: 'Property Investment',
    chapters: [
      'What Is The Property Market?',
      'How Do I Buy a Property?',
      'How Do Investment Properties Work?',
      'How Do I Choose An Investment Property?'
    ]
  }
];

export const LessonExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMicroCredential, setSelectedMicroCredential] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [lessonIcons, setLessonIcons] = useState<{ [key: number]: string }>({});

  const microCredentials = Array.from(new Set(allLessons.map(l => l.microCredential)));
  const topics = Array.from(new Set(allLessons.map(l => l.topic)));

  const filteredLessons = allLessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.chapters.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesMicroCredential = selectedMicroCredential === 'all' || lesson.microCredential === selectedMicroCredential;
    const matchesTopic = selectedTopic === 'all' || lesson.topic === selectedTopic;
    
    return matchesSearch && matchesMicroCredential && matchesTopic;
  });

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

  return (
    <div className="space-y-8">
      {/* Video Embeds Section */}
      <Card className="p-6 bg-white border border-teal-200">
        <h2 className="text-2xl font-semibold text-teal-800 mb-6">Program Materials Preview</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-teal-700">Teacher Pass & Textbook</h3>
            <div className="aspect-video bg-teal-50 rounded-lg flex items-center justify-center border-2 border-dashed border-teal-300">
              <div className="text-center">
                <Play className="h-8 w-8 text-teal-400 mx-auto mb-2" />
                <p className="text-teal-600 font-medium">Teacher Pass Video</p>
                <p className="text-sm text-teal-500">Embed teacher preview video here</p>
              </div>
            </div>
            <Button variant="outline" className="w-full border-teal-200 text-teal-600 hover:bg-teal-50">
              More Teacher Info ↓
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-teal-700">Student Pass & Textbook</h3>
            <div className="aspect-video bg-teal-50 rounded-lg flex items-center justify-center border-2 border-dashed border-teal-300">
              <div className="text-center">
                <Play className="h-8 w-8 text-teal-400 mx-auto mb-2" />
                <p className="text-teal-600 font-medium">Student Pass Video</p>
                <p className="text-sm text-teal-500">Embed student preview video here</p>
              </div>
            </div>
            <Button variant="outline" className="w-full border-teal-200 text-teal-600 hover:bg-teal-50">
              More Student Info ↓
            </Button>
          </div>
        </div>

        {/* Your Four Micro-Credentials */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-teal-700 mb-4">Your Four Micro-Credentials</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((level) => (
              <div key={level} className="cursor-pointer group">
                <div className="aspect-square bg-teal-50 rounded-lg flex items-center justify-center border-2 border-dashed border-teal-300 hover:border-teal-400 transition-colors">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-teal-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                      <span className="text-teal-700 font-bold">L{level}</span>
                    </div>
                    <p className="text-sm text-teal-600">Level {level}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How Do Micro-Credentials Work */}
        <div className="border-t border-teal-200 pt-6">
          <h3 className="text-lg font-semibold text-teal-700 mb-4">How Do Micro-Credentials Work</h3>
          <div className="aspect-video bg-teal-50 rounded-lg flex items-center justify-center border-2 border-dashed border-teal-300">
            <div className="text-center">
              <Book className="h-12 w-12 text-teal-400 mx-auto mb-4" />
              <p className="text-teal-600 font-medium">Canva Public View Link</p>
              <p className="text-sm text-teal-500">How micro-credentials work content will appear here</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Lesson Explorer */}
      <Card className="p-6 bg-white border border-teal-200">
        <div className="flex items-center space-x-2 mb-6">
          <h2 className="text-2xl font-semibold text-teal-800">
            Explore All 42 Financial Literacy Lessons
          </h2>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-400" />
            <Input
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-teal-200 focus:border-teal-500"
            />
          </div>
          
          <Select value={selectedMicroCredential} onValueChange={setSelectedMicroCredential}>
            <SelectTrigger className="border-teal-200">
              <SelectValue placeholder="Micro-Credential" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Micro-Credentials</SelectItem>
              {microCredentials.map(mc => (
                <SelectItem key={mc} value={mc}>{mc}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="border-teal-200">
              <SelectValue placeholder="Topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Topics</SelectItem>
              {topics.map(topic => (
                <SelectItem key={topic} value={topic}>{topic}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Badge variant="outline" className="flex items-center justify-center border-teal-200 text-teal-600">
            {filteredLessons.length} lessons found
          </Badge>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          {filteredLessons.map((lesson) => (
            <Card key={lesson.lesson} className="border border-teal-200">
              <div 
                className="p-4 cursor-pointer hover:bg-teal-50 transition-colors"
                onClick={() => setExpandedLesson(expandedLesson === lesson.lesson ? null : lesson.lesson)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                      {lessonIcons[lesson.lesson] ? (
                        <img 
                          src={lessonIcons[lesson.lesson]} 
                          alt={`Lesson ${lesson.lesson} icon`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center relative">
                          <Upload className="h-4 w-4 mx-auto mb-1 text-gray-400" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleIconUpload(lesson.lesson, e)}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                          <p className="text-xs text-gray-500">Icon</p>
                        </div>
                      )}
                    </div>
                    <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {lesson.lesson}
                    </div>
                    <div>
                      <h3 className="font-semibold text-teal-900">{lesson.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs border-teal-200 text-teal-600">{lesson.topic}</Badge>
                        <Badge className="bg-teal-100 text-teal-800 text-xs">
                          {lesson.microCredential}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {expandedLesson === lesson.lesson ? 
                    <ChevronDown className="h-5 w-5 text-teal-400" /> : 
                    <ChevronRight className="h-5 w-5 text-teal-400" />
                  }
                </div>
              </div>

              {expandedLesson === lesson.lesson && (
                <div className="border-t bg-teal-50 p-4">
                  <h4 className="font-semibold text-teal-700 mb-3">Learning Chapters:</h4>
                  <div className="space-y-2">
                    {lesson.chapters.map((chapter, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-teal-700 text-sm">{chapter}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-teal-200">
                    <p className="text-sm text-teal-600 mb-2">FlipHTML5 embed section for this lesson:</p>
                    <div className="bg-white border border-teal-200 rounded p-3 text-center">
                      <p className="text-teal-500 text-sm">FlipHTML5 embed section for Lesson {lesson.lesson}</p>
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
