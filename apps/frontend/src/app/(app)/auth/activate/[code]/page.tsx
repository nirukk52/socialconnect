export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { AfterActivate } from '@gitroom/frontend/components/auth/after.activate';
import { getAppNameForContext } from '@gitroom/helpers/utils/get.app.name';
export const metadata: Metadata = {
  title: `${getAppNameForContext()} - Activate your account`,
  description: '',
};
export default async function Auth() {
  return <AfterActivate />;
}
