import { ConflictException, UsePipes } from "@nestjs/common";
import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import {hash} from 'bcryptjs'
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from 'zod'

const createAccountBodySchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(6).max(255),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Birthdate must be in the format YYYY-MM-DD'
  }).optional(),
  balance: z.coerce.number().optional().default(0)
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/users/signup')
export class CreateAccountController{
  constructor(private prisma: PrismaService){}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema){
    const {name, email, password, birthDate, balance} = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (userWithSameEmail){
      throw new ConflictException('Email already exists')
    }

    const hashedPassword = await hash(password, 8)
    
    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        birthDate,
        balance
      }
    })
  }
}