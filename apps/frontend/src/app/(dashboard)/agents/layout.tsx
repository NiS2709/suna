import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Worker Conversation | Nexus',
  description: 'Interactive Worker conversation powered by Nexus',
  openGraph: {
    title: 'Worker Conversation | Nexus',
    description: 'Interactive Worker conversation powered by Nexus',
    type: 'website',
  },
};

export default async function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
