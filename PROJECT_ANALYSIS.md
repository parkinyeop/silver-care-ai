# 실버 케어 AI 프로젝트 분석 보고서

## 📋 프로젝트 개요

**프로젝트명**: Silver Care AI (실버 케어 AI)  
**목적**: 부모와 자녀의 목소리를 등록하여 AI 채팅, 알림, 메시지에 활용하는 서비스  
**기술 스택**: Next.js 16.0.4, React 19.2.0, TypeScript 5  
**현재 상태**: 개발 중 (Mock 모드 지원)

---

## 🏗️ 프로젝트 구조

### 디렉토리 구조
```
silver-care-ai/
├── src/
│   ├── app/                    # Next.js App Router 페이지
│   │   ├── page.tsx           # 홈 페이지
│   │   ├── chat/              # AI 채팅 페이지
│   │   ├── onboarding/        # 목소리 등록 페이지
│   │   ├── settings/          # 설정 페이지
│   │   ├── report/            # 심리 분석 리포트 페이지
│   │   └── layout.tsx         # 루트 레이아웃
│   ├── components/            # React 컴포넌트
│   │   ├── ChatInterface.tsx  # 채팅 인터페이스
│   │   ├── AudioRecorder.tsx  # 음성 녹음 컴포넌트
│   │   └── ReminderManager.tsx # 알림 관리 컴포넌트
│   ├── services/              # 비즈니스 로직 서비스
│   │   ├── ai.ts              # AI 서비스 (STT, LLM, TTS)
│   │   ├── voice.ts           # 목소리 프로필 관리
│   │   ├── reminder.ts        # 알림 관리
│   │   └── analysis.ts        # 심리 분석 서비스
│   ├── hooks/                 # 커스텀 훅 (현재 비어있음)
│   ├── types/                 # TypeScript 타입 정의 (현재 비어있음)
│   └── styles/                # 스타일 파일 (현재 비어있음)
├── public/                    # 정적 파일
└── package.json               # 의존성 관리
```

---

## 🔑 핵심 기능 분석

### 1. **음성 인식 (STT - Speech-to-Text)**
- **위치**: `src/services/ai.ts` → `speechToText()`
- **현재 구현**: OpenAI Whisper API 사용
- **Mock 모드**: API 키 없을 시 고정 텍스트 반환
- **용도**: 사용자 음성을 텍스트로 변환

### 2. **AI 대화 생성 (LLM)**
- **위치**: `src/services/ai.ts` → `generateResponse()`
- **현재 구현**: OpenAI GPT-4o-mini 사용
- **시스템 프롬프트**: "자녀의 목소리로 부모님과 대화하는 따뜻하고 친근한 AI 어시스턴트"
- **Mock 모드**: API 키 없을 시 고정 응답 반환
- **용도**: 사용자 입력에 대한 AI 응답 생성

### 3. **음성 합성 (TTS - Text-to-Speech)**
- **위치**: `src/services/ai.ts` → `textToSpeech()`
- **현재 구현**: ElevenLabs API 사용 (목소리 클론 지원)
- **목소리 모델**: `eleven_multilingual_v2` (한국어 지원)
- **Mock 모드**: API 키 없을 시 빈 문자열 반환
- **용도**: AI 응답을 등록된 목소리로 음성 변환

### 4. **목소리 클론 (Voice Cloning)**
- **위치**: `src/services/ai.ts` → `createVoiceModel()`
- **현재 구현**: ElevenLabs Voice Cloning API 사용
- **요구사항**: 최소 30초 이상 녹음 필요
- **저장**: localStorage에 목소리 프로필 저장
- **용도**: 부모/자녀 목소리 등록 및 관리

### 5. **심리 분석 (Sentiment Analysis)**
- **위치**: `src/services/analysis.ts` → `analyzeSentiment()`
- **현재 구현**: OpenAI GPT-4o-mini 사용 (JSON 응답)
- **분석 항목**:
  - 감정 상태 (positive/neutral/negative)
  - 감정 점수 (0-100)
  - 주요 키워드
  - 대화 요약
  - 위험 요인 (우울감, 고립감 등)
  - 케어 권장사항
- **Mock 모드**: API 키 없을 시 고정 분석 결과 반환

### 6. **알림 관리 (Reminder)**
- **위치**: `src/services/reminder.ts`, `src/components/ReminderManager.tsx`
- **저장**: localStorage 사용
- **기능**: 시간별 알림 설정, 활성화/비활성화, 삭제
- **재생**: 등록된 목소리로 알림 메시지 음성 재생

