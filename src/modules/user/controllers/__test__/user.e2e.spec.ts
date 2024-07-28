import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { Test } from '@nestjs/testing';
import { setupVersionPrefixAndPipes } from '../../../../configuration/app.config';
import { loadFixtures } from '../../../../../data/util/fixture-loader';
import { AppModule } from '../../../app.module';
import { join } from 'path';
import { UserResponseDto } from '../../application/dto/user-response.dto';
import { CreateUserDto } from '../../application/dto/create-user.dto';
import { UpdateUserDto } from '../../application/dto/update-user.dto';

describe('User Module', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // await loadFixtures(`${__dirname}/fixture`, dataSourceOptions);
    await loadFixtures(
      `${__dirname}/fixture`,
      join(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'configuration/typeorm.config.ts',
      ),
    );

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    setupVersionPrefixAndPipes(app);

    await app.init();
  });

  describe('GET - /user', () => {
    it('Should return paginated users', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/user')
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            data: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(Number),
                firstName: expect.any(String),
                lastName: expect.any(String),
                email: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                deletedAt: null,
              }),
            ]),
            pageSize: expect.any(Number),
            pageCount: expect.any(Number),
            itemCount: expect.any(Number),
          });

          expect(body).toEqual(expectedResponse);
        });
    });

    it('Should filter by firstName', async () => {
      const firstName = 'Joe';

      await request(app.getHttpServer())
        .get(`/api/v1/user?filter[firstName]=${firstName}`)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            data: expect.arrayContaining([
              expect.objectContaining({
                firstName,
              }),
            ]),
            pageSize: expect.any(Number),
            pageCount: expect.any(Number),
            itemCount: expect.any(Number),
          });
          expect(body).toEqual(expectedResponse);
        });
    });

    it('Should filter by page params', async () => {
      const page = { number: 1, take: 20 };

      await request(app.getHttpServer())
        .get(`/api/v1/user?page[number]=${page.number}&page[take]=${page.take}`)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body.pageCount).toBe(1);
          expect(body.itemCount).toBe(10);
          expect(body.pageSize).toBe(20);
        });
    });

    it('Should sort by id in descending order', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/user?order[orderBy]=id&order[orderDir]=DESC')
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          body.data.forEach((user: UserResponseDto, index: number) => {
            expect(user.id).toEqual(body.data.length - index);
          });
        });
    });

    it('Should sort by id in ascending order', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/user?order[orderBy]=id&order[orderDir]=ASC')
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          body.data.forEach((user: UserResponseDto, index: number) => {
            expect(user.id).toEqual(index + 1);
          });
        });
    });
  });

  describe('GET - /user/:id', () => {
    it('Should create a user and return the user correctly', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@test.com',
      };

      let userId: number;

      await request(app.getHttpServer())
        .post('/api/v1/user')
        .send(createUserDto)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            id: expect.any(Number),
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            email: createUserDto.email,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            deletedAt: null,
          });
          expect(body).toEqual(expectedResponse);
          userId = body.id;
        });

      await request(app.getHttpServer())
        .get(`/api/v1/user/${userId}`)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            id: userId,
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            email: createUserDto.email,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            deletedAt: null,
          });
          expect(body).toEqual(expectedResponse);
        });
    });

    it('Should throw an error if user is not found', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/user/9999')
        .expect(HttpStatus.NOT_FOUND)
        .then(({ body }) => {
          expect(body.message).toBe('User with ID 9999 not found');
        });
    });
  });

  describe('POST - /user', () => {
    it('Should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@test.com',
      };

      await request(app.getHttpServer())
        .post('/api/v1/user/')
        .send(createUserDto)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            id: expect.any(Number),
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            email: createUserDto.email,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            deletedAt: null,
          });
          expect(body).toEqual(expectedResponse);
        });
    });
  });

  describe('PATCH - /user/:id', () => {
    it('Should update an existing user', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'Jane Updated',
      };
      const userId: number = 1;

      await request(app.getHttpServer())
        .patch(`/api/v1/user/${userId}`)
        .send(updateUserDto)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          const expectedResponse = expect.objectContaining({
            id: userId,
            firstName: updateUserDto.firstName,
          });
          expect(body).toEqual(expectedResponse);
        });
    });

    it('Should throw an error if user is not found', async () => {
      await request(app.getHttpServer())
        .patch('/api/v1/user/9999')
        .send({ firstName: 'new user' })
        .expect(HttpStatus.NOT_FOUND)
        .then(({ body }) => {
          expect(body.message).toBe('User with ID 9999 not found');
        });
    });
  });

  describe('DELETE - /user/:id', () => {
    it('Should delete a user', async () => {
      const userId = 1;

      await request(app.getHttpServer())
        .delete(`/api/v1/user/${userId}`)
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .delete(`/api/v1/user/${userId}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Should delete a user and get a not found error', async () => {
      const userId = 40000;

      await request(app.getHttpServer())
        .delete(`/api/v1/user/${userId}`)
        .expect(HttpStatus.NOT_FOUND)
        .then(({ body }) => {
          expect(body.message).toBe('User with ID 40000 not found');
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
