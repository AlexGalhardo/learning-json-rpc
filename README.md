# JSON-RPC MongoDB API

## Development Setup Local

1. Clone repository
```bash
git clone git@github.com:AlexGalhardo/learning-load-stress-tests.git
```

2. Enter repository
```bash
cd learning-load-stress-tests/json-rpc-mongodb-api
```

3. Run setup.sh
```bash
chmod +x ./setup.sh && ./setup.sh
```

## [Single-file executable](https://bun.sh/docs/bundler/executables)

- Building Server
```bash
bun build --compile --minify ./src/server.ts --outfile server
```

- Building Client
```bash
bun build --compile --minify ./src/client.ts --outfile client
```

- Building all
```bash
bun run build
```

- Executing binaries
```bash
./server
```

```bash
./client
```
