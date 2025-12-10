import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Wisp - Your Private Grocery Copilot',
    short_name: 'Wisp',
    description: 'Automated pantry, healthier carts, under your control',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#EE7C2B',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['food', 'lifestyle', 'productivity'],
    lang: 'en',
    dir: 'ltr',
  };
}


