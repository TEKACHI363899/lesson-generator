export type UserRole = 'TEACHER' | 'ADMIN' | 'STUDENT';
export interface UserSession {
    readonly id: number;
    readonly email: string;
    readonly fullName: string;
    readonly role: UserRole;
    readonly token: string;
    readonly deviceId: string;
}
export interface JwtPayload {
    readonly sub: number;
    readonly email: string;
    readonly role: UserRole;
    readonly deviceId: string;
}
export interface DeviceSessionRecord {
    readonly id: number;
    readonly userId: number;
    readonly deviceId: string;
    readonly tokenHash: string;
    readonly expiresAt: string;
    readonly isActive: boolean;
    readonly createdAt: string;
}
