import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button.tsx";
import { doSignOut } from "@/services/firebase/auth.ts";
import {
  createPlayground,
  getUserPlaygrounds,
} from "@/services/firebase/firestore.ts";
import { Playground } from "@/types/firestore.ts";

export default function Dashboard() {
  const [playgrounds, setPlaygrounds] = useState<Playground[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getPlaygrounds = async () => {
      try {
        const userPlaygrounds = await getUserPlaygrounds();
        setPlaygrounds(userPlaygrounds);
      } catch (error) {
        console.error(error);
      }
    };

    getPlaygrounds();
  }, []);

  const handleCreatePlayground = async () => {
    const docRef = await createPlayground("New Playground");
    navigate(`/dashboard/playground/${docRef.id}`);
  };

  // TODO: some kind of feedback when loading playgrounds... the layout gets shifted
  // TODO: Feedback when opening a playground

  return (
    <main>
      <h1>Dashboard</h1>
      <Button
        onClick={() => {
          doSignOut();
          navigate("/");
        }}
      >
        Sign out
      </Button>
      <Button onClick={handleCreatePlayground}>Create Playground</Button>

      <ul>
        {playgrounds.map((playground) => (
          <li key={playground.id}>
            <Button
              onClick={() => navigate(`/dashboard/playground/${playground.id}`)}
            >
              {playground.title}
            </Button>
          </li>
        ))}
      </ul>
    </main>
  );
}
