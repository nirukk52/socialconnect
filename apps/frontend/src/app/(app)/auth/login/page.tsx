export const dynamic = 'force-dynamic';
import { Login } from '@gitroom/frontend/components/auth/login';
import { Metadata } from 'next';
import { getAppNameForContext } from '@gitroom/helpers/utils/get.app.name';
export const metadata: Metadata = {
  title: `${getAppNameForContext()} Login`,
  description: '',
};
export default async function Auth() {
  return <Login />;
}
