import type { FoundationProgram } from "@/types"

export const foundationOverview = {
  title: "Liyana Universal Community Services Foundation (LUCS)",
  description:
    "Founded and patroned by Dr. Girma Ababi, the LUCS Foundation is dedicated to transforming lives through community health outreach, education access, healthcare access in underserved regions, professional empowerment & mentorship, and future healthcare infrastructure development.",
  vision:
    "A future where every individual in underserved communities has access to quality healthcare, education, and the opportunity to thrive through empowered professionals and sustainable infrastructure.",
  mission:
    "To uplift communities through integrated health outreach, education scholarships, professional mentorship, and the development of healthcare infrastructure for those who need it most.",
}

export const programs: FoundationProgram[] = [
  {
    id: "community-health-outreach",
    title: "Community Health Outreach",
    description:
      "Mobile health clinics and community-based health screening programs that bring primary care services to remote and underserved populations across Ethiopia.",
    impact: "Thousands reached with community health services annually",
    beneficiaries: "Remote and underserved communities",
    status: "active",
  },
  {
    id: "education-access",
    title: "Education Access Program",
    description:
      "Scholarships, educational resources, and mentorship programs that enable talented students from underserved backgrounds to pursue careers in healthcare and related fields.",
    impact: "Educational opportunities created for aspiring healthcare professionals",
    beneficiaries: "Students from underserved communities",
    status: "active",
  },
  {
    id: "healthcare-access",
    title: "Healthcare Access in Underserved Regions",
    description:
      "Building and supporting healthcare facilities, mobile clinics, and telemedicine infrastructure in regions with limited or no access to quality medical care.",
    impact: "Expanded healthcare infrastructure in underserved regions",
    beneficiaries: "Communities without adequate healthcare access",
    status: "active",
  },
  {
    id: "professional-empowerment",
    title: "Professional Empowerment & Mentorship",
    description:
      "Mentorship programs, professional development workshops, and leadership training for healthcare professionals to build capacity and advance careers.",
    impact: "Empowered healthcare professionals and emerging leaders",
    beneficiaries: "Healthcare professionals and students",
    status: "active",
  },
  {
    id: "future-health-infrastructure",
    title: "Future Healthcare Infrastructure",
    description:
      "Long-term infrastructure development projects including hospitals, diagnostic centers, and training facilities to build sustainable healthcare capacity for future generations.",
    impact: "Sustainable healthcare infrastructure for future generations",
    beneficiaries: "Future generations across Ethiopia",
    status: "active",
  },
]

export const foundationPillars = [
  {
    id: 'community-health',
    title: 'Community Health',
    description:
      'Outreach and screening initiatives that bring basic diagnostics and care closer to underserved communities.',
    icon: 'heart-pulse',
  },
  {
    id: 'education-access',
    title: 'Education Access',
    description:
      'Scholarships, training support, and academic pathways that open doors for future healthcare professionals.',
    icon: 'graduation-cap',
  },
  {
    id: 'healthcare-infrastructure',
    title: 'Healthcare Infrastructure',
    description:
      'Long-term investments in facilities, systems, and capacity that improve care delivery for generations.',
    icon: 'hospital',
  },
  {
    id: 'professional-mentorship',
    title: 'Professional Mentorship',
    description:
      'Guidance, leadership development, and career support for the next wave of healthcare leaders.',
    icon: 'handshake',
  },
]

export const impactStories = [
  {
    title: "Bringing Healthcare to the Remote Highlands",
    description:
      "Through mobile health clinics and community outreach programs, the LUCS Foundation has brought primary care services to remote highland communities that previously had no access to formal healthcare.",
    beneficiary: "Remote highland communities in Ethiopia",
  },
  {
    title: "Empowering the Next Generation of Healthcare Professionals",
    description:
      "Through the Education Access Program, talented students from underserved backgrounds have received scholarships and mentorship to pursue medical and healthcare degrees, many returning to serve their communities.",
    beneficiary: "Scholarship recipients and aspiring healthcare professionals",
  },
  {
    title: "Building Health Infrastructure for Tomorrow",
    description:
      "The Foundation's commitment to future healthcare infrastructure has laid the groundwork for sustainable health systems that will serve generations to come.",
    beneficiary: "Future generations across Ethiopia",
  },
]

export const futureVision =
  "The LUCS Foundation envisions a future where 5+ Community Impact Pillars have transformed healthcare access across Ethiopia, supported by 4 Private Board Chairman-level governance structures and 1 Civil Society Organization Board Chairmanship that ensures accountability and sustainable impact. The goal is a self-sustaining ecosystem of health, education, and opportunity for all."
