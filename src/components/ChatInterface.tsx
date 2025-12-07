'use client';

import { useState, useEffect, useRef } from 'react';
import { generateResponse, textToSpeech, ChatMessage } from '@/services/ai';
import { getVoiceProfileByRole } from '@/services/voice';

// Web Speech API 타입 정의
declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

type InputMode = 'text' | 'voice';

export default function ChatInterface() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMode, setInputMode] = useState<InputMode>('text'); // 'text' or 'voice'
    const [inputText, setInputText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasVoiceRegistered, setHasVoiceRegistered] = useState(false);
    const [recognizedText, setRecognizedText] = useState('');
    
    const recognitionRef = useRef<any>(null);
    const currentAudioRef = useRef<HTMLAudioElement | null>(null);
    const finalTranscriptRef = useRef<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    // Check if voice is registered on mount
    useEffect(() => {
        const childVoice = getVoiceProfileByRole('child');
        setHasVoiceRegistered(!!childVoice?.voiceModelId);
        
        // Web Speech API 초기화
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.lang = 'ko-KR'; // 한국어 설정
                
                recognition.onstart = () => {
                    setIsListening(true);
                    setRecognizedText('');
                    finalTranscriptRef.current = '';
                };
                
                recognition.onresult = (event: any) => {
                    let interimTranscript = '';
                    let finalTranscript = '';
                    
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript + ' ';
                        } else {
                            interimTranscript += transcript;
                        }
                    }
                    
                    if (finalTranscript) {
                        finalTranscriptRef.current += finalTranscript;
                    }
                    
                    setRecognizedText(finalTranscriptRef.current || interimTranscript);
                };
                
                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    setIsListening(false);
                    if (event.error === 'no-speech') {
                        alert('음성이 감지되지 않았습니다. 다시 시도해주세요.');
                    } else if (event.error === 'not-allowed') {
                        alert('마이크 접근 권한이 필요합니다.');
                    }
                };
                
                recognition.onend = () => {
                    setIsListening(false);
                    const text = finalTranscriptRef.current.trim();
                    if (text) {
                        handleProcessing(text);
                    }
                    finalTranscriptRef.current = '';
                };
                
                recognitionRef.current = recognition;
            } else {
                console.warn('Web Speech API is not supported in this browser');
            }
        }
        
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const handleStartListening = () => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (err) {
                console.error('Error starting speech recognition:', err);
                alert('음성 인식을 시작할 수 없습니다. 브라우저를 확인해주세요.');
            }
        } else {
            alert('이 브라우저는 음성 인식을 지원하지 않습니다. Chrome 또는 Edge 브라우저를 사용해주세요.');
        }
    };

    const handleStopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    const handleProcessing = async (userText: string) => {
        if (!userText || userText.trim() === '') {
            return;
        }

        setIsProcessing(true);

        try {
            // 사용자 메시지 추가
            const userMsg: ChatMessage = { role: 'user', text: userText };
            setMessages(prev => [...prev, userMsg]);

            // LLM: Generate response
            const aiText = await generateResponse(userText);

            // TTS: Convert response to audio using child's voice (음성 모드일 때만)
            const audioUrl = inputMode === 'voice' && hasVoiceRegistered 
                ? await textToSpeech(aiText, 'child') 
                : '';

            const aiMsg: ChatMessage = { role: 'assistant', text: aiText, audioUrl };
            setMessages(prev => [...prev, aiMsg]);

            // Auto-play the audio response (음성 모드일 때만)
            if (audioUrl && inputMode === 'voice') {
                await playAudio(audioUrl);
            }

        } catch (error) {
            console.error("Conversation error:", error);
            alert("오류가 발생했습니다: " + (error as Error).message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTextSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (inputText.trim() && !isProcessing) {
            handleProcessing(inputText.trim());
            setInputText('');
        }
    };

    const handleModeSwitch = (mode: InputMode) => {
        // 음성 모드에서 텍스트 모드로 전환 시 음성 인식 중지
        if (mode === 'text' && isListening) {
            handleStopListening();
        }
        setInputMode(mode);
    };

    const playAudio = (audioUrl: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            // Stop any currently playing audio
            if (currentAudioRef.current) {
                currentAudioRef.current.pause();
                currentAudioRef.current = null;
            }

            setIsPlaying(true);
            const audio = new Audio(audioUrl);
            currentAudioRef.current = audio;

            audio.onended = () => {
                setIsPlaying(false);
                currentAudioRef.current = null;
                // Clean up the object URL
                URL.revokeObjectURL(audioUrl);
                resolve();
            };

            audio.onerror = (error) => {
                setIsPlaying(false);
                currentAudioRef.current = null;
                URL.revokeObjectURL(audioUrl);
                reject(error);
            };

            audio.play().catch(reject);
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 100px)' }}>
            {/* Chat History */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', marginTop: '40px', color: '#888' }}>
                        {!hasVoiceRegistered ? (
                            <>
                                <p style={{ fontSize: '24px', marginBottom: '16px' }}>
                                    자녀의 목소리가 등록되어 있지 않습니다.
                                </p>
                                <p style={{ fontSize: '18px' }}>
                                    먼저 목소리를 등록해주세요.
                                </p>
                            </>
                        ) : (
                            <p style={{ fontSize: '24px' }}>
                                대화 시작하기 버튼을 눌러<br />이야기를 시작해보세요.
                            </p>
                        )}
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        backgroundColor: msg.role === 'user' ? '#E8F5E9' : '#F5F5F5',
                        padding: '16px',
                        borderRadius: '16px',
                        borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                        borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
                        fontSize: '20px'
                    }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '14px', color: '#666' }}>
                            {msg.role === 'user' ? '나' : '자녀'}
                        </div>
                        {msg.text}
                    </div>
                ))}

                {isListening && recognizedText && (
                    <div style={{ alignSelf: 'flex-start', padding: '16px', backgroundColor: '#FFF9C4', borderRadius: '16px', fontSize: '18px', fontStyle: 'italic' }}>
                        🎤 {recognizedText}
                    </div>
                )}
                {isProcessing && (
                    <div style={{ alignSelf: 'flex-start', padding: '16px', backgroundColor: '#F5F5F5', borderRadius: '16px' }}>
                        생각하는 중... 🤔
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Mode Toggle */}
            <div style={{ padding: '8px 16px', borderTop: '1px solid #eee', backgroundColor: '#F5F5F5', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button
                    onClick={() => handleModeSwitch('text')}
                    style={{
                        padding: '8px 16px',
                        fontSize: '16px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: inputMode === 'text' ? 'var(--primary-color)' : '#E0E0E0',
                        color: inputMode === 'text' ? 'white' : '#666',
                        cursor: 'pointer',
                        fontWeight: inputMode === 'text' ? 'bold' : 'normal'
                    }}
                >
                    ✍️ 텍스트
                </button>
                <button
                    onClick={() => handleModeSwitch('voice')}
                    style={{
                        padding: '8px 16px',
                        fontSize: '16px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: inputMode === 'voice' ? 'var(--primary-color)' : '#E0E0E0',
                        color: inputMode === 'voice' ? 'white' : '#666',
                        cursor: 'pointer',
                        fontWeight: inputMode === 'voice' ? 'bold' : 'normal'
                    }}
                >
                    🗣️ 음성
                </button>
            </div>

            {/* Controls */}
            <div style={{ padding: '16px', borderTop: '1px solid #eee', backgroundColor: 'white' }}>
                {inputMode === 'text' ? (
                    // 텍스트 모드
                    <form onSubmit={handleTextSubmit} style={{ display: 'flex', gap: '8px' }}>
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="메시지를 입력하세요..."
                            disabled={isProcessing}
                            style={{
                                flex: 1,
                                fontSize: '18px',
                                padding: '12px 16px',
                                borderRadius: '24px',
                                border: '2px solid #E0E0E0',
                                outline: 'none'
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleTextSubmit();
                                }
                            }}
                        />
                        <button
                            type="submit"
                            className="btn-large"
                            disabled={!inputText.trim() || isProcessing}
                            style={{
                                minWidth: '80px',
                                padding: '12px 24px',
                                borderRadius: '24px'
                            }}
                        >
                            전송
                        </button>
                    </form>
                ) : (
                    // 음성 모드
                    <>
                        {isPlaying ? (
                            <button className="btn-large btn-accent" disabled>
                                🔊 말하는 중...
                            </button>
                        ) : isListening ? (
                            <button onClick={handleStopListening} className="btn-large btn-accent" style={{ animation: 'pulse 1s infinite' }}>
                                👂 듣고 있어요... (누르면 중지)
                            </button>
                        ) : (
                            <button 
                                onClick={handleStartListening} 
                                className="btn-large" 
                                disabled={isProcessing || !hasVoiceRegistered}
                            >
                                {!hasVoiceRegistered 
                                    ? '먼저 목소리를 등록해주세요' 
                                    : isProcessing 
                                        ? '잠시만 기다려주세요' 
                                        : '🗣️ 음성으로 대화하기'
                                }
                            </button>
                        )}
                    </>
                )}
            </div>

            <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.98); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </div>
    );
}
