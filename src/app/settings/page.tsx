'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getReminders, addReminder, deleteReminder, toggleReminder, Reminder } from '@/services/reminder';
import { getVoiceProfiles, deleteVoiceProfile, VoiceProfile } from '@/services/voice';

export default function SettingsPage() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [voiceProfiles, setVoiceProfiles] = useState<VoiceProfile[]>([]);
    const [activeTab, setActiveTab] = useState<'reminders' | 'voices'>('reminders');
    const [newTime, setNewTime] = useState('09:00');
    const [newMessage, setNewMessage] = useState('약 드실 시간이에요');

    useEffect(() => {
        setReminders(getReminders());
        setVoiceProfiles(getVoiceProfiles());
    }, []);

    const handleAdd = () => {
        addReminder(newTime, newMessage);
        setReminders(getReminders());
        alert('알림이 추가되었습니다.');
    };

    const handleDelete = (id: string) => {
        if (confirm('정말 삭제하시겠습니까?')) {
            deleteReminder(id);
            setReminders(getReminders());
        }
    };

    const handleToggle = (id: string) => {
        toggleReminder(id);
        setReminders(getReminders());
    };

    const handleDeleteVoice = (id: string) => {
        if (confirm('정말 이 목소리를 삭제하시겠습니까?')) {
            deleteVoiceProfile(id);
            setVoiceProfiles(getVoiceProfiles());
            alert('목소리가 삭제되었습니다.');
        }
    };

    return (
        <main className="container">
            <header style={{ marginBottom: '24px' }}>
                <Link href="/" style={{ fontSize: '24px' }}>← 뒤로가기</Link>
                <h1 className="title-lg" style={{ marginTop: '16px' }}>설정</h1>
            </header>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <button
                    onClick={() => setActiveTab('reminders')}
                    className={activeTab === 'reminders' ? 'btn-large' : 'btn-large btn-secondary'}
                    style={{ flex: 1, fontSize: '18px' }}
                >
                    ⏰ 알림
                </button>
                <button
                    onClick={() => setActiveTab('voices')}
                    className={activeTab === 'voices' ? 'btn-large' : 'btn-large btn-secondary'}
                    style={{ flex: 1, fontSize: '18px' }}
                >
                    🎙️ 목소리
                </button>
            </div>

            {activeTab === 'reminders' && (
                <>

            <div className="card">
                <h3 style={{ marginBottom: '16px' }}>새 알림 추가</h3>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <input
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        style={{ fontSize: '24px', padding: '8px', borderRadius: '8px', border: '1px solid #ccc' }}
                    />
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <select
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        style={{ width: '100%', fontSize: '20px', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                    >
                        <option value="약 드실 시간이에요">💊 약 드실 시간이에요</option>
                        <option value="식사 하실 시간이에요">🍚 식사 하실 시간이에요</option>
                        <option value="운동 하실 시간이에요">🏃 운동 하실 시간이에요</option>
                        <option value="물 드실 시간이에요">💧 물 드실 시간이에요</option>
                    </select>
                </div>
                <button onClick={handleAdd} className="btn-large btn-secondary" style={{ fontSize: '20px', padding: '12px' }}>
                    ➕ 알림 추가하기
                </button>
            </div>

            <h3 style={{ marginBottom: '16px' }}>등록된 알림</h3>
            {reminders.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>등록된 알림이 없습니다.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {reminders.map(reminder => (
                        <div key={reminder.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', marginBottom: 0, opacity: reminder.enabled ? 1 : 0.5 }}>
                            <div>
                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                    {reminder.time}
                                </div>
                                <div style={{ fontSize: '18px' }}>{reminder.message}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => handleToggle(reminder.id)}
                                    style={{ padding: '8px 16px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc', background: reminder.enabled ? '#E8F5E9' : '#eee' }}
                                >
                                    {reminder.enabled ? '켜짐' : '꺼짐'}
                                </button>
                                <button
                                    onClick={() => handleDelete(reminder.id)}
                                    style={{ padding: '8px 16px', fontSize: '16px', borderRadius: '8px', border: 'none', background: '#FFEBEE', color: '#D32F2F' }}
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
                </>
            )}

            {activeTab === 'voices' && (
                <>
                    <div className="card">
                        <h3 style={{ marginBottom: '16px' }}>등록된 목소리</h3>
                        {voiceProfiles.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                                등록된 목소리가 없습니다.
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {voiceProfiles.map(profile => (
                                    <div key={profile.id} className="card" style={{ padding: '16px', marginBottom: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div>
                                                <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
                                                    {profile.role === 'child' ? '👨‍👩‍👧‍👦 자녀' : '👴👵 부모'} - {profile.name}
                                                </div>
                                                <div style={{ fontSize: '14px', color: '#666' }}>
                                                    등록일: {new Date(profile.createdAt).toLocaleDateString('ko-KR')}
                                                </div>
                                                <div style={{ fontSize: '14px', color: profile.voiceModelId ? '#4CAF50' : '#F44336', marginTop: '4px' }}>
                                                    {profile.voiceModelId ? '✅ 등록 완료' : '❌ 등록 실패'}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Link
                                                    href="/onboarding"
                                                    className="btn-secondary"
                                                    style={{ padding: '8px 16px', fontSize: '14px' }}
                                                    onClick={() => {
                                                        // You could add logic to pre-select the role
                                                        localStorage.setItem('selectedVoiceRole', profile.role);
                                                    }}
                                                >
                                                    재등록
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteVoice(profile.id)}
                                                    style={{ padding: '8px 16px', fontSize: '14px', borderRadius: '8px', border: 'none', background: '#FFEBEE', color: '#D32F2F' }}
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link href="/onboarding" className="btn-large btn-secondary">
                        ➕ 새 목소리 등록하기
                    </Link>
                </>
            )}
        </main>
    );
}
