import { and, eq } from "drizzle-orm";

import { DbClient, walletBalances, WalletBalance, user } from "../db";
import { AppError } from "../utils/AppError";
import { MlmService } from "./MlmService";
import { NotificationService } from "./NotificationService";
import { TransactionService } from "./TransactionService";

export interface BalanceChangeInput {
    userId: string;
    currency: string;
    amount: number;
}

export interface ConvertInput {
    userId: string;
    fromCurrency: string;
    toCurrency: string;
    amount: number;
    rate: number;
}

export interface PurchaseInput {
    userId: string;
    currency: string;
    amount: number;
    description?: string | undefined;
}

export interface TransferByCardInput {
    fromUserId: string;
    cardNumber: string;
    currency: string;
    amount: number;
    description?: string | undefined;
}

export class WalletService {
    constructor(
        private readonly db: DbClient,
        private readonly transactions: TransactionService,
        private readonly notifications: NotificationService,
        private readonly mlm: MlmService
    ) {}

    getBalances(userId: string) {
        return this.db.query.walletBalances.findMany({
            where: eq(walletBalances.userId, userId),
        });
    }

    async createBalances(userId: string) {
        await this.db.insert(walletBalances).values({
            userId: userId,
            currency: "RUB",
            balance: 0,
        });
        await this.db.insert(walletBalances).values({
            userId: userId,
            currency: "IMI",
            balance: 0,
        });
    }

    async deposit(input: BalanceChangeInput) {
        const balance = await this.adjustBalance(input);
        await this.transactions.createTransaction({
            userId: input.userId,
            currency: input.currency,
            amount: input.amount,
            type: "deposit",
        });
        await this.notifications.createNotification({
            userId: input.userId,
            category: "wallet",
            subcategory: "deposit",
            message: `Баланс пополнен ${input.amount} ${input.currency}`,
        });
        return balance;
    }

    async withdraw(input: BalanceChangeInput) {
        const existing = await this.getBalanceRecord(
            input.userId,
            input.currency
        );
        if (!existing || existing.balance < input.amount) {
            throw new AppError("Недостаточно средств на балансе", 400);
        }
        const balance = await this.adjustBalance({
            ...input,
            amount: -input.amount,
        });
        await this.transactions.createTransaction({
            userId: input.userId,
            currency: input.currency,
            amount: -input.amount,
            type: "withdraw",
        });
        await this.notifications.createNotification({
            userId: input.userId,
            category: "wallet",
            subcategory: "withdraw",
            message: `Вы вывели ${input.amount} ${input.currency}`,
        });
        return balance;
    }

    async convert(input: ConvertInput) {
        const from = await this.getBalanceRecord(
            input.userId,
            input.fromCurrency
        );
        if (!from || from.balance < input.amount) {
            throw new AppError("Недостаточно средств на балансе", 400);
        }

        const creditAmount = Number((input.amount * input.rate).toFixed(2));

        await this.adjustBalance({
            userId: input.userId,
            currency: input.fromCurrency,
            amount: -input.amount,
        });
        const toBalance = await this.adjustBalance({
            userId: input.userId,
            currency: input.toCurrency,
            amount: creditAmount,
        });

        await this.transactions.createTransaction({
            userId: input.userId,
            currency: input.fromCurrency,
            amount: -input.amount,
            type: "convert_out",
            metadata: { toCurrency: input.toCurrency, rate: input.rate },
        });

        await this.transactions.createTransaction({
            userId: input.userId,
            currency: input.toCurrency,
            amount: creditAmount,
            type: "convert_in",
            metadata: { fromCurrency: input.fromCurrency, rate: input.rate },
        });

        await this.notifications.createNotification({
            userId: input.userId,
            category: "wallet",
            subcategory: "convert",
            message: `Вы обменяли ${input.amount} ${input.fromCurrency} на ${creditAmount} ${input.toCurrency}`,
        });

        return toBalance;
    }

    async purchase(input: PurchaseInput) {
        const existing = await this.getBalanceRecord(
            input.userId,
            input.currency
        );
        if (!existing || existing.balance < input.amount) {
            throw new AppError("Недостаточно средств на балансе", 400);
        }

        await this.adjustBalance({
            userId: input.userId,
            currency: input.currency,
            amount: -input.amount,
        });

        await this.transactions.createTransaction({
            userId: input.userId,
            currency: input.currency,
            amount: -input.amount,
            type: "purchase",
            metadata: { description: input.description },
        });

        const rewards = await this.mlm.calculateRewards(
            input.userId,
            input.amount
        );

        for (const reward of rewards) {
            if (reward.amount <= 0) continue;

            await this.adjustBalance({
                userId: reward.user.id,
                currency: input.currency,
                amount: reward.amount,
            });

            await this.transactions.createTransaction({
                userId: reward.user.id,
                currency: input.currency,
                amount: reward.amount,
                type: "mlm_reward",
                metadata: {
                    level: reward.level,
                    sourceUserId: input.userId,
                },
            });

            await this.notifications.createNotification({
                userId: reward.user.id,
                category: "mlm",
                subcategory: "reward",
                message: `Награда от продаж ${reward.level} линии  ${reward.amount} ${input.currency}`,
                data: {
                    sourceUserId: input.userId,
                    purchaseAmount: input.amount,
                },
            });
        }

        await this.notifications.createNotification({
            userId: input.userId,
            category: "wallet",
            subcategory: "purchase",
            message: `Вы оплатили покупку ${input.amount} ${input.currency}`,
            data: { description: input.description },
        });
    }

