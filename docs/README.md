# Neysla
[![NPM](https://nodei.co/npm/neysla.png?mini=true)](https://www.npmjs.com/package/neysla)
[![Node version](https://img.shields.io/badge/package-v2.1.8-orange.svg)](https://www.npmjs.com/package/neysla)
[![Dependencies](https://img.shields.io/badge/dependencies-none-green.svg)](https://www.npmjs.com/package/neysla)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://travis-ci.org/onca-vega/Neysla)
[![Coverage Status](https://coveralls.io/repos/github/onca-vega/Neysla/badge.svg?branch=master)](https://coveralls.io/github/onca-vega/Neysla?branch=master)

Modelador de recursos basados en promesas para consumo de API HTTP RESTful para
el navegador.

## Traducciones
- [Inglés]

## Introducción
De acuerdo a [RESTful API Strategy], una de las características principales de
las API RESTful es que los recursos deberían ser anidados:
"That is, the URIs may reflect that one resource is nested within another like
in this made-up example: http://greatvalley.edu/example-app/courses/2305/sections/2465
(where section '2465' is a nested resource under course 2305)".

Esta es una buena característica que describe como debería ser un modelo de
recursos para consumo, debido a que, como podemos ver en la cita, "courses" y
"sections" son partes estáticas, mientras que "2305" y "2465" son partes
dinámicas del recurso.

Además es importante mencionar que cualquier API RESTful debería tener reacciones
differentes, dependiendo del método HTTP usado (POST, GET, PATCH, etc...), y puede
o no necesitar parámetros para enviar, que son requeridos por ejemplo para filtrar,
ordenar o crear registros dentro de la base de datos de nuestra API.

Neysla es una librería basada en JavaScript la cual tiene como principal objetivo
definir todos nuestros modelos de consumo una vez, para poder usarlos a lo largo
de toda tu aplicación.

## Comenzando
### Requisitos previos
- node 10+
- npm 6+

### Instalación
#### Instalación de Neysla mediante npm
```bash
$ npm install --save neysla
```

#### Importación de Neysla dentro de tu aplicación:
```bash
import Neysla from "neysla";
```

## Uso
### Inicializando Neysla
Para poder explicar el uso de Neysla, primero definiremos algunos recursos de
ejemplo para una API que queremos modelar:
1. Nuestra API es consumible bajo la liga "https://www.your-api.com/".
2. Tenemos tres recursos en nuestra API:
  - "https://www.your-api.com/user/$user_id", el cual es definido para interactuar
  con todos (o un específico) los usuarios.
  - "https://www.your-api.com/user/$user_id/contact/$contact_id", el cual es
  definido para interactuar con todos (o un específico) los contactos anidados a
  un usuario definido.
  - "https://www.your-api.com/user/$user_id/contact/$contact_id/phone/$phone_id",
  el cual es definido para interactuar con todos (o un específico) los teléfonos
  de un contacto anidado a un usuario definido.

Definido lo anterior, tenemos:

```bash
const neysla = new Neysla({

  name: "yourApiModeler",
  token: {
    name: "accessToken",
    value: "asodug2312pu312pu3_asodq231"
  },
  url: "https://www.your-api.com/"

}).init();
```

Los parámetros para inicializar Neysla son:

parámetro | descripción | es requerido | ejemplo
------------ | ------------- | ------------ | -------------
name | El nombre de nuestro creador de modelos | si | "yourApiModeler"
token | Neysla puede lidiar con tokens de Autorización si tu API está protegida | no | { name: "accessToken", value: "asodug2312pu312pu3_asodq231" }
token.name | El nombre del token con el que será añadido a la URL de tu modelo | si (si el token es definido) | "accessToken"
token.value | El valor del token de Autorización | si (si el token es definido) | "asodug2312pu312pu3_asodq231"
url | La liga en donde se consume tu API. Será usada para añadirse al inicio de la URL de cada modelo | si | "https://www.your-api.com/"

Después simplemente llamamos al método "init".

### Usando Neysla para la definición de modelos
Es importante saber que Neysla está basado en promesas, por lo que, continuando
con nuestro ejemplo, puede ser usado así:

```bash
let user = null,
userContact = null,
userContactPhone = null;

const neysla = new Neysla({

  name: "yourApiModeler",
  token: {
    name: "accessToken",
    value: "asodug2312pu312pu3_asodq231"
  },
  url: "https://www.your-api.com/"

}).init();
neysla.then(modelers => {

  user = modelers.yourApiModeler.setModel("user");

  userContact = modelers.yourApiModeler.setModel([ "user", "contact" ]);

  userContactPhone = modelers.yourApiModeler.setModel([ "user", "contact", "phone" ]);

}).catch(err => console.log(err));
```

En el código anterior primero inicializamos Neysla, posterior a eso usamos el
método "then" para pasar una única variable mediante la ejecución de la promesa
(definida como "modelers"). Después, "modelers" es usada para definir todos
nuestros modelos de consumo, mediante el llamado del modelador que definimos
previamente como "yourApiModeler". Cada modelador tiene los siguientes métodos:

nombre | descripción | argumentos
------------ | ------------- | ------------
setModel | Método que te permite definir todos tus modelos de consumo (recibe
la parte estática del recurso a definir) | array O string
getToken | Método que regresa el token definido en la configuración de Neysla | ninguno

### Haciendo peticiones con los modelos
Una vez que hemos definido todos nuestros modelos, es importante saber cuales
métodos HTTP son soportados por Neysla:
- GET
- HEAD
- POST
- PATCH
- PUT
- DELETE

#### GET (Método "get" de Neysla)
```bash
...
  user = modelers.yourApiModeler.setModel("user");

  user.get({}).then(data => console.log(data)).catch(err => console.log(err));

  user.get({
    delimiters: 10,
    responseType: "blob"
  }).then(data => console.log(data)).catch(err => console.log(err));

  user.get({
    params: {
      "order": "age",
      "name": "Ort"
    }
  }).then(data => console.log(data)).catch(err => console.log(err));
...
```
Una vez que hemos definido todos nuestros modelos, podemos comenzar a ejecutar
todas las peticiones requeridas por nuestra aplicación. En el código anterior
hicimos tres peticiones GET:
- La primera recibe un objeto vacío, que significa que estamos haciendo una
petición GET a "https://www.your-api.com/user?accessToken=asodug2312pu312pu3_asodq231".
- La segunda recibe un objeto con los nodos "delimiters" = 10, y
"responseType" = "blob", lo que significa que estamos haciendo una petición GET
a "https://www.your-api.com/user/10?accessToken=asodug2312pu312pu3_asodq231", y
queremos recibir la respuesta como tipo "blob".
- La tercera recibe un objeto con algunos "params", lo que significa que estamos
haciendo una petición GET a
"https://www.your-api.com/user?order=age&name=Ort&accessToken=asodug2312pu312pu3_asodq231".

Ahora veamos otros ejemplos:
```bash
...
  userContactPhone = modelers.yourApiModeler.setModel([ "user", "contact", "phone" ]);

  userContactPhone.get({
    delimiters: [ 1, 500 ]
    params: {
      "page": "7",
      "perPage": "35"
    }
  }).then(data => console.log(data)).catch(err => console.log(err));
...
```
En la petición anterior estamos enviando "delimiters" y "params" al modelo
"userContactPhone", esto significa que estamos haciendo una petición GET a
"https://www.your-api.com/user/1/contact/500/phone?page=7&perPage=35&accessToken=asodug2312pu312pu3_asodq231".

Con lo anterior podemos definir las características del método "get":

características | descripción | valor por defecto | tipo de dato soportado
------------ | ------------- | ------------ | -------------
delimiters | Se refiere a la parte dinámica del recurso consumido | undefined | array O integer O string
params | Se refiere a los queryparams añadidos al recurso | undefined | object
requestJson | TRUE para definir el contenido como "application/json"; FALSE para definirlo como "application/x-www-form-urlencoded" | false | boolean
responseType | [Tipo de respuesta] soportado para las peticiones mediante JavaScript | "json" | string

#### HEAD (Método "head" de Neysla)
```bash
...
  user = modelers.yourApiModeler.setModel("user");

  user.head({
    delimiters: 10,
    params: {
      "order": "age",
      "name": "Ort"
    }
  }).then(data => console.log(data)).catch(err => console.log(err));
...
```
Trabaja exactamente igual que el método anterior (con las implicaciones que
conlleva el método HEAD).

#### POST (Método "post" de Neysla)
```bash
...
  userContact = modelers.yourApiModeler.setModel([ "user", "contact" ]);

  userContact.post({
    delimiters: [ 12 ],
    requestJson: true,
    params: {
      "foo": "bar"
    },
    body: {
      "address": "Saint street 177",
      "active": false,
      "first_name": "Roberto",
      "last_name": "Magallanez"
    }
  }).then(data => console.log(data)).catch(err => console.log(err));
...
```
En la petición anterior estamos enviando "delimiters", "params" y "body" al modelo
"userContact", lo que significa que estamos haciendo una petición POST a
"https://www.your-api.com/user/12/contact?foo=bar&accessToken=asodug2312pu312pu3_asodq231".
En este caso, "body" es usado como el cuerpo de la petición, y el nodo
"requestJson" implica que queremos enviarlo como un contenido de tipo
"application/json".

Con lo anterior podemos definir las características del método "post":

características | descripción | valor por defecto | tipo de dato soportado
------------ | ------------- | ------------ | -------------
delimiters | Se refiere a la parte dinámica del recurso consumido | undefined | array O integer O string
body | Se refiere al cuerpo de la petición | undefined | object
params | Se refiere a los queryparams añadidos al recurso | undefined | object
requestJson | TRUE para definir el contenido como "application/json"; FALSE para definirlo como "application/x-www-form-urlencoded" | FALSE | boolean
responseType | [Tipo de respuesta] soportado para las peticiones mediante JavaScript | "json" | string

#### PATCH (Petición "patch" de Neysla)
```bash
...
  userContact = modelers.yourApiModeler.setModel([ "user", "contact" ]);

  userContact.patch({
    delimiters: [ 12, 210 ],
    params: {
      "foo": "bar"
    },
    body: {
      "active": true
    }
  }).then(data => console.log(data)).catch(err => console.log(err));
...
```
En la petición anterior estamos enviando "delimiters", "params" y "body" al modelo
"userContact", lo que significa que estamos haciendo una petición PATCH a
"https://www.your-api.com/user/12/contact/210?foo=bar&accessToken=asodug2312pu312pu3_asodq231".
En este caso, "body" es usado como el cuerpo de la petición, y el nodo
"requestJson" no está definido, lo cual implica que queremos enviarlo como un
contenido de tipo "application/x-www-form-urlencoded".

Con lo anterior podemos definir las características del método "patch":

características | descripción | valor por defecto | tipo de dato soportado
------------ | ------------- | ------------ | -------------
delimiters | Se refiere a la parte dinámica del recurso consumido | undefined | array O integer O string
body | Se refiere al cuerpo de la petición | undefined | object
params | Se refiere a los queryparams añadidos al recurso | undefined | object
requestJson | TRUE para definir el contenido como "application/json"; FALSE para definirlo como "application/x-www-form-urlencoded" | FALSE | boolean
responseType | [Tipo de respuesta] soportado para las peticiones mediante JavaScript | "json" | string

#### PUT (Método "put" de Neysla)
```bash
...
  userContact = modelers.yourApiModeler.setModel([ "user", "contact" ]);

  userContact.put({
    delimiters: [ 12, 210 ],
    params: {
      "active": true
    }
  }).then(data => console.log(data)).catch(err => console.log(err));
...
```
Trabaja exactamente igual que el método anterior (con las implicaciones que
conlleva el método PUT).

#### DELETE (Neysla's remove method)
```bash
...
  userContact = modelers.yourApiModeler.setModel([ "user", "contact" ]);

  userContact.remove({
    delimiters: [ 12, 210 ],
    params: {
      "foo": "bar"
    }
  }).then(data => console.log(data)).catch(err => console.log(err));
...
```
En la petición anterior estamos enviando "delimiters" y "params" al modelo
"userContact", lo que significa que estamos haciendo una petición DELETE a
"https://www.your-api.com/user/12/contact/210?foo=bar&accessToken=asodug2312pu312pu3_asodq231".

Con lo anterior podemos definir las características del método "remove":

características | descripción | valor por defecto | tipo de dato soportado
------------ | ------------- | ------------ | -------------
delimiters | Se refiere a la parte dinámica del recurso consumido | undefined | array O integer O string
body | Se refiere al cuerpo de la petición | undefined | object
params | Se refiere a los queryparams añadidos al recurso | undefined | object
requestJson | TRUE para definir el contenido como "application/json"; FALSE para definirlo como "application/x-www-form-urlencoded" | FALSE | boolean
responseType | [Tipo de respuesta] soportado para las peticiones mediante JavaScript | "json" | string

### Definición de la respuesta
Después de realizar una petición, la respuesta recibida posee las siguientes
características (el formato que tomen dependerá del parámetro "responseType"):

nodo | descripción | tipo de dato
------------ | ------------- | ------------
headers | Encabezado de la respuesta | Object
status | Estatus de la respuesta | number
statusText | Estatus de la respuesta como texto | string
data | La información del cuerpo de la respuesta | Object
dataType | Tipo de respuesta | string
url | Url de respuesta | string
getHeader(:headerName) | Método para solicitar un header específico (necesita un argumento tipo string) | function

### Soporte para múltiples modeladores
Puedes definir uno o más modeladores en Neysla, por ejemplo cuando quieres
consumir más de una API.
Por ejemplo:
```bash
let user = null,
userContact = null;
let store = null,
storeElement = null;

const neysla = new Neysla([
  {
    name: "yourApiUserModeler",
    token: {
      name: "accessToken",
      value: "asodug2312pu312pu3_asodq231"
    },
    url: "https://www.your-api-user.com/"
  },
  {
    name: "yourApiStoreModeler",
    url: "https://www.your-api-store.com/"
  }
]).init();
neysla.then(modelers => {

  user = modelers.yourApiUserModeler.setModel("user");
  userContact = modelers.yourApiUserModeler.setModel([ "user", "contact" ]);

  store = modelers.yourApiStoreModeler.setModel("store");
  storeElement = modelers.yourApiStoreModeler.setModel([ "store", "element" ]);

}).catch(err => console.log(err));
```
Y todas las caraterísticas definidas con anterioridad están disponibles en cada
modelador y modelo definido.
En este caso, el modelador "yourApiUserModeler" requerirá Autorización, mientras
que el modelador "yourApiStoreModeler" es para uso público.

## Versionamiento
Para más información, puedes leer [semver].

## Autores
* **Marcos Jesús Chávez V** - [onca-vega]

## Licencia
Licencia MIT.

[Inglés]: https://github.com/onca-vega/Neysla/blob/master/README.md
[semver]: https://semver.org/spec/v2.0.0.html
[onca-vega]: https://github.com/onca-vega
[RESTful API Strategy]: https://github.com/restfulapi/api-strategy
[Tipo de respuesta]: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
