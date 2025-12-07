# 서버 관리 명령어 가이드

## 서버 종료 방법

### 방법 1: 포트로 프로세스 종료 (권장)
```bash
# 포트 3000, 3001에서 실행 중인 프로세스 종료
lsof -ti:3000,3001 | xargs kill -9
```

### 방법 2: Next.js 프로세스 직접 종료
```bash
# Next.js 개발 서버 프로세스 찾아서 종료
ps aux | grep -i "next dev" | grep -v grep | awk '{print $2}' | xargs kill -9
```

### 방법 3: Lock 파일 제거 후 재시작
```bash
# Lock 파일 제거
rm -f .next/dev/lock

# 그 후 서버 재시작
npm run dev
```

### 방법 4: 모든 Node 프로세스 종료 (주의: 다른 Node 앱도 종료됨)
```bash
# 모든 Node 프로세스 종료
pkill -9 node
```

## 서버 시작

```bash
npm run dev
```

## 서버 재시작 (가장 간단한 방법) ⭐

```bash
npm run dev:restart
```

이 명령어는 다음을 자동으로 수행합니다:
1. 포트 3000, 3001에서 실행 중인 프로세스 종료
2. Lock 파일 제거
3. 서버 재시작

## 서버 재시작 (수동 방법)

```bash
# 1. 서버 종료
lsof -ti:3000,3001 | xargs kill -9

# 2. Lock 파일 제거 (선택사항)
rm -f .next/dev/lock

# 3. 서버 시작
npm run dev
```

## 문제 해결

### 포트가 이미 사용 중일 때
```bash
# 포트 사용 중인 프로세스 확인
lsof -i:3000
lsof -i:3001

# 특정 포트의 프로세스 종료
kill -9 $(lsof -ti:3000)
```

### Lock 파일 오류 해결
```bash
# Lock 파일 제거
rm -rf .next/dev/lock

# 또는 전체 .next 디렉토리 제거 후 재빌드
rm -rf .next
npm run dev
```

## 빠른 참조

| 작업 | 명령어 |
|------|--------|
| 서버 시작 | `npm run dev` |
| 서버 재시작 | `npm run dev:restart` ⭐ |
| 서버 종료 (포트) | `lsof -ti:3000,3001 \| xargs kill -9` |
| 서버 종료 (프로세스) | `ps aux \| grep -i "next dev" \| grep -v grep \| awk '{print $2}' \| xargs kill -9` |
| Lock 파일 제거 | `rm -f .next/dev/lock` |
| 포트 확인 | `lsof -i:3000` |

