export const dynamic = 'force-dynamic';
import { ForgotReturn } from '@gitroom/frontend/components/auth/forgot-return';
import { Metadata } from 'next';
import { getAppNameForContext } from '@gitroom/helpers/utils/get.app.name';
export const metadata: Metadata = {
  title: `${getAppNameForContext()} Forgot Password`,
  description: '',
};
export default async function Auth(params: {
  params: {
    token: string;
  };
}) {
  return <ForgotReturn token={params.params.token} />;
}
