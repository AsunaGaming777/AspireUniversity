import { jsPDF } from 'jspdf'
import { format } from 'date-fns'
import { prisma } from './prisma'

interface CertificateData {
  studentName: string
  courseName: string
  completedDate: Date
  certificateId: string
}

/**
 * Generate a professional certificate PDF with Aspire branding
 * Black & Gold theme, includes verification code
 */
export async function generateCertificate(data: CertificateData): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  })

  const width = doc.internal.pageSize.getWidth()
  const height = doc.internal.pageSize.getHeight()

  // Background - Black
  doc.setFillColor(10, 10, 10) // #0A0A0A
  doc.rect(0, 0, width, height, 'F')

  // Gold border
  doc.setDrawColor(212, 175, 55) // #D4AF37
  doc.setLineWidth(2)
  doc.rect(10, 10, width - 20, height - 20)

  // Inner border
  doc.setLineWidth(0.5)
  doc.rect(15, 15, width - 30, height - 30)

  // Title
  doc.setTextColor(212, 175, 55) // Gold
  doc.setFontSize(48)
  doc.setFont('helvetica', 'bold')
  doc.text('CERTIFICATE OF COMPLETION', width / 2, 40, { align: 'center' })

  // Subtitle
  doc.setFontSize(16)
  doc.setTextColor(207, 207, 207) // Muted text
  doc.text('This certifies that', width / 2, 55, { align: 'center' })

  // Student Name
  doc.setFontSize(36)
  doc.setTextColor(255, 255, 255) // White
  doc.setFont('helvetica', 'bold')
  doc.text(data.studentName, width / 2, 75, { align: 'center' })

  // Has completed
  doc.setFontSize(16)
  doc.setTextColor(207, 207, 207)
  doc.setFont('helvetica', 'normal')
  doc.text('has successfully completed', width / 2, 90, { align: 'center' })

  // Course Name
  doc.setFontSize(28)
  doc.setTextColor(212, 175, 55) // Gold
  doc.setFont('helvetica', 'bold')
  doc.text(data.courseName, width / 2, 110, { align: 'center' })

  // Aspire Academy
  doc.setFontSize(18)
  doc.setTextColor(207, 207, 207)
  doc.setFont('helvetica', 'normal')
  doc.text('at Aspire Academy', width / 2, 125, { align: 'center' })

  // Date
  doc.setFontSize(14)
  doc.text(
    `Completed on ${format(new Date(data.completedDate), 'MMMM dd, yyyy')}`,
    width / 2,
    140,
    { align: 'center' }
  )

  // Verification
  doc.setFontSize(10)
  doc.setTextColor(150, 150, 150)
  doc.text(`Verification ID: ${data.certificateId}`, width / 2, height - 25, {
    align: 'center',
  })
  doc.text(`Verify at: aspire.com/verify/${data.certificateId}`, width / 2, height - 20, {
    align: 'center',
  })

  // Signature line
  doc.setDrawColor(212, 175, 55)
  doc.setLineWidth(0.5)
  doc.line(50, height - 45, 100, height - 45)
  
  doc.setFontSize(12)
  doc.setTextColor(207, 207, 207)
  doc.text('The Overseer', 75, height - 38, { align: 'center' })
  doc.setFontSize(10)
  doc.text('Founder, Aspire Academy', 75, height - 33, { align: 'center' })

  // Convert to buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
  return pdfBuffer
}

/**
 * Issue a certificate to a user for completing a course
 */
export async function issueCertificate(userId: string, courseId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  })

  if (!user || !course) {
    throw new Error('User or course not found')
  }

  // Generate verification code
  const verificationCode = `ASPIRE-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`

  // Create certificate record
  const certificate = await prisma.certificate.create({
    data: {
      userId,
      courseId,
      type: 'completion',
      title: `${course.title} - Certificate of Completion`,
      description: `Awarded for successfully completing ${course.title}`,
      verificationCode,
      verificationUrl: `https://aspire.com/verify/${verificationCode}`,
      completedAt: new Date(),
    },
  })

  // Generate PDF
  const pdfBuffer = await generateCertificate({
    studentName: user.name || user.email,
    courseName: course.title,
    completedDate: new Date(),
    certificateId: verificationCode,
  })

  // TODO: Upload to R2/Cloudflare Storage
  // For now, we'll store the path
  await prisma.certificate.update({
    where: { id: certificate.id },
    data: {
      pdfUrl: `/certificates/${verificationCode}.pdf`,
      pdfHash: Buffer.from(pdfBuffer).toString('base64').substring(0, 64),
    },
  })

  // Trigger Discord notification
  await fetch(`${process.env.NEXTAUTH_URL}/api/discord/webhook`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-webhook-signature': process.env.DISCORD_WEBHOOK_SECRET || 'dev-secret',
    },
    body: JSON.stringify({
      type: 'user.certificate_earned',
      data: { userId, courseId },
    }),
  }).catch(console.error)

  return certificate
}



