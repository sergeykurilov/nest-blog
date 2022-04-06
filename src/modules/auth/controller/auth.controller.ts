import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../service/auth.service';
import { Connection, Repository } from 'typeorm';
import { Admin } from 'src/modules/admin/model/admin.entity';

@Controller('auth')
export class AuthController {
  private adminRepository: Repository<Admin>;
  constructor(
    private authService: AuthService,
    private connection: Connection,
  ) {
    this.adminRepository = this.connection.getRepository(Admin);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('profile')
  async getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('refresh')
  async refresh(@Request() req) {
    const admin = await this.adminRepository.findOne(req.user.id);
    return this.authService.login(admin);
  }
}
