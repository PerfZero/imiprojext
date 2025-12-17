import { db } from "../db";
import { MlmService } from "./MlmService";
import { NotificationService } from "./NotificationService";
import { TransactionService } from "./TransactionService";
import { UserService } from "./UserService";
import { WalletService } from "./WalletService";
import { ProductService } from "./ProductService";

export const userService = new UserService(db);
export const transactionService = new TransactionService(db);
export const notificationService = new NotificationService(db);
export const mlmService = new MlmService(userService);
export const walletService = new WalletService(
    db,
    transactionService,
    notificationService,
    mlmService
);
export const productService = new ProductService(db);

export const services = {
    userService,
    walletService,
    transactionService,
    notificationService,
    mlmService,
    productService,
};
