import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './GameLandingPage.css';

const featureCards = [
  {
    title: 'Play & Earn Vouchers',
    description: 'Answer streaks and perfect rounds translate into XP that you can redeem for rewards.',
  },
  {
    title: 'Climb the Leaderboard',
    description: 'Compete with other FactLens players and unlock fun fact drops as you level up.',
  },
  {
    title: 'Sharpen Your Radar',
    description: 'Train your intuition to spot misleading headlines, deepfakes, and cherry-picked stats.',
  },
];

const GameLandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handlePlayNow = () => {
    navigate('/game/play');
  };

  return (
    <div className="game-landing">
      {/* Hero Section */}
      <section className="game-hero">
        <div className="game-hero-overlay" />
        <div className="game-hero-content">
          <motion.h1
            className="game-hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Fact or Fake? – Turn Every Scroll into a Challenge
          </motion.h1>

          <motion.p
            className="game-hero-subtitle"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
          >
            Swipe through viral posts, decide if they&apos;re facts or fakes, and earn XP for every right call.
            Climb leagues, unlock rewards, and train your intuition against everyday misinformation.
          </motion.p>

          <motion.div
            className="game-hero-cta"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <button className="game-hero-button" onClick={handlePlayNow}>
              Play Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* Swipeable Feature Flashcards */}
      <section className="game-feature-cards" aria-label="Game features">
        <h2 className="game-section-title">Why play Fact or Fake?</h2>
        <div className="game-feature-scroll">
          <div className="game-feature-row">
            {featureCards.map((card, index) => (
              <motion.article
                key={card.title}
                className="game-feature-card"
                whileHover={{ y: -6 }}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div className="game-feature-pill">Game Feature #{index + 1}</div>
                <h3 className="game-feature-title">{card.title}</h3>
                <p className="game-feature-description">{card.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Play & Earn Explanation Section */}
      <section className="game-play-earn">
        <div className="game-play-earn-inner">
          <div className="game-play-earn-visual">
            <div className="game-play-earn-badge">
              <span className="game-play-earn-label">XP Flow</span>
              <span className="game-play-earn-value">+5 XP</span>
            </div>
            <div className="game-play-earn-illustration">
              <div className="game-play-earn-orbit game-play-earn-orbit-outer" />
              <div className="game-play-earn-orbit game-play-earn-orbit-inner" />
              <div className="game-play-earn-avatar">🧠</div>
            </div>
          </div>

          <div className="game-play-earn-copy">
            <h2 className="game-section-title">Play, earn, and level up your intuition</h2>
            <p className="game-body-text">
              Every time you judge a card correctly, you earn XP. Streaks and combos give you bonus points,
              turning your scrolling habit into a daily training ground for critical thinking.
            </p>
            <p className="game-body-text">
              As your XP climbs, you progress through leagues—from Curious Reader to Misinformation Hunter and
              beyond. Higher leagues unlock themed decks, bonus challenges, and surprise fact drops.
            </p>
            <p className="game-body-text">
              Your XP doesn&apos;t just sit there. In upcoming updates, you&apos;ll be able to redeem it for
              perks and vouchers, making truth-seeking both rewarding and fun.
            </p>
            <button className="game-secondary-button" onClick={handlePlayNow}>
              Jump into the arena
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GameLandingPage;


