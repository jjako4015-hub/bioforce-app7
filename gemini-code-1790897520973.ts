import React, { useState } from 'react';
import { PROFILES_CONFIG } from './data/profileRanks';
import { ProfileCategory, SectionType, Question } from './types';
import { textbookTopics, week1Topics, week2Topics, generate20UniqueQuestionsForTopic } from './data/questionDatabase';
import { DnaCanvas3D } from './components/3d/DnaCanvas3D';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [selectedProfile, setSelectedProfile] = useState<ProfileCategory | null>(null);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<SectionType>('modules');
  
  // Progress State
  const [userXp, setUserXp] = useState<number>(0);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [completedWeek1Final, setCompletedWeek1Final] = useState<boolean>(false);
  const [completedWeek2Final, setCompletedWeek2Final] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<{ question: Question; userAnswer: string }[]>([]);

  // Active Test State
  const [activeTest, setActiveTest] = useState<{
    type: 'topic' | 'week1_final' | 'week2_final' | 'monthly';
    topicId?: string;
    questions: Question[];
    currentIndex: number;
    score: number;
    selectedOption: string | null;
    showExplanation: boolean;
  } | null>(null);

  // Test Complete Result Modal State
  const [testResult, setTestResult] = useState<{
    totalScore: number;
    totalQuestions: number;
    percentage: number;
    xpGained: number;
    wrongCount: number;
  } | null>(null);

  // Profile Rank Progress
  const currentProfileData = selectedProfile ? PROFILES_CONFIG[selectedProfile] : null;
  const currentRank = currentProfileData?.ranks.slice().reverse().find(r => userXp >= r.requiredXp) || currentProfileData?.ranks[0];

  // System Progress Calculations
  const generalProgressPercent = Math.round((completedTopics.length / textbookTopics.length) * 100);
  const week1ProgressPercent = Math.round((week1Topics.filter(t => completedTopics.includes(t.id)).length / 4) * 100);
  
  // RULE 10: Week 2 unlock requirements
  const week2Unlocked = completedTopics.includes('topic_1') && completedTopics.includes('topic_2') && 
                         completedTopics.includes('topic_3') && completedTopics.includes('topic_4') && 
                         completedWeek1Final;
  const week2ProgressPercent = week2Unlocked ? Math.round((week2Topics.filter(t => completedTopics.includes(t.id)).length / week2Topics.length) * 100) : 0;

  // --------------------------------------------------------------------------
  // TEST GENERATION PIPELINE
  // --------------------------------------------------------------------------
  const startTopicTest = (topicId: string) => {
    const questions = generate20UniqueQuestionsForTopic(topicId, Number(topicId.replace('topic_', '')) <= 4 ? 1 : 2);
    setActiveTest({ type: 'topic', topicId, questions, currentIndex: 0, score: 0, selectedOption: null, showExplanation: false });
  };

  const startWeek1Final = () => {
    const questions: Question[] = [];
    week1Topics.forEach(t => {
      questions.push(...generate20UniqueQuestionsForTopic(t.id, 1).slice(0, 13));
    });
    setActiveTest({ type: 'week1_final', questions: questions.slice(0, 50), currentIndex: 0, score: 0, selectedOption: null, showExplanation: false });
  };

  const startWeek2Final = () => {
    const questions: Question[] = [];
    week2Topics.forEach(t => {
      questions.push(...generate20UniqueQuestionsForTopic(t.id, 2).slice(0, 10));
    });
    setActiveTest({ type: 'week2_final', questions: questions.slice(0, 50), currentIndex: 0, score: 0, selectedOption: null, showExplanation: false });
  };

  const startMonthlyTest = () => {
    const questions: Question[] = [];
    textbookTopics.forEach(t => {
      questions.push(...generate20UniqueQuestionsForTopic(t.id, 1).slice(0, 12));
    });
    setActiveTest({ type: 'monthly', questions: questions.slice(0, 100), currentIndex: 0, score: 0, selectedOption: null, showExplanation: false });
  };

  // Option Click Handler
  const handleSelectOption = (opt: string) => {
    if (!activeTest || activeTest.selectedOption !== null) return;

    const currentQ = activeTest.questions[activeTest.currentIndex];
    const isCorrect = opt === currentQ.correctAnswer;

    if (!isCorrect) {
      // RULE 50: Auto add to Mistakes Section
      setMistakes(prev => [...prev, { question: currentQ, userAnswer: opt }]);
    }

    setActiveTest(prev => prev ? {
      ...prev,
      selectedOption: opt,
      showExplanation: true,
      score: isCorrect ? prev.score + 1 : prev.score
    } : null);
  };

  // Next Question or Finish Test
  const handleNextQuestion = () => {
    if (!activeTest) return;

    if (activeTest.currentIndex + 1 < activeTest.questions.length) {
      setActiveTest(prev => prev ? {
        ...prev,
        currentIndex: prev.currentIndex + 1,
        selectedOption: null,
        showExplanation: false
      } : null);
    } else {
      // RULE 59: TEST COMPLETE SCREEN CALCULATION
      const totalQ = activeTest.questions.length;
      const finalScore = activeTest.score;
      const percentage = Math.round((finalScore / totalQ) * 100);
      const wrongCount = totalQ - finalScore;
      let xpGained = finalScore * 10;

      if (activeTest.type === 'topic' && activeTest.topicId) {
        if (!completedTopics.includes(activeTest.topicId)) {
          setCompletedTopics(prev => [...prev, activeTest.topicId!]);
          xpGained += 50;
        }
      } else if (activeTest.type === 'week1_final') {
        setCompletedWeek1Final(true);
        xpGained += 100;
      } else if (activeTest.type === 'week2_final') {
        setCompletedWeek2Final(true);
        xpGained += 100;
      } else if (activeTest.type === 'monthly') {
        xpGained += 250;
      }

      setUserXp(prev => prev + xpGained);
      setTestResult({
        totalScore: finalScore,
        totalQuestions: totalQ,
        percentage,
        xpGained,
        wrongCount
      });
      setActiveTest(null);
    }
  };

  // ==========================================================================
  // LANDING PAGE (RULE 4 & 21: ONLY BIOFORCE + PROFILE SELECTION)
  // ==========================================================================
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-white text-[#10251A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#39FF88]/20 rounded-full blur-[120px] pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="text-6xl font-black tracking-widest text-[#0B3D24] drop-shadow-[0_0_25px_rgba(57,255,136,0.6)]">
            BIOFORCE
          </h1>
          <p className="text-xl font-bold text-[#18C875] mt-2 tracking-wider">ӨЗ ПРОФИЛІҢДІ ТАҢДА</p>
        </motion.div>

        {/* 3D DNA Canvas Hero */}
        <div className="w-64">
          <DnaCanvas3D label="Bioforce Core DNA" height="h-48" />
        </div>

        {/* 6 Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full my-6">
          {(Object.keys(PROFILES_CONFIG) as ProfileCategory[]).map((key) => {
            const prof = PROFILES_CONFIG[key];
            const isSelected = selectedProfile === key;
            return (
              <motion.div
                key={key}
                whileHover={{ scale: 1.03 }}
                onClick={() => setSelectedProfile(key)}
                className={`p-5 rounded-2xl cursor-pointer border-2 transition-all glass-panel ${
                  isSelected
                    ? "border-[#39FF88] bg-[#39FF88]/25 shadow-[0_0_30px_rgba(57,255,136,0.45)]"
                    : "border-transparent hover:border-[#39FF88] hover:shadow-[0_0_25px_rgba(57,255,136,0.35)]"
                }`}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-3xl">{prof.icon}</span>
                  <h3 className="text-xl font-black text-[#0B3D24]">{prof.name}</h3>
                </div>
                <p className="text-xs text-emerald-800 font-bold mb-2">Бастапқы кейіпкер: <span className="text-[#18C875]">{prof.ranks[0].character}</span></p>
              </motion.div>
            );
          })}
        </div>

        {/* START BUTTON */}
        {selectedProfile && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setIsStarted(true)}
            className="glow-btn px-10 py-4 rounded-full text-[#0B3D24] text-2xl font-black flex items-center space-x-3 cursor-pointer mt-2"
          >
            <span>БАСТАУ</span>
          </motion.button>
        )}
      </div>
    );
  }

  // ==========================================================================
  // MAIN DASHBOARD PLATFORM
  // ==========================================================================
  return (
    <div className="min-h-screen bg-[#F4FFF7] text-[#10251A] flex flex-col">
      {/* Header Navigation */}
      <header className="border-b border-[#39FF88]/30 bg-white/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-black text-[#0B3D24] tracking-widest">BIOFORCE</span>
          <span className="text-xs bg-[#E8FFF1] border border-[#39FF88] px-3 py-1 rounded-full text-[#0B3D24] font-bold">
            {currentProfileData?.name} | {currentRank?.rank} ({currentRank?.character})
          </span>
        </div>

        <nav className="flex space-x-2">
          {(['modules', 'character', 'mistakes', 'monthly'] as SectionType[]).map((sec) => (
            <button
              key={sec}
              onClick={() => { setActiveTest(null); setActiveSection(sec); }}
              className={`nav-item px-5 py-2 rounded-xl text-sm font-black uppercase ${
                activeSection === sec ? "active" : "text-[#0B3D24]"
              }`}
            >
              {sec === 'modules' && "МОДУЛЬ"}
              {sec === 'character' && "КЕЙІПКЕР"}
              {sec === 'mistakes' && `ҚАТЕМЕН ЖҰМЫС (${mistakes.length})`}
              {sec === 'monthly' && (
                <span className="flex items-center space-x-1">
                  <span>АЙЛЫҚ ТЕСТ</span>
                  {(!completedWeek2Final || mistakes.length > 0) && <span>🔒</span>}
                </span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6">
        {/* BREADCRUMB */}
        <div className="text-xs text-emerald-800 mb-4 uppercase tracking-wider font-extrabold">
          МОДУЛЬ &gt; {activeSection.toUpperCase()} {activeTest && `&gt; ${activeTest.type.toUpperCase()} &gt; СҰРАҚ ${activeTest.currentIndex + 1} / ${activeTest.questions.length}`}
        </div>

        {/* RULE 59: TEST COMPLETE RESULT MODAL */}
        {testResult && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="glass-panel p-8 rounded-3xl max-w-md w-full text-center bg-white">
              <h2 className="text-3xl font-black text-[#0B3D24] mb-2">ТЕСТ АЯҚТАЛДЫ! 🎉</h2>
              <div className="text-5xl font-black text-[#18C875] my-4">{testResult.totalScore} / {testResult.totalQuestions}</div>
              <p className="text-lg font-bold text-[#0B3D24] mb-1">Нәтиже: <span className="text-[#18C875]">{testResult.percentage}%</span></p>
              <p className="text-sm font-bold text-emerald-700 mb-1">Алынған ұпай: <span className="text-[#39FF88] font-black">+{testResult.xpGained} XP</span></p>
              <p className="text-sm font-bold text-red-600 mb-6">Жіберілген қателер: {testResult.wrongCount}</p>

              <div className="flex space-x-3">
                {testResult.wrongCount > 0 && (
                  <button
                    onClick={() => { setTestResult(null); setActiveSection('mistakes'); }}
                    className="flex-1 py-3 bg-red-100 border border-red-400 text-red-700 rounded-xl font-bold text-xs"
                  >
                    ҚАТЕМЕН ЖҰМЫС
                  </button>
                )}
                <button
                  onClick={() => setTestResult(null)}
                  className="flex-1 glow-btn py-3 rounded-xl font-black text-[#0B3D24] text-xs"
                >
                  КЕЛЕСІ БӨЛІМ
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* ACTIVE QUESTION UI */}
        {activeTest ? (
          <div className="glass-panel p-8 rounded-3xl max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-emerald-900">
                Сұрақ {activeTest.currentIndex + 1} / {activeTest.questions.length}
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-[#39FF88]/40 font-black">
                {activeTest.questions[activeTest.currentIndex].difficulty.toUpperCase()}
              </span>
            </div>

            <div className="w-full h-3 bg-[#E8FFF1] rounded-full overflow-hidden mb-6 border border-[#39FF88]/50">
              <div
                className="h-full bg-[#39FF88] transition-all duration-300"
                style={{ width: `${((activeTest.currentIndex + 1) / activeTest.questions.length) * 100}%` }}
              />
            </div>

            <h2 className="text-xl font-black text-[#0B3D24] mb-6">
              {activeTest.questions[activeTest.currentIndex].question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3 mb-6">
              {activeTest.questions[activeTest.currentIndex].options.map((opt, idx) => {
                const currentQ = activeTest.questions[activeTest.currentIndex];
                const isSelected = activeTest.selectedOption === opt;
                const isCorrect = opt === currentQ.correctAnswer;

                let btnStyle = "bg-white/90 border-[#39FF88]/50 text-[#10251A] hover:bg-[#E8FFF1]";
                if (activeTest.selectedOption !== null) {
                  if (isCorrect) btnStyle = "bg-green-100 border-green-500 text-green-800 font-extrabold shadow-[0_0_15px_rgba(57,255,136,0.5)]";
                  else if (isSelected) btnStyle = "bg-red-100 border-red-500 text-red-800 font-bold";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full text-left p-4 rounded-2xl border-2 font-bold transition-all text-sm ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* RULE 49: EXPLANATION PANEL */}
            {activeTest.showExplanation && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-[#E8FFF1] border border-[#39FF88] mb-6">
                <p className="text-xs font-black text-[#0B3D24] uppercase mb-1">
                  {activeTest.selectedOption === activeTest.questions[activeTest.currentIndex].correctAnswer ? "🟢 ДҰРЫС ЖАУАП!" : "🔴 ҚАТЕ ЖАУАП - НЕЛІКТЕН?"}
                </p>
                <p className="text-xs text-emerald-900 font-medium">
                  {activeTest.questions[activeTest.currentIndex].explanation}
                </p>
                <button
                  onClick={handleNextQuestion}
                  className="glow-btn w-full py-3 rounded-xl font-black text-[#0B3D24] mt-3 text-xs"
                >
                  КЕЛЕСІ СҰРАҚ ➔
                </button>
              </motion.div>
            )}
          </div>
        ) : (
          <>
            {/* PROGRESS DASHBOARD */}
            <div className="glass-panel p-6 rounded-3xl mb-8">
              <h2 className="text-lg font-black text-[#0B3D24] mb-2 uppercase tracking-wide">ЖАЛПЫ ПРОГРЕСС</h2>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1 h-4 bg-[#E8FFF1] rounded-full overflow-hidden border border-[#39FF88]/60">
                  <div className="h-full bg-gradient-to-r from-[#39FF88] to-[#18C875]" style={{ width: `${generalProgressPercent}%` }} />
                </div>
                <span className="text-xl font-black text-[#0B3D24]">{generalProgressPercent}%</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs font-black text-[#0B3D24]">
                <div className="p-3 bg-white/80 rounded-xl border border-[#39FF88]/40">1-АПТА: {week1ProgressPercent}%</div>
                <div className="p-3 bg-white/80 rounded-xl border border-[#39FF88]/40">2-АПТА: {week2Unlocked ? `${week2ProgressPercent}%` : "🔒"}</div>
                <div className="p-3 bg-white/80 rounded-xl border border-[#39FF88]/40">ҚАТЕМЕН ЖҰМЫС: {mistakes.length > 0 ? `${mistakes.length} қате` : "100% ✓"}</div>
                <div className="p-3 bg-white/80 rounded-xl border border-[#39FF88]/40">АЙЛЫҚ ТЕСТ: {completedWeek2Final && mistakes.length === 0 ? "🔓 АШЫҚ" : "🔒"}</div>
              </div>
            </div>

            {/* MODULES SECTION */}
            {activeSection === 'modules' && (
              <div className="space-y-8">
                {/* WEEK 1 */}
                <div className="glass-panel p-6 rounded-3xl">
                  <h3 className="text-xl font-black text-[#0B3D24] mb-4">1-АПТА (Алғашқы 4 оқулық тақырыбы)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {week1Topics.map((topic, idx) => {
                      const isUnlocked = idx === 0 || completedTopics.includes(week1Topics[idx - 1].id);
                      const isDone = completedTopics.includes(topic.id);

                      return (
                        <div key={topic.id} className="p-4 bg-white/90 rounded-2xl border border-[#39FF88]/50">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-extrabold text-[#0B3D24] text-sm">{topic.title}</h4>
                            <span className="text-xs font-black">{isDone ? "✓ 20/20" : isUnlocked ? "🔓 0/20" : "🔒"}</span>
                          </div>
                          <DnaCanvas3D height="h-32" />
                          {isUnlocked && !isDone && (
                            <button
                              onClick={() => startTopicTest(topic.id)}
                              className="glow-btn w-full py-2 rounded-xl text-xs font-black text-[#0B3D24] mt-2"
                            >
                              ТАПСЫРУ (20 СҰРАҚ)
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* WEEK 1 FINAL */}
                  {completedTopics.filter(id => week1Topics.some(w => w.id === id)).length === 4 && (
                    <div className="p-4 bg-[#39FF88]/30 border border-[#39FF88] rounded-2xl text-center">
                      <h4 className="font-black text-[#0B3D24] mb-2">1-АПТА ҚОРЫТЫНДЫ ТЕСТІ (50 СҰРАҚ)</h4>
                      <button
                        onClick={startWeek1Final}
                        className="glow-btn px-6 py-2.5 rounded-xl text-sm font-black text-[#0B3D24]"
                      >
                        {completedWeek1Final ? "ҚАЙТА ТАПСЫРУ" : "БАСТАУ (50 СҰРАҚ)"}
                      </button>
                    </div>
                  )}
                </div>

                {/* WEEK 2 */}
                <div className="glass-panel p-6 rounded-3xl relative">
                  {!week2Unlocked && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-10 flex items-center justify-center rounded-3xl">
                      <span className="text-lg font-black text-[#0B3D24] bg-[#39FF88] px-6 py-3 rounded-full shadow-lg">
                        🔒 2-АПТА ҚҰЛЫПТАУЛЫ (1-апта толық аяқталуы тиіс)
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-black text-[#0B3D24] mb-4">2-АПТА (Қалған оқулық тақырыптары)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {week2Topics.map((topic, idx) => {
                      const isUnlocked = idx === 0 || completedTopics.includes(week2Topics[idx - 1].id);
                      const isDone = completedTopics.includes(topic.id);

                      return (
                        <div key={topic.id} className="p-4 bg-white/90 rounded-2xl border border-[#39FF88]/50">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-extrabold text-[#0B3D24] text-sm">{topic.title}</h4>
                            <span className="text-xs font-black">{isDone ? "✓ 20/20" : isUnlocked ? "🔓 0/20" : "🔒"}</span>
                          </div>
                          <DnaCanvas3D height="h-32" />
                          {isUnlocked && !isDone && (
                            <button
                              onClick={() => startTopicTest(topic.id)}
                              className="glow-btn w-full py-2 rounded-xl text-xs font-black text-[#0B3D24] mt-2"
                            >
                              ТАПСЫРУ (20 СҰРАҚ)
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* WEEK 2 FINAL */}
                  {completedTopics.filter(id => week2Topics.some(w => w.id === id)).length === week2Topics.length && (
                    <div className="p-4 bg-[#39FF88]/30 border border-[#39FF88] rounded-2xl text-center">
                      <h4 className="font-black text-[#0B3D24] mb-2">2-АПТА ҚОРЫТЫНДЫ ТЕСТІ (50 СҰРАҚ)</h4>
                      <button
                        onClick={startWeek2Final}
                        className="glow-btn px-6 py-2.5 rounded-xl text-sm font-black text-[#0B3D24]"
                      >
                        {completedWeek2Final ? "ҚАЙТА ТАПСЫРУ" : "БАСТАУ (50 СҰРАҚ)"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CHARACTER SECTION */}
            {activeSection === 'character' && (
              <div className="glass-panel p-8 rounded-3xl text-center max-w-xl mx-auto">
                <h2 className="text-2xl font-black text-[#0B3D24] mb-1">{currentRank?.character}</h2>
                <p className="text-sm font-bold text-[#18C875] mb-2">
                  Rank: {currentRank?.rank} (Level {currentRank?.level})
                </p>
                <DnaCanvas3D label={currentRank?.character} height="h-64" />
                <div className="mt-4 text-left space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>XP Прогресс:</span>
                    <span>{userXp} XP</span>
                  </div>
                  <div className="w-full h-3 bg-[#E8FFF1] rounded-full overflow-hidden border border-[#39FF88]/50">
                    <div className="h-full bg-[#39FF88]" style={{ width: `${Math.min((userXp / 3000) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            )}

            {/* MISTAKES SECTION */}
            {activeSection === 'mistakes' && (
              <div className="glass-panel p-6 rounded-3xl">
                <h3 className="text-xl font-black text-[#0B3D24] mb-4">ҚАТЕМЕН ЖҰМЫС ({mistakes.length} Қате сұрақ)</h3>
                {mistakes.length === 0 ? (
                  <p className="text-center text-emerald-900 font-bold py-8">🎉 Қазірше ешқандай қате жоқ!</p>
                ) : (
                  <div className="space-y-4">
                    {mistakes.map((m, idx) => (
                      <div key={idx} className="p-4 bg-white/90 rounded-2xl border border-red-300">
                        <p className="font-bold text-[#0B3D24] mb-2">{m.question.question}</p>
                        <p className="text-xs text-red-600 font-bold">Сенің жауабың: {m.userAnswer}</p>
                        <p className="text-xs text-green-700 font-extrabold">Дұрыс жауап: {m.question.correctAnswer}</p>
                        <div className="mt-2 p-3 bg-[#E8FFF1] rounded-xl text-xs text-[#0B3D24]">
                          <strong>Түсіндірме:</strong> {m.question.explanation}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setMistakes([])}
                      className="glow-btn w-full py-3 rounded-2xl font-black text-[#0B3D24] mt-4 text-xs"
                    >
                      ҚАТЕЛЕРДІ ЖОЮ ВАЛИДАЦИЯСЫН АЯҚТАУ ✓
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MONTHLY TEST SECTION */}
            {activeSection === 'monthly' && (
              <div className="glass-panel p-8 rounded-3xl text-center max-w-xl mx-auto">
                <h3 className="text-2xl font-black text-[#0B3D24] mb-4">АЙЛЫҚ ТЕСТ (100 СҰРАҚ)</h3>
                {completedWeek2Final && mistakes.length === 0 ? (
                  <button
                    onClick={startMonthlyTest}
                    className="glow-btn px-8 py-4 rounded-full text-lg font-black text-[#0B3D24]"
                  >
                    АЙЛЫҚ ТЕСТТІ БАСТАУ (100 СҰРАҚ)
                  </button>
                ) : (
                  <p className="text-sm font-bold text-red-600">
                    🔒 Айлық тест ашылуы үшін: 2-апта қорытынды тесті тапсырылып, Қатемен жұмыс 100% аяқталуы тиіс.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}