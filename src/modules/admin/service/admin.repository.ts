import { Injectable } from '@nestjs/common';
import { Admin } from '../model/admin';

@Injectable()
export class AdminRepository {
  private readonly admins: Admin[];
  constructor() {
    this.admins = [
      {
        id: 1,
        login: 'grommax',
        password: 'secret',
      },
    ];
  }
  async find(id: number): Promise<Admin | undefined> {
    const user = this.admins.find((admin) => admin.id === id);
    console.log(user);
    return user;
  }

  async findByLogin(login: string): Promise<any> {
    console.log(login);
    const user = this.admins.find((admin) => admin.login === login);
    console.log(user);
    return this.admins.find((admin) => admin.login === login);
  }
}
