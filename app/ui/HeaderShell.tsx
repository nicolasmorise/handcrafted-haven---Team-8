import Header from "./Header";
import { getCurrentUser } from "@/lib/auth";

export default async function HeaderShell() {
  const user = await getCurrentUser();
  return <Header user={user} />;
}

