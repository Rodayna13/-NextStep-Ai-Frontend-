import React, { useEffect, useMemo, useState } from 'react';
import { apiEndpoints } from '../../api/endpoints';

export default function TotalScore({ feedbacks = {}, questions = [], answers = {}, sessionId, accessToken, onClose }) {
  const [loading, setLoading] = useState(false);
  const [llmResult, setLlmResult] = useState(null);
  const [error, setError] = useState(null);

  // compute local aggregated score (average of available totalScore values)
  const localScore = useMemo(() => {
    const values = Object.values(feedbacks).map((f) => Number(f.totalScore || 0));
    if (!values.length) return null;
    const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    return Math.min(100, Math.max(0, avg));
  }, [feedbacks]);

  const depKey = useMemo(() => JSON.stringify({ sessionId, feedbacks, answers, questions, accessToken }), [sessionId, feedbacks, answers, questions, accessToken]);

  useEffect(() => {
    // Try to call an LLM backend summarization endpoint if available
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use central chat API to ask the model to generate an aggregated score and summary
        const url = apiEndpoints.chat;
        if (!url) {
          setLlmResult(null);
          return;
        }

        const systemMsg = "You are an assistant that ingests per-question feedback objects and returns an overall aggregated score (0-100), a short message summary, and detailed findings. Respond with JSON: { \"aggregatedScore\": number, \"message\": string, \"details\": string }. Do not include any surrounding markdown or explanation.";

        const prompt = `Session: ${sessionId || 'unknown'}\n
Please read the following per-question feedback objects and compute an aggregated overall score (0-100). Return JSON with keys: aggregatedScore, message, details.\n\nFeedbacks:\n${JSON.stringify(feedbacks, null, 2)}\n\nQuestions (for context):\n${JSON.stringify(questions, null, 2)}\n\nAnswers (for context):\n${JSON.stringify(answers, null, 2)}`;

        const payload = {
          prompt,
          systemMsg,
          temperature: 0.2,
        };

        const headers = { 'Content-Type': 'application/json' };
        if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const text = await res.text().catch(() => null);
          throw new Error(`LLM request failed: ${res.status} ${text || ''}`);
        }

        const data = await res.json();

        // The chat endpoint may return text; try to parse expected JSON fields
        let parsed = data;
        if (typeof data === 'object' && data !== null) {
          // some wrappers use data.response or data.message
          parsed = data.data || data.response || data.message || data;
        }
        if (typeof parsed === 'string') {
          try {
            parsed = JSON.parse(parsed);
          } catch {
            // try to extract JSON from text
            const match = parsed.match(/\{[\s\S]*\}/);
            if (match) parsed = JSON.parse(match[0]);
          }
        }

        // Expect object with aggregatedScore, message, details
        setLlmResult(parsed);
      } catch (err) {
        setError(err.message || 'Failed to fetch summary');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [depKey]);

  const scoreToShow = llmResult?.aggregatedScore ?? localScore ?? 0;

  return (
    <div className="sa-total-overlay" role="dialog" aria-modal="true">
      <div className="sa-total-card">
        <button className="sa-total-close" onClick={onClose}>×</button>
        <div className="sa-total-inner">
          <div className="sa-total-circle">
            <div className="sa-total-value">{scoreToShow}<span className="sa-total-max">/100</span></div>
          </div>
          <div className="sa-total-meta">
            <h3 className="sa-total-title">Overall Assessment</h3>
            <p className="sa-total-sub">{loading ? 'Analyzing with LLM...' : (llmResult?.message || (localScore ? 'Aggregated score from answered questions' : 'No score available'))}</p>
            {error && <p className="sa-error" style={{ marginTop: 8 }}>{error}</p>}
          </div>
        </div>

        {llmResult?.details && (
          <div className="sa-total-details">
            <h4>LLM Summary</h4>
            <p>{llmResult.details}</p>
          </div>
        )}

        <div className="sa-total-actions">
          <button className="sa-btn sa-btn-primary" onClick={() => { /* stub: could navigate to learning paths */ }}>Explore Learning Paths</button>
          <button className="sa-btn sa-btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
