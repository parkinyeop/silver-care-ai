// Voice Model Management Service
// Stores voice model IDs and manages parent/child voice profiles

export type VoiceRole = 'parent' | 'child';

export interface VoiceProfile {
    id: string;
    role: VoiceRole;
    name: string; // e.g., "엄마", "아들", "딸"
    voiceModelId: string | null; // API에서 받은 목소리 모델 ID
    createdAt: string;
}

const STORAGE_KEY = 'silver_care_voice_profiles';

// Get all voice profiles
export const getVoiceProfiles = (): VoiceProfile[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

// Save voice profiles
export const saveVoiceProfiles = (profiles: VoiceProfile[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
};

// Get voice profile by role
export const getVoiceProfileByRole = (role: VoiceRole): VoiceProfile | null => {
    const profiles = getVoiceProfiles();
    return profiles.find(p => p.role === role) || null;
};

// Add or update voice profile
export const saveVoiceProfile = (profile: Omit<VoiceProfile, 'id' | 'createdAt'>): VoiceProfile => {
    const profiles = getVoiceProfiles();
    
    // Check if profile with same role already exists
    const existingIndex = profiles.findIndex(p => p.role === profile.role);
    
    const newProfile: VoiceProfile = {
        ...profile,
        id: existingIndex >= 0 ? profiles[existingIndex].id : Date.now().toString(),
        createdAt: existingIndex >= 0 ? profiles[existingIndex].createdAt : new Date().toISOString(),
    };

    if (existingIndex >= 0) {
        profiles[existingIndex] = newProfile;
    } else {
        profiles.push(newProfile);
    }
    
    saveVoiceProfiles(profiles);
    return newProfile;
};

// Delete voice profile
export const deleteVoiceProfile = (id: string) => {
    const profiles = getVoiceProfiles();
    saveVoiceProfiles(profiles.filter(p => p.id !== id));
};

// Get active voice model ID for a role (used in TTS)
export const getActiveVoiceModelId = (role: VoiceRole): string | null => {
    const profile = getVoiceProfileByRole(role);
    return profile?.voiceModelId || null;
};




