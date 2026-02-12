import {
  Global,
  Injectable,
  Logger,
  Module,
  OnModuleInit,
} from '@nestjs/common';
import { TemporalService } from 'nestjs-temporal-core';
import { Connection } from '@temporalio/client';

/**
 * Registers required custom search attributes in Temporal on startup.
 * Fails gracefully if the Temporal client is unavailable or lacks permissions
 * (e.g., Temporal Cloud API keys without operator-level access).
 */
@Injectable()
export class TemporalRegister implements OnModuleInit {
  private readonly logger = new Logger(TemporalRegister.name);

  constructor(private _client: TemporalService) {}

  async onModuleInit(): Promise<void> {
    try {
      const connection = this._client?.client?.getRawClient()
        ?.connection as Connection;

      if (!connection) {
        this.logger.warn('Temporal client connection not available, skipping search attribute registration');
        return;
      }

      const { customAttributes } =
        await connection.operatorService.listSearchAttributes({
          namespace: process.env.TEMPORAL_NAMESPACE || 'default',
        });

      const neededAttribute = ['organizationId', 'postId'];
      const missingAttributes = neededAttribute.filter(
        (attr) => !customAttributes[attr],
      );

      if (missingAttributes.length > 0) {
        await connection.operatorService.addSearchAttributes({
          namespace: process.env.TEMPORAL_NAMESPACE || 'default',
          searchAttributes: missingAttributes.reduce((all, current) => {
            // @ts-ignore
            all[current] = 1;
            return all;
          }, {}),
        });
      }
    } catch (error) {
      this.logger.warn(
        'Failed to register Temporal search attributes (may need operator permissions): ' +
          (error as Error).message,
      );
    }
  }
}

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [TemporalRegister],
  get exports() {
    return this.providers;
  },
})
export class TemporalRegisterMissingSearchAttributesModule {}
