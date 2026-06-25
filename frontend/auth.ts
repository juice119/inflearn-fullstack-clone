import type { NextRequest } from 'next/server';

export type Session = {
  user?: {
    email?: string | null;
  };
} | null;

export async function getSession(_request?: NextRequest): Promise<Session> {
  return null;
}

export async function auth(): Promise<Session> {
  return getSession();
}

export async function signIn(..._args: unknown[]): Promise<void> {}

export async function signOut(..._args: unknown[]): Promise<void> {}
