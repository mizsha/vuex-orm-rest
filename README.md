<p align="center">
  <img width="192" src="https://github.com/vuex-orm/vuex-orm/raw/master/logo-vuex-orm.png" alt="Vuex ORM">
</p>

<h1 align="center">Vuex ORM Plugin: vuex-orm-rest</h1>

[Vuex-ORM](https://github.com/vuex-orm/vuex-orm) brings Object-Relational Mapping to the Vuex Store. vuex-orm-rest lets you communicate with RESTful backends.

The plugin extends the basic model of Vuex-ORM with some helful functions to make CRUD operations such as (save, fetch, fetchAll, update and delete).

You no longer need to access your http client manually. All the comunication happens thru the enhanced Vuex-ORM models.

# Dependencies

* [vuex](https://github.com/vuejs/vuex)

``` bash
yarn add vuex
```

* [Vuex-ORM](https://github.com/vuex-orm/vuex-orm)

``` bash
yarn add @vuex-orm/core
```

* [axios](https://github.com/axios/axios) (recommended)

``` bash
yarn add axios
```

* [vue-router](https://github.com/vuejs/vue-router)

``` bash
yarn add vue-router
```

# Installation

``` bash
yarn add vuex-orm-rest
```

The plugin requires a HTTP-Client to make requests to the backend. The client is passed as an option to the plugin. The following tables shows the association between the client- and CRUD method.

| Plugin   | Client |
|----------|--------|
| fetch    | get    |
| fetchAll | get    |
| save     | post   |
| update   | patch  |
| replace  | put    |
| destroy  | delete |

Also the a vue-router instance is needed to generate routes from the model instances.

The following exmaple installs the plugin using [axios](https://github.com/axios/axios) as the HTTP-Client and a vue-router instance.

``` javascript
import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core';
import VuexORMRest from 'vuex-orm-rest';
import axios from 'axios';
import VueRouter from 'vue-router';

const client = axios.create({ baseURL: '/api' });
const database = new VuexORM.Database();
const router = new VueRouter();

VuexORM.use(VuexORMRest, { client, router });

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [VuexORM.install(database)],
});
```

# Defining models

Go to https://vuex-orm.github.io/vuex-orm/guide/components/models.html to see how to define models using Vuex-ORM.

# Interacting with the backend

Assume we have a `user` model. Additionally to the `entity` an `apiPath` variable has to be defined.
The `apiPath` represents the URL under which the entity is reachable on the REST API.

``` javascript
import { Model } from '@vuex-orm/core';

class User extends Model {
  static entity = 'users';
  static apiPath = 'users';

  static fields () {
    return {
      id: this.attr(null),
      name: this.attr('')
    }
  }
}
```

Your vuex-orm instance need to know about your model.

``` javascript
database.register(User, {});
```

## fetch

Fills the store with a single item by id.
Returns a promise with the fetched data.

``` javascript
User.fetch(1);
```

The fetched user now lies in the store and can be retrieved by using the Vuex-ORM actions.

``` javascript
const user = User.find(1);
```

## fetchAll

Fills the store with a list of items.
Returns a promise with the fetched data.

``` javascript
User.fetchAll();
```

Retrieve the fetched users.

``` javascript
User.all();
```

## save

Saves a user instance using post verb.
Returns a promise with the post response.

``` javascript
const user = new User({ name: 'John Doe' });
user.save();
```

## update

Updates an existing user using patch verb.
Returns a promise with the patch response.
The update function also accepts a list of keys for every property that should be part of the patch payload.

``` javascript
// Retrieve the user from the store
const user = User.find(1);
user.name = 'Michelangelo';
// This only updates the name property
user.update(['name']);
```

## replace

Replaces a whole user instance using put verb.
Returns a promise with the put response.

``` javascript
// Retrieve the user from the store
const user = User.find(1);
user.name = 'Michelangelo';
// This only updates the name property
user.replace();
```

## destroy

Destroys a user using the delete verb.
Returns a promise with the delete response.

``` javascript
// Retrieve the user from the store
const user = User.find(1);
user.destroy();
```

# Async queue

The async queue is a utility which helps to manage fetching data.
It is possible to execute functions sequentially or in parallel.
All the methods from the queue are chainable. The whole queue is executed using the `exec` method.

## Sequence

The sequence method executes functions sequentially. The result from the previous sequence is passed to the next step when resolved.

``` javascript
const res = await Queue
  .sequence(() => Promise.resolve(1))
  .sequence((res) => Promise.resolve(res + 1))
  .exec(); // Evaluates to 2
```
## Parallel

The parallel method executes functions in parallel. The result from the previous parallel is passed to the next step as an array when all functions are resolved.

``` javascript
const res = await Queue
  .parallel(() => Promise.resolve(1))
  .parallel(() => Promise.resolve(2))
  .parallel(() => Promise.resolve(3))
  .exec(); // Evaluates to [1, 2, 3]
```

It is also possible to mix the parallel and sequence method.

``` javascript
const res = await Queue
  .sequence(() => Promise.resolve(1))
  .parallel((res) => Promise.resolve(res + 1))
  .parallel((res) => Promise.resolve(res + 1))
  .parallel((res) => Promise.resolve(res + 1))
  .sequence((res) => Promise.resolve(res))
  .exec(); // Evaluates to [2, 2, 2]
```
