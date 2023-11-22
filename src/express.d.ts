import { Request } from 'express';

interface CustomRequest extends Request {
    refreshedAccessToken?: string;
}

export = CustomRequest;