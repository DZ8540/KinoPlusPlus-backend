import { AgeLimits, ageLimits } from 'Config/video'

export let parseAgeLimit = (contentRating: keyof typeof AgeLimits): number => ageLimits[AgeLimits[contentRating]]
