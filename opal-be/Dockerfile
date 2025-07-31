# golang application
FROM golang:1.23.4-alpine AS builder

WORKDIR /app

# Copy go.mod and go.sum for better caching
COPY go.mod go.sum ./

# Cache Go modules and build cache
RUN --mount=type=cache,target=/go/pkg/mod go mod download

# Copy the rest of the application
COPY . .

# Build the Go app with build cache enabled
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go build -o main main.go

RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go build -o migrate migrate.go

# Use a minimal image for the final build
FROM alpine:latest
LABEL maintainer="Nikhil Nayak <nikhil.nixel@gmail.com>"

RUN apk add -U tzdata
ENV TZ=Asia/Kolkata

# Set environment variables for Chrome Headless
#ENV CHROME_BIN=/usr/bin/chromium-browser
#ENV CHROME_ARGS="--headless --disable-gpu --no-sandbox --disable-dev-shm-usage"

WORKDIR /root/

COPY --from=builder /app/main .
COPY --from=builder /app/migrate .
#COPY --from=builder /app/.env.* .
#COPY --from=builder /app/api/templates ./api/templates
#COPY --from=builder /app/api/certs ./api/certs


# Expose the application port
EXPOSE 8080

# Run the application
CMD ["./main"]