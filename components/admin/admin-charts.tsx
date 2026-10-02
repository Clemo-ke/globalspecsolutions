'use client'

import React, { useState, useId } from 'react'

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const fmtKES = (n: number) => `KES ${Number(Math.round(n)).toLocaleString()}`
export const fmtNum = (n: number) => Number(n).toLocaleString()

// ─── Sparkline (Mini trend for KPI cards) ──────────────────────────────────────
interface SparklineProps {
  data: number[]
  color?: string
  height?: number
  className?: string
}

export function Sparkline({ data, color = '#2563eb', height = 36, className = '' }: SparklineProps) {
  if (!data || data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const width = 120
  const pad = 4
  const h = height - pad * 2

  const points = data.map((val, idx) => {
    const x = pad + (idx / (data.length - 1)) * (width - pad * 2)
    const y = height - pad - ((val - min) / range) * h
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  const pathD = `M ${points.join(' L ')}`
  const fillD = `M ${points[0]} L ${points.join(' L ')} L ${width - pad},${height} L ${pad},${height} Z`
  const gradientId = useId()

  return (
    <div className={`inline-block ${className}`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={fillD} fill={`url(#${gradientId})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Endpoint pulse */}
        {points.length > 0 && (
          <circle
            cx={points[points.length - 1].split(',')[0]}
            cy={points[points.length - 1].split(',')[1]}
            r="3"
            fill={color}
          />
        )}
      </svg>
    </div>
  )
}

// ─── AreaTrendChart (Interactive Smooth Curve Area Chart) ──────────────────────
export interface TrendPoint {
  date: string
  label: string
  value: number
  secondaryValue?: number
}

interface AreaTrendChartProps {
  data: TrendPoint[]
  valuePrefix?: string
  valueFormatter?: (v: number) => string
  secondaryLabel?: string
  secondaryFormatter?: (v: number) => string
  color?: string
  secondaryColor?: string
  height?: number
  showSecondary?: boolean
}

export function AreaTrendChart({
  data,
  valuePrefix = '',
  valueFormatter = fmtKES,
  secondaryLabel = 'Orders',
  secondaryFormatter = (v) => `${v} orders`,
  color = '#2563eb',
  secondaryColor = '#10b981',
  height = 240,
  showSecondary = false,
}: AreaTrendChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const gradId = useId()
  const gradSecId = useId()

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
        No trend data available for this range
      </div>
    )
  }

  // Dimensions
  const svgWidth = 720
  const svgHeight = height
  const padLeft = 60
  const padRight = 24
  const padTop = 20
  const padBottom = 34
  const chartWidth = svgWidth - padLeft - padRight
  const chartHeight = svgHeight - padTop - padBottom

  const maxVal = Math.max(1, ...data.map((d) => d.value))
  const maxSecondary = showSecondary ? Math.max(1, ...data.map((d) => d.secondaryValue || 0)) : 1

  // Function to create smooth Bezier curve
  const getCoordinates = (val: number, idx: number, isSec = false) => {
    const x = padLeft + (idx / Math.max(1, data.length - 1)) * chartWidth
    const currentMax = isSec ? maxSecondary : maxVal
    const y = padTop + chartHeight - (val / currentMax) * chartHeight
    return { x, y }
  }

  const primaryCoords = data.map((d, i) => getCoordinates(d.value, i))
  const secCoords = showSecondary ? data.map((d, i) => getCoordinates(d.secondaryValue || 0, i, true)) : []

  // Smooth bezier spline generator
  const createSmoothPath = (coords: { x: number; y: number }[]) => {
    if (coords.length === 0) return ''
    if (coords.length === 1) return `M ${coords[0].x},${coords[0].y}`

    let d = `M ${coords[0].x.toFixed(1)},${coords[0].y.toFixed(1)}`
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1]
      const p1 = coords[i]
      const p2 = coords[i + 1]
      const p3 = coords[i + 2 < coords.length ? i + 2 : i + 1]

      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6

      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`
    }
    return d
  }

  const primaryPath = createSmoothPath(primaryCoords)
  const primaryArea = `${primaryPath} L ${primaryCoords[primaryCoords.length - 1].x},${padTop + chartHeight} L ${primaryCoords[0].x},${padTop + chartHeight} Z`

  const secPath = showSecondary ? createSmoothPath(secCoords) : ''

  // Y-axis gridlines (4 steps)
  const yTicks = [0, 0.33, 0.66, 1].map((pct) => {
    const val = maxVal * pct
    const y = padTop + chartHeight - pct * chartHeight
    return { val, y }
  })

  // Selected hover point
  const activePt = hoverIndex !== null && data[hoverIndex] ? data[hoverIndex] : null
  const activeCoord = hoverIndex !== null && primaryCoords[hoverIndex] ? primaryCoords[hoverIndex] : null

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto overflow-visible cursor-crosshair"
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="70%" stopColor={color} stopOpacity="0.05" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id={gradSecId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={secondaryColor} stopOpacity="0.2" />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid horizontal lines */}
        {yTicks.map((t, idx) => (
          <g key={idx}>
            <line
              x1={padLeft}
              y1={t.y}
              x2={svgWidth - padRight}
              y2={t.y}
              stroke="#f1f5f9"
              strokeDasharray={idx === 0 ? undefined : '3 3'}
              strokeWidth="1"
            />
            <text
              x={padLeft - 8}
              y={t.y + 3}
              textAnchor="end"
              fill="#94a3b8"
              fontSize="9"
              fontFamily="inherit"
              fontWeight="500"
            >
              {idx === 0 ? '0' : maxVal >= 10000 ? `${Math.round(t.val / 1000)}k` : Math.round(t.val)}
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={primaryArea} fill={`url(#${gradId})`} />

        {/* Line strokes */}
        <path
          d={primaryPath}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {showSecondary && secPath && (
          <path
            d={secPath}
            fill="none"
            stroke={secondaryColor}
            strokeWidth="2"
            strokeDasharray="4 4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* X-axis labels (render up to 7 labels spread evenly) */}
        {data.map((d, i) => {
          const step = Math.ceil(data.length / 6)
          const isKeyPoint = i % step === 0 || i === data.length - 1
          if (!isKeyPoint) return null
          const { x } = primaryCoords[i]
          return (
            <text
              key={i}
              x={x}
              y={svgHeight - 10}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="9"
              fontWeight="500"
            >
              {d.label}
            </text>
          )
        })}

        {/* Interactive hover line & dots */}
        {activePt && activeCoord && (
          <g>
            <line
              x1={activeCoord.x}
              y1={padTop}
              x2={activeCoord.x}
              y2={padTop + chartHeight}
              stroke="#64748b"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <circle
              cx={activeCoord.x}
              cy={activeCoord.y}
              r="5"
              fill={color}
              stroke="#ffffff"
              strokeWidth="2.5"
              className="drop-shadow"
            />
            {showSecondary && secCoords[hoverIndex!] && (
              <circle
                cx={secCoords[hoverIndex!].x}
                cy={secCoords[hoverIndex!].y}
                r="4.5"
                fill={secondaryColor}
                stroke="#ffffff"
                strokeWidth="2"
              />
            )}
          </g>
        )}

        {/* Mouse capture overlays across points */}
        {data.map((_, i) => {
          const prevX = i === 0 ? padLeft : (primaryCoords[i - 1].x + primaryCoords[i].x) / 2
          const nextX = i === data.length - 1 ? svgWidth - padRight : (primaryCoords[i].x + primaryCoords[i + 1].x) / 2
          return (
            <rect
              key={i}
              x={prevX}
              y={padTop}
              width={Math.max(1, nextX - prevX)}
              height={chartHeight}
              fill="transparent"
              onMouseEnter={() => setHoverIndex(i)}
            />
          )
        })}
      </svg>

      {/* Floating Tooltip */}
      {activePt && activeCoord && (
        <div
          className="absolute pointer-events-none z-20 bg-slate-900/95 text-white rounded-xl shadow-xl px-3 py-2 text-xs backdrop-blur-md border border-slate-700/60 -translate-x-1/2 -translate-y-full transition-all duration-75"
          style={{
            left: `${(activeCoord.x / svgWidth) * 100}%`,
            top: `${(activeCoord.y / svgHeight) * 100 - 4}%`,
          }}
        >
          <div className="text-[10px] text-slate-400 font-semibold mb-1 pb-1 border-b border-slate-800 flex items-center justify-between gap-3">
            <span>{activePt.date}</span>
            <span>{activePt.label}</span>
          </div>
          <div className="font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span>{valueFormatter(activePt.value)}</span>
          </div>
          {showSecondary && activePt.secondaryValue !== undefined && (
            <div className="font-medium text-slate-300 text-[11px] mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: secondaryColor }} />
              <span>{secondaryFormatter(activePt.secondaryValue)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── DonutShareChart (Category & Revenue Segment Breakdown) ───────────────────
export interface DonutSegment {
  label: string
  value: number
  color: string
}

interface DonutShareChartProps {
  segments: DonutSegment[]
  centerLabel?: string
  centerValue?: string
  valueFormatter?: (v: number) => string
  size?: number
}

export function DonutShareChart({
  segments,
  centerLabel = 'Total Sales',
  centerValue,
  valueFormatter = fmtKES,
  size = 200,
}: DonutShareChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const total = segments.reduce((sum, s) => sum + s.value, 0)
  if (total === 0) {
    return (
      <div className="h-44 flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
        No sales distribution data
      </div>
    )
  }

  const radius = 70
  const strokeWidth = 22
  const center = size / 2
  const circumference = 2 * Math.PI * radius

  // Calculate arc dash arrays and offsets
  let accumulatedAngle = 0
  const arcs = segments.map((seg, idx) => {
    const fraction = seg.value / total
    const strokeDasharray = `${fraction * circumference} ${circumference}`
    const strokeDashoffset = -accumulatedAngle * circumference
    accumulatedAngle += fraction
    return { ...seg, fraction, strokeDasharray, strokeDashoffset, idx }
  })

  const activeSegment = hoveredIdx !== null ? segments[hoveredIdx] : null

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg] overflow-visible">
          {/* Background circle track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {arcs.map((arc) => (
            <circle
              key={arc.label}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={arc.color}
              strokeWidth={hoveredIdx === arc.idx ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={arc.strokeDasharray}
              strokeDashoffset={arc.strokeDashoffset}
              strokeLinecap="round"
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHoveredIdx(arc.idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            {activeSegment ? activeSegment.label : centerLabel}
          </span>
          <span className="text-base font-black text-gray-900 mt-0.5 truncate max-w-[120px]">
            {activeSegment ? valueFormatter(activeSegment.value) : centerValue || valueFormatter(total)}
          </span>
          {activeSegment && (
            <span className="text-[10px] font-bold text-emerald-600">
              {((activeSegment.value / total) * 100).toFixed(1)}% of total
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 w-full space-y-2 max-h-56 overflow-y-auto pr-1">
        {segments.map((seg, i) => {
          const pct = ((seg.value / total) * 100).toFixed(1)
          const isHovered = hoveredIdx === i
          return (
            <div
              key={seg.label}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center justify-between text-xs p-2 rounded-xl border transition-all cursor-pointer ${
                isHovered ? 'bg-gray-50 border-gray-300 shadow-sm' : 'border-transparent hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="font-semibold text-gray-800 truncate">{seg.label}</span>
              </div>
              <div className="text-right shrink-0 ml-3">
                <div className="font-bold text-gray-900">{valueFormatter(seg.value)}</div>
                <div className="text-[10px] text-gray-400 font-mono">{pct}%</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── ComparativeBarChart (Side-by-Side or Stacked Period Bar Chart) ───────────
export interface BarGroup {
  label: string
  seriesA: number
  seriesB?: number
}

interface ComparativeBarChartProps {
  data: BarGroup[]
  labelA: string
  labelB?: string
  colorA?: string
  colorB?: string
  valueFormatter?: (v: number) => string
  height?: number
}

export function ComparativeBarChart({
  data,
  labelA,
  labelB,
  colorA = '#2563eb',
  colorB = '#f59e0b',
  valueFormatter = (v) => String(v),
  height = 200,
}: ComparativeBarChartProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  if (!data || data.length === 0) return null

  const maxVal = Math.max(
    1,
    ...data.map((d) => Math.max(d.seriesA, d.seriesB || 0))
  )

  return (
    <div className="space-y-3">
      {/* Legend */}
      <div className="flex items-center justify-end gap-4 text-xs font-semibold text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: colorA }} />
          {labelA}
        </span>
        {labelB && (
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: colorB }} />
            {labelB}
          </span>
        )}
      </div>

      {/* Bars container */}
      <div
        className="flex items-end gap-2 overflow-x-auto pb-2 pt-6 border-b border-gray-100"
        style={{ height }}
      >
        {data.map((item, idx) => {
          const heightA = (item.seriesA / maxVal) * 100
          const heightB = item.seriesB !== undefined ? (item.seriesB / maxVal) * 100 : 0
          const isHovered = activeIdx === idx

          return (
            <div
              key={item.label}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(null)}
              className="flex-1 min-w-[36px] max-w-[64px] flex flex-col items-center gap-1.5 cursor-pointer relative group"
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[10px] py-1 px-2 rounded shadow-lg whitespace-nowrap pointer-events-none">
                  <div className="font-bold">{item.label}</div>
                  <div>
                    {labelA}: {valueFormatter(item.seriesA)}
                  </div>
                  {labelB && item.seriesB !== undefined && (
                    <div>
                      {labelB}: {valueFormatter(item.seriesB)}
                    </div>
                  )}
                </div>
              )}

              {/* Bar pillars */}
              <div className="w-full flex items-end justify-center gap-1 h-36 bg-gray-50/80 rounded-lg p-1 border border-gray-100">
                <div
                  className="flex-1 rounded-t-md transition-all duration-300 hover:brightness-110"
                  style={{
                    height: `${Math.max(4, heightA)}%`,
                    backgroundColor: colorA,
                  }}
                />
                {labelB && item.seriesB !== undefined && (
                  <div
                    className="flex-1 rounded-t-md transition-all duration-300 hover:brightness-110"
                    style={{
                      height: `${Math.max(4, heightB)}%`,
                      backgroundColor: colorB,
                    }}
                  />
                )}
              </div>

              {/* X label */}
              <span className="text-[10px] font-bold text-gray-500 truncate max-w-full">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── ConversionFunnelChart (Lead to Order Conversion) ─────────────────────────
export interface FunnelStage {
  name: string
  count: number
  conversionRate?: number
  color: string
}

interface ConversionFunnelChartProps {
  stages: FunnelStage[]
}

export function ConversionFunnelChart({ stages }: ConversionFunnelChartProps) {
  if (!stages || stages.length === 0) return null
  const topCount = Math.max(1, stages[0]?.count || 1)

  return (
    <div className="space-y-3">
      {stages.map((st, i) => {
        const pctOfTop = ((st.count / topCount) * 100).toFixed(0)
        const prevCount = i > 0 ? stages[i - 1].count : null
        const stepRate = prevCount && prevCount > 0 ? ((st.count / prevCount) * 100).toFixed(1) : null

        return (
          <div key={st.name} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-800">{st.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-gray-900">{st.count}</span>
                {stepRate && (
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                    {stepRate}% step
                  </span>
                )}
                <span className="text-[10px] text-gray-400">({pctOfTop}%)</span>
              </div>
            </div>
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.max(3, (st.count / topCount) * 100)}%`,
                  backgroundColor: st.color,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
