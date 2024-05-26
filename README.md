<div align="center">
  <h1 align="center">Learning JSON-RPC</a>
</div>

## Introduction

- A personal project I created to learn and improve my skills in:
  - [https://www.jsonrpc.org/specification](https://www.jsonrpc.org/specification)
  - [https://www.npmjs.com/package/json-rpc-2.0](https://www.npmjs.com/package/json-rpc-2.0)

## Development Setup Local

1. Clone repository
```
git clone git@github.com:AlexGalhardo/learning-json-rpc.git
```

2. Install dependencies
```
bun install
```

3. Run setup.sh
```
chmod +x setup.sh && ./setup.sh
```

## [Single-file executable](https://bun.sh/docs/bundler/executables)

- Building Server
```
bun build --compile --minify ./src/server.ts --outfile server
```

- Building Client
```
bun build --compile --minify ./src/client.ts --outfile client
```

- Building all
```
bun run build
```

- Executing binaries
```
./server
```

```
./client
```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) April 2024-present, [Alex Galhardo](https://github.com/AlexGalhardo)
