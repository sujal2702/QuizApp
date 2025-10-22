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
    <div className="flex min-h-screen bg-zinc-900">
      {/* Sidebar */}
      <AdminSidebar
        onNavigate={(key) => {
          setActiveNav(key);
          // Map sidebar keys to screens
          if (key === 'admin_dashboard') setScreen('admin_dashboard');
          else if (key === 'quiz') setScreen('quiz');
          else if (key === 'results') setScreen('results');
          else if (key === 'home') setScreen('home');
        }}
        active={activeNav}
      />
      {/* Main dashboard content */}
      <main className="flex-1 flex flex-col items-center justify-start py-8 px-8">
        <div className="w-full max-w-6xl p-8 bg-zinc-800 border border-zinc-700 rounded-2xl shadow-2xl animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-black mb-2 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent drop-shadow-sm">
              Create Quiz
            </h2>
            <p className="text-zinc-400 text-lg font-medium">Design your interactive quiz experience</p>
          </div>

          {/* Mode Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setMode('option-only')}
              className={`p-6 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                mode === 'option-only'
                  ? 'bg-gradient-to-br from-violet-600 to-purple-600 border-violet-400 text-white shadow-xl scale-[1.02]'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-violet-500'
              }`}
            >
              <div className="text-4xl mb-2">🎯</div>
              <div className="font-bold text-lg mb-1">Option Mode</div>
              <div className={`text-sm ${mode === 'option-only' ? 'text-white/90' : 'text-zinc-400'}`}>
                Questions on projector, answers only
              </div>
            </button>

            <button
              onClick={() => setMode('full-manual')}
              className={`p-6 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${
                mode === 'full-manual'
                  ? 'bg-gradient-to-br from-violet-600 to-purple-600 border-violet-400 text-white shadow-xl scale-[1.02]'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-violet-500'
              }`}
            >
              <div className="text-4xl mb-2">✍️</div>
              <div className="font-bold text-lg mb-1">Full Manual + AI</div>
              <div className={`text-sm ${mode === 'full-manual' ? 'text-white/90' : 'text-zinc-400'}`}>
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

            <div className="bg-zinc-900 p-6 rounded-xl border-2 border-zinc-700 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-bold text-white">
                  Number of Questions
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Math.min(100, Math.max(1, Number(e.target.value))))}
                    className="w-20 px-3 py-2 text-center text-xl font-black text-violet-400 bg-zinc-800 border-2 border-zinc-700 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50"
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
                className="w-full h-3 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-violet-600"
                style={{
                  background: `linear-gradient(to right, 
                    rgb(139 92 246) 0%, 
                    rgb(139 92 246) ${numQuestions}%, 
                    rgb(63 63 70) ${numQuestions}%, 
                    rgb(63 63 70) 100%)`
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
              <div className="bg-violet-500/10 p-6 rounded-xl border-2 border-violet-500/40">
                <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
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

            <div className="bg-zinc-900 p-6 rounded-xl border-2 border-zinc-700">
              <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <span className="text-2xl">⚙️</span>
                {mode === 'option-only' ? 'Answer Key Configuration' : 'Question Editor'}
              </h3>
              
              <div className="max-h-[520px] overflow-y-auto space-y-4 pr-2">
                {mode === 'option-only' ? (
                  // Option Mode: Only correct answers
                  questionSettings.map((setting, index) => (
                    <div key={index} className="bg-zinc-900 p-6 rounded-xl border-2 border-zinc-700 hover:border-violet-500 hover:shadow-lg transition-all">
                      <div className="flex items-center justify-between mb-5">
                        <h4 className="text-lg font-bold text-white flex items-center gap-3">
                          <span className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-lg flex items-center justify-center text-lg font-black shadow-lg border-2 border-violet-400">
                            {index + 1}
                          </span>
                          Question {index + 1}
                        </h4>
                        <span className="text-xs text-zinc-400 bg-zinc-800 px-3 py-1.5 rounded-lg font-medium border border-zinc-700">
                          📽️ On Projector
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-white mb-3">
                            Correct Answer *
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {optionColors.map((option, optIdx) => (
                              <button
                                key={optIdx}
                                onClick={() => updateQuestionSetting(index, 'correctAnswer', optIdx)}
                                className={`p-4 rounded-lg border-2 transition-all transform ${
                                  setting.correctAnswer === optIdx
                                    ? `${option.bg} ${option.border} scale-105 shadow-xl text-white ring-2 ring-violet-400`
                                    : 'bg-zinc-800 border-zinc-700 hover:scale-105 hover:border-violet-500'
                                }`}
                              >
                                <div className="text-center">
                                  <div className="text-3xl mb-1">{option.symbol}</div>
                                  <div className="text-sm font-black">{option.label}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-white mb-3">
                            Time Limit (seconds)
                          </label>
                          <input
                            type="number"
                            min="5"
                            max="600"
                            value={setting.timeLimit}
                            onChange={(e) => updateQuestionSetting(index, 'timeLimit', Number(e.target.value))}
                            className="w-full p-4 text-3xl font-black text-center text-violet-400 rounded-lg border-2 border-zinc-700 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/50 bg-zinc-800"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  // Full Manual Mode: Complete questions
                  manualQuestions.map((q, index) => (
                    <div key={index} className="bg-zinc-900 p-6 rounded-xl border-2 border-zinc-700 hover:border-violet-500 hover:shadow-lg transition-all">
                      <div className="flex items-center justify-between mb-5">
                        <h4 className="text-lg font-bold text-white flex items-center gap-3">
                          <span className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-lg flex items-center justify-center text-lg font-black shadow-lg border-2 border-violet-400">
                            {index + 1}
                          </span>
                          Question {index + 1}
                        </h4>
                      </div>

                      <div className="space-y-4">
                        <Input
                          id={`q-${index}-text`}
                          label="Question Text *"
                          value={q.text}
                          onChange={(e) => updateManualQuestion(index, 'text', e.target.value)}
                          placeholder="Enter your question..."
                        />

                        <div className="grid grid-cols-2 gap-3">
                          {['A', 'B', 'C', 'D'].map((label, optIdx) => (
                            <Input
                              key={optIdx}
                              id={`q-${index}-opt-${optIdx}`}
                              label={`Option ${label} *`}
                              value={q.options[optIdx]}
                              onChange={(e) => updateManualQuestion(index, `option${optIdx}`, e.target.value)}
                              placeholder={`Option ${label}`}
                            />
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-white mb-3">Correct Answer *</label>
                            <div className="grid grid-cols-4 gap-2">
                              {optionColors.map((option, optIdx) => (
                                <button
                                  key={optIdx}
                                  onClick={() => updateManualQuestion(index, 'correctAnswer', optIdx)}
                                  className={`p-3 rounded-lg border-2 transition-all ${
                                    q.correctAnswer === optIdx
                                      ? `${option.bg} ${option.border} scale-105 shadow-xl text-white ring-2 ring-violet-400`
                                      : 'bg-zinc-800 border-zinc-700 hover:scale-105 hover:border-violet-500'
                                  }`}
                                >
                                  <div className="text-center">
                                    <div className="text-xl">{option.symbol}</div>
                                    <div className="text-xs font-black">{option.label}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-bold text-white mb-3">Time Limit (sec)</label>
                            <input
                              type="number"
                              min="5"
                              max="600"
                              value={q.timeLimit}
                              onChange={(e) => updateManualQuestion(index, 'timeLimit', Number(e.target.value))}
                              className="w-full p-3 text-xl font-bold text-center text-violet-400 rounded-lg border-2 border-zinc-700 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50 bg-zinc-800"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={handleCreateRoom} className="!w-full !py-5 !text-xl !font-black !bg-gradient-to-r !from-violet-600 !to-fuchsia-600 hover:!from-violet-700 hover:!to-fuchsia-700 !shadow-2xl !border-2 !border-violet-400">
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
