import { db } from "../db";
import { MlmService } from "./MlmService";
import { NotificationService } from "./NotificationService";
import { TransactionService } from "./TransactionService";
import { UserService } from "./UserService";
import { WalletService } from "./WalletService";
import { ProductService } from "./ProductService";
import { VerificationService } from "./VerificationService";
import { OrderService } from "./OrderService";
import { CouponService } from "./CouponService";

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
export const verificationService = new VerificationService(db);
export const orderService = new OrderService(db);
export const couponService = new CouponService(db);

export const services = {
    userService,
    walletService,
    transactionService,
    notificationService,
    mlmService,
    productService,
    verificationService,
    orderService,
    couponService,
};
