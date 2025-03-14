import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button.tsx";
import {
  createPlayground,
  getUserPlaygrounds,
} from "@/services/firebase/firestore.ts";
import { Playground } from "@/types/firestore.ts";

export default function Home() {
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
    navigate(`/home/playground/${docRef.id}`);
  };

  // TODO: some kind of feedback when loading playgrounds... the layout gets shifted
  // TODO: Feedback when opening a playground
  // TODO: /playground/new should create the new playground automagically

  return (
    <main>
      <Button onClick={handleCreatePlayground}>Create Playground</Button>

      <ul>
        {playgrounds.map((playground) => (
          <li key={playground.id}>
            <Button
              onClick={() => navigate(`/home/playground/${playground.id}`)}
            >
              {playground.title}
            </Button>
          </li>
        ))}
      </ul>
    </main>
  );
}
