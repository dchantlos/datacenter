import type { ExplodeController } from "./PodiumExploder";

export const explodedCube: string;
export function mountExplodeWidget(options: { controller: ExplodeController; container: HTMLElement }): {
  element: HTMLDivElement;
  destroy(): void;
};
