import { AdminRepository } from '../../admin/service/admin.repository';
import { Admin } from '../../admin/model/admin';
import { JwtService } from '@nestjs/jwt';

export class AuthService {
  constructor(
    private adminRepository: AdminRepository,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(login: string, pass: string): Promise<any> {
    const admin = await this.adminRepository.findByLogin(login);

    if (admin && admin.password === pass) {
      const { password, ...secureAdmin } = admin;
      return secureAdmin;
    }

    return null;
  }

  async login(admin: Admin) {
    const payload = { id: admin.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
