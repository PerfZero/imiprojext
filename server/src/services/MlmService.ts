import { User } from "../db";
import { UserService } from "./UserService";

export interface LevelReward {
    level: number;
    user: User;
    amount: number;
}

export class MlmService {
    constructor(
        private readonly userService: UserService,
        private readonly levelPercentages: number[] = [
            0.08, 0.04, 0.04, 0.04, 0.04, 0.03, 0.03,
        ]
    ) {}

    async calculateRewards(buyerId: string, purchaseAmount: number) {
        const uplines = await this.userService.getUpline(
            buyerId,
            this.levelPercentages.length
        );

        return uplines
            .slice(0, this.levelPercentages.length)
            .map((user, idx) => {
                const rate = this.levelPercentages[idx] ?? 0;
                return {
                    level: idx + 1,
                    user,
                    amount: Number((purchaseAmount * rate).toFixed(2)),
                };
            });
    }
}
