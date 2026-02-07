export const ROLES = {
  DOCTOR: 'doctor',
  MAFIA: 'mafia',
  DETECTIVE: 'detective',
  JESTER: 'jester',
  BOMBER: 'bomber',
  LOVER: 'lover',
  CIVILIAN: 'civilian',
}

export const ROLE_INFO = {
  [ROLES.DOCTOR]: {
    name: 'Doctor',
    image: "/images/Doctor.png",
    description: 'Save one player each night (yourself or others)',
  },
  [ROLES.MAFIA]: {
    name: 'Mafia',
    image: "/images/Mafia.png",
    description: 'Kill one player each night. Work with other mafia members',
  },
  [ROLES.DETECTIVE]: {
    name: 'Detective',
    image: "/images/Detective.png",
    description: 'Investigate one player each night',
  },
  [ROLES.JESTER]: {
    name: 'Jester',
    image: "/images/Jester.png",
    description: 'GET VOTED OUT to win alone!',
  },
  [ROLES.BOMBER]: {
    name: 'Bomber',
    image: "/images/Bomber.png",
    description: 'If voted out, take someone with you',
  },
  [ROLES.LOVER]: {
    name: 'Lover',
    image: "/images/Lover.png",
    description: 'Protect someone on Night 1 by sacrificing yourself',
  },
  [ROLES.CIVILIAN]: {
    name: 'Civilian',
    image: "/images/Civilian.png",
    description: 'Find and eliminate Mafia!',
  },
}
