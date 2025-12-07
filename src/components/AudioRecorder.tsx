'use client';

import { useState, useRef } from 'react';

interface AudioRecorderProps {
    onRecordingComplete: (audioBlob: Blob) => void;
    script?: string; // 대사집 (선택사항)
    role?: 'child' | 'parent'; // 역할 (선택사항)
}

export default function AudioRecorder({ onRecordingComplete, script, role }: AudioRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                onRecordingComplete(blob);
                stopTimer();
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            startTimer();
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('마이크 접근 권한이 필요합니다.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            // Stop all tracks to release microphone
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const startTimer = () => {
        setRecordingTime(0);
        timerRef.current = setInterval(() => {
            setRecordingTime((prev) => prev + 1);
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="card text-center">
            <h3 style={{ marginBottom: '16px' }}>목소리 녹음</h3>
            <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '24px', color: isRecording ? 'red' : 'inherit' }}>
                {formatTime(recordingTime)}
            </div>

            {/* 대사집 표시 */}
            {script && (
                <div style={{ 
                    marginBottom: '24px', 
                    padding: '16px', 
                    backgroundColor: '#F5F5F5', 
                    borderRadius: '12px',
                    textAlign: 'left',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    fontSize: '18px',
                    lineHeight: '1.8',
                    color: '#333'
                }}>
                    <div style={{ 
                        fontSize: '16px', 
                        fontWeight: 'bold', 
                        marginBottom: '12px', 
                        color: '#666',
                        textAlign: 'center'
                    }}>
                        📝 아래 대사를 자연스럽게 읽어주세요
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                        {script}
                    </div>
                </div>
            )}

            {!isRecording ? (
                <button onClick={startRecording} className="btn-large">
                    🔴 녹음 시작
                </button>
            ) : (
                <button onClick={stopRecording} className="btn-large btn-accent">
                    ⏹️ 녹음 완료
                </button>
            )}

            <p style={{ marginTop: '16px', color: '#666' }}>
                {role === 'parent' ? '부모님' : '자녀분'}의 목소리를 30초 이상 녹음해주세요.
            </p>
        </div>
    );
}
