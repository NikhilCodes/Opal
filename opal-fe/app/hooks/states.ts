import {create} from "zustand/react";

interface EnvironmentState {
  env: string
  setEnv: (env: string) => void
}

export const useEnvironment = create<EnvironmentState>((set) => ({
  env: 'prod',
  setEnv: (env: string) => set({
    env
  })
}))