import { HuntConfig } from "src/types/hunt_config";

const MOCKED_DEFAULT_BACKGROUND = "../graphics/background.png";

// Change this to change which clue is rendered when visiting popup
export const DEFAULT_CURRENT_PROGRESS = 1;
export const DEFAULT_MAX_PROGRESS = 2;

export const DEFAULT_HUNT_CONFIG: HuntConfig = {
  name: "Default Hunt",
  description: "Default Hunt for Mocked Development",
  author: "Author",
  version: "1.0",
  encrypted: false,
  background: MOCKED_DEFAULT_BACKGROUND,
  options: {
    silent: false,
    inOrder: false,
  },
  beginning: "The beginning clue",
  clues: [
    {
      id: 1,
      url: "google.com",
      text: "The first of two clues",
      image:
        "https://raw.githubusercontent.com/TylerJang27/Scav_Hunt_Extension/dev/public/graphics/scav.png",
      alt: "Scavenger Hunt logo",
    },
    {
      id: 2,
      url: "bing.com",
      text: "The second of two clues",
      interactive: {
        prompt: "Enter 'test'",
        key: "test",
      },
    },
  ],
};
