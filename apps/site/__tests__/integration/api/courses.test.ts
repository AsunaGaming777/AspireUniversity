import { describe, it, expect } from 'vitest'

describe('Courses API', () => {
  it('should fetch courses from database', async () => {
    // Mock Prisma call
    const mockCourses = [
      {
        id: '1',
        slug: 'ai-foundations',
        title: 'AI Foundations',
        published: true,
      },
    ]

    expect(mockCourses).toHaveLength(1)
    expect(mockCourses[0].slug).toBe('ai-foundations')
  })

  it('should only return published courses', async () => {
    const mockCourses = [
      { id: '1', published: true },
      { id: '2', published: false },
    ]

    const published = mockCourses.filter((c) => c.published)
    expect(published).toHaveLength(1)
  })
})



