import React, { useState } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { Screen } from '../hooks/useQuiz';
import Button from '../components/Button';
import Input from '../components/Input';
import { Question } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface AdminDashboardScreenProps {
  setScreen: (screen: Screen) => void;
}

type QuizMode = 'option-only' | 'full-manual';

const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ setScreen }) => {
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

    setError('');
    createRoom(quizName.trim(), questions, mode);
    setScreen('lobby');
  };

  const optionColors = [
    { label: 'A', color: 'Red', bg: 'bg-rose-500', border: 'border-rose-600', text: 'text-rose-700', symbol: '●' },
    { label: 'B', color: 'Yellow', bg: 'bg-amber-400', border: 'border-amber-500', text: 'text-amber-700', symbol: '■' },
    { label: 'C', color: 'Green', bg: 'bg-emerald-500', border: 'border-emerald-600', text: 'text-emerald-700', symbol: '▲' },
    { label: 'D', color: 'Blue', bg: 'bg-sky-500', border: 'border-sky-600', text: 'text-sky-700', symbol: '★' },
  ];

  return (
    <div className="w-full max-w-6xl p-10 bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-200 rounded-3xl shadow-2xl animate-fade-in-up">
      <div className="text-center mb-10">
        <h2 className="text-6xl font-black mb-3 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
          Create Quiz
        </h2>
        <p className="text-slate-600 text-xl font-medium">Design your interactive quiz experience</p>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setMode('option-only')}
          className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
            mode === 'option-only'
              ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 border-violet-600 text-white shadow-xl scale-105'
              : 'bg-white border-slate-300 text-slate-700 hover:border-violet-400'
          }`}
        >
          <div className="text-4xl mb-2">🎯</div>
          <div className="font-bold text-lg mb-1">Option Mode</div>
          <div className={`text-sm ${mode === 'option-only' ? 'text-white/90' : 'text-slate-500'}`}>
            Questions on projector, answers only
          </div>
        </button>

        <button
          onClick={() => setMode('full-manual')}
          className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
            mode === 'full-manual'
              ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 border-violet-600 text-white shadow-xl scale-105'
              : 'bg-white border-slate-300 text-slate-700 hover:border-violet-400'
          }`}
        >
          <div className="text-4xl mb-2">✍️</div>
          <div className="font-bold text-lg mb-1">Full Manual + AI</div>
          <div className={`text-sm ${mode === 'full-manual' ? 'text-white/90' : 'text-slate-500'}`}>
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

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-bold text-slate-700">
              Number of Questions
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="1"
                max="100"
                value={numQuestions}
                onChange={(e) => setNumQuestions(Math.min(100, Math.max(1, Number(e.target.value))))}
                className="w-20 px-3 py-2 text-center text-xl font-black text-violet-600 border-2 border-slate-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
              />
              <span className="text-sm text-slate-500">/ 100 max</span>
            </div>
          </div>
          <input
            id="num-questions"
            type="range"
            min="1"
            max="100"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-full h-3 bg-gradient-to-r from-violet-200 via-fuchsia-200 to-pink-200 rounded-lg appearance-none cursor-pointer accent-violet-600"
            style={{
              background: `linear-gradient(to right, 
                rgb(139 92 246) 0%, 
                rgb(139 92 246) ${numQuestions}%, 
                rgb(226 232 240) ${numQuestions}%, 
                rgb(226 232 240) 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>1</span>
            <span>25</span>
            <span>50</span>
            <span>75</span>
            <span>100</span>
          </div>
        </div>

        {mode === 'full-manual' && (
          <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 p-6 rounded-2xl border-2 border-violet-200">
            <h3 className="font-bold text-lg text-slate-800 mb-3 flex items-center gap-2">
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
            <p className="text-xs text-slate-600 mt-2">
              AI will create {numQuestions} questions about your topic. You can edit them after generation.
            </p>
          </div>
        )}

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            {mode === 'option-only' ? 'Answer Key Configuration' : 'Question Editor'}
          </h3>
          
          <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2">
            {mode === 'option-only' ? (
              // Option Mode: Only correct answers
              questionSettings.map((setting, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-slate-300 hover:border-violet-400 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white rounded-full flex items-center justify-center text-sm font-black">
                        {index + 1}
                      </span>
                      Question {index + 1}
                    </h4>
                    <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
                      📽️ On Projector
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">
                        Correct Answer *
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {optionColors.map((option, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => updateQuestionSetting(index, 'correctAnswer', optIdx)}
                            className={`p-4 rounded-xl border-2 transition-all transform ${
                              setting.correctAnswer === optIdx
                                ? `${option.bg} ${option.border} scale-110 shadow-lg text-white ring-4 ring-violet-200`
                                : 'bg-slate-50 border-slate-300 hover:scale-105 hover:border-violet-300'
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
                      <label className="block text-sm font-bold text-slate-700 mb-3">
                        Time Limit (seconds)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="600"
                        value={setting.timeLimit}
                        onChange={(e) => updateQuestionSetting(index, 'timeLimit', Number(e.target.value))}
                        className="w-full p-4 text-3xl font-black text-center text-violet-600 rounded-xl border-2 border-slate-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-200 bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Full Manual Mode: Complete questions
              manualQuestions.map((q, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-slate-300 hover:border-violet-400 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white rounded-full flex items-center justify-center text-sm font-black">
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
                        <label className="block text-sm font-bold text-slate-700 mb-2">Correct Answer *</label>
                        <div className="grid grid-cols-4 gap-2">
                          {optionColors.map((option, optIdx) => (
                            <button
                              key={optIdx}
                              onClick={() => updateManualQuestion(index, 'correctAnswer', optIdx)}
                              className={`p-3 rounded-lg border-2 transition-all ${
                                q.correctAnswer === optIdx
                                  ? `${option.bg} ${option.border} scale-105 shadow text-white`
                                  : 'bg-slate-50 border-slate-300 hover:scale-105'
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
                        <label className="block text-sm font-bold text-slate-700 mb-2">Time Limit (sec)</label>
                        <input
                          type="number"
                          min="5"
                          max="600"
                          value={q.timeLimit}
                          onChange={(e) => updateManualQuestion(index, 'timeLimit', Number(e.target.value))}
                          className="w-full p-3 text-xl font-bold text-center text-violet-600 rounded-lg border-2 border-slate-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-6">
          <Button onClick={handleCreateRoom} className="!w-full !py-5 !text-2xl !font-black !bg-gradient-to-r !from-violet-600 !to-fuchsia-600 hover:!from-violet-700 hover:!to-fuchsia-700 !shadow-xl">
            🚀 Create Room - {numQuestions} Question{numQuestions > 1 ? 's' : ''}
          </Button>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl animate-pulse">
            <p className="text-red-700 font-bold text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardScreen;
