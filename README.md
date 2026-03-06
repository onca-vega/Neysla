# Neysla

[![CI](https://github.com/onca-vega/Neysla/actions/workflows/ci.yml/badge.svg)](https://github.com/onca-vega/Neysla/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/onca-vega/Neysla/branch/master/graph/badge.svg)](https://codecov.io/gh/onca-vega/Neysla)
[![NPM](https://nodei.co/npm/neysla.png?mini=true)](https://www.npmjs.com/package/neysla)
[![Node version](https://img.shields.io/badge/package-v4.0.1-orange.svg)](https://www.npmjs.com/package/neysla)

## Documentación

- [Aquí](https://ingenieria.onca-vega.com/portafolio/#/neysla) puedes acceder a la documentación de Neysla.

## Migración de v3 a v4

### Manejo de errores

```js
// v3
const result = neysla.init(config);
if (!result) {
  /* error */
}

// v4
try {
  const result = await neysla.init(config);
} catch (err) {
  // err es un TypeError con el mensaje de error
}
```

### Headers de respuesta

```js
// v3 (XHR — case-sensitive)
response.headers["Content-Type"];

// v4 (fetch API — siempre lowercase)
response.headers["content-type"];
```

### setModel() errores

```js
// v3
const model = service.setModel(2);
if (!model) {
  /* error */
}

// v4
try {
  const model = service.setModel(2);
} catch (err) {
  // err es un TypeError
}
```

## Tests manuales

Los tests manuales se encuentran en `test/manual/`. Requieren un build previo:

```bash
npm run build
```

| Archivo                | Descripción        | Comando                                |
| ---------------------- | ------------------ | -------------------------------------- |
| `test/manual/esm.mjs`  | Node.js — ESM      | `node test/manual/esm.mjs`             |
| `test/manual/cjs.cjs`  | Node.js — CJS      | `node test/manual/cjs.cjs`             |
| `test/manual/cdn.html` | Browser — IIFE/CDN | Servir localmente, abrir en el browser |

Para el test de browser puedes usar cualquier servidor local, por ejemplo:

```bash
npx serve .
# Abrir: http://localhost:3000/test/manual/cdn.html
```

## Release

Para publicar una nueva versión a npm via GitHub Actions:

```bash
# 1. Actualizar version en package.json
npm version patch   # o minor / major

# 2. Empujar el commit y el tag
git push origin master
git push origin --tags
```

El workflow `.github/workflows/publish.yml` se dispara automáticamente con cualquier tag `v*` y publica a npm via Trusted Publishing (sin token).

## Autor

- **Marcos Jesus Chavez V** - [onca-vega](https://yo.onca-vega.com)

## Licencia

Licencia MIT.

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

## Documentation

- [Here](https://ingenieria.onca-vega.com/en/portafolio/#/neysla) you can access Neysla's documentation.

## Migration from v3 to v4

### Error handling

```js
// v3
const result = neysla.init(config);
if (!result) {
  /* error */
}

// v4
try {
  const result = await neysla.init(config);
} catch (err) {
  // err is a TypeError with the error message
}
```

### Response headers

```js
// v3 (XHR — case-sensitive)
response.headers["Content-Type"];

// v4 (fetch API — always lowercase)
response.headers["content-type"];
```

## Manual tests

Manual tests are located in `test/manual/`. They require a build first:

```bash
npm run build
```

| File                   | Description        | Command                           |
| ---------------------- | ------------------ | --------------------------------- |
| `test/manual/esm.mjs`  | Node.js — ESM      | `node test/manual/esm.mjs`        |
| `test/manual/cjs.cjs`  | Node.js — CJS      | `node test/manual/cjs.cjs`        |
| `test/manual/cdn.html` | Browser — IIFE/CDN | Serve locally and open in browser |

For the browser test you can use any local server, e.g.:

```bash
npx serve .
# Open: http://localhost:3000/test/manual/cdn.html
```

## Release

To publish a new version to npm via GitHub Actions:

```bash
# 1. Update version in package.json
npm version patch   # or minor / major

# 2. Push the commit and the tag
git push origin master
git push origin --tags
```

The `.github/workflows/publish.yml` workflow triggers automatically on any `v*` tag and publishes to npm via Trusted Publishing (no token required).

## Author

- **Marcos Jesus Chavez V** - [onca-vega](https://yo.onca-vega.com)

## License

MIT License.
