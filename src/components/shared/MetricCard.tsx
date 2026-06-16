interface MetricCardProps {
  value: string
  label: string
  index?: number
}

const MetricCard = ({ value, label }: MetricCardProps) => {
  return (
    <div className="text-center">
      <div className="font-serif text-[clamp(36px,5vw,64px)] font-light leading-none text-paper">
        {value}
      </div>
      <div className="mt-2 font-mono text-xs tracking-widest text-paper/70 uppercase">
        {label}
      </div>
    </div>
  )
}

export default MetricCard
