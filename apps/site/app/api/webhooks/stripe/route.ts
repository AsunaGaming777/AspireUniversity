import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.payment_status === 'paid') {
          const userId = session.metadata?.userId
          const plan = session.metadata?.plan

          if (userId && plan) {
            // Create payment record
            await prisma.payment.create({
              data: {
                userId,
                stripeSessionId: session.id,
                stripePaymentIntentId: session.payment_intent as string,
                amount: session.amount_total!,
                currency: session.currency!,
                status: 'succeeded',
                plan: plan as any,
              },
            })

            // Create enrollment
            const course = await prisma.course.findFirst({
              where: { plans: { has: plan } },
            })

            if (course) {
              await prisma.enrollment.create({
                data: {
                  userId,
                  courseId: course.id,
                  plan: plan as any,
                  status: 'active',
                  accessGrantedAt: new Date(),
                },
              })
            }

            // TODO: Sync Discord roles
            // TODO: Send welcome email
          }
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error('Payment failed:', paymentIntent.id)
        // TODO: Handle failed payment
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        // TODO: Handle subscription cancellation
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}