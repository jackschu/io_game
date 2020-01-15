FROM golang:1.13.6-stretch AS builder
WORKDIR /build
ADD server server
ADD client client
RUN cd server && go mod download
RUN cd server && go build main.go

FROM debian:stretch
COPY --from=builder /build/server/main /server/main
COPY --from=builder /build/client/dist /client/dist

WORKDIR /server
ENTRYPOINT ["./main"]