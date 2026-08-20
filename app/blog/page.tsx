import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CalendarDays, User, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Blog - Global Spec Solutions',
  description: 'Industry insights, tips, and updates from Global Spec Solutions',
}

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: 'The Future of Electrical Systems in Enterprise',
      excerpt:
        'Explore how modern electrical solutions are revolutionizing enterprise infrastructure and sustainability practices.',
      category: 'Technology',
      author: 'John Anderson',
      date: 'January 15, 2024',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=400&fit=crop',
    },
    {
      id: 2,
      title: 'Best Practices for Industrial Solutions Implementation',
      excerpt:
        'Learn the proven strategies and best practices for successfully implementing industrial solutions in your organization.',
      category: 'Business',
      author: 'Sarah Mitchell',
      date: 'January 10, 2024',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1551217678-1e1514cb6fb3?w=800&h=400&fit=crop',
    },
    {
      id: 3,
      title: 'Maximizing ROI with Strategic Business Solutions',
      excerpt:
        'Discover how strategic business solutions can drive significant returns and transform your bottom line.',
      category: 'Strategy',
      author: 'Michael Chen',
      date: 'January 5, 2024',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    },
    {
      id: 4,
      title: 'Sustainability in Modern Business Operations',
      excerpt:
        'Learn how sustainable practices are becoming essential for competitive advantage in modern business.',
      category: 'Sustainability',
      author: 'Emily Rodriguez',
      date: 'December 28, 2023',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    },
    {
      id: 5,
      title: 'Digital Transformation in the Industrial Sector',
      excerpt:
        'How digital technologies are reshaping the industrial landscape and creating new opportunities.',
      category: 'Innovation',
      author: 'John Anderson',
      date: 'December 20, 2023',
      readTime: '9 min read',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=400&fit=crop',
    },
    {
      id: 6,
      title: 'The Value of Long-Term Client Partnerships',
      excerpt:
        'Exploring why building strong, lasting relationships with clients creates mutual success and growth.',
      category: 'Business',
      author: 'Sarah Mitchell',
      date: 'December 15, 2023',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    },
  ]

  const categories = ['All', 'Technology', 'Business', 'Strategy', 'Sustainability', 'Innovation']

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-b from-primary/10 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Blog</h1>
            <p className="text-xl text-muted-foreground">
              Insights, updates, and industry expertise from the Global Spec Solutions team.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  cat === 'All'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-foreground hover:border-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="group">
                <Card className="overflow-hidden hover:shadow-xl transition-all border-border flex flex-col h-full">
                  {/* Featured Image */}
                  <div className="h-56 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-accent/90 text-accent-foreground text-xs font-bold">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <CardContent className="pt-6 flex-1 flex flex-col space-y-4">
                    {/* Title */}
                    <h3 className="font-bold text-xl line-clamp-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-muted-foreground line-clamp-2 flex-1">{post.excerpt}</p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {post.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                    </div>

                    {/* Read More */}
                    <a
                      href="#"
                      className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </CardContent>
                </Card>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5 border-y border-border">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Subscribe to our newsletter to get the latest insights and updates delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-8 py-3 rounded-lg bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
