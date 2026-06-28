const express = require('express')
const router = express.Router()
const prisma = require('../prisma')
const verifyToken = require('../middleware/auth.middleware')

const SECTION_SLUGS = [
  'vision_agenda',
  'about_values',
  'about_banner',
  'about_story',
  'identity_overview',
  'about_vision',
  'liyana_framework',
  'foundation_story',
  'public-service',
  'leadership',
  'recognition_awards',
  'leadership_philosophy',
  'about_education',
  'about_gallery',
  'footer_settings',
]

const sectionSeeds = [
  {
    slug: 'vision_agenda',
    section_type: 'hero_agenda',
    eyebrow: 'The Visionary Agenda',
    title:
      'One doctor\'s blueprint for a <br /><em class="text-teal-mid italic">self-sufficient healthcare Africa</em>',
    subtitle: 'DR. LIYANA - PROFILE',
    description: '',
    image_url: '/image.png',
    image_alt: 'Dr. Girma Ababi',
    metadata: {
      cta: [],
      metrics: [
        {
          value: '20+',
          label: 'Years as Medical Doctor',
          description: 'Over two decades of clinical practice and medical expertise.',
        },
        {
          value: '15+',
          label: 'Years as Anatomical Pathologist',
          description: 'Specialist in anatomical pathology with advanced diagnostic experience.',
        },
        {
          value: '14+',
          label: 'Years Healthcare Investment & Leadership',
          description: 'Building and leading healthcare enterprises across the value chain.',
        },
      ],
    },
    blocks: [
      { block_type: 'identity_teaser', title: 'Physician', eyebrow: 'Identity I', sort_order: 1 },
      {
        block_type: 'identity_teaser',
        title: 'Entrepreneur',
        eyebrow: 'Identity II',
        sort_order: 2,
      },
      {
        block_type: 'identity_teaser',
        title: 'Nation Builder',
        eyebrow: 'Identity III',
        sort_order: 3,
      },
    ],
  },
  {
    slug: 'identity_overview',
    section_type: 'ordered_collection',
    eyebrow: 'Overview',
    title: "Dr. Girma Ababi's professional dimensions",
    description:
      'Explore the journey and background of a clinician who stepped beyond practice to build clinical chains, educational systems, and national frameworks.',
    metadata: {
      cta: [
        { label: 'Explore Journey', path: '/about', variant: 'primary' },
        { label: 'Get in Touch', path: '/contact', variant: 'ghost' },
      ],
    },
    blocks: [],
  },
  {
    slug: 'about_story',
    section_type: 'story',
    eyebrow: 'The Story',
    title: 'A life in <em class="text-teal-mid not-italic">service</em>',
    description: 'A life in service and a portrait.',
    image_url: '/image.png',
    image_alt: 'Dr. Girma Ababi Portrait',
    metadata: {},
    blocks: [
      {
        block_type: 'chapter',
        title: 'Early Life & Training',
        body: "Born in Tulu Milky and educated at Gebreguracha High School, I earned my MD from the University of Gondar and Addis Ababa University. I became one of Ethiopia's leading Anatomical Pathologists after completing my specialty at AAU, serving as Chief Resident for two years.",
        sort_order: 1,
      },
      {
        block_type: 'chapter',
        title: 'Clinical & Academic Career',
        body: 'I built my career as a clinical specialist and academic, serving as Assistant Professor at YLC Health Sciences and practicing anatomical pathology.',
        sort_order: 2,
      },
      {
        block_type: 'chapter',
        title: 'Entrepreneurship & Leadership',
        body: 'Around 2010, I stepped into healthcare entrepreneurship to build an integrated system spanning hospitals, pharma manufacturing, training, research, and financing. In 2019 I attended Stanford GSB Seed Program and in 2023 I was appointed Vice President of the Ethiopian Healthcare Federation.',
        sort_order: 3,
      },
    ],
  },
  {
    slug: 'about_banner',
    section_type: 'banner',
    eyebrow: null,
    title: 'The Story',
    subtitle: null,
    description: 'A life dedicated to healthcare leadership and transformation.',
    image_url: null,
    image_alt: null,
    metadata: {},
    blocks: [],
  },
  {
    slug: 'about_vision',
    section_type: 'quote',
    eyebrow: 'Vision',
    title: 'A healthier Africa',
    description:
      'An integrated, self-sustaining healthcare ecosystem in Ethiopia that delivers quality care to millions, empowers thousands of professionals, and serves as a model for health system transformation across Africa.',
    metadata: {},
    blocks: [],
  },
  {
    slug: 'about_values',
    section_type: 'ordered_collection',
    eyebrow: 'Values',
    title: 'Principles that guide every decision',
    description: '',
    metadata: {},
    blocks: [
      {
        block_type: 'value',
        title: 'Institution Building',
        body: 'True impact comes from building institutions that outlast any individual. I am committed to creating sustainable healthcare organizations that serve generations.',
        sort_order: 1,
        metadata: { icon: 'hospital' },
      },
      {
        block_type: 'value',
        title: 'Professional Empowerment',
        body: 'Healthcare transformation happens through empowered professionals. I invest in training, mentorship, and creating opportunities for the next generation of healthcare leaders.',
        sort_order: 2,
        metadata: { icon: 'users' },
      },
      {
        block_type: 'value',
        title: 'Integrated Systems Thinking',
        body: 'Healthcare cannot be transformed piece by piece. An integrated approach spanning hospitals, education, manufacturing, research, digital health, and financing is the only path to lasting change.',
        sort_order: 3,
        metadata: { icon: 'grid' },
      },
      {
        block_type: 'value',
        title: 'Service to Nation',
        body: 'From clinical practice to policy leadership, my work has always been driven by a deep commitment to serving Ethiopia and its people.',
        sort_order: 4,
        metadata: { icon: 'heart' },
      },
    ],
  },
  {
    slug: 'liyana_framework',
    section_type: 'framework_grid',
    eyebrow: 'The Liyana Healthcare Framework',
    title:
      'A vertically integrated ecosystem <em class="not-italic text-teal-mid">for sovereignty and scale.</em>',
    description: '',
    metadata: {
      cta: [{ label: 'Explore Ecosystem', path: '/ecosystem', variant: 'ghost' }],
      ecosystem: {
        hero: {
          tag: 'Strategic Infrastructure',
          title: 'Most investors build one piece. He built the entire chain.',
          description:
            'Liyana Healthcare represents a paradigm shift in medical economics. By vertically integrating every touchpoint of the patient journey, we eliminate the friction that stalls progress in emerging markets.',
          meta: [
            { value: '6', label: 'Integrated Sectors' },
            { value: '1000+', label: 'Employees' },
            { value: '2010', label: 'Established' },
            { value: 'Pan-African', label: 'Reach' },
          ],
        },
        network: {
          hero: {
            tag: 'System Generated',
            title: 'The Ecosystem Core',
            description:
              'Six interconnected sectors forming a single, self-sustaining healthcare chain.',
          },
          sectors: [
            {
              id: 'delivery',
              label: 'DELIVERY',
              angle: -90,
              title: 'Yanct Chain of Hospitals',
              description:
                'A comprehensive network of tertiary care facilities providing specialized surgical, cardiac, and oncology services across East Africa.',
              metric: '900+ Specialized Beds',
              icon: 'hospital',
            },
            {
              id: 'financing',
              label: 'FINANCING',
              angle: -30,
              title: 'Micro-Financing & Insurance',
              description:
                'Innovative micro-insurance models tailored for the self-employed and informal sectors, closing the affordability gap in healthcare.',
              metric: 'Pan-African Model',
              icon: 'wallet',
            },
            {
              id: 'education',
              label: 'EDUCATION',
              angle: 30,
              title: 'YLC Health Sciences',
              description:
                'Training the next generation of medical specialists through rigorous academic programs and clinical rotation integration.',
              metric: 'Chief Pipeline Active',
              icon: 'graduation-cap',
            },
            {
              id: 'production',
              label: 'PRODUCTION',
              angle: 90,
              title: 'Pharma Manufacturing',
              description:
                'On-shore manufacturing of essential generic medications ensuring supply chain sovereignty and healthcare affordability.',
              metric: 'Supply Secured',
              icon: 'flask',
            },
            {
              id: 'tech',
              label: 'DIGITAL',
              angle: 150,
              title: 'Digital Platforms',
              description:
                'Unified EMR systems and telemedicine portals that connect rural clinics to urban specialists instantly across the region.',
              metric: 'System Active',
              icon: 'mobile',
            },
            {
              id: 'research',
              label: 'RESEARCH',
              angle: 210,
              title: 'Medical Research',
              description:
                'Genomic studies and epidemiological research focused on local populations, driving evidence-based regional care.',
              metric: 'Signal Active',
              icon: 'microscope',
            },
          ],
        },
        breakdown: {
          tag: 'Sector Breakdown',
          title: 'Six sectors. One vision.',
          description:
            'Each sector reinforces the others, creating a vertically integrated system that delivers care from lab to bedside.',
          sectors: [
            {
              num: '01',
              category: 'Delivery',
              title: 'Yanct Chain of Hospitals',
              description:
                'A comprehensive network of tertiary care facilities providing specialized surgical, cardiac, and oncology services across East Africa.',
              stats: ['900+ Specialized Beds', 'Pan-African Medical Hub'],
              image: null,
              accent: false,
            },
            {
              num: '02',
              category: 'Education',
              title: 'YLC Health Sciences',
              description:
                'Training the next generation of medical specialists through rigorous academic programs and clinical rotation integration.',
              stats: ['Chief Pipeline Under Development'],
              image: null,
              accent: false,
            },
            {
              num: '03',
              category: 'Manufacturing',
              title: 'Pharma Production',
              description:
                'On-shore manufacturing of essential generic medications to ensure supply chain sovereignty and healthcare affordability.',
              stats: [],
              image: '/lab-connect.png',
              accent: false,
            },
            {
              num: '04',
              category: 'Research',
              title: 'Medical Research',
              description:
                'Genomic studies and epidemiological research focused on local populations, driving evidence-based regional care.',
              stats: ['Signal Active', 'Liyana Research v3.0'],
              image: null,
              accent: true,
            },
            {
              num: '05',
              category: 'Technology',
              title: 'Digital Platforms',
              description:
                'Unified EMR systems and telemedicine portals that connect rural clinics to urban specialists instantly.',
              stats: ['Normal Rate'],
              image: null,
              accent: false,
            },
          ],
          financing: {
            num: '06',
            category: 'Financing',
            title: 'Micro-Financing & Insurance',
            description:
              'Closing the loop by making healthcare accessible. Our financing wing provides innovative micro-insurance models tailored for the self-employed and informal sectors.',
          },
        },
        vision: {
          quote:
            'Healthcare is not a service to be bought, but a system to be built. Only through complete vertical integration can we guarantee the quality of care and the dignity of the patient.',
          marker: '99',
          attribution: 'Dr. Girma Ababi, Founder',
        },
      },
    },
    blocks: [
      {
        block_type: 'framework_node',
        title: 'Healthcare Delivery',
        body: 'The Yanet Chain of Hospitals provides tertiary diagnostic services, therapeutic care centers, and outpatient clinics across Ethiopia, forming the clinical backbone of Liyana Healthcare.',
        metadata: { icon: 'hospital', category: 'hospital' },
        sort_order: 1,
      },
      {
        block_type: 'framework_node',
        title: 'Education & Training',
        body: 'YLC Health Sciences College delivers medical professional training, research programs, and academic pathways for the next generation of healthcare professionals.',
        metadata: { icon: 'graduation-cap', category: 'education' },
        sort_order: 2,
      },
      {
        block_type: 'framework_node',
        title: 'Manufacturing',
        body: 'Pharmaceutical production and local drug manufacturing facilities ensure reliable supply chains, retail distribution, and affordable access to essential medicines.',
        metadata: { icon: 'flask', category: 'manufacturing' },
        sort_order: 3,
      },
      {
        block_type: 'framework_node',
        title: 'Research',
        body: 'Medical research programs, anatomical pathology research, academic publications, and innovation think-tanks drive evidence-based advancement in healthcare.',
        metadata: { icon: 'microscope', category: 'research' },
        sort_order: 4,
      },
      {
        block_type: 'framework_node',
        title: 'Digital Health',
        body: 'Healthcare technology platforms, digital health innovation, patient data systems, and telemedicine solutions bridge the gap between patients and providers.',
        metadata: { icon: 'mobile', category: 'digital-health' },
        sort_order: 5,
      },
      {
        block_type: 'framework_node',
        title: 'Healthcare Financing',
        body: 'Health insurance products, life insurance offerings, and innovative healthcare financing models make quality care accessible and affordable.',
        metadata: { icon: 'wallet', category: 'insurance' },
        sort_order: 6,
      },
    ],
  },
  {
    slug: 'foundation_story',
    section_type: 'foundation_preview',
    eyebrow: 'Foundation',
    title: 'The <em class="text-teal-mid not-italic">LUCS Foundation</em>',
    description:
      'Founded and patroned by Dr. Girma Ababi, the LUCS Foundation is dedicated to transforming lives through community health outreach, education access, healthcare access in underserved regions, professional empowerment & mentorship, and future healthcare infrastructure development.',
    metadata: {
      cta: [{ label: 'Explore Foundation', path: '/foundation', variant: 'ghost' }],
      stats: [
        { value: '5+', label: 'Community Impact Pillars' },
        { value: '4', label: 'Board Chairmanships' },
        { value: '1', label: 'CSO Board Chairmanship' },
        { value: '1000+', label: 'Lives Impacted' },
      ],
    },
    blocks: [
      {
        block_type: 'pillar',
        title: 'Community Health',
        metadata: { icon: 'heart-pulse' },
        sort_order: 1,
      },
      {
        block_type: 'pillar',
        title: 'Education Access',
        metadata: { icon: 'graduation-cap' },
        sort_order: 2,
      },
      {
        block_type: 'pillar',
        title: 'Healthcare Infrastructure',
        metadata: { icon: 'hospital' },
        sort_order: 3,
      },
      {
        block_type: 'pillar',
        title: 'Professional Mentorship',
        metadata: { icon: 'handshake' },
        sort_order: 4,
      },
    ],
  },
  {
    slug: 'leadership',
    section_type: 'impact_collection',
    eyebrow: 'Leadership',
    title: 'Leadership & Impact',
    subtitle: 'Executive leadership spanning healthcare organizations, boards, and institutions.',
    description: '',
    metadata: {
      overview: {
        title: 'Leadership & Impact',
        subtitle:
          'Executive leadership spanning healthcare organizations, boards, and institutions.',
        description: '',
      },
      executiveRoles: [
        {
          id: 'founder-ceo-liyana',
          title: 'Founder & CEO',
          organization: 'Liyana Healthcare',
          period: '2010 – Present',
          description:
            'Founder and Chief Executive Officer of Liyana Healthcare, a multi-sector healthcare enterprise spanning the Yanet Chain of Hospitals, YLC Health Sciences College, pharmaceutical manufacturing, and healthcare financing. Leads a team of 1,000+ employees across the entire healthcare value chain.',
          highlights: [
            'Founded and scaled Liyana Healthcare from inception to 1,000+ employees',
            'Built the Yanet Chain of Hospitals for tertiary and therapeutic care',
            'Established YLC Health Sciences College for medical professional training',
          ],
          category: 'executive',
          icon: 'FaBuilding',
        },
        {
          id: 'vp-ehf',
          title: 'Vice President',
          organization: 'Ethiopian Healthcare Federation',
          period: '2023 – Present',
          description:
            'Elected Vice President of the Ethiopian Healthcare Federation, serving in national leadership to shape policy, strategy, and regulatory frameworks for the healthcare sector. Serves on multiple Ministry of Health councils and advisory bodies.',
          highlights: [
            'Influences national health policy and regulatory direction',
            'Serves on 3 Ministry of Health advisory bodies',
            'Represents the private health sector at national level',
          ],
          category: 'executive',
          icon: 'FaBuilding',
        },
      ],
      governanceRoles: [
        {
          id: 'board-chairman',
          title: 'Board Chairman',
          organization: 'Multiple Private Boards',
          period: 'Ongoing',
          description:
            'Serves as Board Chairman for four private boards, providing strategic governance, oversight, and leadership across healthcare and related sectors.',
          highlights: [
            'Chairs 4 private boards across healthcare sectors',
            '1 Civil Society Organization Board Chairmanship',
            'Drives governance and strategic direction for portfolio organizations',
          ],
          category: 'board',
          icon: 'FaBuilding',
        },
        {
          id: 'stanford-alumni',
          title: 'Stanford GSB Alumni',
          organization: 'Stanford Graduate School of Business',
          period: '2019 – Present',
          description:
            'Alumnus of the Stanford GSB Seed Transformation Program, applying world-class organizational leadership principles to scale Liyana Healthcare and its ecosystem.',
          highlights: [
            'Completed Seed Transformation Program (2019-2021)',
            'Applied Stanford frameworks to healthcare enterprise scaling',
            'Part of a global network of emerging economy leaders',
          ],
          category: 'advisory',
          icon: 'FaBuilding',
        },
      ],
    },
    blocks: [],
  },
  {
    slug: 'public-service',
    section_type: 'impact_collection',
    eyebrow: 'Public Service',
    title: 'Public Service & Policy Impact',
    subtitle: 'National & Continental Leadership',
    description:
      'Dr. Girma Ababi serves the nation through multiple advisory and leadership roles, shaping healthcare policy, regulatory frameworks, and innovation agendas at the highest levels of government and professional bodies.',
    metadata: {
      overview: {
        title: 'Public Service & Policy Impact',
        subtitle: 'National & Continental Leadership',
        description:
          'Dr. Girma Ababi serves the nation through multiple advisory and leadership roles, shaping healthcare policy, regulatory frameworks, and innovation agendas at the highest levels of government and professional bodies.',
      },
      quickFacts: [
        { label: 'VP, Ethiopian Healthcare Federation', value: '2023 – Present' },
        { label: 'Ministry of Health Advisory Roles', value: '4 Positions' },
        { label: 'Policy & Innovation Boards', value: 'Ongoing' },
      ],
      roles: [
        {
          id: 'vp-ehf',
          title: 'Vice President',
          organization: 'Ethiopian Healthcare Federation',
          period: '2023 – Present',
          description:
            'Appointed to national leadership of the Ethiopian Healthcare Federation, driving policy, strategy, and regulatory advisory for the healthcare sector.',
          highlights: [
            'National leadership role in healthcare federation',
            'Shapes sector-wide policy and strategy',
            'Represents private healthcare providers at national level',
          ],
          category: 'federation',
          icon: 'FaBuilding',
        },
        {
          id: 'moh-advisory',
          title: 'Policy, Strategy & Research Advisor',
          organization: 'Ministry of Health Advisory Council',
          period: 'Ongoing',
          description:
            'Serves as Policy, Strategy & Research Advisor to the Minister of Health, providing expert counsel on national health policy and strategic direction.',
          highlights: [
            'Direct advisory to the Minister of Health',
            'Influences national health policy and strategy',
            'Guides health research priorities',
          ],
          category: 'advisory',
          icon: 'FaBuilding',
        },
        {
          id: 'moh-innovation',
          title: 'Think-Tank on Innovation & Quality',
          organization: 'Ministry of Health Innovation',
          period: 'Ongoing',
          description:
            "Member of the Ministry of Health's innovation think-tank, driving healthcare innovation and quality improvement initiatives across the sector.",
          highlights: [
            'Shapes healthcare innovation agenda',
            'Drives quality improvement frameworks',
            'Promotes adoption of innovative healthcare models',
          ],
          category: 'innovation',
          icon: 'FaBuilding',
        },
        {
          id: 'moh-regulation',
          title: 'National Regulatory Committee Member',
          organization: 'Ministry of Health Regulation',
          period: 'Ongoing',
          description:
            'Serves on the National Regulatory Committee at the Ministry of Health, contributing to healthcare regulation and compliance frameworks.',
          highlights: [
            'Participates in regulatory policy development',
            'Ensures quality and safety standards',
            'Advises on healthcare compliance frameworks',
          ],
          category: 'policy',
          icon: 'FaBuilding',
        },
        {
          id: 'sidama-bureau',
          title: 'Think-Tank Organizer',
          organization: 'Sidama Regional Health Bureau',
          period: 'Ongoing',
          description:
            'Organizes and leads think-tank initiatives for the Sidama Regional Health Bureau, driving regional health system improvement and innovation.',
          highlights: [
            'Leads regional health think-tank initiatives',
            'Drives health system innovation at regional level',
            'Bridges national and regional health priorities',
          ],
          category: 'innovation',
          icon: 'FaBuilding',
        },
        {
          id: 'professional-memberships',
          title: 'Professional Memberships & Leadership',
          organization: 'Multiple Professional Bodies',
          period: 'Ongoing',
          description:
            'Holds leadership positions in multiple professional bodies including Regional Board Member of the Ethiopian Medical Association, member of the Ethiopian Society of Anatomical Pathologists, Vice President of the Ethiopian Private Health Facilities Association, and International Rotarian.',
          highlights: [
            'Regional Board Member, Ethiopian Medical Association',
            'Member, Ethiopian Society of Anatomical Pathologists',
            'VP, Ethiopian Private Health Facilities Association',
            'International Rotarian – Rotary International',
          ],
          category: 'advisory',
          icon: 'FaBuilding',
        },
      ],
      education: [
        {
          id: 'edu-md',
          degree: 'Doctor of Medicine',
          institution: 'University of Gondar / Addis Ababa University',
          footer: 'Distinction in Clinical Practice',
          highlight: false,
        },
        {
          id: 'edu-pathology',
          degree: 'Pathology Specialty',
          institution: 'Advanced diagnostic systems and laboratory management integration.',
          footer: 'Specialized Fellowship',
          highlight: false,
        },
        {
          id: 'edu-stanford',
          degree: 'Stanford GSB Seed',
          institution: 'Strategic Management and Innovation program for high-growth enterprises.',
          footer: 'Executive Leadership',
          highlight: true,
        },
      ],
      foundationItems: [
        {
          id: 'found-outreach',
          title: 'Community Outreach',
          description: 'Mobile screening units bringing diagnostics to remote regions.',
          icon: 'FaMapMarkerAlt',
        },
        {
          id: 'found-education',
          title: 'Education Access',
          description: 'Scholarship funds for aspiring medical technicians and clinical staff.',
          icon: 'FaBookOpen',
        },
        {
          id: 'found-advocacy',
          title: 'Policy Advocacy',
          description: 'Empowering patient rights and standardizing care ethics.',
          icon: 'FaUsers',
        },
      ],
    },
    blocks: [],
  },
  {
    slug: 'recognition_awards',
    section_type: 'awards_carousel',
    eyebrow: 'Recognition',
    title: 'Awards &amp; <em class="text-teal not-italic">honours</em>',
    description: 'Distinctions that reflect a career of transformative leadership in healthcare.',
    metadata: { cta: [{ label: 'View All', path: '/awards-recognition', variant: 'ghost' }] },
    blocks: [
      {
        block_type: 'award',
        title: 'Special Alumni Award for Extraordinary Achievement',
        body: 'Recognized by the University of Gondar with the Special Alumni Award for extraordinary achievement and distinguished contributions to healthcare and national development.',
        image_url: '/image.png',
        image_alt: 'Special Alumni Award for Extraordinary Achievement',
        metadata: { organization: 'University of Gondar', year: 2024, category: 'alumni' },
        sort_order: 1,
      },
      {
        block_type: 'award',
        title: 'Vice Presidential Appointment – National Leadership',
        body: 'Appointed Vice President of the Ethiopian Healthcare Federation, recognizing national leadership in healthcare policy, strategy, and sector development.',
        image_url: '/image.png',
        image_alt: 'Vice Presidential Appointment – National Leadership',
        metadata: {
          organization: 'Ethiopian Healthcare Federation',
          year: 2023,
          category: 'leadership',
        },
        sort_order: 2,
      },
      {
        block_type: 'award',
        title: 'Seed Program Graduate – Emerging Economies Leadership',
        body: 'Graduated from the Stanford GSB Seed Transformation Program, recognized for leadership in building transformative enterprises in emerging economies.',
        image_url: '/image.png',
        image_alt: 'Seed Program Graduate – Emerging Economies Leadership',
        metadata: {
          organization: 'Stanford University Graduate School of Business',
          year: 2021,
          category: 'industry',
        },
        sort_order: 3,
      },
      {
        block_type: 'award',
        title: 'Rotarian – Community Leadership Member',
        body: 'Honored as a Rotarian and Community Leadership Member for dedicated service to community health and development initiatives.',
        image_url: '/image.png',
        image_alt: 'Rotarian – Community Leadership Member',
        metadata: { organization: 'Rotary International', year: 2023, category: 'professional' },
        sort_order: 4,
      },
    ],
  },
  {
    slug: 'leadership_philosophy',
    section_type: 'quote',
    eyebrow: 'Leadership Philosophy',
    title: '',
    description:
      '"Building institutions, empowering professionals, and transforming healthcare for future generations — that is the only legacy worth pursuing."',
    subtitle: '— Dr. Girma Ababi, Founder & CEO, Liyana Healthcare',
    metadata: {},
    blocks: [],
  },
  {
    slug: 'footer_settings',
    section_type: 'site_footer',
    eyebrow: 'Footer',
    title: 'Footer & Social Media',
    description: 'Manage footer contact details and social media links.',
    metadata: {
      contact: {
        heading: "Let's Connect",
        email: 'contact@liyanahealthcare.com',
        phone: '+251-XXX-XXXXXX',
        location: 'Addis Ababa, Ethiopia',
        image_url: '',
        image_caption: '',
      },
      socialLinks: [
        { label: 'LinkedIn', href: 'https://linkedin.com/in/', icon: 'linkedin' },
        { label: 'X / Twitter', href: 'https://twitter.com/', icon: 'x' },
        { label: 'Instagram', href: 'https://instagram.com/', icon: 'instagram' },
        { label: 'Facebook', href: 'https://facebook.com/', icon: 'facebook' },
      ],
    },
    blocks: [],
  },
]

