
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CredtCard, Prisma } from '@prisma/client';
import { ClientProxy } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

@Injectable()
export class CreditCardService {
    constructor(
        private readonly prisma: PrismaService,
        @Inject('NOTIFICATION_SERVICE') private rabbitClient: ClientProxy,
    ) { }
    async create(data: Prisma.CredtCardCreateInput): Promise<CredtCard> {
        const creditCard = await this.prisma.credtCard.create({ data });

        this.sendRegisterPaymentNotification(JSON.stringify(creditCard));

        this.processPayment(creditCard);
        return creditCard;
    }

    async processPayment(payment: CredtCard) {
        setTimeout(() => this.sendConfirmationPaymantNotification(JSON.stringify(payment)),
        10000,
        );
    }

    sendRegisterPaymentNotification(message: string) {
        try {
            this.rabbitClient.emit('register', {
                id: randomUUID(),
                data: {
                    notification: message
                },
            })
        } catch (error) {
            console.log(error);
        }
    }

    sendConfirmationPaymantNotification(message: string) {
        try {
            this.rabbitClient.emit('confirmation', {
                id: randomUUID(),
                data: { notification: message },
            })
        } catch (error) {
            console.log(error);
        }
    }
}    