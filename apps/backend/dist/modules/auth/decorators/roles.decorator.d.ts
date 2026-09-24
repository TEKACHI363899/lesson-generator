import { CustomDecorator } from '@nestjs/common';
import { UserRole } from '@eng-studio/shared-types';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserRole[]) => CustomDecorator<string>;
