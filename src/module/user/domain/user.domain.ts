import { Base } from 'src/common/domain/base.domain';

export class User extends Base {
  email: string;
  name: string;
  lastName: string;
}