const identitySeeds = [
  {
    label: '01',
    title: 'Medical Doctor & Anatomical Pathologist',
    description: '20+ years clinical · 15+ years specialty · Asst. Professor, YLC Health Sciences',
    sort_order: 1,
  },
  {
    label: '02',
    title: 'Founder & CEO, Liyana Healthcare',
    description:
      'Yanet Chain of Hospitals · Health Sciences College · Pharmaceuticals · 1,000+ employees',
    sort_order: 2,
  },
  {
    label: '03',
    title: 'Vice President, Ethiopian Healthcare Federation',
    description:
      'National policy, strategy & regulatory advisory roles · Ministry of Health councils',
    sort_order: 3,
  },
  {
    label: '04',
    title: 'Board Chairman · Stanford GSB Alumni · Philanthropist',
    description:
      '4 boards · LUCS Foundation Founder & Patron · University of Gondar Special Alumni Awardee',
    sort_order: 4,
  },
]

const timelineSeeds = [
  {
    slug: 'md-degree',
    year: '1992',
    title: 'MD, Medicine',
    subtitle: 'University of Gondar & AAU/HSC',
    description:
      'Earned his medical degree from the University of Gondar and Addis Ababa University Health Sciences Center.',
    category: 'education',
    sort_order: 1,
  },
  {
    slug: 'specialty-pathology',
    year: '2002',
    title: 'Specialty Diploma in Anatomical Pathology',
    subtitle: 'Addis Ababa University',
    description:
      'Completed specialty training in anatomical pathology at AAU, serving as Chief Resident for two years.',
    category: 'education',
    sort_order: 2,
  },
  {
    slug: 'assistant-professor',
    year: '2004',
    title: 'MD in Anatomical Pathology – Practice & Teaching',
    subtitle: 'Asst. Professor at YLC Health Sciences',
    description:
      'Practiced as a clinical specialist in anatomical pathology and served as Assistant Professor at YLC Health Sciences.',
    category: 'career',
    sort_order: 3,
  },
  {
    slug: 'entrepreneurship-begins',
    year: '2010',
    title: 'Healthcare Entrepreneurship Begins',
    subtitle: 'Liyana Healthcare Founded',
    description:
      'Founded Liyana Healthcare, beginning the journey to build an integrated healthcare system spanning hospitals, pharma, training, research, and financing.',
    category: 'milestone',
    sort_order: 4,
  },
  {
    slug: 'stanford-seed',
    year: '2019',
    title: 'Stanford University Seed Transformation Program',
    subtitle: 'Stanford Graduate School of Business',
    description:
      'Joined the prestigious Seed Transformation Program at Stanford GSB to accelerate organizational leadership and enterprise growth.',
    category: 'education',
    sort_order: 5,
  },
  {
    slug: 'vice-president-ehf',
    year: '2023',
    title: 'Vice President',
    subtitle: 'Ethiopian Healthcare Federation',
    description:
      'Appointed Vice President of the Ethiopian Healthcare Federation, shaping national healthcare policy and strategy.',
    category: 'career',
    sort_order: 6,
  },
  {
    slug: 'current-leadership',
    year: '2025',
    title: 'CEO, Investor, Policy Leader & Philanthropist',
    subtitle: 'Leading Liyana Healthcare Ecosystem',
    description:
      'Leading a multi-sector healthcare ecosystem as CEO, investor, policy leader, and philanthropist.',
    category: 'milestone',
    sort_order: 7,
  },
]

