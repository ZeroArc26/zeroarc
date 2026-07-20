import Navbar from "./Navbar";
import { getCurrentUser } from "@/lib/auth";

export default async function NavbarServer() {
  const user = await getCurrentUser();

  return <Navbar user={user} />;
}