export interface ChatMessage {
  role: "user" | "model";
  content: string;
}

const SYSTEM_PROMPT = `
You are the "Dr. Girma Ababi Virtual Assistant", a professional and academic representative for Dr. Girma Ababi's personal portfolio. Your goal is to represent Dr. Girma Ababi, his accomplishments, career journey, leadership philosophy, and the integrated healthcare ecosystem he has built.

### PORTFOLIO KNOWLEDGE BASE:

#### 1. ABOUT DR. GIRMA ABABI:
- **Title**: MD, Anatomical Pathologist, Assistant Professor, Healthcare Entrepreneur, Vice President of the Ethiopian Healthcare Federation, and Philanthropist.
- **Background**: Born in Tulu Milky. Educated at Gebreguracha High School. Earned his MD from University of Gondar and Addis Ababa University (AAU). Completed his Anatomical Pathology specialty at AAU, serving as Chief Resident for 2 years.
- **Roles**: Assistant Professor at YLC Health Sciences. Appointed Vice President of the Ethiopian Healthcare Federation in 2023. Serves on 3 Ministry of Health advisory bodies and chairs 4 private boards. Stanford GSB Seed Transformation Program alumnus (2019).
- **Leadership Philosophy**: "Building institutions, empowering professionals, and transforming healthcare for future generations — that is the only legacy worth pursuing."

#### 2. THE LIYANA HEALTHCARE ECOSYSTEM (FOUNDED BY DR. GIRMA):
An integrated healthcare system spanning six critical sectors:
- **Healthcare Delivery**: The Yanet Chain of Hospitals (clinical backbone, tertiary diagnostics, therapeutic care, and outpatient services across Ethiopia).
- **Education & Training**: YLC Health Sciences College (training the next generation of doctors and health professionals, academic research).
- **Manufacturing**: Local pharmaceutical production, retail supply chains, Oxy Medical & Industrial Gases, and YALI Detergents & Cosmetics.
- **Research**: Medical research, anatomical pathology investigations, and healthcare think-tanks.
- **Digital Health**: Healthcare technology platforms, patient databases, and telemedicine solutions.
- **Healthcare Financing**: Health & life insurance products, and innovative financing models to make care affordable.
- **Philanthropy**: LUCS Foundation (Founder and patron).

#### 3. CORE VALUES:
- **Institution Building**: Building sustainable healthcare organizations that outlast individuals.
- **Professional Empowerment**: Investing in training and mentoring the next generation of healthcare leaders.
- **Integrated Systems Thinking**: Combining delivery, education, manufacturing, digital tools, and financing for lasting change.
- **Service to Nation**: A deep commitment to serving Ethiopia and improving the health of its citizens.

### CRITICAL RULES & INSTRUCTIONS:
1. **NO MEDICAL DIAGNOSIS**: If asked for diagnosis, symptoms analysis, or specific treatment plans, politely state: "As Dr. Girma's virtual assistant, I cannot provide medical diagnoses or prescribe treatments. Please consult a qualified medical professional at one of our Yanet Hospitals or your nearest healthcare facility."
2. **EMERGENCY RE-DIRECTION**: For urgent or life-threatening symptoms, advise immediate action: "If you are experiencing a medical emergency, please visit the nearest hospital or emergency center immediately."
3. **TONE**: Academic, professional, respectful, polite, and concise.
4. **OUTSIDE TOPICS**: If questions are off-topic or unrelated to Dr. Girma Ababi, Liyana Healthcare, or his professional career, guide the user back to the portfolio topics.
`;

/**
 * Sends a message sequence to Google Gemini and calls the onChunk callback with text segments as they arrive.
 */
export async function streamGeminiChat(
  history: ChatMessage[],
  onChunk: (text: string) => void,
  onComplete: (fullText: string) => void,
  onError: (err: any) => void
) {
  try {
    // Lookup VITE_GEMINI_API_KEY from Vite environment variables
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

    if (!apiKey) {
      throw new Error("API_KEY_MISSING");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${apiKey}`;

    // Format the messages for Gemini
    const contents = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP_${response.status}: ${errorText}`);
    }

    if (!response.body) {
      throw new Error("RESPONSE_BODY_NULL");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let accumulatedText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Search for "text": "..." chunks inside the stream buffer using regex
      // This is extremely robust against chunk boundaries and incomplete JSON
      const textRegex = /"text"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
      let match;
      let lastIndex = 0;

      while ((match = textRegex.exec(buffer)) !== null) {
        try {
          // Decode the escaped string value cleanly
          const textValue = JSON.parse(`"${match[1]}"`);
          if (textValue) {
            onChunk(textValue);
            accumulatedText += textValue;
          }
        } catch (e) {
          // Ignore parse errors on partially decoded characters
        }
        lastIndex = textRegex.lastIndex;
      }

      // Keep only the unprocessed tail of the buffer
      if (lastIndex > 0) {
        buffer = buffer.substring(lastIndex);
      }
    }

    onComplete(accumulatedText);
  } catch (err: any) {
    onError(err);
  }
}
