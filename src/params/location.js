import { LOCATIONS } from "$lib/config";

export function match(value) {
  return LOCATIONS.some(item => item.id.toString() === value);
}
