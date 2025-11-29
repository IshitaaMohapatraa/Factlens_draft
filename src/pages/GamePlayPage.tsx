import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import './GamePlayPage.css';

type Question = {
  text: string;
  answer: 'fact' | 'fake';
  explanation?: string;
};

const QUESTIONS: Question[] = [
  {
    text: 'A single viral tweet can reduce vaccine uptake in a city by more than 10%.',
    answer: 'fact',
    explanation: 'Studies show misleading viral posts can measurably impact health decisions.',
  },
  {
    text: 'Deepfake videos are always easy to spot if you look closely at the eyes and mouth.',
    answer: 'fake',
    explanation: 'Some deepfakes are extremely polished; relying on one visual cue is risky.',
  },
  {
    text: 'Images shared in private messaging apps cannot be manipulated or edited.',
    answer: 'fake',
    explanation: 'Any image can be edited before sharing, regardless of where it is posted.',
  },
  {
    text: 'Fact-checking a claim before sharing it can cut the spread of misinformation in your circles by half.',
    answer: 'fact',
    explanation: 'Even small pauses before sharing can significantly reduce cascade effects.',
  },
  {
    text: 'If a headline mentions a scientific “breakthrough,” it is guaranteed to be peer reviewed.',
    answer: 'fake',
    explanation: 'Headlines often exaggerate; many “breakthroughs” are early-stage or unverified.',
  },
];

const XP_PER_CORRECT = 5;
const STREAK_BONUS = 3;

const GamePlayPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentXp, setCurrentXp] = useState(30);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [lastAnswerType, setLastAnswerType] = useState<'fact' | 'fake' | null>(null);
  const [lastExplanation, setLastExplanation] = useState<string | undefined>();

  const cardControls = useAnimation();

  const currentQuestion = useMemo(
    () => QUESTIONS[currentIndex % QUESTIONS.length],
    [currentIndex]
  );

  const leagueLabel = useMemo(() => {
    if (currentXp >= 80) return 'League: Lv 3 – Myth Buster';
    if (currentXp >= 50) return 'League: Lv 2 – Signal Seeker';
    return 'League: Lv 1 – Curious Reader';
  }, [currentXp]);

  const handleExit = () => {
    navigate('/game');
  };

  const handleDecision = async (direction: 'left' | 'right') => {
    const chosen: 'fact' | 'fake' = direction === 'right' ? 'fact' : 'fake';
    const isCorrect = chosen === currentQuestion.answer;

    const baseXp = isCorrect ? XP_PER_CORRECT : 0;
    const bonus = isCorrect && streak >= 2 ? STREAK_BONUS : 0;

    if (isCorrect) {
      setCurrentXp((prev) => prev + baseXp + bonus);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }

    setLastCorrect(isCorrect);
    setLastAnswerType(currentQuestion.answer);
    setLastExplanation(currentQuestion.explanation);

    const targetX = direction === 'right' ? 600 : -600;
    const rotate = direction === 'right' ? 18 : -18;

    await cardControls.start({
      x: targetX,
      rotate,
      opacity: 0,
      transition: { duration: 0.35, ease: 'easeIn' },
    });

    setShowResult(true);
  };

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    const threshold = 120;
    if (info.offset.x > threshold) {
      handleDecision('right');
    } else if (info.offset.x < -threshold) {
      handleDecision('left');
    } else {
      cardControls.start({ x: 0, rotate: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } });
    }
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setCurrentIndex((prev) => prev + 1);
    cardControls.set({ x: 0, rotate: 0, opacity: 1 });
  };

  const hintLabel = (side: 'left' | 'right') => {
    if (side === 'right') return 'Swipe right for FACT';
    return 'Swipe left for FAKE';
  };

  return (
    <div className="gameplay-page">
      {/* Top Game Status Bar */}
      <section className="gameplay-status-bar">
        <div className="gameplay-status-pill">
          <span className="gameplay-status-label">XP</span>
          <span className="gameplay-status-value">{currentXp} XP</span>
        </div>
        <div className="gameplay-league">{leagueLabel}</div>
        <button className="gameplay-exit" onClick={handleExit}>
          Exit
        </button>
      </section>

      {/* Swipeable Card Area */}
      <section className="gameplay-main">
        <div className="gameplay-card-shell">
          <motion.div
            className="gameplay-card"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            whileHover={{ scale: 1.02 }}
            style={{ touchAction: 'pan-y' }}
            animate={cardControls}
          >
            <div className="gameplay-card-header">
              <span className="gameplay-card-chip">Question {currentIndex + 1}</span>
              {streak > 1 && (
                <span className="gameplay-streak">
                  🔥 {streak} streak
                </span>
              )}
            </div>
            <p className="gameplay-card-text">{currentQuestion.text}</p>

            <div className="gameplay-card-hints">
              <div className="gameplay-hint gameplay-hint-left">{hintLabel('left')}</div>
              <div className="gameplay-hint gameplay-hint-right">{hintLabel('right')}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Result Overlay */}
      {showResult && (
        <div className="gameplay-overlay">
          <motion.div
            className="gameplay-result-modal"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="gameplay-result-header">
              <span className={`gameplay-result-tag ${lastCorrect ? 'correct' : 'incorrect'}`}>
                {lastCorrect ? 'Correct' : 'Not quite'}
              </span>
              <div className="gameplay-result-title">
                {lastCorrect
                  ? lastAnswerType === 'fact'
                    ? `It's a fact! +${XP_PER_CORRECT} XP`
                    : `It's fake! +${XP_PER_CORRECT} XP`
                  : `This one was actually ${lastAnswerType === 'fact' ? 'a fact' : 'fake'}.`}
              </div>
            </div>
            {lastExplanation && <p className="gameplay-result-body">{lastExplanation}</p>}
            <button className="gameplay-next-button" onClick={handleNextQuestion}>
              Next question
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default GamePlayPage;


