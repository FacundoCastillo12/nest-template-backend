import { BaseEntity } from 'src/common/infrastructure/database/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  email: string;
}
