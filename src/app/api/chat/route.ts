import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { text } = await request.json();

        if (!text || typeof text !== 'string') {
            return NextResponse.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.CLAUDE_API_KEY;

        if (!apiKey || apiKey === 'your_claude_api_key_here') {
            // Fallback to mock for development
            return NextResponse.json({
                text: "네, 날씨가 정말 좋아서 공원에 다녀왔어요. 우리 아들도 밥 잘 챙겨 먹고 있지?"
            });
        }

        const systemInstruction = '당신은 자녀의 목소리로 부모님과 대화하는 따뜻하고 친근한 AI 어시스턴트입니다. 부모님께 존중하고 배려하는 말투로 자연스럽게 대화하세요. 응답은 간결하고 따뜻하게 작성해주세요.';

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
                        max_tokens: 200,
                        temperature: 0.7,
                        system: systemInstruction,
                        messages: [
                            {
                                role: 'user',
                                content: text
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
                const textResponse = data.content?.[0]?.text || '';
                
                if (!textResponse) {
                    lastError = new Error(`No response from Claude API (${modelName})`);
                    continue;
                }

                return NextResponse.json({ text: textResponse });
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
        console.error('❌ Chat API error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error', text: "죄송해요, 잠시 문제가 생겼어요. 다시 말씀해주실 수 있나요?" },
            { status: 500 }
        );
    }
}

