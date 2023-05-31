FROM golang:1.20 as build
WORKDIR /app
COPY . .
ENV G0111MODULE=on
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM scratch
WORKDIR /app
COPY --from=build /app/main .
CMD ["./main"]
