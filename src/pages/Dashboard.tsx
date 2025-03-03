import { Button } from "@/components/ui/button.tsx";
import { doSignOut } from "@/services/firebase/auth.ts";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Button onClick={doSignOut}>Sign out</Button>
    </div>
  );
}
