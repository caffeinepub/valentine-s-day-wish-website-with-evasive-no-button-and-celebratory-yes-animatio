export const valentineConfig = {
  hero: {
    title: "Happy Valentine's Day",
    subtitle: "Celebrating Love & Connection",
    description: "A special day to cherish the moments that matter most",
    ctaText: "Explore Memories",
  },
  wish: {
    question: "Will you be my Valentine?",
    helperText: "Choose your answer below...",
    yesLabel: "Yes! 💕",
    noLabel: "No",
    acceptanceMessage: "Yay! You made my day! 💖✨",
    acceptanceSubtext: "I'm so happy you said yes! Here are some special moments just for you.",
  },
  features: [
    {
      title: "Share Your Love",
      description: "Create and preserve beautiful memories together",
      icon: "heart",
    },
    {
      title: "Celebrate Together",
      description: "Every moment is a treasure worth keeping",
      icon: "sparkles",
    },
    {
      title: "Forever Yours",
      description: "Memories that last a lifetime",
      icon: "infinity",
    },
  ],
  photos: [
    {
      src: "/assets/generated/valentine-photo-1.dim_1200x800.png",
      alt: "Valentine memory 1",
      caption: "Sweet moments together",
    },
    {
      src: "/assets/generated/valentine-photo-2.dim_1200x800.png",
      alt: "Valentine memory 2",
      caption: "Love and laughter",
    },
    {
      src: "/assets/generated/valentine-photo-3.dim_1200x800.png",
      alt: "Valentine memory 3",
      caption: "Forever in my heart",
    },
  ],
  footer: {
    message: "Made with love for you",
    year: new Date().getFullYear(),
  },
  assets: {
    heroBg: "/assets/generated/valentine-hero-bg.dim_1920x1080.png",
    heartStickers: "/assets/generated/valentine-heart-stickers.dim_1024x1024.png",
    cupidIcon: "/assets/generated/cupid-icon.dim_256x256.png",
    bokehSparklesOverlay: "/assets/generated/valentine-bokeh-sparkles-overlay.dim_1920x1080.png",
  },
} as const;
