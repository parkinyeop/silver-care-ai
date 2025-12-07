# Gemini API 설정 가이드

## Gemini API 키 발급 방법

1. **Google AI Studio 접속**
   - https://makersuite.google.com/app/apikey 방문
   - 또는 https://aistudio.google.com/app/apikey

2. **Google 계정으로 로그인**
   - Google 계정이 필요합니다

3. **API 키 생성**
   - "Create API Key" 버튼 클릭
   - 프로젝트 선택 또는 새 프로젝트 생성
   - API 키가 생성되면 복사

4. **환경 변수 설정**
   - 프로젝트 루트에 `.env.local` 파일 생성
   - 다음 내용 추가:
   ```bash
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. **서버 재시작**
   ```bash
   npm run dev
   ```

## 사용 모델

- **gemini-pro**: 텍스트 생성 및 분석에 사용
- 무료 할당량 제공 (월별 제한 있음)

## 주의사항

- API 키는 클라이언트 측에서 사용되므로 `.env.local`에 `NEXT_PUBLIC_` 접두사가 필요합니다
- API 키를 Git에 커밋하지 마세요 (`.env.local`은 `.gitignore`에 포함되어야 함)
- 프로덕션 환경에서는 환경 변수를 안전하게 관리하세요

## 문제 해결

### API 키가 작동하지 않는 경우
1. API 키가 올바르게 복사되었는지 확인
2. `.env.local` 파일이 프로젝트 루트에 있는지 확인
3. 서버를 재시작했는지 확인
4. 브라우저 콘솔에서 에러 메시지 확인

### 할당량 초과 시
- Google AI Studio에서 할당량 확인
- 필요시 유료 플랜으로 업그레이드

