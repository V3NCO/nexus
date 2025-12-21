export type Location = {
  id: number;
  hassid: string;
  emoji: string;
  label: string;
};

export const GITHUB_USERNAME = 'v3nco';
export const HASS_LOCATION_ENTITY = 'person.venco';
export const LOCATIONS: Location[] = [
  // The map gets centered on the first item in this list so its kinda the most important
  {
    id: 1,
    hassid: "device_tracker.pixel_8_pro",
    emoji: "📱",
    label: "My Phone :3"
  },
  {
    id: 2,
    hassid: "device_tracker.stardust",
    emoji: "💻",
    label: "Stardust - my mac!"
  },
]
export const LASTFM_USERNAME = 'v3nco'
