import { SettingsIcon } from "lucide-react";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import LoadingScreen from "@/components/LoadingScreen.tsx";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";
import ActionButton from "@/features/projects/components/ActionButton.tsx";
import { handleError } from "@/utils/error.ts";

import { fetchProfile, upsertProfile } from "../services/usersService.ts";

export default function Settings() {
  const { session } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!session) return;

      try {
        const prof = await fetchProfile(session.user.id);
        setDisplayName(prof.display_name);
      } catch (err) {
        handleError(err, "Project loading failed");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [session]);

  const handleChangeDisplayName = async () => {
    if (!session) return;
    setIsSubmitting(true);
    try {
      if (!displayName.trim()) throw new Error("Display name can't be empty.");
      await upsertProfile(session.user.id, displayName.trim());
      toast.success("Display name changed successfully.");
    } catch (err) {
      handleError(err, "Failed to update display name");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      <h1 className="flex items-center gap-2 text-2xl font-bold">
        <SettingsIcon />
        Settings
      </h1>
      <p className="text-base-content/80 mb-3 text-sm">
        Change your display name.
      </p>
      <div className="flex flex-col gap-1">
        <label htmlFor="display_name" className="label text-sm">
          Display Name
        </label>
        <input
          type="text"
          name=""
          id="display_name"
          placeholder="Display Name"
          className="input"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>
      <ActionButton
        onClick={handleChangeDisplayName}
        loading={isSubmitting}
        className="btn mt-1.5"
      >
        Submit
      </ActionButton>
      <p className="text-base-content/80 mt-3 text-sm italic">
        To change your avatar, change the picture in your Google account and
        login with Google once again.
      </p>
    </>
  );
}
