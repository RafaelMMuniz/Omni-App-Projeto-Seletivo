import { Body, Controller, Headers, HttpCode, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { z } from "zod";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";

const transferBodySchema = z.object({
  fromId: z.string().uuid(),
  toId: z.string().uuid(),
  amount: z.coerce.number().positive().gt(0),
});

type TransferBodySchema = z.infer<typeof transferBodySchema>;

@Injectable()
@Controller('/transfer')
export class TransferController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(transferBodySchema))
  async handle(@Body() body: TransferBodySchema, @Headers('authorization') authHeader: string) {
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    let userId: string;
    try {
      const payload = this.jwt.verify(token);
      userId = payload.sub;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const { fromId, toId, amount } = body;

    if (fromId !== userId) {
      throw new UnauthorizedException('You can only transfer from your own account');
    }

    const fromUser = await this.prisma.user.findUnique({
      where: { id: fromId },
    });
    if (!fromUser) {
      throw new UnauthorizedException('User not found');
    }

    if (fromUser.balance < amount) {
      throw new UnauthorizedException('Insufficient balance');
    }

    const toUser = await this.prisma.user.findUnique({
      where: { id: toId },
    });
    if (!toUser) {
      throw new UnauthorizedException('Recipient not found');
    }

    await this.prisma.user.update({
      where: { id: fromId },
      data: {
        balance: fromUser.balance - amount,
      },
    });

    await this.prisma.user.update({
      where: { id: toId },
      data: {
        balance: toUser.balance + amount,
      },
    });

    return;
  }
}
