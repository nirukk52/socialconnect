import { TemporalModule } from 'nestjs-temporal-core';
import { socialIntegrationList } from '@gitroom/nestjs-libraries/integrations/integration.manager';

/**
 * Creates the Temporal module configuration for both backend and orchestrator.
 * Supports Temporal Cloud (TLS + API key) and local Temporal Server.
 */
export const getTemporalModule = (
  isWorkers: boolean,
  path?: string,
  activityClasses?: any[]
) => {
  const address = process.env.TEMPORAL_ADDRESS || 'localhost:7233';
  const namespace = process.env.TEMPORAL_NAMESPACE || 'default';
  const apiKey = process.env.TEMPORAL_API_KEY;

  // Temporal Cloud requires TLS; detect by address or explicit API key
  const isCloud = !!apiKey || address.includes('.temporal.io') || address.includes('.tmprl.cloud');

  return TemporalModule.register({
    isGlobal: true,
    connection: {
      address,
      namespace,
      ...(isCloud ? { tls: true } : {}),
      ...(apiKey ? { apiKey } : {}),
    },
    taskQueue: 'main',
    logLevel: 'error',
    ...(isWorkers
      ? {
          workers: [
            { identifier: 'main', maxConcurrentJob: undefined },
            ...socialIntegrationList,
          ]
            .filter((f) => f.identifier.indexOf('-') === -1)
            .map((integration) => ({
              taskQueue: integration.identifier.split('-')[0],
              workflowsPath: path!,
              activityClasses: activityClasses!,
              autoStart: true,
              ...(integration.maxConcurrentJob
                ? {
                    workerOptions: {
                      maxConcurrentActivityTaskExecutions:
                        integration.maxConcurrentJob,
                    },
                  }
                : {}),
            })),
        }
      : {}),
  });
};
