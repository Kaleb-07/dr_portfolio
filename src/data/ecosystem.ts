import type { EcosystemNode, EcosystemConnection } from "@/types"

export const ecosystemTitle = "Healthcare Ecosystem"

export const ecosystemDescription =
  "Dr. Liyana has built an integrated healthcare ecosystem spanning six critical sectors — from hospital care and medical education to pharmaceutical manufacturing, research, digital health, and healthcare financing. Each sector works in concert to deliver a complete healthcare value chain."

export const ecosystemNodes: EcosystemNode[] = [
  {
    id: "healthcare-delivery",
    name: "Healthcare Delivery",
    description:
      "The Yanet Chain of Hospitals provides tertiary diagnostic services, therapeutic care centers, and outpatient clinics across Ethiopia, forming the clinical backbone of Liyana Healthcare.",
    category: "hospital",
    metrics: ["Yanet Chain of Hospitals", "Tertiary diagnostics", "Therapeutic & outpatient care"],
    link: "/leadership",
  },
  {
    id: "education-training",
    name: "Education & Training",
    description:
      "YLC Health Sciences College delivers medical professional training, research programs, and academic pathways for the next generation of healthcare professionals.",
    category: "education",
    metrics: ["YLC Health Sciences College", "Medical professional training", "Research & academic programs"],
    link: "/education",
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    description:
      "Pharmaceutical production and local drug manufacturing facilities ensure reliable supply chains, retail distribution, and affordable access to essential medicines.",
    category: "manufacturing",
    metrics: ["Pharmaceutical production", "Local drug manufacturing", "Retail distribution & supply chain"],
    link: "/ecosystem",
  },
  {
    id: "research",
    name: "Research",
    description:
      "Medical research programs, anatomical pathology research, academic publications, and innovation think-tanks drive evidence-based advancement in healthcare.",
    category: "research",
    metrics: ["Medical research programs", "Anatomical pathology research", "Academic publications & think-tanks"],
    link: "/education",
  },
  {
    id: "digital-health",
    name: "Digital Health",
    description:
      "Healthcare technology platforms, digital health innovation, patient data systems, and telemedicine solutions bridge the gap between patients and providers.",
    category: "digital-health",
    metrics: ["Healthcare technology platforms", "Digital health innovation", "Patient data & telemedicine"],
    link: "/ecosystem",
  },
  {
    id: "healthcare-financing",
    name: "Healthcare Financing",
    description:
      "Health insurance products, life insurance offerings, and innovative healthcare financing models make quality care accessible and affordable.",
    category: "insurance",
    metrics: ["Health insurance products", "Life insurance", "Healthcare financing models"],
    link: "/foundation",
  },
]

export const ecosystemConnections: EcosystemConnection[] = [
  {
    source: "healthcare-delivery",
    target: "education-training",
    label: "Clinical Training Site",
  },
  {
    source: "healthcare-delivery",
    target: "digital-health",
    label: "Digital Health Integration",
  },
  {
    source: "education-training",
    target: "research",
    label: "Academic Research Programs",
  },
  {
    source: "manufacturing",
    target: "healthcare-delivery",
    label: "Pharmaceutical Supply",
  },
  {
    source: "research",
    target: "healthcare-delivery",
    label: "Evidence-Based Practice",
  },
  {
    source: "digital-health",
    target: "healthcare-delivery",
    label: "Telemedicine & Patient Data",
  },
  {
    source: "healthcare-financing",
    target: "healthcare-delivery",
    label: "Insurance Network Access",
  },
  {
    source: "healthcare-financing",
    target: "manufacturing",
    label: "Financing Supply Chain",
  },
  {
    source: "research",
    target: "education-training",
    label: "Curriculum Development",
  },
  {
    source: "digital-health",
    target: "healthcare-financing",
    label: "Digital Claims & Financing Platforms",
  },
  {
    source: "manufacturing",
    target: "digital-health",
    label: "Supply Chain Tech",
  },
  {
    source: "education-training",
    target: "healthcare-delivery",
    label: "Workforce Pipeline",
  },
]