const navigationSeeds = [
  { label: 'Story', path: '/', sort_order: 1, children: [] },
  {
    label: 'Profile',
    sort_order: 2,
    children: [
      { label: 'Journey', path: '/about', sort_order: 1 },
      { label: 'Education', path: '/education', sort_order: 2 },
      { label: 'Gallery', path: '/gallery', sort_order: 3 },
    ],
  },
  { label: 'Ecosystem', path: '/ecosystem', sort_order: 3, children: [] },
  {
    label: 'Impact',
    sort_order: 4,
    children: [
      { label: 'Public Service', path: '/public-service', sort_order: 1 },
      { label: 'Leadership', path: '/leadership', sort_order: 2 },
      { label: 'Foundation', path: '/foundation', sort_order: 3 },
    ],
  },
  {
    label: 'Achievements',
    sort_order: 5,
    children: [
      { label: 'Awards & Recognition', path: '/awards-recognition', sort_order: 1 },
      { label: 'Media & Speaking', path: '/media-speaking', sort_order: 2 },
    ],
  },
  { label: 'Contact', path: '/contact', sort_order: 6, children: [] },
]

async function initCmsSchema() {
  await seedCms()
}

async function seedCms() {
  for (const section of sectionSeeds) {
    const existingSection = await prisma.cms_sections.findUnique({ where: { slug: section.slug } })
    if (!existingSection) {
      const created = await prisma.cms_sections.create({
        data: {
          slug: section.slug,
          section_type: section.section_type,
          eyebrow: section.eyebrow || null,
          title: section.title || null,
          subtitle: section.subtitle || null,
          description: section.description || null,
          image_url: section.image_url || null,
          image_alt: section.image_alt || null,
          metadata: section.metadata || {},
          sort_order: sectionSeeds.indexOf(section) + 1,
        },
      })

      if (section.blocks && section.blocks.length > 0) {
        await prisma.cms_section_blocks.createMany({
          data: section.blocks.map((block) => ({
            section_id: created.id,
            block_type: block.block_type || 'content',
            eyebrow: block.eyebrow || null,
            title: block.title || null,
            body: block.body || null,
            image_url: block.image_url || null,
            image_alt: block.image_alt || null,
            metadata: block.metadata || {},
            sort_order: block.sort_order || 0,
          })),
        })
      }
    }
  }

  const identityCount = await prisma.identity_items.count()
  if (identityCount === 0) {
    await prisma.identity_items.createMany({
      data: identitySeeds.map((item) => ({
        label: item.label,
        title: item.title,
        description: item.description,
        icon: item.icon || null,
        image_url: item.image_url || null,
        sort_order: item.sort_order,
      })),
    })
  }

  const timelineCount = await prisma.timeline_events.count()
  if (timelineCount === 0) {
    await prisma.timeline_events.createMany({
      data: timelineSeeds.map((event) => ({
        slug: event.slug,
        year: event.year,
        title: event.title,
        subtitle: event.subtitle,
        description: event.description,
        category: event.category,
        icon: event.icon || null,
        sort_order: event.sort_order,
      })),
    })
  }

  const navCount = await prisma.navigation_items.count()
  if (navCount === 0) {
    for (const item of navigationSeeds) {
      const parent = await prisma.navigation_items.create({
        data: {
          parent_id: null,
          label: item.label,
          path: item.path || null,
          sort_order: item.sort_order,
          metadata: {},
        },
      })

      if (item.children && item.children.length > 0) {
        await prisma.navigation_items.createMany({
          data: item.children.map((child) => ({
            parent_id: parent.id,
            label: child.label,
            path: child.path || null,
            sort_order: child.sort_order,
            metadata: {},
          })),
        })
      }
    }
  }
}

