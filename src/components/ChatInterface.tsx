'use client';

import { useState, useEffect, useRef } from 'react';
import { speechToText, generateResponse, textToSpeech, ChatMessage } from '@/services/ai';
import { getVoiceProfileByRole } from '@/services/voice';

export default function ChatInterface() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasVoiceRegistered, setHasVoiceRegistered] = useState(false);
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const currentAudioRef = useRef<HTMLAudioElement | null>(null);

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
    }, []);

    const handleStartListening = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await handleProcessing(audioBlob);
                // Stop all tracks to release microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsListening(true);
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('마이크 접근 권한이 필요합니다.');
        }
    };

    const handleStopListening = () => {
        if (mediaRecorderRef.current && isListening) {
            mediaRecorderRef.current.stop();
            setIsListening(false);
        }
    };

    const handleProcessing = async (audioBlob: Blob) => {
        setIsProcessing(true);

        try {
            // 1. STT: Convert audio to text
            const userText = await speechToText(audioBlob);
            if (!userText || userText.trim() === '') {
                alert('음성을 인식하지 못했습니다. 다시 말해주세요.');
                setIsProcessing(false);
                return;
            }

            const userMsg: ChatMessage = { role: 'user', text: userText };
            setMessages(prev => [...prev, userMsg]);

            // 2. LLM: Generate response
            const aiText = await generateResponse(userText);

            // 3. TTS: Convert response to audio using child's voice
            const audioUrl = await textToSpeech(aiText, 'child');

            const aiMsg: ChatMessage = { role: 'assistant', text: aiText, audioUrl };
            setMessages(prev => [...prev, aiMsg]);

            // 4. Auto-play the audio response
            if (audioUrl) {
                await playAudio(audioUrl);
            }

        } catch (error) {
            console.error("Conversation error:", error);
            alert("오류가 발생했습니다: " + (error as Error).message);
        } finally {
            setIsProcessing(false);
        }
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

                {isProcessing && (
                    <div style={{ alignSelf: 'flex-start', padding: '16px', backgroundColor: '#F5F5F5', borderRadius: '16px' }}>
                        생각하는 중... 🤔
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Controls */}
            <div style={{ padding: '16px', borderTop: '1px solid #eee', backgroundColor: 'white' }}>
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
                                : '🗣️ 대화 시작하기'
                        }
                    </button>
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
