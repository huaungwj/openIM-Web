import type { App } from 'vue';
import { registerNaive } from '@/global/register-naive';

export function registerApp(app: App): void {
  registerNaive(app);
}