    async transferByCard(input: TransferByCardInput) {
        const fromBalance = await this.getBalanceRecord(
            input.fromUserId,
            input.currency
        );
        if (!fromBalance || fromBalance.balance < input.amount) {
            throw new AppError("Недостаточно средств на балансе", 400);
        }

        const toUserId = await this.findUserByCardNumber(input.cardNumber);
        if (!toUserId) {
            throw new AppError("Карта не найдена", 404);
        }

        if (toUserId === input.fromUserId) {
            throw new AppError("Нельзя перевести средства самому себе", 400);
        }

        await this.adjustBalance({
            userId: input.fromUserId,
            currency: input.currency,
            amount: -input.amount,
        });

        await this.adjustBalance({
            userId: toUserId,
            currency: input.currency,
            amount: input.amount,
        });

        await this.transactions.createTransaction({
            userId: input.fromUserId,
            currency: input.currency,
            amount: -input.amount,
            type: "transfer_out",
            metadata: JSON.stringify({ 
                toUserId,
                cardNumber: input.cardNumber,
                description: input.description 
            }),
        });

        await this.transactions.createTransaction({
            userId: toUserId,
            currency: input.currency,
            amount: input.amount,
            type: "transfer_in",
            metadata: JSON.stringify({ 
                fromUserId: input.fromUserId,
                cardNumber: input.cardNumber,
                description: input.description 
            }),
        });

        await this.notifications.createNotification({
            userId: input.fromUserId,
            category: "wallet",
            subcategory: "transfer_out",
            message: `Вы перевели ${input.amount} ${input.currency} на карту ${input.cardNumber}`,
        });

        await this.notifications.createNotification({
            userId: toUserId,
            category: "wallet",
            subcategory: "transfer_in",
            message: `Вам переведено ${input.amount} ${input.currency} на карту`,
        });

        return await this.getBalanceRecord(input.fromUserId, input.currency);
    }

    private async findUserByCardNumber(cardNumber: string): Promise<string | null> {
        const normalizedCardNumber = cardNumber.replace(/\s/g, '');
        const allUsers = await this.db.query.user.findMany();
        
        for (const user of allUsers) {
            const balances = await this.getBalances(user.id);
            for (let index = 0; index < balances.length; index++) {
                const generatedNumber = this.generateCardNumber(user.id, balances[index].currency, index);
                const normalizedGenerated = generatedNumber.replace(/\s/g, '');
                if (normalizedGenerated === normalizedCardNumber) {
                    return user.id;
                }
            }
        }
        
        return null;
    }

    private generateCardNumber(userId: string, currency: string, index: number): string {
        const seed = `${userId}-${currency}-${index}`;
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            const char = seed.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        const absHash = Math.abs(hash);
        const cardDigits = String(absHash).padStart(12, '0').slice(-12);
        const cardNumber = `0000 ${cardDigits.slice(0, 4)} ${cardDigits.slice(4, 8)} ${cardDigits.slice(8, 12)}`;
        return cardNumber;
    }

    private async adjustBalance(input: BalanceChangeInput) {
        const existing = await this.getBalanceRecord(
            input.userId,
            input.currency
        );
        if (!existing) {
            await this.db.insert(walletBalances).values({
                userId: input.userId,
                currency: input.currency,
                balance: input.amount,
            });
            const record = await this.getBalanceRecord(
                input.userId,
                input.currency
            );
            if (!record) {
                throw new Error("Failed to create balance record");
            }
            return record;
        }

        const newBalance = Number((existing.balance + input.amount).toFixed(2));
        await this.db
            .update(walletBalances)
            .set({
                balance: newBalance,
            })
            .where(
                and(
                    eq(walletBalances.userId, input.userId),
                    eq(walletBalances.currency, input.currency)
                )
            );

        const record = await this.getBalanceRecord(
            input.userId,
            input.currency
        );
        if (!record) {
            throw new Error("Failed to update balance record");
        }
        return record;
    }

    private getBalanceRecord(userId: string, currency: string) {
        return this.db.query.walletBalances.findFirst({
            where: and(
                eq(walletBalances.userId, userId),
                eq(walletBalances.currency, currency)
            ),
        });
    }
}
