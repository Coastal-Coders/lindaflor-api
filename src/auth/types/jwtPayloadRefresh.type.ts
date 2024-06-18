import { JwtPayload } from './jwtPayload.type';

export type JwtPayloadRefresh = JwtPayload & {
  refreshToken: string;
};
