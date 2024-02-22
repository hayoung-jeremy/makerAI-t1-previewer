# MAKER AI type 1 previewer

- 이 레포는 AI research team이 개발한 MAKER AI type 1 의 preview 모바일웹앱입니다.
- threestudio 기반 image to 3D AI인 type 1의 생성 전 과정에서 생성 대기, 생성 중, 생성 완료 후의 UI를 나타냅니다.

## Install

- git clone 후 `npm install` 또는 `pnpm install`
- 루트 경로에 `.env` 파일 추가 및 아래 내용 작성
  ```
  VITE_API_URL = "http://10.190.140.55:8086" # getStatus, getPreview
  VITE_RESULT_URL = "https://ai-result.altava.com/result" # getResult
  ```
- 라이브 배포 시 pm2 사용
  ```
  pm2 start pnpm --name preview-pro -- start
  ```
