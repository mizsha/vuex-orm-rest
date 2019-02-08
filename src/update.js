import _ from 'lodash';
import { checkConstraints } from '@/constraint';
import joinPath from 'path.join';

export default async function update(keys = Object.keys(this.$toJson())) {
  const { patch } = this.client;

  if (_.isUndefined(patch)) {
    throw new Error('HTTP Client has no `patch` method');
  }

  checkConstraints(this);

  const { data } = await patch(this.apiPath(), _.omit(_.pick(this.$toJson(), keys), '$id'));
  const stored = await this.$update(data);
  return stored[this.constructor.entity][0];
}
