import Stripe from 'stripe';
import * as Yup from 'yup';
import 'dotenv/config';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmout = (itens) => {
  const total = itens.reduce((acc, current) => {
    return current.price * current.quantity + acc;
  }, 0);

  return total;
};

class CreatePaymentIntentController {
  async store(req, res) {
    const schema = Yup.object({
      products: Yup.array()
        .required()
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
            price: Yup.number().required(),
          }),
        ),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { products } = req.body;

    const amount = calculateOrderAmout(products);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'brl',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      dpmCheckerLink: `https://dsahboard.stripe.com/settings/payment_methods/review?account=${paymentIntent.id}`
    });
  }
}

export default new CreatePaymentIntentController();
