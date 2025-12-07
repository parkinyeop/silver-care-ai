// AI Service for Speech-to-Text, LLM, and Text-to-Speech
// Supports Web Speech API (STT), Anthropic Claude (LLM), and ElevenLabs (TTS with voice cloning)

import { getActiveVoiceModelId, VoiceRole } from './voice';

export interface ChatMessage {
    role: 'user' | 'assistant';
    text: string;
    audioUrl?: string; // For assistant messages
}

// STT: Converts audio blob to text using OpenAI Whisper API
// Note: 현재는 ChatInterface에서 Web Speech API를 직접 사용하므로 이 함수는 사용되지 않습니다.
// 필요시 OpenAI Whisper API를 사용할 수 있도록 유지합니다.
export const speechToText = async (audioBlob: Blob): Promise<string> => {
    // Check if API key is configured
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    
    if (!apiKey) {
        // Fallback to mock for development
        console.warn('OpenAI API key not found, using mock STT');
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("엄마, 오늘 날씨가 참 좋네요. 산책 다녀오셨어요?");
            }, 1500);
        });
    }

    try {
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.webm');
        formData.append('model', 'whisper-1');
        formData.append('language', 'ko'); // Korean

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`STT API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.text || '';
    } catch (error) {
        console.error('STT error:', error);
        throw error;
    }
};

// LLM: Generates text response using Anthropic Claude API (via Next.js API Route)
export const generateResponse = async (inputText: string): Promise<string> => {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: inputText }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate response');
        }

        const data = await response.json();
        const text = data.text || data.error || "죄송해요, 잠시 문제가 생겼어요. 다시 말씀해주실 수 있나요?";
        
        if (data.text) {
            console.log('✅ Claude API 응답 성공:', text.substring(0, 50) + '...');
        }
        
        return text;
    } catch (error) {
        console.error('❌ LLM error:', error);
        // 에러 발생 시 Mock 응답 반환 (사용자 경험 개선)
        console.warn('⚠️ Falling back to mock response due to error');
        return "죄송해요, 잠시 문제가 생겼어요. 다시 말씀해주실 수 있나요?";
    }
};

// TTS: Converts text to audio using ElevenLabs API with voice cloning
// role: 'child' for chat assistant (uses child's voice), 'parent' for reminders
export const textToSpeech = async (text: string, role: VoiceRole = 'child'): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
    const voiceModelId = getActiveVoiceModelId(role);

    if (!apiKey) {
        // Fallback to mock for development
        console.warn('ElevenLabs API key not found, using mock TTS');
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(""); // Empty string, UI handles "playing" state
            }, 2000);
        });
    }

    if (!voiceModelId) {
        console.warn(`Voice model not found for role: ${role}, using default voice`);
        // You could use a default voice ID here
        return '';
    }

    try {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceModelId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': apiKey,
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_multilingual_v2', // Supports Korean
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`TTS API error: ${response.statusText} - ${errorText}`);
        }

        // Convert audio blob to data URL for playback
        const audioBlob = await response.blob();
        return URL.createObjectURL(audioBlob);
    } catch (error) {
        console.error('TTS error:', error);
        throw error;
    }
};

// Voice Cloning: Upload audio sample to create a voice model
export const createVoiceModel = async (
    audioBlob: Blob,
    name: string,
    description?: string
): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

    if (!apiKey) {
        // Fallback to mock for development
        console.warn('ElevenLabs API key not found, using mock voice model');
        return new Promise((resolve) => {
            setTimeout(() => {
                // Generate a mock voice model ID for testing
                // Format: mock_voice_{timestamp}_{random}
                const mockId = `mock_voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                resolve(mockId);
            }, 2000);
        });
    }

    try {
        // Step 1: Create a voice clone
        const formData = new FormData();
        formData.append('name', name);
        if (description) {
            formData.append('description', description);
        }
        formData.append('files', audioBlob, 'voice_sample.webm');

        const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
            method: 'POST',
            headers: {
                'xi-api-key': apiKey,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Voice cloning error: ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        return data.voice_id; // Return the voice model ID
    } catch (error) {
        console.error('Voice cloning error:', error);
        throw error;
    }
};
