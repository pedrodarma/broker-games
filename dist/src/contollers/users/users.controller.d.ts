import { Request, Response } from 'express';
export declare class UsersController {
    static list(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