---

## 📄 페이지별 상세 분석

### 1. **홈 페이지** (`/`)
- **파일**: `src/app/page.tsx`
- **기능**: 메인 네비게이션
  - 대화 시작하기 → `/chat`
  - 목소리 등록하기 → `/onboarding`
  - 설정 → `/settings`
- **특징**: 간단한 랜딩 페이지

### 2. **채팅 페이지** (`/chat`)
- **파일**: `src/app/chat/page.tsx`, `src/components/ChatInterface.tsx`
- **기능**:
  - 음성 녹음 시작/중지
  - STT → LLM → TTS 파이프라인 실행
  - 대화 히스토리 표시
  - 자동 음성 재생
- **제약사항**: 자녀 목소리 등록 필수

### 3. **온보딩 페이지** (`/onboarding`)
- **파일**: `src/app/onboarding/page.tsx`
- **플로우**:
  1. 서비스 이용 동의
  2. 역할 선택 (자녀/부모)
  3. 이름 입력 (선택)
  4. 음성 녹음
  5. 목소리 모델 생성
  6. 완료/에러 처리
- **검증**: 최소 30초 녹음 확인

### 4. **설정 페이지** (`/settings`)
- **파일**: `src/app/settings/page.tsx`
- **탭 구조**:
  - 알림 탭: 알림 추가/삭제/활성화
  - 목소리 탭: 등록된 목소리 관리
- **기능**: CRUD 작업 지원

### 5. **리포트 페이지** (`/report`)
- **파일**: `src/app/report/page.tsx`
- **기능**: 대화 내용 심리 분석 리포트 표시
- **현재 상태**: Mock 대화 데이터 사용 (실제 대화 연동 필요)
- **UI**: 감정 점수, 키워드, 위험 요인, 권장사항 시각화

---

## 🔌 외부 API 의존성

### 현재 사용 중인 API

1. **OpenAI API**
   - **용도**: STT (Whisper), LLM (GPT-4o-mini), 심리 분석
   - **환경 변수**: `NEXT_PUBLIC_OPENAI_API_KEY`
   - **엔드포인트**:
     - `/v1/audio/transcriptions` (STT)
     - `/v1/chat/completions` (LLM)

2. **ElevenLabs API**
   - **용도**: TTS, 목소리 클론
   - **환경 변수**: `NEXT_PUBLIC_ELEVENLABS_API_KEY`
   - **엔드포인트**:
     - `/v1/text-to-speech/{voice_id}` (TTS)
     - `/v1/voices/add` (목소리 클론)

### Gemini 연동 필요 사항

**⚠️ 중요**: 현재 프로젝트는 OpenAI와 ElevenLabs를 사용하고 있으며, Gemini로 전환하려면 다음 작업이 필요합니다:

1. **STT (음성 인식)**
   - Gemini는 현재 STT API를 제공하지 않음
   - 대안: Google Cloud Speech-to-Text API 사용 고려
   - 또는: Gemini의 멀티모달 입력 활용 (음성 파일 직접 처리)

