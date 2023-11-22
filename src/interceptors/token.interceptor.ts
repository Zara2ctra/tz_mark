import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';

@Injectable()
export class AccessTokenInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
        try {
            const response: AxiosResponse = await axios.post(
                `${process.env.API_TOKEN}/oauth2/access_token`,
                {
                    client_id: process.env.CLIENT_ID,
                    client_secret: process.env.CLIENT_SECRET,
                    grant_type: 'refresh_token',
                    refresh_token: process.env.REFRESH_TOKEN,
                    redirect_uri: process.env.REDIRECT_URI,
                }
            );

            const request = context.switchToHttp().getRequest();
            request.refreshedAccessToken = response.data.access_token;

            return next.handle();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError = error;
                console.error('Refresh Token Error:', axiosError.response?.data || axiosError.message);
                throw axiosError;
            } else {
                throw error;
            }
        }
    }
}