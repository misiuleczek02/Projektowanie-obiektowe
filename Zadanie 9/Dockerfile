FROM swift:5.9-jammy AS build

RUN export DEBIAN_FRONTEND=noninteractive DEBCONF_NONINTERACTIVE_SEEN=true \
    && apt-get -q update \
    && apt-get -q dist-upgrade -y \
    && apt-get install -y libjemalloc-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build

COPY ./Package.* ./
RUN swift package resolve --skip-update

COPY . .
RUN swift build -c release --static-swift-stdlib

WORKDIR /staging
RUN cp "$(swift build --package-path /build -c release --show-bin-path)/App" ./
RUN find -L "$(swift build --package-path /build -c release --show-bin-path)/" -regex '.*\.resources$' -exec cp -Ra {} ./ \;
RUN [ -d /build/Public ] && cp -R /build/Public ./Public || true
RUN [ -d /build/Resources ] && cp -R /build/Resources ./Resources || true

FROM swift:5.9-jammy-slim

RUN export DEBIAN_FRONTEND=noninteractive DEBCONF_NONINTERACTIVE_SEEN=true \
    && apt-get -q update \
    && apt-get -q dist-upgrade -y \
    && apt-get -q install -y libjemalloc2 ca-certificates tzdata \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build /staging /app

ENV SWIFT_BACKTRACE=enable=no
EXPOSE 8080

CMD ["sh", "-c", "./App serve --env production --hostname 0.0.0.0 --port ${PORT:-8080}"]
