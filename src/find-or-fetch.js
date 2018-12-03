import { checkConstraints } from '@/constraint';
import _ from 'lodash';

export default async function findOrFetch(id) {
  if (_.isUndefined(id)) {
    throw new Error('No id is provided');
  }

  checkConstraints(this);

  const record = this.find(id);

  if (_.isNull(record)) {
    return this.fetch(id);
  }

  return Promise.resolve(record);
}
