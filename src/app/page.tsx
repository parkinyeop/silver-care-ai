import Link from 'next/link';

export default function Home() {
  return (
    <main className="container">
      <header className="text-center" style={{ marginTop: '40px', marginBottom: '40px' }}>
        <h1 className="title-lg">실버 케어 AI</h1>
        <p style={{ fontSize: '20px', color: 'var(--text-secondary)' }}>
          자녀의 목소리로<br />따뜻한 대화를 나눠보세요
        </p>
      </header>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Link href="/chat" className="btn-large">
          🗣️ 대화 시작하기
        </Link>

        <Link href="/onboarding" className="btn-large btn-secondary">
          🎙️ 목소리 등록하기
        </Link>

        <Link href="/settings" className="btn-large btn-accent">
          ⚙️ 설정
        </Link>
      </nav>
    </main>
  );
}
