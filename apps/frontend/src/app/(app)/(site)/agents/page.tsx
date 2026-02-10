import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME || process.env.APP_NAME || 'SocialConnect'} - Agent`,
  description: '',
};

export default async function Page() {
  return redirect('/agents/new');
}
