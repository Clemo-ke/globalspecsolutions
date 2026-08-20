import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap } from 'lucide-react'
import { getSolutions } from '@/app/actions/content'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Solutions - Global Spec Solutions',
  description: 'Explore our comprehensive business solutions tailored for your needs',
}


export default async function SolutionsPage() {
  const solutions = await getSolutions()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-12 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Zap className="w-5 md:w-6 h-5 md:h-6 text-accent" />
            <span className="text-xs md:text-sm font-semibold text-primary uppercase tracking-wider">Solutions</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 text-balance leading-tight">
            Our Solutions
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Discover tailored solutions designed to address your specific business challenges and drive growth.
          </p>
        </div>
      </div>

      {/* Solutions Grid */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {solutions.length > 0 ? (
              solutions.map((solution, index) => (
                <a
                  key={solution.id}
                  href={`/solutions/${solution.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all border-border h-full">
                    {solution.imageUrl && (
                      <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                        <img
                          src={solution.imageUrl}
                          alt={solution.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <CardHeader>
                      <CardTitle className="group-hover:text-accent transition-colors text-2xl">
                        {solution.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {solution.description && (
                        <CardDescription className="text-base line-clamp-3">
                          {solution.description}
                        </CardDescription>
                      )}

                      {solution.benefits && (
                        <div className="space-y-3">
                          <p className="font-semibold text-foreground text-sm">Key Benefits:</p>
                          <ul className="space-y-2">
                            {solution.benefits.split(',').slice(0, 4).map((benefit, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                                <span className="text-accent font-bold mt-0.5 flex-shrink-0">✓</span>
                                <span>{benefit.trim()}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-accent font-semibold mt-6 group-hover:gap-3 transition-all">
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Need a custom solution?</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
            Our team of experts is ready to create tailored solutions for your unique business needs.
          </p>
          <a href="/#contact">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Get in Touch
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}
