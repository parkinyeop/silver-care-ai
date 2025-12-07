'use client';

import { useState } from 'react';
import AudioRecorder from '@/components/AudioRecorder';
import Link from 'next/link';
import { saveVoiceProfile, VoiceRole } from '@/services/voice';
import { createVoiceModel } from '@/services/ai';

export default function OnboardingPage() {
    const [step, setStep] = useState<'consent' | 'role' | 'intro' | 'record' | 'complete' | 'error'>('consent');
    const [selectedRole, setSelectedRole] = useState<VoiceRole | null>(null);
    const [voiceName, setVoiceName] = useState('');
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleRecordingComplete = async (blob: Blob) => {
        setAudioBlob(blob);
        setIsProcessing(true);
        setErrorMessage('');

        try {
            // Validate minimum recording duration (at least 30 seconds for voice cloning)
            if (blob.size < 100000) { // Rough estimate: ~100KB = ~30 seconds
                throw new Error('목소리 등록을 위해 최소 30초 이상 녹음해주세요.');
            }

            const roleName = selectedRole === 'child' ? '자녀' : '부모';
            const displayName = voiceName.trim() || (selectedRole === 'child' ? '자녀' : '부모');

            // Create voice model using ElevenLabs API
            const voiceModelId = await createVoiceModel(blob, displayName, `${roleName} 목소리`);

            // Save voice profile
            saveVoiceProfile({
                role: selectedRole!,
                name: displayName,
                voiceModelId,
            });

            setStep('complete');
        } catch (error: any) {
            console.error('Voice registration error:', error);
            setErrorMessage(error.message || '목소리 등록 중 오류가 발생했습니다.');
            setStep('error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <main className="container">
            <header style={{ marginBottom: '24px' }}>
                <Link href="/" style={{ fontSize: '24px' }}>← 뒤로가기</Link>
            </header>

            {step === 'consent' && (
                <>
                    <h1 className="title-lg">서비스 이용 동의</h1>
                    <div className="card" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <h3 style={{ marginBottom: '12px' }}>음성 데이터 수집 및 이용 동의</h3>
                        <p style={{ marginBottom: '16px', fontSize: '16px', color: '#555' }}>
                            본 서비스는 부모 또는 자녀의 목소리를 AI로 생성하여 대화 서비스를 제공하기 위해,
                            목소리 녹음 데이터를 수집하고 분석합니다.
                        </p>
                        <ul style={{ paddingLeft: '20px', marginBottom: '16px', fontSize: '16px', color: '#555' }}>
                            <li>수집 목적: AI 음성 모델 생성 및 대화 서비스 제공</li>
                            <li>수집 항목: 목소리 녹음 파일</li>
                            <li>보유 기간: 서비스 이용 종료 시까지 (또는 사용자 요청 시 즉시 삭제)</li>
                        </ul>
                        <p style={{ fontSize: '14px', color: '#888' }}>
                            * 동의를 거부할 권리가 있으나, 거부 시 서비스 이용이 불가능합니다.
                        </p>
                    </div>

                    <button onClick={() => setStep('role')} className="btn-large">
                        동의하고 시작하기
                    </button>
                </>
            )}

            {step === 'role' && (
                <>
                    <h1 className="title-lg">목소리 등록</h1>
                    <div className="card">
                        <p style={{ marginBottom: '24px', fontSize: '20px' }}>
                            누구의 목소리를 등록하시나요?
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <button
                                onClick={() => {
                                    setSelectedRole('child');
                                    setVoiceName('');
                                    setStep('intro');
                                }}
                                className="btn-large"
                                style={{ fontSize: '24px', padding: '20px' }}
                            >
                                👨‍👩‍👧‍👦 자녀의 목소리
                            </button>
                            <button
                                onClick={() => {
                                    setSelectedRole('parent');
                                    setVoiceName('');
                                    setStep('intro');
                                }}
                                className="btn-large btn-secondary"
                                style={{ fontSize: '24px', padding: '20px' }}
                            >
                                👴👵 부모의 목소리
                            </button>
                        </div>
                    </div>
                </>
            )}

            {step === 'intro' && (
                <>
                    <h1 className="title-lg">
                        {selectedRole === 'child' ? '자녀' : '부모'} 목소리 등록
                    </h1>
                    <div className="card">
                        <p style={{ marginBottom: '16px' }}>
                            AI가 {selectedRole === 'child' ? '자녀분' : '부모님'}의 목소리를 배울 수 있도록<br />
                            목소리를 녹음해주세요.
                        </p>
                        
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '18px', fontWeight: 'bold' }}>
                                이름 (선택사항)
                            </label>
                            <input
                                type="text"
                                value={voiceName}
                                onChange={(e) => setVoiceName(e.target.value)}
                                placeholder={selectedRole === 'child' ? '예: 철수, 영희' : '예: 엄마, 아빠'}
                                style={{
                                    width: '100%',
                                    fontSize: '20px',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc'
                                }}
                            />
                        </div>

                        <ul style={{ paddingLeft: '20px', marginBottom: '24px', lineHeight: '1.8' }}>
                            <li>조용한 곳에서 녹음해주세요.</li>
                            <li>평소 말투로 자연스럽게 읽어주세요.</li>
                            <li>최소 30초 이상 녹음해주세요 (1분 이상 권장).</li>
                        </ul>
                    </div>

                    <button onClick={() => setStep('record')} className="btn-large">
                        🎙️ 녹음하기
                    </button>
                </>
            )}

            {step === 'record' && (
                <>
                    <h1 className="title-lg">녹음 진행 중</h1>
                    {isProcessing ? (
                        <div className="card text-center">
                            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
                            <p style={{ fontSize: '20px' }}>
                                목소리를 학습하고 있습니다...<br />
                                잠시만 기다려주세요.
                            </p>
                        </div>
                    ) : (
                        <AudioRecorder onRecordingComplete={handleRecordingComplete} />
                    )}
                </>
            )}

            {step === 'complete' && (
                <>
                    <h1 className="title-lg">등록 완료!</h1>
                    <div className="card text-center">
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
                        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                            목소리가 성공적으로<br />등록되었습니다.
                        </p>
                        <p style={{ marginTop: '16px' }}>
                            {selectedRole === 'child' 
                                ? '이제 AI가 자녀의 목소리로 대화할 준비가 되었습니다.'
                                : '이제 알림과 메시지에서 부모님의 목소리를 사용할 수 있습니다.'
                            }
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {selectedRole === 'child' && (
                            <Link href="/chat" className="btn-large">
                                🗣️ 대화하러 가기
                            </Link>
                        )}
                        <Link href="/" className="btn-large btn-secondary">
                            🏠 홈으로 돌아가기
                        </Link>
                    </div>
                </>
            )}

            {step === 'error' && (
                <>
                    <h1 className="title-lg">등록 실패</h1>
                    <div className="card text-center" style={{ backgroundColor: '#FFEBEE' }}>
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}>❌</div>
                        <p style={{ fontSize: '20px', color: '#D32F2F', marginBottom: '16px' }}>
                            {errorMessage || '목소리 등록 중 오류가 발생했습니다.'}
                        </p>
                        <p style={{ fontSize: '16px', color: '#666' }}>
                            API 키가 설정되어 있는지 확인하거나<br />
                            네트워크 연결을 확인해주세요.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button onClick={() => setStep('record')} className="btn-large">
                            🔄 다시 시도
                        </button>
                        <Link href="/" className="btn-large btn-secondary">
                            🏠 홈으로 돌아가기
                        </Link>
                    </div>
                </>
            )}
        </main>
    );
}