2. **LLM (대화 생성)**
   - Gemini API로 교체 가능
   - 엔드포인트: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`
   - API 키: Google AI Studio에서 발급

3. **TTS (음성 합성)**
   - Gemini는 TTS API를 제공하지 않음
   - 대안: Google Cloud Text-to-Speech API 사용
   - 또는: ElevenLabs 유지 (목소리 클론 기능 유지)

4. **심리 분석**
   - Gemini API로 교체 가능 (LLM과 동일한 엔드포인트)

---

## 💾 데이터 저장 방식

### localStorage 사용
- **목소리 프로필**: `silver_care_voice_profiles`
- **알림 설정**: `silver_care_reminders`
- **세션 플래그**: `triggered_{reminder_id}_{time}` (중복 알림 방지)

### 저장 데이터 구조

**VoiceProfile**:
```typescript
{
  id: string;
  role: 'parent' | 'child';
  name: string;
  voiceModelId: string | null;
  createdAt: string;
}
```

**Reminder**:
```typescript
{
  id: string;
  time: string; // "HH:MM"
  message: string;
  enabled: boolean;
}
```

---

## 🎨 UI/UX 특징

### 시니어 친화적 디자인
- **큰 폰트**: 기본 18px, 큰 버튼 24px
- **높은 대비**: 진한 텍스트 색상 (#212121)
- **명확한 버튼**: 큰 터치 영역, 명확한 색상 구분
- **간단한 네비게이션**: 최소한의 클릭으로 기능 접근

### 반응형 디자인
- 모바일/태블릿 중심 (최대 너비 600px)
- 터치 친화적 인터페이스

---

## 🚨 현재 이슈 및 개선 필요 사항

### 1. **Gemini 연동 준비**
- [ ] OpenAI API를 Gemini API로 교체
- [ ] STT는 Google Cloud Speech-to-Text 또는 Gemini 멀티모달 활용
- [ ] TTS는 Google Cloud TTS 또는 ElevenLabs 유지
- [ ] 환경 변수 업데이트 (`NEXT_PUBLIC_GEMINI_API_KEY`)

### 2. **데이터 영속성**
- [ ] localStorage → 백엔드 DB로 마이그레이션 고려
- [ ] 목소리 파일 백업/복원 기능

### 3. **리포트 페이지**
- [ ] 실제 대화 히스토리 연동
- [ ] 대화 로그 저장 기능 추가

### 4. **에러 처리**
- [ ] 더 상세한 에러 메시지
- [ ] 네트워크 오류 처리 개선
- [ ] 재시도 로직 추가

### 5. **성능 최적화**
- [ ] 음성 파일 크기 최적화
- [ ] API 호출 최적화 (배치 처리)
- [ ] 로딩 상태 개선

### 6. **테스트**
- [ ] 단위 테스트 추가
- [ ] 통합 테스트 추가
- [ ] E2E 테스트 추가

---

## 📦 의존성 분석

### 현재 설치된 패키지
```json
{
  "dependencies": {
    "next": "16.0.4",
    "react": "19.2.0",
    "react-dom": "19.2.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.0.4",
    "typescript": "^5"
  }
}
```

### Gemini 연동 시 추가 필요 패키지
- `@google/generative-ai` (Gemini SDK)
- 또는 직접 fetch로 API 호출 가능

---

## 🔄 Mock 모드 동작

프로젝트는 API 키가 없을 때 자동으로 Mock 모드를 활성화합니다:

1. **STT**: 항상 동일한 고정 텍스트 반환
2. **LLM**: 항상 동일한 고정 응답 반환
3. **TTS**: 빈 문자열 반환 (UI에서 "재생 중" 상태만 표시)
4. **목소리 클론**: 에러 발생 (API 키 필수)
5. **심리 분석**: 고정 분석 결과 반환

---

## 📝 다음 단계 제안

### Gemini 연동 작업 순서

1. **환경 변수 설정**
   - `.env.local`에 `NEXT_PUBLIC_GEMINI_API_KEY` 추가

2. **Gemini 서비스 파일 생성**
   - `src/services/gemini.ts` 생성
   - LLM 및 심리 분석 함수 구현

3. **STT 대안 선택**
   - Google Cloud Speech-to-Text 또는 Gemini 멀티모달
   - `src/services/stt.ts` 생성 또는 기존 `ai.ts` 수정

4. **TTS 결정**
   - Google Cloud TTS 또는 ElevenLabs 유지
   - 필요시 `src/services/tts.ts` 생성

5. **기존 코드 리팩토링**
   - `src/services/ai.ts` 수정
   - `src/services/analysis.ts` 수정
   - API 호출 부분 교체

6. **테스트**
   - Mock 모드와 실제 모드 모두 테스트
   - 에러 처리 확인

---

## 🎯 프로젝트 강점

1. ✅ **명확한 구조**: 서비스 레이어 분리로 유지보수 용이
2. ✅ **Mock 모드 지원**: API 키 없이도 개발/테스트 가능
3. ✅ **시니어 친화적 UI**: 접근성 고려된 디자인
4. ✅ **타입 안정성**: TypeScript 사용
5. ✅ **모듈화**: 컴포넌트와 서비스 분리

---

## 📌 결론

현재 프로젝트는 **OpenAI + ElevenLabs** 기반으로 잘 구성되어 있으며, **Gemini로 전환**하기 위해서는 주로 LLM 부분의 API 교체가 필요합니다. STT와 TTS는 Google Cloud 서비스로 대체하거나 기존 서비스를 유지하는 선택이 필요합니다.

**서브 프로그래머로서의 역할**: Gemini 연동 작업을 단계별로 진행하고, 기존 기능을 유지하면서 점진적으로 마이그레이션하는 것이 좋겠습니다.

