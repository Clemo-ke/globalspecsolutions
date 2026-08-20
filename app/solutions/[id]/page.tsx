import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Zap, Check } from 'lucide-react'
import { getSolutions } from '@/app/actions/content'

export const metadata = {
  title: 'Solution Details - Global Spec Solutions',
  description: 'Detailed information about our business solutions',
}

export default async function SolutionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const solutions = await getSolutions()
  const solution = solutions.find((s) => s.id === parseInt(params.id))

  if (!solution) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Solution Not Found</h1>
          <p className="text-muted-foreground mb-8">The solution you&apos;re looking for doesn&apos;t exist.</p>
          <a href="/solutions">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Solutions
            </Button>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-8 md:py-12 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <a href="/solutions" className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors mb-4 md:mb-6 text-sm md:text-base">
            <ArrowLeft className="w-4 h-4" />
            Back to Solutions
          </a>
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Zap className="w-5 md:w-6 h-5 md:h-6 text-accent" />
            <span className="text-xs md:text-sm font-semibold text-primary uppercase tracking-wider">Solution Details</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-balance leading-tight">{solution.title}</h1>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 mb-12 md:mb-16">
            {/* Image */}
            <div className="md:col-span-2">
              {solution.imageUrl ? (
                <div className="w-full h-48 sm:h-64 md:h-96 rounded-lg overflow-hidden shadow-xl">
                  <img
                    src={solution.imageUrl}
                    alt={solution.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-96 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Zap className="w-24 h-24 text-primary/50" />
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div>
              <Card className="border-border sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Start</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{solution.description}</p>
                  <a href="/#contact" className="block">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                      Request a Quote
                    </Button>
                  </a>
                  <Button variant="outline" className="w-full">
                    Download Brochure
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Benefits */}
          {solution.benefits && (
            <div className="mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8">Key Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {solution.benefits.split(',').map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-6 rounded-lg border border-border hover:border-primary transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center mt-1">
                      <Check className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{benefit.trim()}</h3>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive support and implementation for {benefit.toLowerCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Why Choose Us */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 md:p-8 lg:p-12 mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8">Why Choose This Solution?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
              <div className="space-y-3">
                <div className="text-4xl font-bold text-accent">100%</div>
                <p className="font-semibold">Customizable</p>
                <p className="text-sm text-muted-foreground">Tailored specifically to your business needs</p>
              </div>
              <div className="space-y-3">
                <div className="text-4xl font-bold text-accent">24/7</div>
                <p className="font-semibold">Expert Support</p>
                <p className="text-sm text-muted-foreground">Round-the-clock assistance from our team</p>
              </div>
              <div className="space-y-3">
                <div className="text-4xl font-bold text-accent">3+</div>
                <p className="font-semibold">Years Experience</p>
                <p className="text-sm text-muted-foreground">Proven track record of success</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">Ready to get started?</h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
              Contact our team of experts to discuss how this solution can benefit your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <a href="/#contact">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  Contact Us Now
                </Button>
              </a>
              <a href="/solutions">
                <Button size="lg" variant="outline">
                  Explore Other Solutions
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
