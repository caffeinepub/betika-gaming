import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type Principal = Principal;
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum Currency {
    EUR = "EUR",
    GBP = "GBP",
    KES = "KES",
    MWK = "MWK",
    TZS = "TZS",
    UGX = "UGX",
    USD = "USD",
    ZAR = "ZAR",
    ZMW = "ZMW"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    confirmDeposit(transactionId: bigint): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    initiateDeposit(currency: Currency, amount: bigint): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    recordAdminDeposit(currency: Currency, amount: bigint): Promise<bigint>;
    recordWin(user: Principal, amount: bigint): Promise<void>;
    releaseWinningsToUser(user: Principal): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
