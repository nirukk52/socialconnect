import { Plugs } from '@gitroom/frontend/components/plugs/plugs';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { getAppNameForContext } from '@gitroom/helpers/utils/get.app.name';
export const metadata: Metadata = {
  title: `${getAppNameForContext()} Plugs`,
  description: '',
};
export default async function Index() {
  return <Plugs />;
}
