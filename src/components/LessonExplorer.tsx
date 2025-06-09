import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Maximize2, Minimize2 } from 'lucide-react';

export const LessonExplorer = () => {
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleLesson = (lessonNumber: number) => {
    setExpandedLesson(expandedLesson === lessonNumber ? null : lessonNumber);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const lessonEmbeds = {
    1: "https://online.fliphtml5.com/tudtv/czxk/",
    2: "https://online.fliphtml5.com/tudtv/dwnc/",
    3: "https://online.fliphtml5.com/tudtv/sezx/",
    4: "https://online.fliphtml5.com/tudtv/pohv/",
    5: "https://online.fliphtml5.com/tudtv/ddqj/",
    6: "https://online.fliphtml5.com/tudtv/pkvl/",
    7: "https://online.fliphtml5.com/tudtv/kllg/",
    8: "https://online.fliphtml5.com/tudtv/keoe/",
    9: "https://online.fliphtml5.com/tudtv/ybme/",
    10: "https://online.fliphtml5.com/tudtv/vuvp/",
    11: "https://online.fliphtml5.com/tudtv/oxuf/",
    12: "https://online.fliphtml5.com/tudtv/mpxn/",
    13: "https://online.fliphtml5.com/tudtv/zbzr/",
    14: "https://online.fliphtml5.com/tudtv/fgdz/",
    15: "https://online.fliphtml5.com/tudtv/ybss/",
    16: "https://online.fliphtml5.com/tudtv/dhss/",
    17: "https://online.fliphtml5.com/tudtv/zvol/",
    18: "https://online.fliphtml5.com/tudtv/vtxx/",
    19: "https://online.fliphtml5.com/tudtv/psoj/",
    20: "https://online.fliphtml5.com/tudtv/atju/",
    21: "https://online.fliphtml5.com/tudtv/kuaq/",
    22: "https://online.fliphtml5.com/tudtv/cjfr/",
    23: "https://online.fliphtml5.com/tudtv/cjjh/",
    24: "https://online.fliphtml5.com/tudtv/gqvv/",
    25: "https://online.fliphtml5.com/tudtv/tndt/",
    26: "https://online.fliphtml5.com/tudtv/untg/",
    27: "https://online.fliphtml5.com/tudtv/lvid/",
    28: "https://online.fliphtml5.com/tudtv/yyrz/",
    29: "https://online.fliphtml5.com/tudtv/bfyo/",
    30: "https://online.fliphtml5.com/tudtv/uyxd/",
    31: "https://online.fliphtml5.com/tudtv/gfch/",
    32: "https://online.fliphtml5.com/tudtv/hxxp/",
    33: "https://online.fliphtml5.com/tudtv/qekk/",
    34: "https://online.fliphtml5.com/tudtv/mmhv/",
    35: "https://online.fliphtml5.com/tudtv/ntwa/",
    36: "https://online.fliphtml5.com/tudtv/xplo/",
    37: "https://online.fliphtml5.com/tudtv/yjsn/",
    38: "https://online.fliphtml5.com/tudtv/qkfm/",
    39: "https://online.fliphtml5.com/tudtv/bmke/",
    40: "https://online.fliphtml5.com/tudtv/jazz/",
    41: "https://online.fliphtml5.com/tudtv/fwzc/",
    42: "https://online.fliphtml5.com/tudtv/gqju/"
  };

  const lessons = [
    { number: 1, title: "Setting The Scene", topic: "Introduction to Financial Literacy" },
    { number: 2, title: "Earning Money", topic: "Employment & Income" },
    { number: 3, title: "Banking Basics", topic: "Understanding Banking" },
    { number: 4, title: "Spending Wisely", topic: "Smart Consumer Habits" },
    { number: 5, title: "Budgeting Basics", topic: "Personal Budget Creation" },
    { number: 6, title: "Saving Strategies", topic: "Building Emergency Funds" },
    { number: 7, title: "Goal Setting", topic: "Financial Planning" },
    { number: 8, title: "Interest Rates", topic: "Understanding Interest" },
    { number: 9, title: "Credit & Debt", topic: "Responsible Borrowing" },
    { number: 10, title: "Credit Cards", topic: "Managing Credit" },
    { number: 11, title: "Loans & Mortgages", topic: "Major Financial Commitments" },
    { number: 12, title: "Insurance Basics", topic: "Risk Management" },
    { number: 13, title: "Tax Fundamentals", topic: "Understanding Taxation" },
    { number: 14, title: "Superannuation", topic: "Retirement Planning" },
    { number: 15, title: "Investment Basics", topic: "Building Wealth" },
    { number: 16, title: "Shares & Bonds", topic: "Investment Vehicles" },
    { number: 17, title: "Property Investment", topic: "Real Estate Basics" },
    { number: 18, title: "Risk vs Return", topic: "Investment Strategy" },
    { number: 19, title: "Scams & Fraud", topic: "Financial Safety" },
    { number: 20, title: "Identity Protection", topic: "Personal Security" },
    { number: 21, title: "Online Safety", topic: "Digital Financial Security" },
    { number: 22, title: "Financial Apps", topic: "Digital Money Management" },
    { number: 23, title: "Cryptocurrency", topic: "Digital Currency Basics" },
    { number: 24, title: "Entrepreneurship", topic: "Starting a Business" },
    { number: 25, title: "Business Planning", topic: "Enterprise Skills" },
    { number: 26, title: "Marketing Basics", topic: "Promoting Your Business" },
    { number: 27, title: "Financial Records", topic: "Business Accounting" },
    { number: 28, title: "Global Economics", topic: "Economic Systems" },
    { number: 29, title: "Currency Exchange", topic: "International Finance" },
    { number: 30, title: "Economic Indicators", topic: "Understanding Markets" },
    { number: 31, title: "Financial Stress", topic: "Mental Health & Money" },
    { number: 32, title: "Money Relationships", topic: "Financial Communication" },
    { number: 33, title: "Life Transitions", topic: "Financial Milestones" },
    { number: 34, title: "Career Planning", topic: "Professional Development" },
    { number: 35, title: "Salary Negotiation", topic: "Maximizing Income" },
    { number: 36, title: "Side Hustles", topic: "Additional Income Streams" },
    { number: 37, title: "Travel & Money", topic: "Financial Planning for Travel" },
    { number: 38, title: "Education Costs", topic: "Funding Your Future" },
    { number: 39, title: "Housing Decisions", topic: "Rent vs Buy" },
    { number: 40, title: "Family Finances", topic: "Managing Household Money" },
    { number: 41, title: "Giving Back", topic: "Charitable Giving" },
    { number: 42, title: "Your Financial Future", topic: "Long-term Wealth Building" }
  ];

  const programSections = [
    {
      id: 'setting-scene',
      title: 'Setting The Scene',
      icon: '/Setting The Scene Icon.png',
      lessons: lessons.slice(0, 1),
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'spending',
      title: 'Spending',
      icon: '/Spending Icon.png',
      lessons: lessons.slice(1, 7),
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'debt',
      title: 'Debt',
      icon: '/Debt Icon.png',
      lessons: lessons.slice(7, 12),
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'tax',
      title: 'Tax',
      icon: '/Tax Icon.png',
      lessons: lessons.slice(12, 14),
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'super',
      title: 'Super',
      icon: '/Super Icon.png',
      lessons: lessons.slice(13, 15),
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'investing',
      title: 'Investing',
      icon: '/Investing Icon.png',
      lessons: lessons.slice(14, 19),
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'safety',
      title: 'Safety',
      icon: '/Safety Icon.png',
      lessons: lessons.slice(18, 24),
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'employment',
      title: 'Employment',
      icon: '/Employment Icon.png',
      lessons: lessons.slice(23, 28),
      color: 'from-teal-500 to-teal-600'
    },
    {
      id: 'systems',
      title: 'Systems',
      icon: '/Systems Icon.png',
      lessons: lessons.slice(27, 31),
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'real-world',
      title: 'Real World',
      icon: '/Real World Icon.png',
      lessons: lessons.slice(30, 42),
      color: 'from-gray-500 to-gray-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* How Do Micro-Credentials Work Section */}
      <Card className="mb-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">How Do Micro-Credentials Work?</h2>
          <p className="text-blue-700 text-lg">Understanding the digital certification system</p>
        </div>
        
        <div className="mb-6">
          <Button
            onClick={() => toggleSection('micro-credentials')}
            className="w-full flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg"
          >
            <span className="text-lg font-semibold">View Program Overview Slideshow</span>
            {expandedSection === 'micro-credentials' ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
        </div>

        {expandedSection === 'micro-credentials' && (
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <iframe 
              src="/How Does The Mandy Money High School Program Work_compressed.pdf" 
              width="100%" 
              height="600px"
              className="border-0 rounded-lg"
              title="How Does The Mandy Money High School Program Work"
            />
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                <a 
                  href="/How Does The Mandy Money High School Program Work_compressed.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  How Does The Mandy Money High School Program Work?
                </a> by Mandy Money
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Program Materials Preview */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#fe5510] via-[#fea700] to-[#fe8303] bg-clip-text text-transparent">
          Program Materials Preview
        </h2>
        <p className="text-xl text-gray-600">Explore the comprehensive 42-lesson curriculum</p>
      </div>

      {/* Program Sections */}
      <div className="grid gap-8 mb-12">
        {programSections.map((section) => (
          <Card key={section.id} className="overflow-hidden shadow-lg">
            <div className={`bg-gradient-to-r ${section.color} text-white p-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={section.icon} alt={section.title} className="w-12 h-12" />
                  <div>
                    <h3 className="text-2xl font-bold">{section.title}</h3>
                    <p className="text-white/90">{section.lessons.length} lessons</p>
                  </div>
                </div>
                <Button
                  onClick={() => toggleSection(section.id)}
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  {expandedSection === section.id ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Hide Lessons
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      View Lessons
                    </>
                  )}
                </Button>
              </div>
            </div>

            {expandedSection === section.id && (
              <div className="p-6 bg-gray-50">
                <div className="grid gap-4">
                  {section.lessons.map((lesson) => (
                    <Card key={lesson.number} className="overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">
                              Lesson {lesson.number}: {lesson.title}
                            </h4>
                            <p className="text-gray-600">{lesson.topic}</p>
                          </div>
                          <Button
                            onClick={() => toggleLesson(lesson.number)}
                            variant="outline"
                            size="sm"
                          >
                            {expandedLesson === lesson.number ? (
                              <>
                                <Minimize2 className="h-4 w-4 mr-2" />
                                Minimize
                              </>
                            ) : (
                              <>
                                <Maximize2 className="h-4 w-4 mr-2" />
                                Expand
                              </>
                            )}
                          </Button>
                        </div>

                        {expandedLesson === lesson.number && (
                          <div className="mt-4 bg-white rounded-lg p-4 shadow-inner">
                            <iframe
                              src={lessonEmbeds[lesson.number as keyof typeof lessonEmbeds]}
                              width="100%"
                              height="500px"
                              className="border-0 rounded-lg"
                              title={`Lesson ${lesson.number}: ${lesson.title}`}
                            />
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
