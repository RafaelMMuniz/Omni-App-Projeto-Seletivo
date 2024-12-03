import { Controller, Get, Request, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { PrismaService } from "src/prisma/prisma.service";

@Controller('/users')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers() {
    const users = await this.prisma.user.findMany();

    return users.map(user => ({
      id: user.id,
      name: user.name,
      birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : null,
      balance: user.balance
    }));
  }
}
