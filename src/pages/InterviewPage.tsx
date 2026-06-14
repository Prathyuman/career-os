import { useState } from 'react'
import PageLayout from '../components/PageLayout'
import ScrollReveal from '../components/ScrollReveal'
import {
  MessageSquare,
  Play,
  CheckCircle,
  Zap,
  Star,
  ChevronRight,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react'

const categories = [
  { name: 'Behavioral', count: 24, icon: MessageSquare },
  { name: 'Technical', count: 36, icon: Zap },
  { name: 'System Design', count: 18, icon: Star },
  { name: 'Coding', count: 42, icon: ChevronRight },
]

const questions = [
  {
    id: 1,
    category: 'Behavioral',
    question: 'Tell me about a time you had a conflict with a team member and how you resolved it.',
    tips: ['Use the STAR method', 'Focus on the resolution, not the conflict', 'Show empathy and growth'],
    difficulty: 'Medium',
  },
  {
    id: 2,
    category: 'Technical',
    question: 'Explain how React\'s Virtual DOM works and why it improves performance.',
    tips: ['Mention diffing algorithm', 'Compare with direct DOM manipulation', 'Discuss reconciliation'],
    difficulty: 'Medium',
  },
  {
    id: 3,
    category: 'System Design',
    question: 'Design a URL shortening service like bit.ly.',
    tips: ['Discuss database choice', 'Consider caching strategy', 'Talk about scalability'],
    difficulty: 'Hard',
  },
  {
    id: 4,
    category: 'Coding',
    question: 'Implement a function to reverse a linked list.',
    tips: ['Consider edge cases', 'Track previous/current/next nodes', 'Handle empty/single node lists'],
    difficulty: 'Easy',
  },
  {
    id: 5,
    category: 'Behavioral',
    question: 'Why do you want to leave your current role?',
    tips: ['Stay positive', 'Focus on growth opportunities', 'Never badmouth previous employer'],
    difficulty: 'Easy',
  },
  {
    id: 6,
    category: 'Technical',
    question: 'What are the differences between REST and GraphQL?',
    tips: ['Discuss over/under-fetching', 'Mention type system', 'Talk about flexibility vs standards'],
    difficulty: 'Medium',
  },
]

const mockSession = [
  { question: 'Tell me about yourself and your background.', type: 'intro' as const },
  { question: 'What is your greatest professional achievement?', type: 'behavioral' as const },
  { question: 'Design a caching system for a high-traffic application.', type: 'technical' as const },
  { question: 'How do you handle tight deadlines?', type: 'behavioral' as const },
  { question: 'Explain event delegation in JavaScript.', type: 'technical' as const },
]

export default function InterviewPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [mockMode, setMockMode] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  const filteredQuestions = activeCategory === 'All'
    ? questions
    : questions.filter((q) => q.category === activeCategory)

  const handleMockStart = () => {
    setMockMode(true)
    setCurrentQ(0)
    setShowAnswer(false)
  }

  const handleNext = () => {
    if (currentQ < mockSession.length - 1) {
      setCurrentQ(currentQ + 1)
      setShowAnswer(false)
    } else {
      setMockMode(false)
      setCurrentQ(0)
    }
  }

  return (
    <PageLayout title="Interview Coach">
      {mockMode ? (
        <ScrollReveal>
          <div className="bg-surface rounded-lg border border-border-subtle p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-text-muted text-xs">Question {currentQ + 1} of {mockSession.length}</span>
              <div className="h-1.5 w-32 bg-elevated rounded-full overflow-hidden">
                <div className="h-full bg-cyan rounded-full" style={{ width: `${((currentQ + 1) / mockSession.length) * 100}%` }} />
              </div>
            </div>

            <div className="mb-6">
              <span className={`text-xs px-2 py-0.5 rounded-md mb-3 inline-block ${
                mockSession[currentQ].type === 'intro' ? 'bg-cyan/10 text-cyan' :
                mockSession[currentQ].type === 'behavioral' ? 'bg-violet/10 text-violet' :
                'bg-coral/10 text-coral'
              }`}>
                {mockSession[currentQ].type}
              </span>
              <h3 className="font-display text-lg font-semibold text-text-primary">
                {mockSession[currentQ].question}
              </h3>
            </div>

            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                className="px-6 py-2.5 rounded-pill bg-cyan text-deep font-semibold text-sm hover:brightness-110 transition-all"
              >
                Show Sample Answer
              </button>
            ) : (
              <div className="bg-elevated rounded-md p-4 mb-4">
                <p className="text-text-secondary text-sm leading-relaxed">
                  [Sample answer would appear here based on the question type and content. This is a placeholder for the AI-generated response that would provide a structured, high-quality answer to help the user prepare.]
                </p>
              </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border-subtle">
              <button
                onClick={() => setMockMode(false)}
                className="text-text-muted text-sm hover:text-text-primary transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-4 h-4" />
                End Session
              </button>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-md bg-elevated flex items-center justify-center text-text-muted hover:text-coral transition-colors">
                  <ThumbsDown className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-md bg-elevated flex items-center justify-center text-text-muted hover:text-cyan transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-md bg-cyan text-deep text-xs font-semibold hover:brightness-110 transition-all flex items-center gap-1.5"
                >
                  {currentQ === mockSession.length - 1 ? 'Finish' : 'Next'}
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      ) : (
        <>
          {/* Mock Interview CTA */}
          <ScrollReveal>
            <div className="bg-surface rounded-lg border border-border-subtle p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-cyan/20 flex items-center justify-center">
                    <Play className="w-6 h-6 text-cyan" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-text-primary">Start Mock Interview</h3>
                    <p className="text-text-secondary text-sm">Practice with 5 AI-generated questions tailored to your profile.</p>
                  </div>
                </div>
                <button
                  onClick={handleMockStart}
                  className="px-6 py-2.5 rounded-pill bg-cyan text-deep font-semibold text-sm hover:brightness-110 transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Start Session
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* Categories */}
          <ScrollReveal className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveCategory('All')}
                className={`p-4 rounded-lg border transition-all text-left ${
                  activeCategory === 'All' ? 'border-cyan/30 bg-cyan/5' : 'border-border-subtle bg-surface hover:border-cyan/20'
                }`}
              >
                <MessageSquare className="w-5 h-5 text-cyan mb-2" />
                <div className="text-text-primary text-sm font-medium">All Questions</div>
                <div className="text-text-muted text-xs">{questions.length} total</div>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`p-4 rounded-lg border transition-all text-left ${
                    activeCategory === cat.name ? 'border-cyan/30 bg-cyan/5' : 'border-border-subtle bg-surface hover:border-cyan/20'
                  }`}
                >
                  <cat.icon className="w-5 h-5 text-cyan mb-2" />
                  <div className="text-text-primary text-sm font-medium">{cat.name}</div>
                  <div className="text-text-muted text-xs">{cat.count} questions</div>
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Questions */}
          <ScrollReveal stagger={0.06} className="space-y-3">
            {filteredQuestions.map((q) => (
              <div key={q.id} className="bg-surface rounded-lg border border-border-subtle p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-elevated text-text-muted px-2 py-0.5 rounded-md">{q.category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-md ${
                        q.difficulty === 'Easy' ? 'bg-cyan/10 text-cyan' :
                        q.difficulty === 'Medium' ? 'bg-violet/10 text-violet' :
                        'bg-coral/10 text-coral'
                      }`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <p className="text-text-primary text-sm">{q.question}</p>
                  </div>
                </div>
                <div className="bg-elevated rounded-md p-3">
                  <div className="text-text-muted text-xs mb-2 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-cyan" />
                    Tips
                  </div>
                  <ul className="space-y-1">
                    {q.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-xs text-text-secondary">
                        <CheckCircle className="w-3 h-3 text-cyan flex-shrink-0 mt-0.5" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </ScrollReveal>
        </>
      )}
    </PageLayout>
  )
}
