import { create } from "zustand";

export type TUserState = {
  apiKey: string;
};

export type TUserStateSetters = {
  setAPIKey(apiKey: string): void;
};

export const useUser = create<TUserState>(() => ({
  apiKey: "",
}));

export const userStateSetters: TUserStateSetters = {
  setAPIKey(apiKey) {
    useUser.setState((state) => ({
      ...state,
      apiKey,
    }));
  },
};
