import { LifetimeDeal } from '@gitroom/frontend/components/billing/lifetime.deal';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { getAppNameForContext } from '@gitroom/helpers/utils/get.app.name';
export const metadata: Metadata = {
  title: `${getAppNameForContext()} Lifetime deal`,
  description: '',
};
export default async function Page() {
  return <LifetimeDeal />;
}
