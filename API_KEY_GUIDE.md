# API 키 발급 가이드

이 프로젝트에서 사용하는 API 키 발급 방법을 단계별로 설명합니다.

---

## 1. Google Gemini API 키 발급 (필수) 🔑

Gemini API는 AI 대화 생성 및 심리 분석에 사용됩니다.

### 발급 단계

#### 1단계: Google AI Studio 접속
1. 웹 브라우저를 열고 다음 주소 중 하나로 접속:
   - **방법 1**: https://makersuite.google.com/app/apikey
   - **방법 2**: https://aistudio.google.com/app/apikey
   - **방법 3**: https://ai.google.dev/ (Google AI Studio 검색)

#### 2단계: Google 계정 로그인
1. Google 계정으로 로그인
   - Gmail 계정이 있으면 바로 사용 가능
   - 없으면 새로 만들기: https://accounts.google.com/signup

#### 3단계: API 키 생성
1. 페이지에 접속하면 "Get API Key" 또는 "Create API Key" 버튼이 보입니다
2. 버튼 클릭
3. 프로젝트 선택 화면이 나타납니다:
   - **기존 프로젝트가 있는 경우**: 드롭다운에서 선택
   - **새 프로젝트 생성**: "Create new project" 선택
     - 프로젝트 이름 입력 (예: "silver-care-ai")
     - "Create" 클릭
4. API 키가 생성되면 화면에 표시됩니다
   - 예: `AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567`
5. **중요**: API 키를 복사해두세요 (나중에 다시 볼 수 없을 수 있습니다)

#### 4단계: API 키 확인 및 관리
- 생성된 API 키는 "API Keys" 페이지에서 확인 가능
- 필요시 여러 개의 API 키 생성 가능
- 키 삭제/재생성 가능

### 주의사항
- ✅ 무료 할당량 제공 (월별 제한 있음)
- ✅ API 키는 비공개로 유지 (공유하지 마세요)
- ⚠️ API 키가 노출되면 즉시 재생성 권장

---

## 2. ElevenLabs API 키 발급 (선택사항) 🎙️

ElevenLabs API는 음성 생성 및 목소리 클론에 사용됩니다. 
**참고**: 이 키가 없어도 텍스트 채팅은 정상 작동합니다.

### 발급 단계

#### 1단계: ElevenLabs 회원가입
1. 웹 브라우저를 열고 다음 주소로 접속:
   - https://elevenlabs.io/
2. 우측 상단 "Sign Up" 클릭
3. 회원가입 방법 선택:
   - **이메일로 가입**: Email과 Password 입력
   - **Google 계정으로 가입**: "Continue with Google" 클릭
   - **GitHub 계정으로 가입**: "Continue with GitHub" 클릭

#### 2단계: 이메일 인증 (이메일 가입 시)
1. 가입한 이메일로 인증 메일 확인
2. 메일의 인증 링크 클릭
3. 인증 완료

#### 3단계: API 키 생성

**방법 1: Settings 페이지에서 찾기**
1. 로그인 후 우측 상단 프로필 아이콘 클릭
2. **"Settings"** 클릭
3. Settings 페이지 상단의 탭을 확인:
   - **"Profile"** 탭 (현재 열려있을 수 있음)
   - **"API Keys"** 또는 **"API"** 탭 찾기
   - 탭이 보이지 않으면 아래 방법 2 시도

**방법 2: 사이드바에서 Developers 메뉴 찾기**
1. 왼쪽 사이드바에서 **"Developers"** 메뉴 찾기
2. "Developers" 클릭
3. "API Keys" 또는 "API" 섹션 찾기

**방법 3: 직접 URL 접근**
1. 브라우저 주소창에 다음 URL 입력:
   ```
   https://elevenlabs.io/app/settings/api-keys
   ```
2. 또는:
   ```
   https://elevenlabs.io/app/user/api-keys
   ```

**API 키 생성하기**
1. "API Keys" 페이지에서 **"Create API Key"** 또는 **"+"** 버튼 클릭
2. API 키 이름 입력 (예: "silver-care-ai")
3. "Create" 또는 "Generate" 클릭
4. 생성된 API 키가 화면에 표시됩니다
   - 예: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`
5. **중요**: API 키를 복사해두세요 (다시 볼 수 없습니다)

**참고**: 
- 무료 플랜에서도 API 키 발급 가능
- API 키가 보이지 않으면 계정이 완전히 인증되었는지 확인
- 브라우저를 새로고침해보세요

#### 4단계: 무료 플랜 확인
- ElevenLabs는 무료 플랜 제공 (월 10,000자 제한)
- 무료 플랜으로도 테스트 가능
- 필요시 유료 플랜 업그레이드 가능

### 주의사항
- ✅ 무료 플랜: 월 10,000자 제한
- ⚠️ API 키는 한 번만 표시되므로 안전한 곳에 저장
- ⚠️ API 키가 노출되면 즉시 삭제 후 재생성

---

## 3. 환경 변수 설정

API 키를 발급받은 후 프로젝트에 설정하는 방법입니다.

### 파일 위치
프로젝트 루트 디렉토리에 `.env.local` 파일 생성

### 파일 내용
```bash
# Google Gemini API Key (필수)
# 발급: https://makersuite.google.com/app/apikey
NEXT_PUBLIC_GEMINI_API_KEY=여기에_Gemini_API_키_붙여넣기

