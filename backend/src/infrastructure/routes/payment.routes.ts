import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.post('/create-checkout-session', authenticateJWT, async (req: any, res) => {
  try {
    const { items, totalAmount } = req.body;
    
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && stripeKey !== 'your_stripe_secret_key_here') {
      try {
        const Stripe = require('stripe');
        const stripe = new Stripe(stripeKey);
        
        const lineItems = items.map((item: any) => {
          const price = typeof item.price === 'string'
            ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
            : Number(item.price || 0);
            
          const img = item.product?.image || '';
          const imageLink = img.startsWith('http') 
            ? img 
            : `${req.protocol}://${req.get('host')}${img}`;

          return {
            price_data: {
              currency: 'eur',
              product_data: {
                name: item.product?.name || 'Mueble Premium',
                images: imageLink ? [imageLink] : [],
              },
              unit_amount: Math.round(price * 100),
            },
            quantity: item.quantity,
          };
        });

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: `${req.protocol}://${req.get('host')}/pages/orders.html?payment=success`,
          cancel_url: `${req.protocol}://${req.get('host')}/pages/products.html?payment=cancel`,
        });

        return res.json({ id: session.id, url: session.url, isMock: false });
      } catch (stripeError: any) {
        console.warn('Stripe SDK creation failed, falling back to simulation:', stripeError.message);
      }
    }

    // Fallback simulated Stripe session for sandboxed / offline testing
    const simulatedSessionId = 'cs_test_' + Math.random().toString(36).substring(2, 15);
    return res.json({ 
      id: simulatedSessionId, 
      url: '#stripe-mock-payment', 
      isMock: true, 
      totalAmount 
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
