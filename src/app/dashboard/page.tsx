import { auth, currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const authObj = await auth();
  const userObject = await currentUser();
  console.log({ authObj, userObject });
  return <h1>Dashboard</h1>;
}
