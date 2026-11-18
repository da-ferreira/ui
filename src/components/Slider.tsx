import type { InputHTMLAttributes } from 'react'
import { cn } from './cn'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> & {
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}

/** Native range input with the track filled up to the value. */
export function Slider({ value, min, max, onChange, className, style, ...props }: Props) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        background: `linear-gradient(to right, var(--brand) ${pct}%, var(--bg-surface-hover) ${pct}%)`,
        ...style,
      }}
      className={cn(
        'h-1 w-full cursor-pointer appearance-none rounded-full outline-none disabled:cursor-not-allowed disabled:opacity-50',
        '[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:bg-canvas [&::-webkit-slider-thumb]:transition',
        '[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand [&::-moz-range-thumb]:bg-canvas',
        'hover:[&::-webkit-slider-thumb]:ring-4 hover:[&::-webkit-slider-thumb]:ring-brand-area focus-visible:[&::-webkit-slider-thumb]:ring-4 focus-visible:[&::-webkit-slider-thumb]:ring-brand-area',
        'hover:[&::-moz-range-thumb]:ring-4 hover:[&::-moz-range-thumb]:ring-brand-area focus-visible:[&::-moz-range-thumb]:ring-4 focus-visible:[&::-moz-range-thumb]:ring-brand-area',
        className,
      )}
      {...props}
    />
  )
}
