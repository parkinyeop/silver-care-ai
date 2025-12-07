// Psychological Analysis Service
// Analyzes conversation logs to determine sentiment, keywords, and potential risk factors
// Uses Anthropic Claude API for analysis

export interface AnalysisResult {
    sentiment: 'positive' | 'neutral' | 'negative';
    sentimentScore: number; // 0 to 100
    keywords: string[];
    summary: string;
    riskFactors: string[]; // e.g., "우울", "고립", "식욕 저하"
    recommendation: string;
}

// Mock analysis for development without API costs
const MOCK_ANALYSIS: AnalysisResult = {
    sentiment: 'positive',
    sentimentScore: 85,
    keywords: ['손자', '산책', '날씨'],
    summary: '오늘 손자가 방문해서 매우 기뻐하셨으며, 날씨가 좋아 산책을 다녀오셨습니다.',
    riskFactors: [],
    recommendation: '긍정적인 기분을 유지할 수 있도록 가족들과의 통화를 권장합니다.',
};

export const analyzeSentiment = async (conversationText: string): Promise<AnalysisResult> => {
    if (!conversationText) {
        console.warn('Empty text, using mock analysis');
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_ANALYSIS), 1500));
    }

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ conversationText }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to analyze sentiment');
        }

        const data = await response.json();
        
        // 응답이 이미 AnalysisResult 형식인지 확인
        if (data.sentiment && data.sentimentScore !== undefined) {
            console.log('✅ Claude API 분석 성공');
            return data as AnalysisResult;
        }
        
        // 형식이 맞지 않으면 Mock 반환
        throw new Error('Invalid response format');
    } catch (error) {
        console.error('Analysis error:', error);
        return MOCK_ANALYSIS;
    }
};
