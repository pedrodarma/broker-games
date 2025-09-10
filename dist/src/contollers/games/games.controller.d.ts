import { Request, Response } from 'express';
export declare class GamesController {
    static list(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
