import type { ContactFormData } from "@/types"

export const contactInfo = {
  email: "info@liyanahealthcare.com",
  phone: "+251-11-XXX-XXXX",
  location: "Addis Ababa, Ethiopia",
  inquiryTypes: [
    {
      value: "partnership" as const,
      label: "Partnerships",
      description: "Healthcare investment, joint ventures, and sector collaboration opportunities.",
    },
    {
      value: "media" as const,
      label: "Media",
      description: "Interviews, features, documentary requests, and press inquiries.",
    },
    {
      value: "speaking" as const,
      label: "Speaking",
      description: "Keynote invitations, conference participation, and panel engagement requests.",
    },
    {
      value: "other" as const,
      label: "Policy",
      description: "Advisory engagements, government collaboration, and policy consultation inquiries.",
    },
    {
      value: "foundation" as const,
      label: "Foundation",
      description: "LUCS Foundation partnerships, philanthropy, and community program inquiries.",
    },
  ] satisfies { value: ContactFormData["inquiryType"]; label: string; description: string }[],
}
