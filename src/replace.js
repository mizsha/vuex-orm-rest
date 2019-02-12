import _ from 'lodash';
import { checkConstraints } from '@/constraint';
import joinPath from 'path.join';

export default async function replace({ keys = Object.keys(this.$toJson()), relations = [], terminus = false } = {}) {
  const { put } = this.client;

  if (_.isUndefined(put)) {
    throw new Error('HTTP Client has no `put` method');
  }

  checkConstraints(this);
  console.log(this);

  const path = joinPath(...relations.map(r => r.apiPath()), terminus ? this.constructor.apiPath : this.apiPath());
  console.log(path);

  const { data } = await put(path, _.omit(this.$toJson(), '$id'));

  return data;
}
