import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'

export const metadata = {
  title: 'Client Testimonials - Global Spec Solutions',
  description: 'See what our satisfied clients have to say about working with us',
}

export default function TestimonialsPage() {
  const testimonials = [
    {
      id: 1,
      name: 'James Wilson',
      company: 'TechCorp Industries',
      role: 'Operations Manager',
      content:
        'Global Spec Solutions transformed our operations. Their expertise and professionalism exceeded our expectations.',
      rating: 5,
    },
    {
      id: 2,
      name: 'Lisa Chen',
      company: 'Premier Manufacturing',
      role: 'CEO',
      content:
        'Working with this team was a game-changer. They understood our unique challenges and delivered tailored solutions.',
      rating: 5,
    },
    {
      id: 3,
      name: 'David Martinez',
      company: 'Industrial Solutions Inc',
      role: 'Project Director',
      content:
        'Exceptional service quality and attention to detail. They went above and beyond to ensure project success.',
      rating: 5,
    },
    {
      id: 4,
      name: 'Emma Thompson',
      company: 'Advanced Systems Corp',
      role: 'Head of Infrastructure',
      content:
        'The team demonstrated remarkable technical expertise. I would highly recommend them to any organization.',
      rating: 5,
    },
    {
      id: 5,
      name: 'Robert Singh',
      company: 'Global Enterprises',
      role: 'Chief Technology Officer',
      content:
        'Outstanding results delivered on time and within budget. A true partnership that adds real value to our business.',
      rating: 5,
    },
    {
      id: 6,
      name: 'Patricia Johnson',
      company: 'Future Industries Ltd',
      role: 'VP of Operations',
      content:
        'Their innovative approach and problem-solving skills are unmatched. Definitely a trusted partner for us.',
      rating: 5,
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Client Testimonials</h1>
            <p className="text-xl text-muted-foreground">
              Hear directly from our satisfied clients about their experiences working with Global Spec Solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-all border-border group">
                <CardContent className="pt-6 space-y-4">
                  {/* Rating */}
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-accent text-accent group-hover:scale-110 transition-transform"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-foreground leading-relaxed">
                    &quot;{testimonial.content}&quot;
                  </blockquote>

                  {/* Author Info */}
                  <div className="pt-4 border-t border-border">
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-accent font-semibold">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Happy Clients</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">98%</div>
              <p className="text-muted-foreground">Satisfaction Rate</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <p className="text-muted-foreground">Projects Completed</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">15+</div>
              <p className="text-muted-foreground">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Work With Us?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of satisfied clients who trust Global Spec Solutions for their business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#contact"
                className="px-8 py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
              >
                Get Started
              </a>
              <a
                href="/team"
                className="px-8 py-3 rounded-lg border border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
              >
                Learn About Our Team
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
