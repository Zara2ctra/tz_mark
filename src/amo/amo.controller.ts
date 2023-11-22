import {Controller, Get, Query, Req, UseInterceptors} from '@nestjs/common';
import {AmoService} from './amo.service';
import {AccessTokenInterceptor} from "../interceptors/token.interceptor";
import CustomRequest from "../express";

@Controller('')
export class AmoController {
    constructor(private readonly amoService: AmoService) {}

    @Get('/')
    @UseInterceptors(AccessTokenInterceptor)
    async getContact(
        @Req() request: CustomRequest,
    ): Promise<any> {
        const refreshedAccessToken = request.refreshedAccessToken;
        console.log(refreshedAccessToken)
        if (refreshedAccessToken) {
            await this.amoService.getContact(request);
        } else {
            return { error: 'access token not found' };
        }
    }
}