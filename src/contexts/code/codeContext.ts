import { createContext } from "react";

import { CodeStateType } from "@/types/firestore.ts";

export const CodeContext = createContext<CodeStateType | undefined>(undefined);
