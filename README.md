# Neysla

[![CI](https://github.com/onca-vega/Neysla/actions/workflows/ci.yml/badge.svg)](https://github.com/onca-vega/Neysla/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/onca-vega/Neysla/branch/master/graph/badge.svg)](https://codecov.io/gh/onca-vega/Neysla)
[![NPM](https://nodei.co/npm/neysla.png?mini=true)](https://www.npmjs.com/package/neysla)
[![Node version](https://img.shields.io/badge/package-v4.0.0-orange.svg)](https://www.npmjs.com/package/neysla)

## Documentación

- [Aquí](https://ingenieria.onca-vega.com/portafolio/#/neysla) puedes acceder a la documentación de Neysla.

## Migración de v3 a v4

### Manejo de errores

```js
// v3
const result = neysla.init(config);
if (!result) { /* error */ }

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
response.headers["Content-Type"]

// v4 (fetch API — siempre lowercase)
response.headers["content-type"]
```

### setModel() errores

```js
// v3
const model = service.setModel(2);
if (!model) { /* error */ }

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

| Archivo | Descripción | Comando |
|---|---|---|
| `test/manual/esm.mjs` | Node.js — ESM | `node test/manual/esm.mjs` |
| `test/manual/cjs.cjs` | Node.js — CJS | `node test/manual/cjs.cjs` |
| `test/manual/cdn.html` | Browser — IIFE/CDN | Servir localmente, abrir en el browser |

Para el test de browser puedes usar cualquier servidor local, por ejemplo:

```bash
npx serve .
# Abrir: http://localhost:3000/test/manual/cdn.html
```

## Autor

- **Marcos Jesus Chavez V** - [onca-vega](https://yo.onca-vega.com)

## Licencia

Licencia MIT.

––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

## Documentation

- [Here](https://ingenieria.onca-vega.com/portafolio/#/neysla) you can access Neysla's documentation.

## Migration from v3 to v4

### Error handling

```js
// v3
const result = neysla.init(config);
if (!result) { /* error */ }

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
response.headers["Content-Type"]

// v4 (fetch API — always lowercase)
response.headers["content-type"]
```

## Manual tests

Manual tests are located in `test/manual/`. They require a build first:

```bash
npm run build
```

| File | Description | Command |
|---|---|---|
| `test/manual/esm.mjs` | Node.js — ESM | `node test/manual/esm.mjs` |
| `test/manual/cjs.cjs` | Node.js — CJS | `node test/manual/cjs.cjs` |
| `test/manual/cdn.html` | Browser — IIFE/CDN | Serve locally and open in browser |

For the browser test you can use any local server, e.g.:

```bash
npx serve .
# Open: http://localhost:3000/test/manual/cdn.html
```

## Author

- **Marcos Jesus Chavez V** - [onca-vega](https://yo.onca-vega.com)

## License

MIT License.
