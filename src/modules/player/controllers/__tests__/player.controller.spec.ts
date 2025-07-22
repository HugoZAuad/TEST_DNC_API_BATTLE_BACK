import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PlayerModule } from '../../player.module';
import { PlayerRepository } from '../../repositories/player.repository';

describe('PlayerController (integração)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PlayerModule],
    })
      .overrideProvider(PlayerRepository)
      .useValue({
        findById: jest.fn().mockImplementation((id: number) => {
          if (id === 1) {
            return Promise.resolve({ id: 1, username: 'JogadorTeste' });
          }
          return Promise.resolve(null);
        }),
        create: jest.fn().mockImplementation((name: string) => {
          return Promise.resolve({ id: 1, username: name });
        }),
        update: jest.fn().mockImplementation((id: number, name: string) => {
          if (id === 1) {
            return Promise.resolve({ id: 1, username: name });
          }
          return Promise.reject({ status: 404 });
        }),
        delete: jest.fn().mockImplementation((id: number) => {
          if (id === 1) {
            return Promise.resolve();
          }
          return Promise.reject({ status: 404 });
        }),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let createdPlayerId: number;

  it('deve criar um jogador com sucesso', async () => {
    const response = await request(app.getHttpServer())
      .post('/players')
      .send({ name: 'JogadorTeste' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    createdPlayerId = response.body.id;
  });

  it('deve atualizar um jogador com sucesso', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/players/${createdPlayerId}`)
      .send({ name: 'JogadorAtualizado' })
      .expect(200);

    expect(response.body).toHaveProperty('id', createdPlayerId);
    expect(response.body).toHaveProperty('username', 'JogadorAtualizado');
  });

  it('deve retornar erro ao atualizar jogador inexistente', async () => {
    await request(app.getHttpServer())
      .patch('/players/999999')
      .send({ name: 'NomeQualquer' })
      .expect(404);
  });

  it('deve deletar um jogador com sucesso', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/players/${createdPlayerId}`)
      .expect(200);

    expect(response.body).toHaveProperty('message');
  });

  it('deve retornar erro ao deletar jogador inexistente', async () => {
    await request(app.getHttpServer())
      .delete('/players/999999')
      .expect(404);
  });
});
