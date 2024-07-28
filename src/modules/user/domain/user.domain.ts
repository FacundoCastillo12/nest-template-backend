import { Base } from '@/common/domain/base.domain';

export class User extends Base {
  email: string;
  firstName: string;
  lastName: string;
}
