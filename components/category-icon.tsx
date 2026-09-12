import React from 'react'
import {
  Zap,
  Server,
  Monitor,
  BatteryCharging,
  Battery,
  Package,
  Boxes,
  Sun,
  Shield,
  Cpu,
  Snowflake,
  Building2,
  Wrench,
  Network,
  HardDrive,
  Plug,
  Gauge,
  Lock,
  Radio,
  Factory,
  Landmark,
  HeartPulse,
  ClipboardCheck,
} from 'lucide-react'

type IconComponent = React.ComponentType<{ className?: string }>

const iconMap: Record<string, IconComponent> = {
  zap: Zap,
  'zap-off': Zap,
  server: Server,
  monitor: Monitor,
  cpu: Cpu,
  battery: BatteryCharging,
  'battery-charging': BatteryCharging,
  box: Package,
  boxes: Boxes,
  package: Package,
  sun: Sun,
  solar: Sun,
  shield: Shield,
  security: Shield,
  snowflake: Snowflake,
  network: Network,
  harddrive: HardDrive,
  plug: Plug,
  gauge: Gauge,
  lock: Lock,
  radio: Radio,
  factory: Factory,
  landmark: Landmark,
  'heart-pulse': HeartPulse,
  clipboardcheck: ClipboardCheck,
  building: Building2,
  'building-2': Building2,
  wrench: Wrench,
  bolt: Zap,
}

const legacyEmojiMap: Record<string, string> = {
  '⚡': 'zap',
  '🖥️': 'server',
  '💻': 'monitor',
  '🔋': 'battery-charging',
  '🔌': 'plug',
  '📦': 'package',
  '🌞': 'sun',
  '☀️': 'sun',
  '🛡️': 'shield',
  '🔒': 'lock',
  '🧊': 'snowflake',
  '🏗️': 'building',
  '🔧': 'wrench',
  '📶': 'network',
  '💾': 'harddrive',
}

export function CategoryIcon({
  name,
  className,
  fallback = Package,
}: {
  name?: string | null
  className?: string
  fallback?: IconComponent
}) {
  if (!name) {
    const Fallback = fallback
    return <Fallback className={className} />
  }

  const trimmed = name.trim()
  const mappedKey = legacyEmojiMap[trimmed] || trimmed.toLowerCase()
  const Icon = iconMap[mappedKey] || fallback
  return <Icon className={className} />
}