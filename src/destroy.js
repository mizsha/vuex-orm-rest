import _ from 'lodash';
import { checkConstraints } from '@/constraint';
import joinPath from 'path.join';

export default async function destroy({ relations = [], terminus = false } = {}) {
  const { delete: destroy } = this.client;

  if (_.isUndefined(destroy)) {
    throw new Error('HTTP Client has no `delete` method');
  }

  checkConstraints(this);

  const path = joinPath(...relations.map(r => r.apiPath()), terminus ? this.constructor.apiPath : this.apiPath());

  await destroy(path);
  return this.$delete();
}
