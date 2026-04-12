import { Case } from "./types";

export const DEFAULT_CASES: Case[] = [
  {
    id: "default-1",
    title: "Unexpected Billing Charge",
    scenario:
      "A long-time customer (3 years) noticed a £45 charge on their bill that wasn't there last month. They have no idea what it is and are frustrated because they've already called twice this week and got disconnected both times.",
    openingMessage:
      "Hi, I've been trying to get through for DAYS. There's a random £45 charge on my bill and nobody can explain it to me. I need this sorted out NOW.",
    channel: "Chat",
    topic: "Billing",
    difficulty: "Intermediate",
    isDefault: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "default-2",
    title: "Cancellation Request — Better Deal Elsewhere",
    scenario:
      "A customer wants to cancel their subscription because a competitor is offering the same plan for £10/month less. They've been a customer for 18 months and are politely but firmly asking to cancel.",
    openingMessage:
      "Hi there. I'd like to cancel my subscription please. I've found the same plan with another provider for ten pounds cheaper per month.",
    channel: "Chat",
    topic: "Retention",
    difficulty: "Beginner",
    isDefault: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "default-3",
    title: "Internet Keeps Dropping — Working From Home",
    scenario:
      "A customer works from home and their internet has been dropping every afternoon for the past week. They've missed two important video calls because of it and are starting to lose patience. They've already restarted the router multiple times.",
    openingMessage:
      "My internet keeps cutting out every single afternoon. I work from home and I've already missed two client calls this week. I've restarted the router about ten times. This is completely unacceptable.",
    channel: "Call",
    topic: "Technical",
    difficulty: "Intermediate",
    isDefault: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "default-4",
    title: "Overcharged After Plan Downgrade",
    scenario:
      "A customer downgraded their plan last month following a conversation with an agent who promised the change would be immediate. The next bill shows the old, higher price. They're angry and feel misled.",
    openingMessage:
      "I am absolutely furious. I downgraded my plan last month and was PROMISED it would take effect immediately. My bill is exactly the same as before. I was lied to and I want a refund and an explanation.",
    channel: "Call",
    topic: "Billing",
    difficulty: "Advanced",
    isDefault: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "default-5",
    title: "Can't Access Account — Locked Out",
    scenario:
      "A customer has been locked out of their online account for two days. They tried resetting their password but the reset email never arrives. They have an urgent bill to pay and can't access the portal.",
    openingMessage:
      "I've been locked out of my account for two days. I've tried resetting my password but the email never comes. I need to pay my bill urgently. Can you please help me?",
    channel: "Chat",
    topic: "Account Access",
    difficulty: "Beginner",
    isDefault: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "default-6",
    title: "Threatening to Post Negative Review",
    scenario:
      "A customer had a poor experience with a field engineer who was rude and left a mess. They're now threatening to post a negative review on Trustpilot and contact consumer protection unless they receive a formal apology and compensation.",
    openingMessage:
      "Your engineer came round yesterday, was incredibly rude, and left mud all over my carpet. I want a formal written apology and compensation or I'm posting a one-star review on every platform I can find and contacting Trading Standards.",
    channel: "Call",
    topic: "De-escalation",
    difficulty: "Advanced",
    isDefault: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
];

export const DEFAULT_TOPICS = [
  "Billing",
  "Technical",
  "Retention",
  "De-escalation",
  "Account Access",
  "General Enquiry",
];
