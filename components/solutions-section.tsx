'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Zap } from 'lucide-react'

interface Solution {
  id: number
  title: string
  description?: string
  imageUrl?: string
  benefits?: string
}

interface SolutionsSectionProps {
  solutions: Solution[]
}

export function SolutionsSection({ solutions }: SolutionsSectionProps) {
  return (
    <section className="py-16 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-accent" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Our Solutions
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Comprehensive Business Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover tailored solutions designed to address your specific business challenges and drive growth
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {solutions.length > 0 ? (
            solutions.slice(0, 4).map((solution, index) => (
              <a
                key={solution.id}
                href={`/solutions/${solution.id}`}
              >
                <Card
                  className={`overflow-hidden hover:shadow-xl transition-all border-border group cursor-pointer h-full ${
                    index % 2 === 0 ? 'md:col-span-1' : 'md:col-span-1'
                  }`}
                >
                {solution.imageUrl && (
                  <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                    <img
                      src={solution.imageUrl}
                      alt={solution.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="group-hover:text-accent transition-colors">
                    {solution.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {solution.description && (
                    <CardDescription className="text-base">
                      {solution.description}
                    </CardDescription>
                  )}

                  {solution.benefits && (
                    <div className="space-y-2">
                      <p className="font-semibold text-foreground text-sm">Key Benefits:</p>
                      <ul className="space-y-2">
                        {solution.benefits.split(',').map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span className="text-accent font-bold mt-0.5 flex-shrink-0">✓</span>
                            <span>{benefit.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-accent font-semibold mt-4 group-hover:gap-3 transition-all">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </a>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">No solutions available yet.</p>
            </div>
          )}
        </div>

        {/* View All Solutions Button */}
        {solutions.length > 4 && (
          <div className="flex justify-center">
            <a href="/solutions">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors font-semibold">
                View All Solutions ({solutions.length})
                <ArrowRight className="w-4 h-4" />
              </button>
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
