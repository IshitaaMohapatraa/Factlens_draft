import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import FileUploadBox from '../components/FileUploadBox';
import Loader from '../components/Loader';
import ScoreCircle from '../components/ScoreCircle';
import Tag from '../components/Tag';
import { analyzeText, analyzeImage, analyzeURL } from '../services/api';
import { useToast } from '../context/ToastContext';
import './Analyze.css';

const getVerdictFromScore = (score) => {
  if (score >= 80) return 'True';
  if (score >= 60) return 'Mostly True';
  if (score >= 40) return 'Mostly Fake';
  return 'Fake';
};

const getVerdictVariant = (verdict) => {
  if (verdict === 'True') return 'success';
  if (verdict === 'Mostly True') return 'secondary';
  if (verdict === 'Mostly Fake') return 'warning';
  return 'danger';
};

const Analyze = () => {
  const [inputText, setInputText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const { showError } = useToast();

  const handleImageSelect = (file) => {
    setImageFile(file);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim() && !imageFile) {
      setError('Please paste a claim or upload an image.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('[Analyze] Starting analysis', {
        hasImage: !!imageFile,
        rawInput: inputText,
      });

      let response;
      if (imageFile) {
        response = await analyzeImage(imageFile);
      } else if (inputText.trim().toLowerCase().startsWith('http')) {
        response = await analyzeURL(inputText.trim());
      } else {
        response = await analyzeText(inputText.trim());
      }

      console.log('[Analyze] Response received', response);
      setResult(response.data);
    } catch (err) {
      let message = err?.message || 'Analysis failed. Please try again.';

      // Normalize common network/CORS-style messages
      if (message.toLowerCase().includes('network error')) {
        message =
          'Could not reach the analysis service. Please check that the backend is running and your network connection is stable.';
      }

      setError(message);
      showError(message);
      console.error('Analyze network/processing error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const score = result?.credibilityScore ?? 0;
  const verdict = getVerdictFromScore(score);
  const verdictVariant = getVerdictVariant(verdict);

  const summaryPoints = result
    ? [
        `Verdict: ${verdict}`,
        `Credibility score: ${score}/100`,
        result.riskLevel ? `Risk level: ${result.riskLevel}` : null,
        result.explanation?.whyFlagged
          ? `Why: ${result.explanation.whyFlagged}`
          : null,
      ].filter(Boolean)
    : [];

  const supportingEvidence = result?.explanation?.supportingEvidence || [];

  const isAnalyzeDisabled =
    isLoading || (!inputText.trim() && !imageFile);

  return (
    <div className="analyze">
      {/* Hero / Input Block */}
      <div className="analyze-header">
        <h1 className="analyze-title">Check if a claim is Fact or Fake</h1>
        <p className="analyze-subtitle">
          Paste a news link, type a claim, or upload an image to get a deep analysis powered by FactLens.
        </p>
      </div>

      <div className="analyze-main">
        <Card className="analyze-input-card">
          <div className="fact-input-shell">
            <textarea
              className="fact-input-textarea"
              placeholder="Check a fact by typing or pasting here..."
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div className="analyze-upload-block">
            <FileUploadBox
              onFileSelect={handleImageSelect}
              accept="image/*"
            />
            {imageFile && (
              <p className="analyze-upload-caption">
                Attached: <strong>{imageFile.name}</strong>
              </p>
            )}
          </div>

          <div className="analyze-button-row">
            <Button
              variant="primary"
              size="large"
              onClick={handleAnalyze}
              disabled={isAnalyzeDisabled}
            >
              {isLoading ? 'Analyzing…' : 'Analyze Claim'}
            </Button>
          </div>

          {error && <p className="analyze-error-text">{error}</p>}

          {isLoading && (
            <div className="analyze-loading-inline">
              <Loader size="small" message="Running multi-modal checks..." />
            </div>
          )}
        </Card>

        {/* Result Panel */}
        {result && !isLoading && (
          <div className="analyze-results">
            <Card className="analyze-result-summary-card">
              <div className="analyze-result-header">
                <Tag size="large" variant={verdictVariant}>
                  {verdict}
                </Tag>
                <div className="analyze-score-block">
                  <span className="analyze-score-label">Credibility</span>
                  <div className="analyze-score-visual">
                    <ScoreCircle score={score} size={120} />
                  </div>
                </div>
              </div>
              <div className="analyze-summary-section">
                <h2 className="analyze-section-title">Summary</h2>
                <ul className="analyze-summary-list">
                  {summaryPoints.map((point, idx) => (
                    <li key={idx} className="analyze-summary-item">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            {supportingEvidence.length > 0 && (
              <Card className="analyze-evidence-card">
                <h2 className="analyze-section-title">Key Evidence</h2>
                <ul className="analyze-evidence-list">
                  {supportingEvidence.slice(0, 5).map((evidence, idx) => (
                    <li key={idx} className="analyze-evidence-item">
                      {evidence}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analyze;

