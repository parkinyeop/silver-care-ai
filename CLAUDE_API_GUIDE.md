# Claude API 전환 가이드

## Claude API로 전환 가능 여부

✅ **가능합니다!** 현재 프로젝트 구조에서 Claude API로 전환할 수 있습니다.

### 기능별 호환성

| 기능 | 현재 | Claude 전환 후 |
|------|------|---------------|
| **음성 인식 (STT)** | Web Speech API | ✅ 동일 (변경 불필요) |
| **AI 대화 생성 (LLM)** | Gemini API | ✅ Claude API로 교체 |
| **음성 생성 (TTS)** | ElevenLabs | ✅ 동일 (변경 불필요) |
| **심리 분석** | Gemini API | ✅ Claude API로 교체 |

## Claude API 장점

1. **안정적인 모델**: Claude 3.5 Sonnet, Claude 3 Opus 등
2. **우수한 한국어 지원**: 자연스러운 한국어 대화 생성
3. **긴 컨텍스트**: 최대 200K 토큰 지원
4. **안전한 응답**: 유해 콘텐츠 필터링

## Claude API 키 발급 방법

### 1단계: Anthropic 계정 생성
1. https://console.anthropic.com/ 접속
2. "Sign Up" 클릭
3. 이메일로 회원가입

### 2단계: API 키 생성
1. 로그인 후 "API Keys" 메뉴 클릭
2. "Create Key" 버튼 클릭
3. 키 이름 입력 (예: "silver-care-ai")
4. API 키 복사
   - 예: `sk-ant-api03-...`

### 3단계: 환경 변수 설정
`.env.local` 파일에 추가:
```bash
NEXT_PUBLIC_CLAUDE_API_KEY=your_claude_api_key_here
```

## Claude API 모델 종류

- **claude-3-5-sonnet-20241022**: 최신 모델 (권장)
- **claude-3-opus-20240229**: 고성능 모델
- **claude-3-sonnet-20240229**: 균형잡힌 모델
- **claude-3-haiku-20240307**: 빠른 모델

## 비용 정보

- **무료 크레딧**: 신규 계정에 $5 크레딧 제공
- **유료 플랜**: 사용량 기반 과금
- **가격**: Gemini보다 약간 비쌈 (하지만 더 안정적)

## 전환 방법

코드를 수정하여 Claude API를 사용하도록 변경할 수 있습니다. 전환을 원하시면 알려주세요!

