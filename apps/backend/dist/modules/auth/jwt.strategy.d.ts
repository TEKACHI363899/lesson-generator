import { Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { NguoiDungThietBiEntity } from '../../database/entities/nguoi-dung-thiet-bi.entity';
import { JwtPayload } from '@eng-studio/shared-types';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly deviceSessionRepo;
    constructor(deviceSessionRepo: Repository<NguoiDungThietBiEntity>);
    validate(req: Request, payload: JwtPayload): Promise<JwtPayload>;
}
export {};
