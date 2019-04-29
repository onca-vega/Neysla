# Neysla
[![NPM](https://nodei.co/npm/neysla.png?mini=true)](https://www.npmjs.com/package/neysla)
[![Node version](https://img.shields.io/badge/package-v2.5.7-orange.svg)](https://www.npmjs.com/package/neysla)
[![Dependencies](https://img.shields.io/badge/dependencies-none-green.svg)](https://www.npmjs.com/package/neysla)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://travis-ci.org/onca-vega/Neysla)
[![Coverage Status](https://coveralls.io/repos/github/onca-vega/Neysla/badge.svg?branch=master)](https://coveralls.io/github/onca-vega/Neysla?branch=master)

Promise based HTTP RESTful API resources modeler for the browser.

## Translations
- [Spanish]

## Introduction
One of the main features of a RESTful API, acording to [RESTful API Strategy],
is that it's resources may be nested:
"That is, the URIs may reflect that one resource is nested within another like
in this made-up example: http://greatvalley.edu/example-app/courses/2305/sections/2465
(where section '2465' is a nested resource under course 2305)".

This is a good feature that tells us how may be a resource model for consumtion,
because as we can see, "courses" and "sections" are static parts, in the mean
time that "2305" and "2465" are dynamic parts of the resource.

Besides it's important to mention that any RESTful API should response different,
depending on the HTTP method used (POST, GET, PATCH, etc...), and may or may not
need params to send, for example in order to filter, order or create new data
inside our API database.

Neysla is a JavaScript based library which main aim is to define all your models
only once, in order that you could use them all over your frontend app.

## Starting
### Pre-requisites
- node 10+
- npm 6+

### Installation
#### Install Neysla through CDN
```bash
$ <script type="text/javascript" src="https://unpkg.com/neysla@2.5.7/build/cdn/neysla.min.js" charset="utf-8"></script>
```

#### Install Neysla through NPM
```bash
$ npm install --save neysla
```

##### Import Neysla inside your app:
```bash
import Neysla from "neysla";
```

## Direct usage
Neysla has support as direct usage for the HTTP methods:
- GET
- HEAD
- POST
- PATCH
- PUT
- DELETE

#### GET (Neysla's direct usage "get" method)
```bash
...
  Neysla.get({
    url: "https://www.your-api.com/your-endpoint?param=paramValue",
    responseType: "blob"
  }).then(data => console.log(data)).catch(err => console.log(err));
...
```

"get" method features for direct usage are:

feature | description | default | supporting typeof
------------ | ------------- | ------------ | -------------
headers | Refers to headers you want to add to your request | undefined | object
url | Link for request | undefined | string
requestType | "json" for "application/json"; "multipart" for "multipart/form-data"; everything else will be taken as "application/x-www-form-urlencoded" | "application/x-www-form-urlencoded" | string
responseType | [responseType] supported for JavaScript requests | "json" | string

#### HEAD (Neysla's direct usage "head" method)
```bash
...
  Neysla.head({
    url: "https://www.your-api.com/your-endpoint?param=paramValue"
  }).then(data => console.log(data)).catch(err => console.log(err));
...
```

Works just the same as previous method (with HEAD method implies).

#### POST (Neysla's direct usage "post" method)
```bash
...
  Neysla.post({
    url: "https://www.your-api.com/your-endpoint?param=paramValue",
    headers: {
      "Authentication": "Basic dufhspo43p43hu34h5p34hu5p34"
    },
    requestType: "multipart",
    body: {
      "address": "Saint street 177",
      "active": false,
      "first_name": "Roberto",
      "last_name": "Magallanez"
    }
  }).then(data => console.log(data)).catch(err => console.log(err));
...
```

"post" method features for direct usage are:

feature | description | default | supporting typeof
------------ | ------------- | ------------ | -------------
headers | Refers to headers you want to add to your request | undefined | object
url | Link for request | undefined | string
body | Refers to the body of the request | undefined | object
requestType | "json" for "application/json"; "multipart" for "multipart/form-data"; everything else will be taken as "application/x-www-form-urlencoded" | "application/x-www-form-urlencoded" | string
responseType | [responseType] supported for JavaScript requests | "json" | string

#### PATCH (Neysla's direct usage "patch" method)
```bash
...
  Neysla.patch({
    url: "https://www.your-api.com/your-endpoint?param=paramValue",
    requestType: "multipart",
    body: {
      "active": true
    }
  }).then(data => console.log(data)).catch(err => console.log(err));
...
```

"patch" method features for direct usage are:

feature | description | default | supporting typeof
------------ | ------------- | ------------ | -------------
headers | Refers to headers you want to add to your request | undefined | object
url | Link for request | undefined | string
body | Refers to the body of the request | undefined | object
requestType | "json" for "application/json"; "multipart" for "multipart/form-data"; everything else will be taken as "application/x-www-form-urlencoded" | "application/x-www-form-urlencoded" | string
responseType | [responseType] supported for JavaScript requests | "json" | string

#### PUT (Neysla's direct usage "put" method)
```bash
...
  Neysla.put({
    url: "https://www.your-api.com/your-endpoint?param=paramValue"
  }).then(data => console.log(data)).catch(err => console.log(err));
...
```

Works just the same as previous method.

#### DELETE (Neysla's direct usage "remove" method)
```bash
...
  Neysla.remove({
    url: "https://www.your-api.com/your-endpoint?param=paramValue"
  }).then(data => console.log(data)).catch(err => console.log(err));
...
```

"remove" method features for direct usage are:

feature | description | default | supporting type of data
------------ | ------------- | ------------ | -------------
headers | Refers to headers you want to add to your request | undefined | object
url | Link for request | undefined | string
body | Refers to the body of the request | undefined | object
requestType | "json" for "application/json"; "multipart" for "multipart/form-data"; everything else will be taken as "application/x-www-form-urlencoded" | "application/x-www-form-urlencoded" | string
responseType | [responseType] supported for JavaScript requests | "json" | string

### Data transmition progress
Every request has a method named "progress", that pass the variable defined by
"progress" native AJAX event:
```bash
...
  const file = document.getElementById("myFile").files[0];
  Neysla.post({
    url: "https://www.your-api.com/your-endpoint?param=paramValue",
    headers: {
      "Authentication": "Basic dufhspo43p43hu34h5p34hu5p34"
    },
    requestType: "multipart",
    body: {
      file,
      name: "My file"
    }
    progress(progressEv){
      // Algún código divertido con el evento "progress".
    }
  }).then(data => console.log(data)).catch(err => console.log(err));
...
```

### Data response definition
After we make a request, we'll receive our data defined through the following
nodes (it's format will depend on the "responseType" param):

node | description | type of data
------------ | ------------- | ------------
headers | Response Headers | Object
status | Response status | number
statusText | Response status as text | string
getHeader | Method to get an specific header (needs an string argument) | Function
data | Response body data | Object
dataType | Response type | string
url | Requested URL | string

## Modeler usage
### Initializating Neysla
In order to explain how to use Neysla as a modeler, let's define some fake
resources for an API that we want to model:
1. Our API is under the link "https://www.your-api.com/".
2. We have three resources on our API:
  - "https://www.your-api.com/user/$user_id", which is defined to interact with
all (or one) existent users.
  - "https://www.your-api.com/user/$user_id/contact/$contact_id", which is defined
to interact with all (or one) contacts nested to a defined user.
  - "https://www.your-api.com/user/$user_id/contact/$contact_id/phone/$phone_id",
which is defined to interact with all (or one) phones of a contact nested to a
defined user.

So let's code:

```bash
const neysla = new Neysla();

neysla.init({

  name: "yourApiModeler",
  token: {
    name: "accessToken",
    value: "asodug2312pu312pu3_asodq231"
  },
  url: "https://www.your-api.com/"

});
```

Let's take a look into previous code. First, we must create our Neysla instance.
Then we must call "init" method and pass all Neysla params:

param | description | required | example
------------ | ------------- | ------------ | -------------
name | The name of our model creator | yes | "yourApiModeler"
token | Neysla can handle with an Authorization token if your API is protected | no | { name: "accessToken", value: "asodug2312pu312pu3_asodq231" }
token.name | The name of the token that will be appended to your model's URL | yes (if token is defined) | "accessToken"
token.value | The value of the token that will be appended to your model's URL | yes (if token is defined) | "asodug2312pu312pu3_asodq231"
url | The link where your API stands. This will be used to prepend all your models | yes | "https://www.your-api.com/"

### Using Neysla for model definition
It's important to know that Neysla is promise based, so, continuing with our
example, you could use it like:

```bash
let user = null,
userContact = null,
userContactPhone = null;

const neysla = new Neysla();

neysla.init({

  name: "yourApiModeler",
  token: {
    name: "accessToken",
    value: "asodug2312pu312pu3_asodq231"
  },
  url: "https://www.your-api.com/"

}).then(modelers => {

  user = modelers.yourApiModeler.setModel("user");

  userContact = modelers.yourApiModeler.setModel([ "user", "contact" ]);

  userContactPhone = modelers.yourApiModeler.setModel([ "user", "contact", "phone" ]);

}).catch(err => console.log(err));
```

Let's take a look into previous code. First, we initialize Neysla, next the
"then" method for the Promise pass a variable (we defined it as "modelers").
Then, this "modelers" variable is used to define all our models, by calling our
previous modeler called "yourApiModeler". Every API modeler has the following
methods:

name | description | arguments
------------ | ------------- | ------------
setModel | method that allows you to define all your API models, that receive the "static" part of your API resource | array OR string
getToken | method that returns the token of your modeler configuration | none

### Requesting with the models
Once we've defined all our models, it's important to know that Neysla has support
for the HTTP methods:
- GET
- HEAD
- POST
- PATCH
- PUT
- DELETE

#### GET (Neysla's modeler usage "get" method)
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

Once we've defined all our models, we can start to deliver all our needed requests.
On previous example, we've made three GET requests:
- The first one is receiving an empty Object, that means we are making a GET
request to "https://www.your-api.com/user?accessToken=asodug2312pu312pu3_asodq231".
- The second is receiving an Object with delimiters = 10, and
responseType = "blob", that means we are making a GET request to
"https://www.your-api.com/user/10?accessToken=asodug2312pu312pu3_asodq231", and we
want to receive our responseType as a blob.
- The third is receiving an Object with some params that means we are making a
GET request to
"https://www.your-api.com/user?order=age&name=Ort&accessToken=asodug2312pu312pu3_asodq231".

Let's see some other examples:
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

On previous request we are sending delimiters and params to "userContactPhone"
model, that means we are making a GET request to
"https://www.your-api.com/user/1/contact/500/phone?page=7&perPage=35&accessToken=asodug2312pu312pu3_asodq231".

So let's talk about "get" method features:

feature | description | default | supporting typeof
------------ | ------------- | ------------ | -------------
headers | Refers to headers you want to add to your request | undefined | object
delimiters | Refers to the "dynamic" part to your API resource | undefined | array OR integer OR string
params | Refers to the query params appended to the API resource | undefined | object
requestType | "json" for "application/json"; "multipart" for "multipart/form-data"; everything else will be taken as "application/x-www-form-urlencoded" | "application/x-www-form-urlencoded" | string
responseType | [responseType] supported for JavaScript requests | "json" | string

#### HEAD (Neysla's modeler usage "head" method)
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

Works just the same as previous method (with HEAD method implies).

#### POST (Neysla's modeler usage "post" method)
```bash
...
  userContact = modelers.yourApiModeler.setModel([ "user", "contact" ]);

  userContact.post({
    delimiters: [ 12 ],
    requestType: "multipart",
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

On previous request we are sending delimiters, params and body to "userContact"
model, that means we are making a POST request to
"https://www.your-api.com/user/12/contact?foo=bar&accessToken=asodug2312pu312pu3_asodq231".
In this case, the body is used as the POST body, and the requestType node implies
that we want to send it's content as "multipart/form-data".

So let's talk about "post" method features:

feature | description | default | supporting typeof
------------ | ------------- | ------------ | -------------
headers | Refers to headers you want to add to your request | undefined | object
delimiters | Refers to the "dynamic" part to your API resource | undefined | array OR integer OR string
body | Refers to the body of the request | undefined | object
params | Refers to the query params appended to the API resource | undefined | object
requestType | "json" for "application/json"; "multipart" for "multipart/form-data"; everything else will be taken as "application/x-www-form-urlencoded" | "application/x-www-form-urlencoded" | string
responseType | [responseType] supported for JavaScript requests | "json" | string

#### PATCH (Neysla's modeler usage "patch" method)
```bash
...
  userContact = modelers.yourApiModeler.setModel([ "user", "contact" ]);

  userContact.patch({
    delimiters: [ 12, 210 ],
    params: {
      "active": true
    }
  }).then(data => console.log(data)).catch(err => console.log(err));
...
```

On previous request we are sending delimiters and params to "userContact"
model, that means we are making a PATCH request to
"https://www.your-api.com/user/12/contact/210?accessToken=asodug2312pu312pu3_asodq231".
In this case, the params are used as the PATCH body, and the requestType node is
not defined, this implies that we want to send it as an
"application/x-www-form-urlencoded" content.

So let's talk about "patch" method features:

feature | description | default | supporting typeof
------------ | ------------- | ------------ | -------------
headers | Refers to headers you want to add to your request | undefined | object
delimiters | Refers to the "dynamic" part to your API resource | undefined | array OR integer OR string
body | Refers to the body of the request | undefined | object
params | Refers to the query params appended to the API resource | undefined | object
requestType | "json" for "application/json"; "multipart" for "multipart/form-data"; everything else will be taken as "application/x-www-form-urlencoded" | "application/x-www-form-urlencoded" | string
responseType | [responseType] supported for JavaScript requests | "json" | string

#### PUT (Neysla's modeler usage "put" method)
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

Works just the same as previous method.

#### DELETE (Neysla's modeler usage "remove" method)
```bash
...
  userContact = modelers.yourApiModeler.setModel([ "user", "contact" ]);

  userContact.remove({
    delimiters: [ 12, 210 ]
  }).then(data => console.log(data)).catch(err => console.log(err));
...
```

On previous request we are sending delimiters to "userContact"
model, that means we are making a DELETE request to
"https://www.your-api.com/user/12/contact/210?accessToken=asodug2312pu312pu3_asodq231".

So let's talk about "remove" method features:

feature | description | default | supporting type of data
------------ | ------------- | ------------ | -------------
headers | Refers to headers you want to add to your request | undefined | object
delimiters | Refers to the "dynamic" part to your API resource | undefined | array OR integer OR string
body | Refers to the body of the request | undefined | object
params | Refers to the query params appended to the API resource | undefined | object
requestType | "json" for "application/json"; "multipart" for "multipart/form-data"; everything else will be taken as "application/x-www-form-urlencoded" | "application/x-www-form-urlencoded" | string
responseType | [responseType] supported for JavaScript requests | "json" | string

### Data transmition progress
Every model has a method named "progress", that pass the variable defined by "progress" native AJAX event:
```bash
...
  const file = document.getElementById("myFile").files[0];
  userContact = modelers.yourApiModeler.setModel([ "user", "contact" ]);

  userContact.post({
    delimiters: [ 12, 210 ],
    params: {
      "foo": "bar"
    },
    body: {
      file,
      name: "My file"
    },
    progress(progressEv){
      // Some funny code to work with progress event.
    }
  }).then(data => console.log(data)).catch(err => console.log(err));

...
```

### Data response definition
Response is defined just like direct usage response.

### Support for multiple modelers
You can define one or more modelers in Neysla, for example when you want to
consume more that one API.
Let's see an example:
```bash
let user = null,
userContact = null;
let store = null,
storeElement = null;

const neysla = new Neysla();

neysla.init([
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
]).then(modelers => {

  user = modelers.yourApiUserModeler.setModel("user");
  userContact = modelers.yourApiUserModeler.setModel([ "user", "contact" ]);

  store = modelers.yourApiStoreModeler.setModel("store");
  storeElement = modelers.yourApiStoreModeler.setModel([ "store", "element" ]);

}).catch(err => console.log(err));
```

And all the previous features are available in every modeler and model defined
in the last example. In this case, the "yourApiUserModeler" modeler is going to
work under token Authorization, meanwhile the "yourApiStoreModeler" modeler is
for public usage.

## Versioning
For further information, read [semver].

## Authors
* **Marcos Jesús Chávez V** - [onca-vega]

## License
MIT license.

[Spanish]: https://github.com/onca-vega/Neysla/blob/master/docs/README.md
[semver]: https://semver.org/spec/v2.0.0.html
[onca-vega]: https://github.com/onca-vega
[RESTful API Strategy]: https://github.com/restfulapi/api-strategy
[responseType]: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
