// AI Service for Speech-to-Text, LLM, and Text-to-Speech
// Supports OpenAI Whisper (STT), OpenAI GPT (LLM), and ElevenLabs (TTS with voice cloning)

import { getActiveVoiceModelId, VoiceRole } from './voice';

export interface ChatMessage {
    role: 'user' | 'assistant';
    text: string;
    audioUrl?: string; // For assistant messages
}

// STT: Converts audio blob to text using OpenAI Whisper API
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

// LLM: Generates text response using OpenAI GPT API
export const generateResponse = async (inputText: string): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    if (!apiKey) {
        // Fallback to mock for development
        console.warn('OpenAI API key not found, using mock LLM');
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("네, 날씨가 정말 좋아서 공원에 다녀왔어요. 우리 아들도 밥 잘 챙겨 먹고 있지?");
            }, 2000);
        });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: '당신은 자녀의 목소리로 부모님과 대화하는 따뜻하고 친근한 AI 어시스턴트입니다. 부모님께 존중하고 배려하는 말투로 자연스럽게 대화하세요.'
                    },
                    {
                        role: 'user',
                        content: inputText
                    }
                ],
                temperature: 0.7,
                max_tokens: 200,
            }),
        });

        if (!response.ok) {
            throw new Error(`LLM API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
    } catch (error) {
        console.error('LLM error:', error);
        throw error;
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
        throw new Error('ElevenLabs API key not found');
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
