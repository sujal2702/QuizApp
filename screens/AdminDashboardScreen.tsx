import React, { useState } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { Screen } from '../hooks/useQuiz';
import Button from '../components/Button';
import Input from '../components/Input';
import AdminSidebar from '../components/AdminSidebar';
import { Question } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface AdminDashboardScreenProps {
  setScreen: (screen: Screen) => void;
}

type QuizMode = 'option-only' | 'full-manual';

const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ setScreen }) => {
  // Sidebar navigation state
  const [activeNav, setActiveNav] = useState('admin_dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { createRoom } = useQuiz();
  const [quizName, setQuizName] = useState('');
  const [mode, setMode] = useState<QuizMode>('option-only');
  const [numQuestions, setNumQuestions] = useState(5);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Option Mode: Admin only sets correct answers
  const [questionSettings, setQuestionSettings] = useState<Array<{
    correctAnswer: number;
    timeLimit: number;
  }>>([]);

  // Full Manual Mode: Complete question entry
  const [manualQuestions, setManualQuestions] = useState<Array<{
    text: string;
    options: [string, string, string, string];
    correctAnswer: number;
    timeLimit: number;
  }>>([]);

  // AI topic for full manual mode
  const [aiTopic, setAiTopic] = useState('');

  // Initialize question settings when numQuestions changes
  React.useEffect(() => {
    if (mode === 'option-only') {
      const settings = Array.from({ length: numQuestions }, (_, i) => 
        questionSettings[i] || { correctAnswer: 0, timeLimit: 30 }
      );
      setQuestionSettings(settings);
    } else {
      const questions = Array.from({ length: numQuestions }, (_, i) => 
        manualQuestions[i] || { text: '', options: ['', '', '', ''], correctAnswer: 0, timeLimit: 30 }
      );
      setManualQuestions(questions);
    }
  }, [numQuestions, mode]);

  const updateQuestionSetting = (index: number, field: 'correctAnswer' | 'timeLimit', value: number) => {
    const updated = [...questionSettings];
    updated[index] = { ...updated[index], [field]: value };
    setQuestionSettings(updated);
  };

  const updateManualQuestion = (index: number, field: string, value: any) => {
    const updated = [...manualQuestions];
    if (field === 'text' || field === 'correctAnswer' || field === 'timeLimit') {
      (updated[index] as any)[field] = value;
    } else if (field.startsWith('option')) {
      const optIndex = parseInt(field.replace('option', ''));
      updated[index].options[optIndex] = value;
    }
    setManualQuestions(updated);
  };

  const generateWithAI = async () => {
    if (!aiTopic.trim()) {
      setError('Please enter a topic for AI generation.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `Generate ${numQuestions} multiple-choice quiz questions about ${aiTopic}. Each question should have 4 options and one correct answer. Time limit should be 15-45 seconds based on difficulty.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctOption: { type: Type.NUMBER },
                    timeLimit: { type: Type.NUMBER },
                  },
                  required: ['text', 'options', 'correctOption', 'timeLimit'],
                }
              }
            },
            required: ['questions'],
          },
        }
      });

      const jsonText = response.text.trim();
      const generatedQuiz = JSON.parse(jsonText);
      
      if (generatedQuiz.questions && generatedQuiz.questions.length > 0) {
        const generated = generatedQuiz.questions.map((q: any) => ({
          text: q.text,
          options: q.options.slice(0, 4) as [string, string, string, string],
          correctAnswer: q.correctOption,
          timeLimit: q.timeLimit
        }));
        setManualQuestions(generated);
        setNumQuestions(generated.length);
      } else {
        setError('Failed to generate questions. Please try again.');
      }
    } catch (e) {
      console.error(e);
      setError('AI generation failed. Please try manual entry.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = () => {
    if (!quizName.trim()) {
      setError('Please provide a quiz name.');
      return;
    }

    let questions: Question[];

    if (mode === 'option-only') {
      if (questionSettings.length === 0) {
        setError('Please add at least one question.');
        return;
      }
      questions = questionSettings.map((setting, index) => ({
        id: index + 1,
        text: `Question ${index + 1}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctOption: setting.correctAnswer,
        timeLimit: setting.timeLimit
      }));
    } else {
      const invalidQuestion = manualQuestions.findIndex(q => 
        !q.text.trim() || q.options.some(opt => !opt.trim())
      );
      
      if (invalidQuestion !== -1) {
        setError(`Question ${invalidQuestion + 1} is incomplete. Please fill all fields.`);
        return;
      }

      questions = manualQuestions.map((q, index) => ({
        id: index + 1,
        text: q.text.trim(),
        options: q.options.map(opt => opt.trim()),
        correctOption: q.correctAnswer,
        timeLimit: q.timeLimit
      }));
    }

    console.log('Creating room with:', { name: quizName.trim(), questions, mode });
    setError('');
    createRoom(quizName.trim(), questions, mode);
    console.log('Room created, navigating to lobby');
    setScreen('lobby');
  };

  const optionColors = [
    { label: 'A', color: 'Red', bg: 'bg-rose-500', border: 'border-rose-600', text: 'text-rose-700', symbol: '●' },
    { label: 'B', color: 'Yellow', bg: 'bg-amber-400', border: 'border-amber-500', text: 'text-amber-700', symbol: '■' },
    { label: 'C', color: 'Green', bg: 'bg-emerald-500', border: 'border-emerald-600', text: 'text-emerald-700', symbol: '▲' },
    { label: 'D', color: 'Blue', bg: 'bg-sky-500', border: 'border-sky-600', text: 'text-sky-700', symbol: '★' },
  ];

  return (
    <div className="relative flex min-h-screen bg-gray-50">
      {/* Floating 3-Dot Menu Button */}
      <div className="fixed top-24 right-6 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="group relative w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        >
          <div className="flex flex-col gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          </div>
          {isMenuOpen && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          )}
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 -z-10"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Items */}
            <div className="absolute top-16 right-0 w-64 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden animate-fade-in">
              <div className="p-2">
                <button
                  onClick={() => {
                    setActiveNav('admin_dashboard');
                    setScreen('admin_dashboard');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeNav === 'admin_dashboard'
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activeNav === 'admin_dashboard' ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-sm">Dashboard</p>
                    <p className={`text-xs ${activeNav === 'admin_dashboard' ? 'text-white/80' : 'text-gray-500'}`}>Create & manage</p>
                  </div>
                  {activeNav === 'admin_dashboard' && (
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveNav('quiz');
                    setScreen('quiz');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeNav === 'quiz'
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activeNav === 'quiz' ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.25 22.5l-.648-1.947a4.5 4.5 0 01-3.09-3.09l-1.947-.648 1.947-.648a4.5 4.5 0 013.09-3.09l.648-1.947.648 1.947a4.5 4.5 0 013.09 3.09l1.947.648-1.947.648a4.5 4.5 0 01-3.09 3.09z" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-sm">Live Quiz</p>
                    <p className={`text-xs ${activeNav === 'quiz' ? 'text-white/80' : 'text-gray-500'}`}>Active session</p>
                  </div>
                  {activeNav === 'quiz' && (
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveNav('results');
                    setScreen('results');
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeNav === 'results'
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activeNav === 'results' ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-sm">Results</p>
                    <p className={`text-xs ${activeNav === 'results' ? 'text-white/80' : 'text-gray-500'}`}>View scores</p>
                  </div>
                  {activeNav === 'results' && (
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  )}
                </button>

                <div className="h-px bg-gray-200 my-2"></div>

                <button
                  onClick={() => {
                    setActiveNav('home');
                    setScreen('home');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-gray-100 text-gray-700"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-sm">Home</p>
                    <p className="text-xs text-gray-500">Back to main</p>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main dashboard content */}
      <main className="flex-1 flex flex-col items-center justify-start py-8 px-8">
        <div className="w-full max-w-6xl p-8 bg-white border-2 border-gray-200 rounded-3xl shadow-xl animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-3xl">✨</span>
            </div>
            <h2 className="text-5xl font-black mb-2 text-gray-900">
              Create Quiz
            </h2>
            <p className="text-gray-600 text-lg font-medium">Design your interactive quiz experience</p>
          </div>

          {/* Mode Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setMode('option-only')}
              className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-[1.02] ${
                mode === 'option-only'
                  ? 'bg-yellow-400 border-yellow-500 text-gray-900 shadow-xl scale-[1.02]'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-yellow-400'
              }`}
            >
              <div className="text-4xl mb-2">🎯</div>
              <div className="font-bold text-lg mb-1">Option Mode</div>
              <div className={`text-sm ${mode === 'option-only' ? 'text-gray-900' : 'text-gray-600'}`}>
                Questions on projector, answers only
              </div>
            </button>

            <button
              onClick={() => setMode('full-manual')}
              className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-[1.02] ${
                mode === 'full-manual'
                  ? 'bg-cyan-200 border-cyan-400 text-gray-900 shadow-xl scale-[1.02]'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-cyan-400'
              }`}
            >
              <div className="text-4xl mb-2">✍️</div>
              <div className="font-bold text-lg mb-1">Full Manual + AI</div>
              <div className={`text-sm ${mode === 'full-manual' ? 'text-gray-900' : 'text-gray-600'}`}>
                Complete questions with AI assist
              </div>
            </button>
          </div>

          <div className="space-y-6">
            <Input
              id="quiz-name"
              label="Quiz Name *"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              placeholder="e.g., Science Quiz - Chapter 5"
            />

            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold text-gray-900">
                  Number of Questions
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Math.min(100, Math.max(1, Number(e.target.value))))}
                    className="w-20 px-3 py-2 text-center text-xl font-black text-gray-900 bg-white border-2 border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                  />
                  <span className="text-sm text-zinc-400">/ 100 max</span>
                </div>
              </div>
              <input
                id="num-questions"
                type="range"
                min="1"
                max="100"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                style={{
                  background: `linear-gradient(to right, 
                    rgb(234 179 8) 0%, 
                    rgb(234 179 8) ${numQuestions}%, 
                    rgb(229 231 235) ${numQuestions}%, 
                    rgb(229 231 235) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-zinc-500 mt-2">
                <span>1</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>

            {mode === 'full-manual' && (
              <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-400/40">
                <h3 className="font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  AI Question Generator
                </h3>
                <div className="flex gap-3">
                  <Input
                    id="ai-topic"
                    label=""
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    placeholder="e.g., World War II, Photosynthesis, JavaScript..."
                    className="flex-1"
                  />
                  <Button
                    onClick={generateWithAI}
                    disabled={loading || !aiTopic.trim()}
                    variant="secondary"
                    className="!px-6"
                  >
                    {loading ? '⏳ Generating...' : '✨ Generate'}
                  </Button>
                </div>
                <p className="text-xs text-zinc-400 mt-2">
                  AI will create {numQuestions} questions about your topic. You can edit them after generation.
                </p>
              </div>
            )}

            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="text-2xl">⚙️</span>
                {mode === 'option-only' ? 'Answer Key Configuration' : 'Question Editor'}
              </h3>
              
              <div className="max-h-[520px] overflow-y-auto space-y-4 pr-2">
                {mode === 'option-only' ? (
                  // Option Mode: Only correct answers
                  questionSettings.map((setting, index) => (
                    <div key={index} className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 hover:border-yellow-400 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                      {/* Decorative gradient overlay */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="p-6 sm:p-8">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-gray-100">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg transform group-hover:scale-110 transition-transform">
                                {index + 1}
                              </div>
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xl font-black text-gray-900">Question {index + 1}</h4>
                              <p className="text-sm text-gray-500 font-medium mt-1">Configure answer & timing</p>
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-2 text-sm text-gray-700 bg-gradient-to-r from-gray-100 to-gray-50 px-4 py-2.5 rounded-xl font-semibold border-2 border-gray-200 shadow-sm">
                            <span className="text-lg">📽️</span>
                            <span>On Projector</span>
                          </span>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Correct Answer Selection */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                              <label className="text-base font-black text-gray-900 uppercase tracking-wide">
                                Correct Answer *
                              </label>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              {optionColors.map((option, optIdx) => (
                                <button
                                  key={optIdx}
                                  onClick={() => updateQuestionSetting(index, 'correctAnswer', optIdx)}
                                  className={`group/btn relative p-5 rounded-2xl border-3 transition-all duration-300 transform ${
                                    setting.correctAnswer === optIdx
                                      ? `${option.bg} ${option.border} scale-105 shadow-2xl text-white ring-4 ring-yellow-400/50`
                                      : 'bg-white border-2 border-gray-200 hover:scale-105 hover:border-yellow-400 hover:shadow-lg'
                                  }`}
                                >
                                  {setting.correctAnswer === optIdx && (
                                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                      <span className="text-white text-sm font-bold">✓</span>
                                    </div>
                                  )}
                                  <div className="text-center">
                                    <div className={`text-4xl mb-2 transition-transform group-hover/btn:scale-110 ${setting.correctAnswer !== optIdx ? 'grayscale' : ''}`}>
                                      {option.symbol}
                                    </div>
                                    <div className={`text-lg font-black uppercase ${setting.correctAnswer === optIdx ? 'text-white' : 'text-gray-900'}`}>
                                      {option.label}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 italic mt-3 flex items-center gap-2">
                              <span className="text-yellow-500">ℹ️</span>
                              <span>Select the correct answer option</span>
                            </p>
                          </div>

                          {/* Time Limit */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                              <label className="text-base font-black text-gray-900 uppercase tracking-wide">
                                Time Limit
                              </label>
                            </div>
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 rounded-2xl blur-xl"></div>
                              <input
                                type="number"
                                min="5"
                                max="600"
                                value={setting.timeLimit}
                                onChange={(e) => updateQuestionSetting(index, 'timeLimit', Number(e.target.value))}
                                className="relative w-full p-6 text-5xl font-black text-center text-gray-900 rounded-2xl border-3 border-gray-200 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/30 bg-white shadow-lg transition-all hover:shadow-xl"
                              />
                              <div className="absolute bottom-2 left-0 right-0 text-center">
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">seconds</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 mt-3 px-2">
                              <span className="flex items-center gap-1">
                                <span className="text-yellow-500">⚡</span>
                                <span>Min: 5s</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="text-yellow-500">⏱️</span>
                                <span>Max: 600s</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Full Manual Mode: Complete questions
                  manualQuestions.map((q, index) => (
                    <div key={index} className="group relative bg-gradient-to-br from-white to-blue-50/30 rounded-2xl border-2 border-gray-200 hover:border-cyan-400 hover:shadow-2xl transition-all duration-300 overflow-hidden">
                      {/* Decorative gradient overlay */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="p-6 sm:p-8">
                        {/* Header */}
                        <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-gray-100">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg transform group-hover:scale-110 transition-transform">
                                {index + 1}
                              </div>
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full border-4 border-white flex items-center justify-center">
                                <span className="text-white text-xs">✎</span>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xl font-black text-gray-900">Question {index + 1}</h4>
                              <p className="text-sm text-gray-500 font-medium mt-1">Full question editor</p>
                            </div>
                          </div>
                        </div>

                        {/* Question Content */}
                        <div className="space-y-6">
                          {/* Question Text */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                              <label className="text-sm font-black text-gray-900 uppercase tracking-wide">
                                Question Text *
                              </label>
                            </div>
                            <Input
                              id={`q-${index}-text`}
                              label=""
                              value={q.text}
                              onChange={(e) => updateManualQuestion(index, 'text', e.target.value)}
                              placeholder="Enter your question here..."
                              className="!border-2 !border-gray-200 focus:!border-cyan-400 !rounded-xl !text-base"
                            />
                          </div>

                          {/* Options Grid */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                              <label className="text-sm font-black text-gray-900 uppercase tracking-wide">
                                Answer Options *
                              </label>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {['A', 'B', 'C', 'D'].map((label, optIdx) => (
                                <div key={optIdx} className="relative">
                                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center font-black text-gray-700 text-sm shadow-sm">
                                    {label}
                                  </div>
                                  <Input
                                    id={`q-${index}-opt-${optIdx}`}
                                    label=""
                                    value={q.options[optIdx]}
                                    onChange={(e) => updateManualQuestion(index, `option${optIdx}`, e.target.value)}
                                    placeholder={`Enter option ${label}...`}
                                    className="!pl-14 !border-2 !border-gray-200 focus:!border-cyan-400 !rounded-xl"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Answer & Time Settings */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                            {/* Correct Answer Selection */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                <label className="text-sm font-black text-gray-900 uppercase tracking-wide">
                                  Correct Answer *
                                </label>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                {optionColors.map((option, optIdx) => (
                                  <button
                                    key={optIdx}
                                    onClick={() => updateManualQuestion(index, 'correctAnswer', optIdx)}
                                    className={`group/btn relative p-4 rounded-xl border-3 transition-all duration-300 ${
                                      q.correctAnswer === optIdx
                                        ? `${option.bg} ${option.border} scale-105 shadow-xl text-white ring-4 ring-cyan-400/50`
                                        : 'bg-white border-2 border-gray-200 hover:scale-105 hover:border-cyan-400 hover:shadow-lg'
                                    }`}
                                  >
                                    {q.correctAnswer === optIdx && (
                                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white text-xs font-bold">✓</span>
                                      </div>
                                    )}
                                    <div className="text-center">
                                      <div className={`text-3xl mb-1 transition-transform group-hover/btn:scale-110 ${q.correctAnswer !== optIdx ? 'grayscale' : ''}`}>
                                        {option.symbol}
                                      </div>
                                      <div className={`text-sm font-black uppercase ${q.correctAnswer === optIdx ? 'text-white' : 'text-gray-900'}`}>
                                        {option.label}
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Time Limit */}
                            <div className="space-y-4">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                <label className="text-sm font-black text-gray-900 uppercase tracking-wide">
                                  Time Limit
                                </label>
                              </div>
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-blue-500/10 rounded-2xl blur-xl"></div>
                                <input
                                  type="number"
                                  min="5"
                                  max="600"
                                  value={q.timeLimit}
                                  onChange={(e) => updateManualQuestion(index, 'timeLimit', Number(e.target.value))}
                                  className="relative w-full p-5 text-4xl font-black text-center text-gray-900 rounded-2xl border-3 border-gray-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/30 bg-white shadow-lg transition-all hover:shadow-xl"
                                />
                                <div className="absolute bottom-2 left-0 right-0 text-center">
                                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">seconds</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-500 px-2">
                                <span className="flex items-center gap-1">
                                  <span className="text-cyan-500">⚡</span>
                                  <span>Min: 5s</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <span className="text-cyan-500">⏱️</span>
                                  <span>Max: 600s</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={handleCreateRoom} variant="primary" className="!w-full !py-5 !text-xl !font-black">
                🚀 Create Room - {numQuestions} Question{numQuestions > 1 ? 's' : ''}
              </Button>
            </div>
            
            {error && (
              <div className="p-4 bg-red-500/10 border-2 border-red-500/40 rounded-xl animate-pulse">
                <p className="text-red-400 font-bold text-center">{error}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardScreen;
