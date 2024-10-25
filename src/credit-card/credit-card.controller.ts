import { Body, Controller, Post } from '@nestjs/common';
import { CreditCardService } from './credit-card.service';
import { CredtCard, Prisma } from '@prisma/client';

@Controller('credit-card')
export class CreditCardController {
  constructor(private readonly creditCardService: CreditCardService) {}

  @Post('/send')
  async send(@Body() data: Prisma.CredtCardCreateInput): Promise<CredtCard> {
    return await this.creditCardService.create(data);
  }
}
