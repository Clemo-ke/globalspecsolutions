import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone } from 'lucide-react'

export const metadata = {
  title: 'Our Team - Global Spec Solutions',
  description: 'Meet the talented team behind Global Spec Solutions',
}

export default async function TeamPage() {
  const team = [
    {
      id: 1,
      name: 'John Anderson',
      role: 'Chief Executive Officer',
      bio: 'Visionary leader with 20+ years in business solutions and enterprise development',
      email: 'john@globalspec.com',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    },
    {
      id: 2,
      name: 'Sarah Mitchell',
      role: 'Head of Product Development',
      bio: 'Expert in innovative solutions with deep expertise in electrical systems',
      email: 'sarah@globalspec.com',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Director of Operations',
      bio: 'Strategic operations leader ensuring excellence in every project delivery',
      email: 'michael@globalspec.com',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      role: 'Head of Client Relations',
      bio: 'Dedicated to building lasting partnerships with our valued clients',
      email: 'emily@globalspec.com',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
    },
  ]

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Meet Our Team</h1>
            <p className="text-xl text-muted-foreground">
              We&apos;re a group of passionate professionals dedicated to delivering exceptional solutions and outstanding service to our clients.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-all group">
                {/* Team Member Image */}
                <div className="h-64 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <CardContent className="pt-6 space-y-3">
                  <div>
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-sm text-accent font-semibold">{member.role}</p>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{member.bio}</p>

                  <div className="flex items-center gap-3 pt-3 border-t border-border">
                    <a
                      href={`mailto:${member.email}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-semibold"
                      title="Send email"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="hidden sm:inline">Email</span>
                    </a>
                    <a
                      href="#"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors text-xs font-semibold"
                      title="Phone"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="hidden sm:inline">Call</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 bg-card/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-3">150+</div>
              <p className="text-muted-foreground">Years of combined experience</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-3">500+</div>
              <p className="text-muted-foreground">Successful projects delivered</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-3">98%</div>
              <p className="text-muted-foreground">Client satisfaction rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Excellence',
                description: 'We pursue the highest standards in everything we do',
              },
              {
                title: 'Innovation',
                description: 'We embrace cutting-edge solutions and creative thinking',
              },
              {
                title: 'Integrity',
                description: 'We operate with transparency and unwavering ethical principles',
              },
            ].map((value, index) => (
              <Card key={index} className="border-border hover:border-primary transition-colors">
                <CardContent className="pt-8">
                  <div className="w-12 h-12 rounded-lg bg-accent/20 text-accent flex items-center justify-center font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
