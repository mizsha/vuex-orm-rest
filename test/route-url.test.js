import { Model } from '@vuex-orm/core';
import { installPlugin, mockResponse, createStore } from './helpers';
import VueRouter from 'vue-router';

class RouteDummy extends Model {
  static entity = 'dummy';
  static apiPath = 'dummyPath';
  static routeName = 'dummyRoute';
}

class EmptyDummy extends Model {}

test('Throws error when no entity is defined', () => {
  installPlugin();
  const emptyDummy = new EmptyDummy();

  expect(() => { emptyDummy.routeURL(); }).toThrow("entity name is not defined on class 'EmptyDummy'");
});

test('Throws error when no id is defined', () => {
  installPlugin();
  const emptyDummy = new RouteDummy();

  expect(() => { emptyDummy.routeURL(); }).toThrow("Unable to generate route URL. No id defined for 'dummy'.")
});

test('Generates arbitrary route urls', () => {
  installPlugin();
  const routeDummy = new RouteDummy({ $id: 1 });

  expect(routeDummy.routeURL('some')).toEqual({ name: 'some-dummyRoute', params: { id: 1 } });
});

test('Generates show route urls', () => {
  installPlugin();
  const routeDummy = new RouteDummy({ $id: 1 });

  expect(routeDummy.showURL()).toEqual({ name: 'show-dummyRoute', params: { id: 1 } });
});

test('Generates edit route urls', () => {
  installPlugin();
  const routeDummy = new RouteDummy({ $id: 1 });

  expect(routeDummy.editURL()).toEqual({ name: 'edit-dummyRoute', params: { id: 1 } });
});
