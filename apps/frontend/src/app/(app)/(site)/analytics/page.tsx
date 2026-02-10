export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { PlatformAnalytics } from '@gitroom/frontend/components/platform-analytics/platform.analytics';
import { getAppNameForContext } from '@gitroom/helpers/utils/get.app.name';
export const metadata: Metadata = {
  title: `${getAppNameForContext()} Analytics`,
  description: '',
};
export default async function Index() {
  return <PlatformAnalytics />;
}
