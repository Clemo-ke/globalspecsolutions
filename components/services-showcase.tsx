'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb } from 'lucide-react'

interface Service {
  id: number
  name: string
  description?: string
  icon?: string
}

interface ServicesShowcaseProps {
  services: Service[]
}

export function ServicesShowcase({ services }: ServicesShowcaseProps) {
  const getIconComponent = (iconName?: string) => {
    switch (iconName) {
      case 'zap':
        return <Lightbulb className="w-8 h-8" />
      default:
        return <Lightbulb className="w-8 h-8" />
    }
  }

  return (
    <section className="py-16 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">
            Services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            What We Offer
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive professional services designed to meet your unique business needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.length > 0 ? (
            services.map((service) => (
              <Card
                key={service.id}
                className="border-border hover:shadow-lg hover:border-primary/50 transition-all group cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    {getIconComponent(service.icon)}
                  </div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                </CardHeader>

                {service.description && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">No services available yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
