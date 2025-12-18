// src/data/mockData.js

// src/data/mockData.js

export const chatbots = [
  {
    id: "fitfusion",
    type: "fitfusion",
    category: "health lifestyle recommended",
    title: "FitFusion AI",
    description:
      "Your personal fitness coach for workout plans, diet tips, and fat loss strategies.",
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop", // Gym/Fitness image
    plan: "PRO",
  },
  {
    id: "marketing",
    type: "marketing",
    category: "creative productivity business recommended",
    title: "Marketing Bot",
    description:
      "Expert advice on promoting products, digital marketing strategies, and brand growth.",
    image:
      "https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=400&h=400&fit=crop", // Marketing/Strategy image
    plan: "FREE",
  },
  {
    id: "mental_health",
    type: "mental_health",
    category: "health wellness support recommended",
    title: "Mental Health Support",
    description:
      "A safe space to discuss anxiety, stress, and receive supportive guidance.",
    image:
      "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?w=400&h=400&fit=crop", // Peaceful nature/Health image
    plan: "",
  },
  {
    id: "general",
    type: "general",
    category: "education productivity recommended",
    title: "Standard Assistant",
    description:
      "Your versatile AI companion for general queries, writing, and problem-solving.",
    image:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=400&fit=crop", // Tech/AI image
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
