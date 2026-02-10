/**
 * Returns the programmatic agent identifier for Mastra/CopilotKit.
 * Derived from APP_AGENT_NAME or APP_NAME env vars (lowercase, no spaces).
 */
export const getAgentName = () => {
  const name =
    process.env.APP_AGENT_NAME ||
    process.env.APP_NAME ||
    process.env.NEXT_PUBLIC_APP_NAME ||
    'socialconnect';
  return name.toLowerCase().replace(/\s+/g, '');
};
