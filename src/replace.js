import _ from 'lodash';
import { checkConstraints } from '@/constraint';
import joinPath from 'path.join';

export default function replace({ relations = [], terminus = false } = {}) {
  const { put } = this.client;

  if (_.isUndefined(put)) {
    throw new Error('HTTP Client has no `put` method');
  }

  checkConstraints(this);

  const path = joinPath(...relations.map(r => r.apiPath()), terminus ? this.constructor.apiPath : this.apiPath());

  put(path, _.omit(this.$toJson(), '$id'));
}
