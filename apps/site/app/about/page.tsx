import Link from 'next/link'
import { Button } from '@aspire/ui'
import { Crown, Target, Zap, Shield } from 'lucide-react'

export const metadata = {
  title: 'About - Aspire Academy',
  description: 'Learn about our mission to democratize AI mastery',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen constellation-bg py-16">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
            About <span className="gradient-text">Aspire Academy</span>
          </h1>
          <p className="text-xl text-brand-muted-text leading-relaxed">
            We're building the world's most comprehensive AI mastery platform. 
            Our mission: equip every person with the skills to thrive in the AI era.
          </p>
        </div>

        {/* Mission */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
          <div className="card">
            <Crown className="w-12 h-12 text-brand-gold mb-4" />
            <h2 className="text-2xl font-heading font-bold text-white mb-4">
              Our Mission
            </h2>
            <p className="text-brand-muted-text leading-relaxed">
              AI is the greatest wealth transfer in human history. We're ensuring you're on the right side of it. 
              Through world-class education, ethical frameworks, and hands-on practice, we transform beginners into AI experts.
            </p>
          </div>

          <div className="card">
            <Target className="w-12 h-12 text-brand-gold mb-4" />
            <h2 className="text-2xl font-heading font-bold text-white mb-4">
              Our Approach
            </h2>
            <p className="text-brand-muted-text leading-relaxed">
              No fluff. No hype. Just practical AI skills you can use immediately. We teach the technical foundations, 
              the business applications, and the ethical considerations. Real knowledge for real results.
            </p>
          </div>

          <div className="card">
            <Zap className="w-12 h-12 text-brand-gold mb-4" />
            <h2 className="text-2xl font-heading font-bold text-white mb-4">
              What Makes Us Different
            </h2>
            <p className="text-brand-muted-text leading-relaxed">
              We don't just teach AI tools—we teach AI mastery across industries. From business to coding, design to security, 
              finance to content creation. Comprehensive, cutting-edge, and constantly updated.
            </p>
          </div>

          <div className="card">
            <Shield className="w-12 h-12 text-brand-gold mb-4" />
            <h2 className="text-2xl font-heading font-bold text-white mb-4">
              Ethics First
            </h2>
            <p className="text-brand-muted-text leading-relaxed">
              Power without responsibility is dangerous. We teach the dark patterns and attack vectors only so you can defend against them. 
              Ethics, privacy, and responsible AI are core to every module.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="card">
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-brand-muted-text mb-6">
              Join thousands of professionals mastering AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg">
                  Browse Courses
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

