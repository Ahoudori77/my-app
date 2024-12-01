import 'axios';

declare module 'axios' {
  export function isAxiosError<T = any>(payload: unknown): payload is AxiosError<T>;
}
