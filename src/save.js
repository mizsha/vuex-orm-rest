import _ from 'lodash';
import { checkConstraints } from '@/constraint';
import joinPath from 'path.join';

export default async function save(keys = Object.keys(this.$toJson()), { relations = [], terminus = false } = {}) {
  const { post } = this.client;

  if (_.isUndefined(post)) {
    throw new Error('HTTP Client has no `post` method');
  }

  checkConstraints(this);

  console.log(keys);
  console.log(relations);


  const path = joinPath(...relations.map(r => r.apiPath()), terminus ? this.constructor.apiPath : this.apiPath());
  console.log(path);

  const data = await post(path, _.omit(_.pick(this.$toJson(), keys), '$id', '$relations', '$terminus'));
  const stored = await this.$insert(data);
  return stored[this.constructor.entity][0];
}
