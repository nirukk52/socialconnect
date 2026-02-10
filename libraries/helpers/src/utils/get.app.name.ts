/**
 * Returns the app display name for server-side use (metadata, titles, etc.).
 * Reads from NEXT_PUBLIC_APP_NAME or APP_NAME env vars.
 */
export const getAppName = () => {
  return (
    process.env.NEXT_PUBLIC_APP_NAME ||
    process.env.APP_NAME ||
    'SocialConnect'
  );
};

/**
 * Returns the app name for enterprise/white-label mode (e.g. Gitroom).
 * Reads from NEXT_PUBLIC_APP_NAME_ENTERPRISE or APP_NAME_ENTERPRISE env vars.
 */
export const getAppNameEnterprise = () => {
  return (
    process.env.NEXT_PUBLIC_APP_NAME_ENTERPRISE ||
    process.env.APP_NAME_ENTERPRISE ||
    'Gitroom'
  );
};

/**
 * Returns the app name for the current context (general vs enterprise).
 * Use for page metadata and titles. When IS_GENERAL is set, returns getAppName();
 * otherwise returns getAppNameEnterprise(). Keeps "general vs enterprise" logic in one place.
 */
export const getAppNameForContext = () => {
  return !!process.env.IS_GENERAL ? getAppName() : getAppNameEnterprise();
};

/**
 * Returns the app domain (hostname) for analytics and scripts.
 * Uses NEXT_PUBLIC_APP_DOMAIN if set; otherwise derives hostname from
 * NEXT_PUBLIC_APP_URL or FRONTEND_URL. Avoids duplicating URL parsing logic.
 */
export const getAppDomain = () => {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_APP_URL ||
        process.env.FRONTEND_URL ||
        'http://localhost:4200'
    ).hostname;
  } catch {
    return 'localhost';
  }
};
