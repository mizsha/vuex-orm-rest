import _ from 'lodash';
import { checkConstraints } from '@/constraint';
import joinPath from 'path.join';

export default async function fetch(id, { filter = {} } = {}) {
  const { get } = this.client;

  if (_.isUndefined(get)) {
    throw new Error('HTTP Client has no `get` method');
  }

  if (_.isUndefined(id)) {
    throw new Error('No id is provided');
  }

  if (!_.isObject(filter)) {
    throw new Error('Filter needs to be an object');
  }

  checkConstraints(this);

  const data = await get(joinPath(this.apiPath, id.toString()), { params: filter });
  try {
    const insertedData = await this.insertOrUpdate(data);
    return insertedData[this.entity][0];
  } catch (error) {
    throw new Error('Unable to process response.');
  }
}
