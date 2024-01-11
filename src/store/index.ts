import { create } from "zustand";

type WireframeState = {
  toggleToSeeWireframe: boolean;
  setToggleToSeeWireframe: (value: boolean) => void;
};

export const useWireframeStore = create<WireframeState>(set => ({
  toggleToSeeWireframe: false,
  setToggleToSeeWireframe: value => set({ toggleToSeeWireframe: value }),
}));
