import { PrismaService } from '../prisma/prisma.service';
interface JwtPayload {
    sub: string;
    iat?: number;
    exp?: number;
}
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        username: string;
        email: string;
    }>;
}
export {};
