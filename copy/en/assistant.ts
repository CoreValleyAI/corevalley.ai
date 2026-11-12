/**
 * The private-assistant demo (components/home/assistant-section.tsx): a
 * question, its answer from the organisation's own documents and the source
 * named. Sample content, labelled as an illustration. It came off the home
 * page in Nov 2026 (an AI infrastructure company should not be read as a
 * chatbot) and is kept for a product page.
 */
export const ASSISTANT = {
  kicker: "Private AI",
  title: "An AI assistant that's yours alone.",
  continuation: "It answers from your documents.",
  lead: "Give your team answers from your own files, with the source named. It runs in your private workspace in Nepal, and nothing anyone asks is used to train anything.",
  window: "Assistant",
  private: "Private to your organisation",
  pick: "Try asking",
  source: "Source",
  caption: "Illustration · sample documents",
  questions: [
    {
      id: "q1",
      chip: "Our leave policy",
      ask: "What's our parental leave policy?",
      answer: [
        {
          text: "Section 4.2 of the staff handbook covers it: who qualifies, how long the leave is, and how to apply.",
        },
        { text: "HR's request form is in appendix B." },
      ],
      read: "Staff handbook, section 4.2",
    },
    {
      id: "q2",
      chip: "Summarise a report",
      ask: "Summarise the quarterly report in three points.",
      answer: [
        { text: "Demand grew in every region, and costs rose more slowly than sales." },
        { text: "Two projects ran late; both now have new dates." },
        { text: "Hiring is the main risk for next quarter." },
      ],
      read: "Quarterly report",
    },
    {
      id: "q3",
      chip: "Draft a reply",
      ask: "Draft a reply to this customer, in Nepali and English.",
      answer: [
        {
          text: "हामीलाई लेख्नुभएकोमा धन्यवाद। तपाईंको अर्डर ढिलो आइपुगेकोमा हामी क्षमाप्रार्थी छौं। हामीले डेलिभरी शुल्क फिर्ता गरेका छौं र भोलि तपाईंलाई फोन गरेर पुष्टि गर्नेछौं।",
          lang: "ne",
        },
        {
          text: "Thank you for writing to us. We're sorry your order arrived late. We have refunded the delivery charge and will call you tomorrow to confirm.",
        },
      ],
      read: "The customer's email",
    },
  ] as {
    id: "q1" | "q2" | "q3";
    chip: string;
    ask: string;
    answer: { text: string; lang?: "ne" }[];
    read: string;
  }[],
  link: { href: "/products/inferencing", label: "Run your own assistant" },
} as const;
