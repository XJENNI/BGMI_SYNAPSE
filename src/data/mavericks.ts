export interface MavericksImage {
  src: string;
  label: string;
  source: string;
}

export interface MavericksEvent {
  name: string;
  date?: string;
  venueOrMode?: string;
  entryFee?: string;
  prize?: string;
  source: string;
}

export const mavericksPageData = {
  hero: {
    title: 'MAVERICKS',
    subtitle: 'THE GAMING SOCIETY OF MAMC',
    source: 'attached-image-01 (0e0bd87a-d751-4a84-99a6-07572e71fafa)'
  },
  about: {
    lines: [
      'The official gaming society of Maulana Azad Medical College.',
      'The official BGMI Tournament of Synapse 2026 is organized by Mavericks.'
    ],
    source: 'src/pages/index.astro and src/layouts/Layout.astro'
  },
  relationship: {
    synapse: 'SYNAPSE is the annual festival ecosystem of MAMC; Mavericks is the gaming society and organizer of Synapse 2026 BGMI tournament.',
    source: 'src/pages/index.astro'
  },
  social: [
    {
      platform: 'Instagram',
      url: 'https://www.instagram.com/mavericks_mamc/',
      source: 'user-provided + src/pages/events.astro + src/layouts/Layout.astro'
    }
  ],
  activities: [
    {
      name: 'FIFA Tournament',
      date: 'Feb 11 – 12, 2026',
      venueOrMode: 'Biochem Demo Room',
      entryFee: '₹150 (Maulanians) / ₹200 (Non-Maulanians)',
      prize: 'Prize Pool: ₹2000',
      source: 'src/pages/events.astro'
    },
    {
      name: 'Smash Karts Tournament',
      date: 'Feb 6 – 10, 2026',
      entryFee: '₹200 per team',
      prize: '1st: ₹1500, 2nd: ₹500',
      source: 'src/pages/events.astro'
    },
    {
      name: 'Clash Royale Tournament',
      date: 'Feb 8 – 9, 2026',
      venueOrMode: 'Online',
      entryFee: '₹50',
      prize: 'Prize Pool: ₹2000',
      source: 'src/pages/events.astro'
    },
    {
      name: 'Stumble Guys Tournament',
      date: 'Feb 11, 2026',
      venueOrMode: 'Online - Play from home',
      entryFee: '₹50 only',
      prize: '1st: ₹1000, 2nd: ₹500',
      source: 'src/pages/events.astro'
    }
  ] as MavericksEvent[],
  coreImages: [
    {
      src: '/data/img/core/Head.jpg',
      label: 'Head.jpg',
      source: 'public/data/img/core (commit 03c44b20245c3ad2b8d1e8e135dc01eaf55ba00e)'
    },
    {
      src: '/data/img/core/It head.jpg',
      label: 'It head.jpg',
      source: 'public/data/img/core (commit 03c44b20245c3ad2b8d1e8e135dc01eaf55ba00e)'
    },
    {
      src: '/data/img/core/Junior executive .jpg',
      label: 'Junior executive .jpg',
      source: 'public/data/img/core (commit 03c44b20245c3ad2b8d1e8e135dc01eaf55ba00e)'
    },
    {
      src: '/data/img/core/Junior executive 1.jpg',
      label: 'Junior executive 1.jpg',
      source: 'public/data/img/core (commit 03c44b20245c3ad2b8d1e8e135dc01eaf55ba00e)'
    },
    {
      src: '/data/img/core/Mavericks.jpg',
      label: 'Mavericks.jpg',
      source: 'public/data/img/core (commit 03c44b20245c3ad2b8d1e8e135dc01eaf55ba00e)'
    },
    {
      src: '/data/img/core/Secretary .jpg',
      label: 'Secretary .jpg',
      source: 'public/data/img/core (commit 03c44b20245c3ad2b8d1e8e135dc01eaf55ba00e)'
    },
    {
      src: '/data/img/core/Senior executive .jpg',
      label: 'Senior executive .jpg',
      source: 'public/data/img/core (commit 03c44b20245c3ad2b8d1e8e135dc01eaf55ba00e)'
    },
    {
      src: '/data/img/core/Senior executive 1.jpg',
      label: 'Senior executive 1.jpg',
      source: 'public/data/img/core (commit 03c44b20245c3ad2b8d1e8e135dc01eaf55ba00e)'
    }
  ] as MavericksImage[]
};
