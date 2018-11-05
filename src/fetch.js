import _ from 'lodash';
import { checkConstraints } from '@/constraint';
import joinPath from 'path.join';

export default async function fetch(id) {
  const { get } = this.client;

  if (_.isUndefined(get)) {
    throw new Error('HTTP Client has no `get` method');
  }

  if (_.isUndefined(id)) {
    throw new Error('No id is provided');
  }

  if (!_.isNumber(id)) {
    throw new Error('The id provided is not a number');
  }

  checkConstraints(this);

  const data = await get(joinPath(this.apiPath, id.toString()));
  const insertedData = await this.insertOrUpdate(data);
  return insertedData[this.entity][0];
}
