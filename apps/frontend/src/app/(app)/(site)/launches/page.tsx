export const dynamic = 'force-dynamic';
import { LaunchesComponent } from '@gitroom/frontend/components/launches/launches.component';
import { Metadata } from 'next';
import { getAppNameForContext } from '@gitroom/helpers/utils/get.app.name';
export const metadata: Metadata = {
  title: `${getAppNameForContext()} ${!!process.env.IS_GENERAL ? 'Calendar' : 'Launches'}`,
  description: '',
};
export default async function Index() {
  return <LaunchesComponent />;
}
