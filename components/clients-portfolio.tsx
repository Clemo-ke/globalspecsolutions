'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Award } from 'lucide-react'

interface Client {
  id: number
  name: string
  description?: string
  imageUrl?: string
  projectTitle?: string
  projectDescription?: string
  technologies?: string
}

interface ClientsPortfolioProps {
  clients: Client[]
}

export function ClientsPortfolio({ clients }: ClientsPortfolioProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="w-6 h-6 text-accent" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Client Success Stories
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our portfolio of successful projects and partnerships across various sectors
          </p>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.length > 0 ? (
            clients.map((client) => (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className="cursor-pointer group"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all border-border h-full">
                  {client.imageUrl && (
                    <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden relative">
                      <img
                        src={client.imageUrl}
                        alt={client.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 font-semibold transition-opacity">
                          View Project
                        </span>
                      </div>
                    </div>
                  )}

                  <CardHeader>
                    <CardTitle className="group-hover:text-accent transition-colors">
                      {client.name}
                    </CardTitle>
                    {client.description && (
                      <CardDescription className="line-clamp-2">{client.description}</CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {client.projectTitle && (
                      <div>
                        <p className="font-semibold text-sm text-foreground mb-1">Project:</p>
                        <p className="text-sm text-muted-foreground">{client.projectTitle}</p>
                      </div>
                    )}

                    {client.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {client.technologies.split(',').slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">No client projects available yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedClient.name}</DialogTitle>
              {selectedClient.description && (
                <DialogDescription className="text-base mt-2">
                  {selectedClient.description}
                </DialogDescription>
              )}
            </DialogHeader>

            <div className="space-y-6 mt-6">
              {selectedClient.imageUrl && (
                <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden">
                  <img
                    src={selectedClient.imageUrl}
                    alt={selectedClient.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {selectedClient.projectTitle && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Project: {selectedClient.projectTitle}</h3>
                  {selectedClient.projectDescription && (
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {selectedClient.projectDescription}
                    </p>
                  )}
                </div>
              )}

              {selectedClient.technologies && (
                <div>
                  <p className="font-semibold text-sm mb-3">Technologies Used:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedClient.technologies.split(',').map((tech, idx) => (
                      <span key={idx} className="bg-accent text-accent-foreground px-3 py-1 rounded text-sm font-medium">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  )
}
