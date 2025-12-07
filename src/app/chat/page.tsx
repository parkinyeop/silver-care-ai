import ChatInterface from '@/components/ChatInterface';
import Link from 'next/link';

export default function ChatPage() {
    return (
        <main className="container" style={{ padding: 0, height: '100vh' }}>
            <header style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link href="/" style={{ fontSize: '24px', padding: '8px' }}>🏠 홈으로</Link>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>자녀와의 대화</h1>
                <div style={{ width: '40px' }}></div> {/* Spacer for centering */}
            </header>

            <ChatInterface />
        </main>
    );
}
