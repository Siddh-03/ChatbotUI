// src/data/mockData.js

export const chatbots = [
  {
    id: 1,
    type: "educationai",
    category: "education learning study academic recommended",
    title: "Education AI Chatbot",
    description:
      "Your AI partner for academic research, learning, and complex topics.",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop",
    plan: "PRO",
  },
  {
    id: 2,
    type: "storytelling",
    category: "creative storytelling entertainment lifestyle recommended",
    title: "Story telling chatbot",
    description:
      "Crafts engaging narratives and helps you weave your own tales.",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop",
    plan: "FREE",
  },
  {
    id: 3,
    type: "sport",
    category: "sport entertainment lifestyle news recommended",
    title: "Sport Chatbot",
    description: "Your go-to source for sports news, scores, and discussions.",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop",
    plan: "",
  },
  {
    id: 4,
    type: "visualgenerator",
    category: "creative visual design art productivity recommended",
    title: "Visual Generator chatbot",
    description:
      "Creates stunning images and visual content from your prompts.",
    image:
      "https://images.unsplash.com/photo-1561089489-f13d5e730d72?w=200&h=200&fit=crop",
    plan: "",
  },
  {
    id: 5,
    type: "mentalhealth",
    category: "health mentalhealth wellness support lifestyle recommended",
    title: "Mental Health chatbot",
    description:
      "Provides a supportive space for mental well-being and guidance.",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&h=200&fit=crop",
    plan: "",
  },
  {
    id: 6,
    type: "summary",
    category: "productivity utility tools education text recommended",
    title: "Summary AI chatbot",
    description: "Condenses long texts and documents into concise summaries.",
    image:
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=200&h=200&fit=crop",
    plan: "",
  },
];

export const subscriptionsData = [
  {
    id: 1,
    title: "Education AI Chatbot",
    description:
      "Your AI partner for academic research, learning, and complex topics.",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop",
    currentPlan: "pro",
    plans: [
      {
        id: "free",
        name: "Free",
        price: 0,
        features: ["10 messages/day", "Basic topics", "Limited history"],
      },
      {
        id: "pro",
        name: "Pro",
        price: 9.99,
        features: [
          "Unlimited messages",
          "All topics",
          "Advanced analytics",
          "Priority support",
        ],
      },
      {
        id: "team",
        name: "Team",
        price: 24.99,
        features: [
          "Everything in Pro",
          "Multiple users",
          "API access",
          "Custom training",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Story telling chatbot",
    description:
      "Crafts engaging narratives and helps you weave your own tales.",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop",
    currentPlan: "free",
    plans: [
      {
        id: "free",
        name: "Free",
        price: 0,
        features: ["5 stories/month", "Basic genres", "Text-only"],
      },
      {
        id: "premium",
        name: "Premium",
        price: 4.99,
        features: [
          "Unlimited stories",
          "All genres",
          "Audio versions",
          "Illustration prompts",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Visual Generator chatbot",
    description:
      "Creates stunning images and visual content from your prompts.",
    image:
      "https://images.unsplash.com/photo-1561089489-f13d5e730d72?w=200&h=200&fit=crop",
    currentPlan: "pro",
    plans: [
      {
        id: "free",
        name: "Free",
        price: 0,
        features: ["10 images/month", "Basic styles", "Standard resolution"],
      },
      {
        id: "pro",
        name: "Pro",
        price: 14.99,
        features: [
          "100 images/month",
          "All styles",
          "HD resolution",
          "Commercial license",
        ],
      },
      {
        id: "enterprise",
        name: "Enterprise",
        price: 49.99,
        features: [
          "Unlimited images",
          "Custom models",
          "API access",
          "Bulk generation",
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Mental Health chatbot",
    description:
      "Provides a supportive space for mental well-being and guidance.",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&h=200&fit=crop",
    currentPlan: "free",
    plans: [
      {
        id: "free",
        name: "Free",
        price: 0,
        features: ["Daily check-ins", "Basic exercises", "Community resources"],
      },
      {
        id: "premium",
        name: "Premium",
        price: 7.99,
        features: [
          "Unlimited sessions",
          "Advanced tools",
          "Progress tracking",
          "Expert content",
        ],
      },
    ],
  },
];
