'use client';

import { handleCredentialsSignin } from '@/app/actions/handleCredentialsSignin';
import Link from 'next/link';
import { type SubmitEvent } from 'react';
import { useState } from 'react';

export default function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await handleCredentialsSignin(email, password);

    if (!result.success) alert(result.errorMessage);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">로그인</h1>
      <p className="text-gray-700">인프런 계정으로 로그인할 수 있어요</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 min-w-[300px]">
        <label htmlFor="email">이메일</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          name="email"
          placeholder="example@inflab.com"
          className="border-2 border-gray-300 rounded-sm p-2"
        />
        <label htmlFor="password">비밀번호</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          name="password"
          placeholder="example@inflab.com"
          className="border-2 border-gray-300 rounded-sm p-2"
        />

        <button
          type="submit"
          className="bg-green-500 text-white font-bold cursor-pointer rounded-sm p-2"
        >
          로그인
        </button>
        <Link href="/signup" className="text-center">
          회원가입
        </Link>
      </form>
    </div>
  );
}
