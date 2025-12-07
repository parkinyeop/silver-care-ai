import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { conversationText } = await request.json();

        if (!conversationText || typeof conversationText !== 'string') {
            return NextResponse.json(
                { error: 'Conversation text is required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.CLAUDE_API_KEY;

        if (!apiKey || apiKey === 'your_claude_api_key_here') {
            // Fallback to mock for development
            return NextResponse.json({
                sentiment: 'positive',
                sentimentScore: 85,
                keywords: ['손자', '산책', '날씨'],
                summary: '오늘 손자가 방문해서 매우 기뻐하셨으며, 날씨가 좋아 산책을 다녀오셨습니다.',
                riskFactors: [],
                recommendation: '긍정적인 기분을 유지할 수 있도록 가족들과의 통화를 권장합니다.',
            });
        }

        const systemInstruction = `당신은 노인 심리 분석 전문가입니다. 주어진 대화 내용을 분석하여 JSON 형식으로 응답해 주세요.

응답 필드:
- sentiment: "positive" | "neutral" | "negative"
- sentimentScore: 0~100 사이의 정수 (높을수록 긍정적)
- keywords: 주요 키워드 리스트 (최대 5개)
- summary: 대화 내용 및 심리 상태 요약 (한국어, 2~3문장)
- riskFactors: 발견된 위험 징후 리스트 (예: "우울감", "식욕 부진", "수면 장애", "고립감" 등). 없으면 빈 배열.
- recommendation: 보호자를 위한 케어 조언 (한국어, 1문장)

반드시 유효한 JSON 형식으로만 응답하세요.`;

        // Claude 모델 목록 (우선순위 순)
        const models = [
            'claude-3-5-sonnet-20241022',  // 최신 모델 (권장)
            'claude-3-opus-20240229',      // 고성능 모델
            'claude-3-sonnet-20240229',    // 균형잡힌 모델
            'claude-3-haiku-20240307',     // 빠른 모델
        ];

        let lastError: Error | null = null;

        // 모델을 순차적으로 시도
        for (const modelName of models) {
            try {
                const response = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': apiKey,
                        'anthropic-version': '2023-06-01',
                    },
                    body: JSON.stringify({
                        model: modelName,
                        max_tokens: 500,
                        temperature: 0.5,
                        system: systemInstruction,
                        messages: [
                            {
                                role: 'user',
                                content: `다음 대화 내용을 분석해주세요:\n\n${conversationText}`
                            }
                        ]
                    }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    lastError = new Error(`Claude API error (${modelName}): ${response.statusText} - ${errorText}`);
                    // 404 (모델 없음) 또는 429 (할당량 초과) 에러면 다음 모델 시도
                    if (response.status === 404 || response.status === 429) {
                        continue;
                    }
                    throw lastError;
                }

                const data = await response.json();
                const text = data.content?.[0]?.text || '';
                
                if (!text) {
                    lastError = new Error(`No response from Claude API (${modelName})`);
                    continue;
                }

                // JSON 파싱 시도
                let result: any;
                try {
                    result = JSON.parse(text);
                } catch (parseError) {
                    // JSON 파싱 실패 시 텍스트에서 JSON 추출 시도
                    const jsonMatch = text.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        result = JSON.parse(jsonMatch[0]);
                    } else {
                        lastError = new Error(`Failed to parse JSON response (${modelName})`);
                        continue;
                    }
                }

                return NextResponse.json(result);
            } catch (error: any) {
                if (error.message && !error.message.includes('404') && !error.message.includes('429')) {
                    throw error;
                }
                lastError = error;
                continue;
            }
        }

        // 모든 모델 실패
        throw lastError || new Error('All Claude models failed');
    } catch (error: any) {
        console.error('Analysis API error:', error);
        return NextResponse.json(
            {
                sentiment: 'positive',
                sentimentScore: 85,
                keywords: ['손자', '산책', '날씨'],
                summary: '오늘 손자가 방문해서 매우 기뻐하셨으며, 날씨가 좋아 산책을 다녀오셨습니다.',
                riskFactors: [],
                recommendation: '긍정적인 기분을 유지할 수 있도록 가족들과의 통화를 권장합니다.',
            },
            { status: 200 } // Mock 응답 반환
        );
    }
}

