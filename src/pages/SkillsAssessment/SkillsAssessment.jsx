import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./SkillsAssessment.css";
import TotalScore from "./TotalScore";
export default function SkillsAssessment() {
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedbacks, setFeedbacks] = useState({});
  const [error, setError] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { accessToken } = useAuth();
  const [showTotal, setShowTotal] = useState(false);

  const startAssessment = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = { "Content-Type": "application/json" };
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

      const res = await fetch("/api/SkillsAssessment/start-skills-assessment", {
        method: "POST",
        headers,
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      if (data.success) {
        setSessionId(data.sessionId || null);
        setQuestions(data.questions || []);
        setStarted(true);
        setCurrentIndex(0);
        setAnswers({});
      } else {
        throw new Error("Server returned unsuccessful response");
      }
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex] || null;

  const getFeedbackForQuestion = (q) => {
    if (!q) return null;
    const candidates = [q.id, q.questionNumber, String(q.id), String(q.questionNumber)];
    for (const k of candidates) {
      if (k != null && feedbacks[k]) return feedbacks[k];
    }
    return null;
  };

  const setAnswerForCurrent = (value) => {
    if (!currentQuestion) return;
    setAnswers((s) => ({ ...s, [currentQuestion.id]: value }));
  };

  const submitCurrentAnswer = async () => {
    if (!currentQuestion) return null;
    const answerText = answers[currentQuestion.id] || "";
    setSubmitting(true);
    setError(null);
    try {
      const headers = { "Content-Type": "application/json" };
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

      const body = {
        sessionId,
        questionNumber: currentQuestion.id,
        answer: answerText,
      };

      const res = await fetch("/api/SkillsAssessment/submit-answer", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Submit failed: ${res.status}`);
      const data = await res.json();
      if (data.success && data.score) {
        const score = data.score;
        const key = score.questionNumber ?? currentQuestion.id;
        setFeedbacks((s) => ({ ...s, [key]: score }));
        return score;
      }
      return data;
    } catch (err) {
      setError(err.message || "Submit error");
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    try {
      await submitCurrentAnswer();
    } catch (e) {
      // stop navigation on submit error
      setError(e.message || "Submit error");
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  return (
    <div className="sa-page">
      <main className="sa-container">
        {!started && !loading && (
          <div className="sa-card">
            <h1 className="sa-title">Skills Assessment Quiz</h1>
            <p className="sa-note">This assessment will evaluate your skills. Click Start to begin.</p>
            <div className="sa-row">
              <button onClick={startAssessment} className="sa-btn sa-btn-primary">Start</button>
              <button onClick={() => {}} className="sa-btn sa-btn-ghost">Cancel</button>
            </div>
            {error && <p className="sa-error">{error}</p>}
          </div>
        )}

        {loading && (
          <div className="sa-card">
            <p>Starting assessment…</p>
          </div>
        )}

        {started && !completed && currentQuestion && (
          <div>
            <div className="sa-progress-meta">
              <div>Question {currentIndex + 1} of {questions.length}</div>
            </div>
            <div className="sa-progress-bar" aria-hidden>
              <div className="sa-progress-fill" style={{ width: `${((currentIndex+1)/questions.length)*100}%` }} />
            </div>

            <div className="sa-question-card">
              <div className="sa-chips">
                <div className="sa-chip sa-chip-primary"><span>{currentQuestion.skill}</span></div>
                <div className="sa-chip sa-chip-difficulty">Difficulty: {currentQuestion.difficulty}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h1 className="sa-question-title">{currentQuestion.question}</h1>
                <button aria-label="Get help with this question" className="sa-help-btn">?</button>
              </div>

              <div className="sa-keypoints">
                {currentQuestion.expectedKeyPoints && currentQuestion.expectedKeyPoints.map((p, idx) => (
                  <div key={idx} className="sa-keypoint">{p}</div>
                ))}
              </div>

              <div>
                <label className="sa-answer-label">Your Answer</label>
                <textarea
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => setAnswerForCurrent(e.target.value)}
                  className="sa-textarea"
                  placeholder="Write your answer here..."
                  rows={6}
                />
              </div>

              {/* feedback from submission (if any) */}
              {(() => {
                const fb = getFeedbackForQuestion(currentQuestion);
                if (!fb) return null;
                return (
                  <div className="sa-answer-block sa-feedback-container" style={{ marginTop: 12 }}>
                    <p style={{ fontWeight: 700, marginBottom: 6 }}>Feedback</p>
                    <p style={{ marginBottom: 8 }}>{fb.feedback}</p>

                    <div style={{ display: 'flex', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                      <div style={{ background: 'rgba(3, 105, 161, 0.06)', padding: '6px 10px', borderRadius: 8 }}>
                        <strong>Accuracy:</strong> {fb.accuracyScore ?? '-'}
                      </div>
                      <div style={{ background: 'rgba(3, 105, 161, 0.06)', padding: '6px 10px', borderRadius: 8 }}>
                        <strong>Completeness:</strong> {fb.completenessScore ?? '-'}
                      </div>
                      <div style={{ background: 'rgba(3, 105, 161, 0.06)', padding: '6px 10px', borderRadius: 8 }}>
                        <strong>Depth:</strong> {fb.deepUnderstandingScore ?? '-'}
                      </div>
                      <div style={{ background: 'linear-gradient(90deg,#137fec,#0b67c9)', color: '#fff', padding: '6px 10px', borderRadius: 8 }}>
                        <strong>Total:</strong> {fb.totalScore ?? '-'}
                      </div>
                    </div>

                    {fb.strengths && fb.strengths.length > 0 && (
                      <>
                        <p style={{ fontWeight: 700, marginBottom: 6 }}>Strengths</p>
                        <ul style={{ margin: 0, paddingLeft: 18, marginBottom: 8 }}>
                          {fb.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </>
                    )}

                    <p style={{ fontWeight: 700, marginBottom: 6 }}>Areas For Improvement</p>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {(fb.areasForImprovement || []).map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                );
              })()}
            </div>

            <div className="sa-actions">
              <button onClick={handleBack} className="sa-back">Back</button>
              <button
                onClick={handleNext}
                className="sa-next"
                disabled={submitting}
                aria-busy={submitting}
              >
                {submitting ? 'Submitting...' : (currentIndex < questions.length - 1 ? 'Next' : 'Finish')}
              </button>
            </div>
          </div>
        )}

        {completed && (
          <div className="sa-finished">
            <h2 className="sa-title">Assessment finished</h2>
            <p className="sa-note">Session ID: <span className="sa-session">{sessionId}</span></p>
            <div className="sa-summary-grid">
              {questions.map((q) => (
                <div key={q.id} className="sa-answer-block">
                  <p style={{ fontWeight:700 }}>{q.question}</p>
                  <p style={{ marginTop:8 }}>{answers[q.id] || '(no answer)'}</p>
                  {(() => {
                    const fb = getFeedbackForQuestion(q);
                    if (!fb) return null;
                    return (
                      <div style={{ marginTop: 10 }}>
                        <p style={{ fontWeight:700 }}>Feedback summary</p>
                        <p style={{ marginTop:6 }}>{fb.feedback}</p>
                        <div style={{ display:'flex', gap:8, marginTop:8, flexWrap:'wrap' }}>
                          <span style={{ background:'#e6f0ff', padding:'6px 8px', borderRadius:8 }}>Accuracy: {fb.accuracyScore ?? '-'}</span>
                          <span style={{ background:'#e6f0ff', padding:'6px 8px', borderRadius:8 }}>Completeness: {fb.completenessScore ?? '-'}</span>
                          <span style={{ background:'#e6f0ff', padding:'6px 8px', borderRadius:8 }}>Depth: {fb.deepUnderstandingScore ?? '-'}</span>
                          <span style={{ background:'#137fec', color:'#fff', padding:'6px 8px', borderRadius:8 }}>Total: {fb.totalScore ?? '-'}</span>
                        </div>
                        {fb.areasForImprovement && fb.areasForImprovement.length > 0 && (
                          <>
                            <p style={{ fontWeight:700, marginTop:10 }}>Areas For Improvement</p>
                            <ul style={{ margin:0, paddingLeft:18 }}>
                              {fb.areasForImprovement.map((a,i)=>(<li key={i}>{a}</li>))}
                            </ul>
                          </>
                        )}
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18, gap: 12 }}>
              <button className="sa-btn sa-btn-primary" onClick={() => setShowTotal(true)}>View Total Score</button>
              <button className="sa-btn sa-btn-ghost" onClick={() => { /* placeholder: go to dashboard */ }}>Go to Dashboard</button>
            </div>
            {showTotal && (
              <TotalScore
                feedbacks={feedbacks}
                questions={questions}
                answers={answers}
                sessionId={sessionId}
                accessToken={accessToken}
                onClose={() => setShowTotal(false)}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
