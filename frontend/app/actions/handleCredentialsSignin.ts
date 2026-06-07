// app/actions/handleCredentialsSignin.ts
"use server";

import { signIn } from "@/auth";

// 클라이언트에 돌려줄 안전한 리턴 타입 구조 정의
export type SigninResponse = 
  | { success: true }
  | { success: false; errorMessage: string };

export async function handleCredentialsSignin(email: string, password: string): Promise<SigninResponse> {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false, // 💡 중요: 자동 리다이렉트를 꺼야 catch 블록에서 에러를 낚아챕니다!
    });
    return { success: true };
  } catch (error: any) {
    // 🎯 Auth.js v5가 숨겨놓은 진짜 알맹이 에러 메시지를 정밀 타격하여 꺼냅니다.
    const rawError = error.cause?.err?.message || error.message || "";
    
    let friendlyMessage = "로그인 정보가 올바르지 않습니다.";
    
    // 내가 auth.ts에서 적어둔 에러 문구가 포함되어 있는지 검증합니다.
    if (rawError.includes("이메일과 비밀번호")) friendlyMessage = "이메일과 비밀번호를 입력해주세요.";
    else if (rawError.includes("존재하지 않는 이메일")) friendlyMessage = "존재하지 않는 이메일입니다.";
    else if (rawError.includes("비밀 번호가 일치하지")) friendlyMessage = "비밀번호가 일치하지 않습니다.";

    // 💡 에러를 throw하지 않고, 안전하게 문자열 객체로 묶어서 클라이언트에 리턴(return)합니다.
    return {
      success: false,
      errorMessage: friendlyMessage
    };
  }
}