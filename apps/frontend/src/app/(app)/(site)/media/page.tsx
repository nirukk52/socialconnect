import { MediaLayoutComponent } from '@gitroom/frontend/components/new-layout/layout.media.component';
import { Metadata } from 'next';
import { getAppNameForContext } from '@gitroom/helpers/utils/get.app.name';

export const metadata: Metadata = {
  title: `${getAppNameForContext()} Media`,
  description: '',
};

export default async function Page() {
  return <MediaLayoutComponent />
}
