'use client';

import { useState, useEffect } from 'react';
import { analyzeSentiment, AnalysisResult } from '@/services/analysis';
import Link from 'next/link';

export default function ReportPage() {
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);

    // Mock conversation for demo
    const mockConversation = `
    부모: 오늘 날씨가 참 좋네. 꽃이 많이 폈더라.
    자녀(AI): 네, 정말 따뜻하고 맑은 날씨였어요. 산책은 좀 하셨어요?
    부모: 응, 오전에 잠깐 나갔다 왔어. 근데 철수 너는 언제 오니? 좀 보고 싶네.
    자녀(AI): 저도 많이 보고 싶어요. 이번 주말에 꼭 찾아뵐게요. 밥은 잘 챙겨 드셨나요?
    부모: 입맛이 썩 없어서 대충 먹었다. 혼자 먹으려니 맛이 없어.
  `;

    const runAnalysis = async () => {
        setLoading(true);
        try {
            const result = await analyzeSentiment(mockConversation);
            setAnalysis(result);
        } catch (error) {
            console.error('Failed to analyze:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <header className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    🧠 마음 케어 리포트
                </h1>
                <Link href="/" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:opacity-80 transition-opacity">
                    ← 메인으로
                </Link>
            </header>

            <main className="max-w-4xl mx-auto space-y-8">

                {/* Input Section (Demo) */}
                {!analysis && !loading && (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 text-center">
                        <h2 className="text-xl font-semibold mb-4">최근 대화 분석하기</h2>
                        <p className="text-gray-500 mb-6">최근 나누신 대화를 바탕으로 어르신의 심리 상태를 분석합니다.</p>
                        <button
                            onClick={runAnalysis}
                            className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                        >
                            분석 리포트 생성
                        </button>
                        <div className="mt-8 text-left bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-sm text-gray-400">
                            <p className="font-bold mb-2">분석할 대화 예시:</p>
                            <pre className="whitespace-pre-wrap font-sans">{mockConversation}</pre>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-lg animate-pulse">대화 내용을 깊이 있게 분석하고 있습니다...</p>
                    </div>
                )}

                {/* Result UI */}
                {analysis && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

                        {/* 1. Overall Score */}
                        <div className={`p-8 rounded-3xl text-white shadow-xl ${analysis.sentimentScore >= 70 ? 'bg-gradient-to-br from-green-500 to-emerald-700' :
                                analysis.sentimentScore >= 40 ? 'bg-gradient-to-br from-yellow-500 to-orange-600' :
                                    'bg-gradient-to-br from-red-500 to-rose-700'
                            }`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-medium opacity-90 mb-1">오늘의 마음 날씨</h3>
                                    <p className="text-4xl font-bold">
                                        {analysis.sentimentScore >= 70 ? '맑음 ☀️' :
                                            analysis.sentimentScore >= 40 ? '구름 조금 ⛅' :
                                                '흐림 🌧️'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm opacity-80">긍정 지수</p>
                                    <p className="text-5xl font-black tracking-tight">{analysis.sentimentScore}<span className="text-2xl font-normal opacity-70">/100</span></p>
                                </div>
                            </div>
                        </div>

                        {/* 2. Summary & Keywords */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    📝 대화 요약
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {analysis.summary}
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    🔑 주요 키워드
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {analysis.keywords.map((keyword, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full text-sm">
                                            #{keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3. Risk Factors (Only show if exists) */}
                        {analysis.riskFactors.length > 0 && (
                            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-3xl border border-red-100 dark:border-red-900/50">
                                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                                    ⚠️ 주의가 필요한 신호가 감지되었습니다
                                </h3>
                                <ul className="list-disc list-inside text-red-700 dark:text-red-300">
                                    {analysis.riskFactors.map((factor, i) => (
                                        <li key={i}>{factor}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* 4. Recommendation */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/50">
                            <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                                💡 보호자를 위한 제안
                            </h3>
                            <p className="text-blue-800 dark:text-blue-200">
                                {analysis.recommendation}
                            </p>
                        </div>

                        <button
                            onClick={() => { setAnalysis(null); }}
                            className="w-full py-4 text-gray-500 hover:text-gray-800 transition-colors text-sm"
                        >
                            다시 분석하기
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
