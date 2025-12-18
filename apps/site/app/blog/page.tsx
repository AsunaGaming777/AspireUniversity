import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { Button } from '@aspire/ui'
import { formatDate } from '@/lib/date-utils'

export const metadata = {
  title: 'Blog - Aspire Academy',
  description: 'Latest AI insights, tutorials, and industry news',
}

const posts = [
  {
    slug: 'ai-is-eating-the-world',
    title: 'AI Is Eating The World - And You\'re Either The Eater Or The Eaten',
    excerpt: 'The AI revolution isn\'t coming—it\'s here. Companies are replacing entire teams with AI. The question is: will you adapt or become obsolete?',
    author: 'The Overseer',
    date: '2025-01-15',
    category: 'Industry Insights',
  },
  {
    slug: 'prompt-engineering-masterclass',
    title: 'Prompt Engineering: The $200K/Year Skill Nobody Talks About',
    excerpt: 'Prompt engineers are making six figures. Here\'s the exact framework they use to write prompts that get 10x better results.',
    author: 'Alex Chen',
    date: '2025-01-10',
    category: 'Tutorial',
  },
  {
    slug: 'dark-side-of-ai',
    title: 'The Dark Side of AI: What They Don\'t Want You To Know',
    excerpt: 'Deepfakes, manipulation, surveillance—AI has a dark side. We explore it so you can defend against it.',
    author: 'The Overseer',
    date: '2025-01-05',
    category: 'Ethics',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen constellation-bg py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6">
            The Aspire <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-xl text-brand-muted-text">
            AI insights, tutorials, and industry analysis. Unfiltered truth about the AI revolution.
          </p>
        </div>

        {/* Blog Posts */}
        <div className="max-w-5xl mx-auto space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="card group hover:scale-102 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/30 rounded-full">
                  <span className="text-brand-gold text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>

              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3 group-hover:text-brand-gold transition-colors">
                  {post.title}
                </h2>
              </Link>

              <p className="text-brand-muted-text mb-6 leading-relaxed">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-brand-muted-text">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                </div>

                <Link href={`/blog/${post.slug}`}>
                  <Button variant="ghost" size="sm">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-16 text-center">
          <div className="card max-w-2xl mx-auto">
            <h3 className="text-2xl font-heading font-bold text-white mb-4">
              More content coming soon
            </h3>
            <p className="text-brand-muted-text mb-6">
              Subscribe to our newsletter to get the latest AI insights delivered to your inbox.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-brand-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

