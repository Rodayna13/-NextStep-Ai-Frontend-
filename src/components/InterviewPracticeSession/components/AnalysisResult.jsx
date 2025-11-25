import PropTypes from 'prop-types';
import './AnalysisResult.css';

/**
 * Analysis result modal component with Arabic/English support
 */
const AnalysisResult = ({ analysis, onClose }) => {
    if (!analysis) return null;

    const { overallScore, breakdown, strengths, areasForImprovement, detailedFeedback, recommendations } = analysis;

    // Detect if content is Arabic
    const isArabic = /[\u0600-\u06FF]/.test(detailedFeedback || '');
    const textDirection = isArabic ? 'rtl' : 'ltr';

    const getScoreColor = (score) => {
        if (score >= 80) return '#22c55e';
        if (score >= 60) return '#eab308';
        return '#ef4444';
    };

    // Labels in both languages
    const labels = isArabic ? {
        title: 'تحليل أداء المقابلة',
        overallScore: 'الدرجة الإجمالية',
        breakdown: 'تفصيل الأداء',
        detailedFeedback: 'ملاحظات تفصيلية',
        strengths: 'نقاط القوة',
        improvements: 'مجالات التحسين',
        recommendations: 'التوصيات',
        close: 'إغلاق',
        communicationQuality: 'جودة التواصل',
        engagementLevel: 'مستوى المشاركة',
        professionalism: 'الاحترافية',
        responseRelevance: 'صلة الرد بالموضوع'
    } : {
        title: 'Interview Performance Analysis',
        overallScore: 'Overall Score',
        breakdown: 'Performance Breakdown',
        detailedFeedback: 'Detailed Feedback',
        strengths: 'Strengths',
        improvements: 'Areas for Improvement',
        recommendations: 'Recommendations',
        close: 'Close',
        communicationQuality: 'Communication Quality',
        engagementLevel: 'Engagement Level',
        professionalism: 'Professionalism',
        responseRelevance: 'Response Relevance'
    };

    const breakdownLabels = {
        communicationQuality: labels.communicationQuality,
        engagementLevel: labels.engagementLevel,
        professionalism: labels.professionalism,
        responseRelevance: labels.responseRelevance
    };

    return (
        <div className="analysis-modal-overlay" onClick={onClose}>
            <div className="analysis-modal" onClick={(e) => e.stopPropagation()} dir={textDirection}>
                <div className="analysis-header">
                    <h2>{labels.title}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="analysis-content">
                    {/* Overall Score */}
                    <div className="score-section">
                        <div className="overall-score" style={{ borderColor: getScoreColor(overallScore) }}>
                            <div className="score-value" style={{ color: getScoreColor(overallScore) }}>
                                {overallScore}
                            </div>
                            <div className="score-label">{labels.overallScore}</div>
                        </div>
                    </div>

                    {/* Breakdown */}
                    <div className="breakdown-section">
                        <h3>{labels.breakdown}</h3>
                        <div className="breakdown-grid">
                            {Object.entries(breakdown).map(([key, value]) => (
                                <div key={key} className="breakdown-item">
                                    <div className="breakdown-label">
                                        {breakdownLabels[key] || key.replace(/([A-Z])/g, ' $1').trim()}
                                    </div>
                                    <div className="breakdown-bar">
                                        <div 
                                            className="breakdown-fill" 
                                            style={{ 
                                                width: `${(value / 10) * 100}%`,
                                                backgroundColor: getScoreColor(value * 10),
                                                [isArabic ? 'marginRight' : 'marginLeft']: 0
                                            }}
                                        />
                                    </div>
                                    <div className="breakdown-value">{value}/10</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Detailed Feedback */}
                    <div className="feedback-section">
                        <h3>{labels.detailedFeedback}</h3>
                        <p>{detailedFeedback}</p>
                    </div>

                    {/* Strengths */}
                    <div className="list-section strengths">
                        <h3>
                            <span className="material-symbols-outlined">check_circle</span>
                            {labels.strengths}
                        </h3>
                        <ul>
                            {strengths.map((strength, idx) => (
                                <li key={idx}>{strength}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Areas for Improvement */}
                    <div className="list-section improvements">
                        <h3>
                            <span className="material-symbols-outlined">info</span>
                            {labels.improvements}
                        </h3>
                        <ul>
                            {areasForImprovement.map((area, idx) => (
                                <li key={idx}>{area}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Recommendations */}
                    <div className="list-section recommendations">
                        <h3>
                            <span className="material-symbols-outlined">lightbulb</span>
                            {labels.recommendations}
                        </h3>
                        <ul>
                            {recommendations.map((rec, idx) => (
                                <li key={idx}>{rec}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="analysis-footer">
                    <button className="primary-btn" onClick={onClose}>
                        {labels.close}
                    </button>
                </div>
            </div>
        </div>
    );
};

AnalysisResult.propTypes = {
    analysis: PropTypes.shape({
        overallScore: PropTypes.number.isRequired,
        breakdown: PropTypes.object.isRequired,
        strengths: PropTypes.array.isRequired,
        areasForImprovement: PropTypes.array.isRequired,
        detailedFeedback: PropTypes.string.isRequired,
        recommendations: PropTypes.array.isRequired
    }),
    onClose: PropTypes.func.isRequired
};

export default AnalysisResult;