async function getSections(slugs = SECTION_SLUGS) {
  const sections = await prisma.cms_sections.findMany({
    where: { slug: { in: slugs } },
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  })

  const sectionIds = sections.map((s) => s.id)
  const blocks = await prisma.cms_section_blocks.findMany({
    where: { section_id: { in: sectionIds } },
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  })

  return sections.reduce((acc, section) => {
    acc[section.slug] = {
      ...section,
      metadata: safeParseMetadata(section.metadata, {}),
      blocks: blocks
        .filter((block) => block.section_id === section.id)
        .map((block) => ({
          ...block,
          metadata: safeParseMetadata(block.metadata, {}),
        })),
    }
    return acc
  }, {})
}

function safeParseMetadata(value, fallback = {}) {
  if (!value) return fallback
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch (error) {
    console.log('[cms.safeParseMetadata] invalid JSON:', error.message)
    return fallback
  }
}

async function getIdentityItems(includeInactive = false) {
  return prisma.identity_items.findMany({
    where: includeInactive ? {} : { is_active: true },
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  })
}

async function getTimelineEvents(includeInactive = false) {
  return prisma.timeline_events.findMany({
    where: includeInactive ? {} : { is_active: true },
    orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
  })
}

function buildNavigationTree(rows, parentId = null) {
  return rows
    .filter((item) => item.parent_id === parentId)
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
    .map((item) => ({
      ...item,
      children: buildNavigationTree(rows, item.id),
    }))
}