# ElevenLabs API Key (선택사항)
# 발급: https://elevenlabs.io/app/settings/api-keys
NEXT_PUBLIC_ELEVENLABS_API_KEY=여기에_ElevenLabs_API_키_붙여넣기
```

### 설정 방법

#### 방법 1: 터미널에서 직접 생성
```bash
# 프로젝트 루트로 이동
cd /Users/inyeoppark/Documents/MyGemeProject/silver-care-ai

# 파일 생성 및 편집
nano .env.local
# 또는
code .env.local
```

#### 방법 2: 텍스트 에디터로 생성
1. 프로젝트 루트 폴더 열기
2. 새 파일 생성: `.env.local`
3. 위의 내용을 복사하여 붙여넣기
4. 실제 API 키로 교체
5. 저장

### 예시
```bash
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
NEXT_PUBLIC_ELEVENLABS_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

## 4. 서버 재시작

환경 변수를 설정한 후 서버를 재시작해야 합니다.

```bash
npm run dev:restart
```

또는

```bash
# 서버 종료
lsof -ti:3000,3001 | xargs kill -9

# 서버 시작
npm run dev
```

---

## 5. API 키 확인 방법

### 브라우저 콘솔에서 확인
1. 브라우저에서 F12 키 누르기 (개발자 도구 열기)
2. Console 탭 클릭
3. 다음 메시지 확인:
   - `✅ Gemini API 응답 성공` → 정상 작동
   - `⚠️ Gemini API key not found` → API 키 미설정

### 터미널에서 확인 (보안상 권장하지 않음)
```bash
# API 키가 설정되었는지 확인 (값은 표시되지 않음)
grep -q "NEXT_PUBLIC_GEMINI_API_KEY" .env.local && echo "✅ 설정됨" || echo "❌ 없음"
```

---

## 6. 문제 해결

### Gemini API 키가 작동하지 않는 경우

1. **API 키 확인**
   - `.env.local` 파일에 올바르게 입력되었는지 확인
   - 공백이나 따옴표가 없는지 확인
   - `your_gemini_api_key_here` 같은 플레이스홀더가 아닌지 확인

2. **서버 재시작**
   ```bash
   npm run dev:restart
   ```

3. **브라우저 캐시 삭제**
   - 브라우저에서 Ctrl+Shift+R (Windows) 또는 Cmd+Shift+R (Mac)
   - 또는 시크릿 모드에서 테스트

4. **API 키 재생성**
   - Google AI Studio에서 기존 키 삭제
   - 새 키 생성
   - `.env.local` 파일 업데이트
   - 서버 재시작

### ElevenLabs API 키가 작동하지 않는 경우

1. **무료 할당량 확인**
   - ElevenLabs 대시보드에서 사용량 확인
   - 월 10,000자 제한 초과 시 유료 플랜 필요

2. **API 키 확인**
   - ElevenLabs 대시보드에서 키가 활성화되어 있는지 확인
   - 키가 삭제되었는지 확인

3. **에러 메시지 확인**
   - 브라우저 콘솔에서 정확한 에러 메시지 확인
   - "Invalid API key" → 키가 잘못됨
   - "Quota exceeded" → 할당량 초과

---

## 7. 비용 정보

### Gemini API
- ✅ **무료**: 월별 무료 할당량 제공
- 💰 **유료**: 할당량 초과 시 사용량 기반 과금
- 📊 할당량은 Google AI Studio에서 확인 가능

### ElevenLabs API
- ✅ **무료 플랜**: 월 10,000자
- 💰 **유료 플랜**: 
  - Starter: $5/월 (30,000자)
  - Creator: $22/월 (100,000자)
  - 더 많은 플랜: https://elevenlabs.io/pricing

---

## 8. 보안 주의사항

### ⚠️ 중요: API 키 보안

1. **절대 공유하지 마세요**
   - GitHub에 커밋하지 마세요
   - `.env.local`은 `.gitignore`에 포함되어 있어야 함
   - 공개 채팅방이나 포럼에 올리지 마세요

2. **키 노출 시 대응**
   - 즉시 해당 키 삭제
   - 새 키 생성
   - `.env.local` 파일 업데이트

3. **환경 변수 확인**
   ```bash
   # .gitignore에 .env.local이 포함되어 있는지 확인
   grep -q "\.env\.local" .gitignore && echo "✅ 안전" || echo "❌ 추가 필요"
   ```

---

## 요약

| API | 용도 | 필수 여부 | 발급 사이트 |
|-----|------|----------|------------|
| **Gemini** | AI 대화 생성, 심리 분석 | ✅ 필수 | https://makersuite.google.com/app/apikey |
| **ElevenLabs** | 음성 생성, 목소리 클론 | ⚪ 선택 | https://elevenlabs.io/app/settings/api-keys |

### 빠른 시작 체크리스트

- [ ] Gemini API 키 발급
- [ ] ElevenLabs API 키 발급 (선택)
- [ ] `.env.local` 파일 생성
- [ ] API 키 입력
- [ ] 서버 재시작 (`npm run dev:restart`)
- [ ] 브라우저 콘솔에서 확인

---

## 추가 도움말

- **Gemini API 문서**: https://ai.google.dev/docs
- **ElevenLabs API 문서**: https://elevenlabs.io/docs
- **프로젝트 이슈**: GitHub Issues에 문의

