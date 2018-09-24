# Veza
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

Veza is a JavaScript based library which main aim is to define all your models
only once, in order that you could use them all over your frontend app.

## Starting
### Pre-requisites
- node 10+
- npm 6+

### Installation
#### Install Veza through npm
```bash
$ npm install --save veza
```

#### Import Veza inside your app:

## Usage
### Initializating Veza
In order to explain how to use Veza, let's define some fake resources for an API
that we want to model:
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
const myVezaModeler = new Veza({
  name: "yourApiModeler",
  token: {
    name: "accessToken",
    value: "asodug2312pu312pu3_asodq231"
  },
  url: "https://www.your-api.com/"
});
```

Let's take a look into previous code. First, we define a new instance of Veza
(our Modeler) with some params:
param | description | required | example
name | The name of our model creator | yes | "yourApiModeler"
token | Veza can handle with an Authorization token if your API is protected | no | { name: "accessToken", value: "asodug2312pu312pu3_asodq231" }
token.name | The name of the token that will be appended to your model's URL | yes (if token is defined) | "accessToken"
token.value | The value of the token that will be appended to your model's URL | yes (if token is defined) | "asodug2312pu312pu3_asodq231"
url | The link where your API stands. This will be used to prepend all your models | yes | "https://www.your-api.com/"

### Using Veza for model definition
It's important to know that Veza's instance previously defined is a Promise, so,
continuing with our example, you could use it like:

```bash
let user = null,
userContact = null,
userContactPhone = null;
myVezaModeler.then(modelers => {
  user = modelers.yourApiModeler.setModel("user");
  userContact = modelers.yourApiModeler.setModel([ "user", "contact" ]);
  userContactPhone = modelers.yourApiModeler.setModel([ "user", "contact", "phone" ]);
}).catch(err => console.log(err));
```

Let's take a look into previous code. First, we call our Veza's instance "then"
method, which define a variable (we defined it as "modelers").
Then, this "modelers" is used to define all our models, by calling our previous
modeler called "yourApiModeler".
Every API modeler has the following methods:
name | description | Initializator params
setModel | method that allows you to define all your API models, that receive the "static" part of your API resource | array OR string
getToken | method that returns the token of your modeler configuration | none

### Requesting with your models
Once we've defined all our models, it's important to know that right now Veza
has support for four HTTP methods:
- GET
- POST
- PATCH
- DELETE

#### GET (Veza's get method)
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

So let's talk about GET method features:
feature | description | default | supporting typeof
delimiters | Refers to the "dynamic" part to your API resource | undefined | array OR integer OR string
params | Refers to the query params appended to the API resource | undefined | object
responseType | [responseType] supported for JavaScript requests | "json" | string

#### POST (Veza's post method)
```bash
...
  userContact = modelers.yourApiModeler.setModel([ "user", "contact" ]);
  userContact.post({
    delimiters: [ 12 ],
    requestJson: true,
    params: {
      "address": "Saint street 177",
      "active": false,
      "first_name": "Roberto",
      "last_name": "Magallanez"
    }
  }).then(data => console.log(data)).catch(err => console.log(err));
...
```
On previous request we are sending delimiters and params to "userContact"
model, that means we are making a POST request to
"https://www.your-api.com/user/12/contact?accessToken=asodug2312pu312pu3_asodq231".
In this case, the params are used as the POST body, and the requestJson node implies
that we want to send it as an "application/json" content.

So let's talk about POST method features:
feature | description | default | supporting typeof
delimiters | Refers to the "dynamic" part to your API resource | undefined | array OR integer OR string
params | Refers to the body params of the API resource | undefined | object
responseType | [responseType] supported for JavaScript requests | "json" | string
requestJson | TRUE for "application/json"; FALSE for "application/x-www-form-urlencoded" | false | boolean

#### PATCH (Veza's patch method)
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
In this case, the params are used as the PATCH body, and the requestJson node is
not defined, this implies that we want to send it as an
"application/x-www-form-urlencoded" content.

So let's talk about PATCH method features:
feature | description | default | supporting typeof
delimiters | Refers to the "dynamic" part to your API resource | undefined | array OR integer OR string
params | Refers to the body params of the API resource | undefined | object
responseType | [responseType] supported for JavaScript requests | "json" | string
requestJson | TRUE for "application/json"; FALSE for "application/x-www-form-urlencoded" | false | boolean

#### DELETE (Veza's remove method)
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

So let's talk about DELETE method features:
feature | description | default | supporting typeof
delimiters | Refers to the "dynamic" part to your API resource | undefined | array OR integer OR string
params | Refers to the body params of the API resource | undefined | object
responseType | [responseType] supported for JavaScript requests | "json" | string
requestJson | TRUE for "application/json"; FALSE for "application/x-www-form-urlencoded" | false | boolean

### data response definition
After we make a request, we'll receive our data defined through the following
nodes (it's format will depend on the responseType param):
node | description | type of data
headers | Headers of the response | Object
status | Request status | number
statusText | Request status as text | string
getHeader | Method to request an specific header (needs an string argument) | Function
data | All data related to response | Object
dataType | Response type | string
url | Response url | string


## Versioning
For further information, read more about this on [semver].

## Authors
* **Marcos Jesús Chávez V** - [onca-vega]

## License
MIT license.

[Spanish]: docs/spanish/README.md
[semver]: https://semver.org/spec/v2.0.0.html
[onca-vega]: https://github.com/onca-vega
[RESTful API Strategy]: https://github.com/restfulapi/api-strategy
[responseType]: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
