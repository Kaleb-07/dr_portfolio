import { useEffect, useState, useRef } from 'react'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 5000,
})

const fallbackContact = {
  heading: 'Get in touch',
  email: 'info@liyanahealthcare.com',
  phone: '+251-11-XXX-XXXX',
  location: 'Addis Ababa, Ethiopia',
  image_url: '',
  image_caption: '',
}

const fallbackInquiryTypes = [
  { value: 'partnership', label: 'Partnerships' },
  { value: 'media', label: 'Media' },
  { value: 'speaking', label: 'Speaking' },
  { value: 'other', label: 'Policy' },
  { value: 'foundation', label: 'Foundation' },
]

const POLL_INTERVAL = 5000

export function useContactData() {
  const [contactData, setContactData] = useState(fallbackContact)
  const [inquiryTypes, setInquiryTypes] = useState(fallbackInquiryTypes)
  const lastContactRef = useRef<string>('')
  const lastTypesRef = useRef<string>('')

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const [settingsRes, typesRes] = await Promise.all([
          api.get('/contact/settings'),
          api.get('/contact/inquiry-types'),
        ])
        if (!isMounted) return

        const newContactStr = JSON.stringify(settingsRes.data || {})
        const newTypesStr = JSON.stringify(typesRes.data || [])

        if (newContactStr !== lastContactRef.current) {
          lastContactRef.current = newContactStr
          setContactData((prev) => ({ ...prev, ...(settingsRes.data || {}) }))
        }

        if (newTypesStr !== lastTypesRef.current) {
          lastTypesRef.current = newTypesStr
          setInquiryTypes(typesRes.data?.length ? typesRes.data : fallbackInquiryTypes)
        }
      } catch {
        // keep fallback data
      }
    }

    fetchData()

    const interval = setInterval(fetchData, POLL_INTERVAL)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return { contactData, inquiryTypes }
}
