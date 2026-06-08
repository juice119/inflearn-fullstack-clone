// src/comon/request.ts
import type { Request } from 'express';


// 💡 제네릭 T 뒤에 'extends Express.User' 제약 조건을 추가해줍니다.
export interface AuthenticatedRequest extends Request {
  user: JwtPayLoad;
}

interface JwtPayLoad {
  email: string;
}