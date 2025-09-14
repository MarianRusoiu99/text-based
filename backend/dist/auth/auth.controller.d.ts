import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                username: string;
                email: string;
                displayName: string | null;
            };
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
            user: {
                id: string;
                username: string;
                email: string;
                displayName: string | null;
            };
        };
    }>;
    refresh(refreshToken: string): {
        success: boolean;
        message: string;
        data: {
            accessToken: string;
            refreshToken: string;
        };
    };
}
