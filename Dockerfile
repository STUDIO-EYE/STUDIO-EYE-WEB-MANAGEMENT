##노드이미지로 빌드 후, nginx 이미지로 보내 웹서버 실행
#Node lst ver.
FROM node:lts as build
#작업 위치 지정
WORKDIR /app
COPY package.json .
#의존성 설치
RUN npm i
COPY . .
#빌드 시작
RUN npm run build

#nginx
FROM nginx:stable-alpine
# nginx의 기본 설정을 삭제하고 앱에서 설정한 파일을 복사
RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx
# 위 스테이지에서 생성한 빌드 결과를 nginx의 샘플 앱이 사용하던 폴더로 이동
COPY --from=build /app/build /usr/share/nginx/html
#80번 포트 노출. 나중에 docker run 옵션으로 따로 매핑 해야함.
EXPOSE 80
# nginx 실행
CMD [ "nginx", "-g", "daemon off;" ]