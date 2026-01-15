# 1. For build React app
FROM node:22-alpine AS development


# Set environment variables
ENV APP_CONFIG_IP_ROOT=https://gwdu.ptit.edu.vn/
ENV APP_CONFIG_ONE_SIGNAL_ID=
ENV APP_CONFIG_SENTRY_DSN=
ENV APP_CONFIG_KEYCLOAK_AUTHORITY=https://gwdu.ptit.edu.vn/sso/realms/ptit
ENV APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID=ptit-
ENV APP_CONFIG_APP_VERSION=250219.1200

ENV APP_CONFIG_TEN_TRUONG='Học viện Công nghệ Bưu chính Viễn thông'
ENV APP_CONFIG_TIEN_TO_TRUONG='Học viện'
ENV APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH='PTIT'
ENV APP_CONFIG_PRIMARY_COLOR='#CC0D00'

ENV APP_CONFIG_URL_LANDING=https://ptit.edu.vn/
ENV APP_CONFIG_URL_CONNECT=https://slink.ptit.edu.vn/
ENV APP_CONFIG_URL_CAN_BO=https://canbo.ptit.edu.vn/
ENV APP_CONFIG_URL_DAO_TAO=https://quanlydaotao.ptit.edu.vn/
ENV APP_CONFIG_URL_NHAN_SU=https://tccb.ptit.edu.vn/
ENV APP_CONFIG_URL_TAI_CHINH=https://thanhtoan.ptit.edu.vn/
ENV APP_CONFIG_URL_CTSV=https://ctsv.ptit.edu.vn/
ENV APP_CONFIG_URL_QLKH=https://qlkhcn.ptit.edu.vn/
ENV APP_CONFIG_URL_VPS=https://vanphong.ptit.edu.vn/
ENV APP_CONFIG_URL_KHAO_THI=https://khaothi.ptit.edu.vn/
ENV APP_CONFIG_URL_CORE=https://core.ptit.edu.vn/
ENV APP_CONFIG_URL_CSVC=
ENV APP_CONFIG_URL_THU_VIEN=https://qltv.ptit.edu.vn/
ENV APP_CONFIG_URL_QLVB=https://gwdu.ptit.edu.vn/sso/realms/ptit/protocol/openid-connect/auth?response_type=token&client_id=lms_ptit&redirect_uri=http%3A%2F%2Fvanban.ptit.edu.vn%2Fauth_oauth%2Fsignin&scope=openid+profile+email&state=%7B%22d%22%3A+%22ptit-bu%22%2C+%22p%22%3A+4%2C+%22r%22%3A+%22http%253A%252F%252Fvanban.ptit.edu.vn%252Fweb%22%7D
ENV APP_CONFIG_URL_VBCC=https://vanbang.ptit.edu.vn/
ENV APP_CONFIG_URL_QLND=https://iam.ptit.edu.vn/
ENV APP_CONFIG_URL_TAP_CHI_KH=


# Set working directory
WORKDIR /app

COPY package.json /app/
RUN yarn install

COPY . /app

FROM development AS build
RUN yarn build

FROM nginx:alpine
COPY --from=build /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /var/www/website

RUN rm -rf ./*
COPY --from=build /app/dist .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
