import { useEffect, useState } from 'react'
import api from '../api'
import { Loader2 } from 'lucide-react'

export default function ContactMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const load = async () => {
      const res = await api.get('/contact/messages')
      setMessages(res.data)
      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return <Loader2 className="animate-spin" />
  }

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* LIST */}
      <div className="col-span-1 border bg-white">
        {messages.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelected(m)}
            className="p-3 border-b cursor-pointer hover:bg-gray-50"
          >
            <p className="font-medium">{m.name}</p>
            <p className="text-xs text-gray-500">{m.subject}</p>
          </div>
        ))}
      </div>

      {/* DETAIL */}
      <div className="col-span-2 border bg-white p-6">
        {selected ? (
          <>
            <h2 className="text-xl font-medium">{selected.subject}</h2>
            <p className="mt-2 text-sm">{selected.message}</p>
          </>
        ) : (
          <p>Select a message</p>
        )}
      </div>
    </div>
  )
}
