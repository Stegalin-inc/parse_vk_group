import { createContext, type ComponentChild } from "preact";

export const MessageContext = createContext<((msg: ComponentChild) => any) | null>(null)