async function getNavigation(includeInactive = false) {
  const rows = await prisma.navigation_items.findMany({
    where: includeInactive ? {} : { is_active: true },
    orderBy: [{ parent_id: 'asc' }, { sort_order: 'asc' }, { id: 'asc' }],
  })
  return buildNavigationTree(rows)
}

router.get('/site-content', async (req, res) => {
  try {
    const [sections, identityItems, timelineEvents, navigation, contact] = await Promise.all([
      getSections(),
      getIdentityItems(),
      getTimelineEvents(),
      getNavigation(),
      prisma.contact_settings.findFirst(),
    ])

    res.json({ sections, identityItems, timelineEvents, navigation, contact })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/sections/:slug', async (req, res) => {
  try {
    console.log('[cms.getSection] slug received:', req.params.slug)
    const sections = await getSections([req.params.slug])
    if (!sections[req.params.slug]) return res.status(404).json({ message: 'Section not found' })
    console.log('[cms.getSection] response data:', sections[req.params.slug])
    res.json(sections[req.params.slug])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/sections/:slug', verifyToken, async (req, res) => {
  try {
    const { section = {}, blocks = [] } = req.body
    console.log('[cms.putSection] slug received:', req.params.slug)
    console.log('[cms.putSection] payload received:', { section, blocks })

    const storedSection = await prisma.$transaction(async (tx) => {
      const savedSection = await tx.cms_sections.upsert({
        where: { slug: req.params.slug },
        update: {
          eyebrow: section.eyebrow || null,
          title: section.title || null,
          subtitle: section.subtitle || null,
          description: section.description || null,
          image_url: section.image_url || null,
          image_alt: section.image_alt || null,
          metadata: JSON.stringify(safeParseMetadata(section.metadata, {})),
          is_active: section.is_active === 0 ? false : true,
        },
        create: {
          slug: req.params.slug,
          section_type: section.section_type || 'generic',
          eyebrow: section.eyebrow || null,
          title: section.title || null,
          subtitle: section.subtitle || null,
          description: section.description || null,
          image_url: section.image_url || null,
          image_alt: section.image_alt || null,
          metadata: JSON.stringify(safeParseMetadata(section.metadata, {})),
          is_active: section.is_active === 0 ? false : true,
        },
      })

      await tx.cms_section_blocks.deleteMany({
        where: { section_id: savedSection.id },
      })

      if (blocks.length > 0) {
        await tx.cms_section_blocks.createMany({
          data: blocks.map((block, index) => ({
            section_id: savedSection.id,
            block_type: block.block_type || 'content',
            eyebrow: block.eyebrow || null,
            title: block.title || null,
            body: block.body || null,
            image_url: block.image_url || null,
            image_alt: block.image_alt || null,
            metadata: JSON.stringify(safeParseMetadata(block.metadata, {})),
            sort_order: block.sort_order || index + 1,
            is_active: block.is_active === 0 ? false : true,
          })),
        })
      }

      return tx.cms_sections.findUnique({
        where: { slug: req.params.slug },
        include: {
          blocks: {
            orderBy: [{ sort_order: 'asc' }, { id: 'asc' }],
          },
        },
      })
    })

    console.log('[cms.putSection] prisma result:', storedSection)
    res.json({ message: 'Section saved', data: storedSection })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/identity-items', async (req, res) => {
  try {
    res.json(await getIdentityItems(req.query.all === '1'))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/identity-items', verifyToken, async (req, res) => {
  try {
    const { label, title, description, icon, image_url, sort_order, is_active } = req.body
    const created = await prisma.identity_items.create({
      data: {
        label: label || null,
        title,
        description: description || null,
        icon: icon || null,
        image_url: image_url || null,
        sort_order: sort_order || 0,
        is_active: is_active === 0 ? false : true,
      },
    })
    res.status(201).json({ id: created.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/identity-items/:id', verifyToken, async (req, res) => {
  try {
    const { label, title, description, icon, image_url, sort_order, is_active } = req.body
    await prisma.identity_items.update({
      where: { id: Number(req.params.id) },
      data: {
        label: label || null,
        title,
        description: description || null,
        icon: icon || null,
        image_url: image_url || null,
        sort_order: sort_order || 0,
        is_active: is_active === 0 ? false : true,
      },
    })
    res.json({ message: 'Identity item saved' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/identity-items/:id', verifyToken, async (req, res) => {
  try {
    await prisma.identity_items.delete({
      where: { id: Number(req.params.id) },
    })
    res.json({ message: 'Identity item deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/timeline-events', async (req, res) => {
  try {
    res.json(await getTimelineEvents(req.query.all === '1'))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/timeline-events', verifyToken, async (req, res) => {
  try {
    const { slug, year, title, subtitle, description, category, icon, sort_order, is_active } =
      req.body
    const created = await prisma.timeline_events.create({
      data: {
        slug: slug || null,
        year: year || null,
        title,
        subtitle: subtitle || null,
        description: description || null,
        category: category || 'milestone',
        icon: icon || null,
        sort_order: sort_order || 0,
        is_active: is_active === 0 ? false : true,
      },
    })
    res.status(201).json({ id: created.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/timeline-events/:id', verifyToken, async (req, res) => {
  try {
    const { slug, year, title, subtitle, description, category, icon, sort_order, is_active } =
      req.body
    await prisma.timeline_events.update({
      where: { id: Number(req.params.id) },
      data: {
        slug: slug || null,
        year: year || null,
        title,
        subtitle: subtitle || null,
        description: description || null,
        category: category || 'milestone',
        icon: icon || null,
        sort_order: sort_order || 0,
        is_active: is_active === 0 ? false : true,
      },
    })
    res.json({ message: 'Timeline event saved' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/timeline-events/:id', verifyToken, async (req, res) => {
  try {
    await prisma.timeline_events.delete({
      where: { id: Number(req.params.id) },
    })
    res.json({ message: 'Timeline event deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.get('/navigation-items', async (req, res) => {
  try {
    res.json(await getNavigation(req.query.all === '1'))
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/navigation-items', verifyToken, async (req, res) => {
  try {
    const { parent_id, label, path, target, sort_order, is_active, metadata } = req.body
    const created = await prisma.navigation_items.create({
      data: {
        parent_id: parent_id || null,
        label,
        path: path || null,
        target: target || '_self',
        sort_order: sort_order || 0,
        is_active: is_active === 0 ? false : true,
        metadata: metadata || {},
      },
    })
    res.status(201).json({ id: created.id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.put('/navigation-items/:id', verifyToken, async (req, res) => {
  try {
    const { parent_id, label, path, target, sort_order, is_active, metadata } = req.body
    await prisma.navigation_items.update({
      where: { id: Number(req.params.id) },
      data: {
        parent_id: parent_id || null,
        label,
        path: path || null,
        target: target || '_self',
        sort_order: sort_order || 0,
        is_active: is_active === 0 ? false : true,
        metadata: metadata || {},
      },
    })
    res.json({ message: 'Navigation item saved' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.delete('/navigation-items/:id', verifyToken, async (req, res) => {
  try {
    await prisma.navigation_items.delete({
      where: { id: Number(req.params.id) },
    })
    res.json({ message: 'Navigation item deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.initCmsSchema = initCmsSchema

module.exports = router
