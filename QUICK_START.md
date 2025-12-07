# 빠른 시작 가이드 (Quick Start)

## 1️⃣ 환경 변수 설정 (필수)

프로젝트 루트에 `.env.local` 파일을 생성하세요:

```bash
# .env.local
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

> **💡 Tip**: `.env.local.example` 파일을 복사해서 사용하세요:
> ```bash
# macOS/Linux
cp .env.local.example .env.local

# Windows
copy .env.local.example .env.local
```

## 2️⃣ 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 3️⃣ 빠른 테스트 순서

### Step 1: 목소리 등록 (1분 소요)
1. 홈 화면 → "목소리 등록하기"
2. "동의하고 시작하기"
3. "자녀의 목소리" 선택
4. 이름 입력 (선택, 예: "철수")
5. "녹음하기" → 마이크 권한 허용
6. **30초 이상** 자연스럽게 말하기
7. "녹음 완료" → 처리 완료까지 대기

### Step 2: AI 채팅 테스트 (30초 소요)
1. 홈 화면 → "대화 시작하기"
2. "🗣️ 대화 시작하기" 클릭
3. 마이크에 **3-5초간** 말하기
4. "👂 듣고 있어요..." 버튼 클릭하여 중지
5. AI 응답과 음성 재생 확인

### Step 3: 알림 테스트 (1분 소요)
1. 홈 화면 → "설정"
2. 현재 시간 + 1분으로 알림 설정
3. 메시지 선택
4. "➕ 알림 추가하기"
5. 1분 후 음성 알림 확인

## ⚠️ 문제 발생 시

- **마이크 권한 오류**: 브라우저 설정에서 마이크 권한 허용
- **API 키 오류**: `.env.local` 파일 확인, 서버 재시작
- **음성 재생 안 됨**: 브라우저 콘솔(F12) 확인

자세한 내용은 `TESTING_GUIDE.md` 참고



