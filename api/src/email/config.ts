/**
 * Validates the environment variables needed by the invitation email pipeline.
 * Called from `main.ts` before `app.listen` so a misconfigured deploy aborts
 * at startup instead of failing on the first send.
 *
 * Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, APP_BASE_URL
 * Optional: SMTP_SECURE ('true' | 'false', defaults to false).
 */
export function validateInvitationConfig(env: NodeJS.ProcessEnv): void {
  const REQUIRED_VARS = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM',
    'APP_BASE_URL',
  ] as const;

  const missing: string[] = [];
  for (const name of REQUIRED_VARS) {
    const value = env[name];
    if (value === undefined || value === '') {
      missing.push(name);
    }
  }

  if (missing.length > 0) {
    const message = `Missing required env vars: ${missing.join(', ')}`;
    console.error(message);
    throw new Error(message);
  }

  const portRaw = env.SMTP_PORT as string;
  const port = Number(portRaw);
  if (!Number.isFinite(port) || !Number.isInteger(port) || port <= 0) {
    throw new Error(
      `SMTP_PORT must be a finite positive integer, received: ${portRaw}`,
    );
  }

  const secureRaw = env.SMTP_SECURE;
  if (
    secureRaw !== undefined &&
    secureRaw !== '' &&
    secureRaw !== 'true' &&
    secureRaw !== 'false'
  ) {
    throw new Error(
      `SMTP_SECURE must be 'true' or 'false' when set, received: ${secureRaw}`,
    );
  }
}
