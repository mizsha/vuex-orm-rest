import _ from 'lodash';
import { checkConstraints } from '@/constraint';
import joinPath from 'path.join';

export default async function save({ keys = Object.keys(this.$toJson()), relations = [], terminus = false } = {}) {
  const { post } = this.client;

  if (_.isUndefined(post)) {
    throw new Error('HTTP Client has no `post` method');
  }

  checkConstraints(this);

  console.log(keys);
  console.log(relations);
  console.log(this);
  console.log(this.$toJson());
  console.log(_.omit(_.pick(this.$toJson(), keys), '$id'));


  const path = joinPath(...relations.map(r => r.apiPath()), terminus ? this.constructor.apiPath : this.apiPath());
  console.log(path);

  const data = await post(path, _.omit(_.pick(this.$toJson(), keys), '$id'));
  const stored = await this.$insert(data);
  return stored[this.constructor.entity][0];
}
