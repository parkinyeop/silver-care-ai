# 실버 케어 AI (Silver Care AI)

부모와 자녀의 목소리를 등록하여 AI 채팅, 알림, 메시지에 활용하는 서비스입니다.

## 주요 기능

- 🎙️ **목소리 등록**: 부모 또는 자녀의 목소리를 녹음하여 AI 음성 모델 생성
- 🗣️ **AI 채팅**: 자녀의 목소리로 부모님과 대화하는 AI 어시스턴트
- ⏰ **음성 알림**: 등록된 목소리로 알림 메시지를 음성으로 재생
- ⚙️ **설정 관리**: 목소리 및 알림 설정 관리

## 필수 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
# OpenAI API Key (음성 인식 및 대화 생성용)
# 발급: https://platform.openai.com/api-keys
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here

# ElevenLabs API Key (음성 생성 및 목소리 클론용)
# 발급: https://elevenlabs.io/app/settings/api-keys
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

> **참고**: API 키가 없어도 Mock 모드로 실행되지만, 실제 기능을 사용하려면 API 키가 필요합니다.

## Getting Started

First, install dependencies and set up environment variables, then run the development server:

```bash
# Dependencies 설치
npm install

# 환경 변수 파일 생성 (.env.local)
# 위의 환경 변수 설정 섹션을 참고하여 API 키를 설정하세요

# 개발 서버 실행
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 사용 방법

1. **목소리 등록**: "목소리 등록하기" 버튼을 눌러 부모 또는 자녀의 목소리를 녹음합니다.
   - 최소 30초 이상 (1분 이상 권장)
   - 조용한 곳에서 평소 말투로 자연스럽게 읽어주세요

2. **AI 채팅**: 자녀의 목소리가 등록되면 "대화 시작하기"에서 음성 대화를 시작할 수 있습니다.

3. **알림 설정**: "설정" 페이지에서 시간별 알림을 추가하고, 등록된 목소리로 알림을 받을 수 있습니다.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
