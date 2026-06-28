import { Undo2 } from 'lucide-react'

interface UndoButtonProps {
  onClick: () => void
}

export default function UndoButton({ onClick }: UndoButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
    >
      <Undo2 size={16} /> Undo
    </button>
  )
}
