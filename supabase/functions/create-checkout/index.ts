
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { priceId, membershipId } = await req.json();

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the auth header from the request
    const authHeader = req.headers.get('Authorization');
    
    let userEmail = 'guest@example.com'; // Default for guests
    let userId = null;
    
    // If auth header exists, get the user's email
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data } = await supabase.auth.getUser(token);
      
      if (data?.user) {
        userEmail = data.user.email || userEmail;
        userId = data.user.id;
      }
    }

    // Find or create a customer
    const { data: customers } = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    let customerId: string;
    if (customers && customers.length > 0) {
      customerId = customers[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          membership_id: membershipId || '',
        },
      });
      customerId = customer.id;
    }

    // Determine mode based on price
    const price = await stripe.prices.retrieve(priceId);
    const mode = price.type === 'recurring' ? 'subscription' : 'payment';

    // Create checkout session
    const origin = req.headers.get('origin') || 'http://localhost:5173';
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment-cancelled`,
      metadata: {
        membership_id: membershipId || '',
      },
    });

    // Store order information in Supabase
    if (session && userId) {
      await supabase.from('orders').insert({
        user_id: userId,
        stripe_session_id: session.id,
        stripe_customer_id: customerId,
        membership_id: membershipId || '',
        status: 'pending',
        amount: price.unit_amount,
        currency: price.currency,
      });
    }

    // Return the checkout session URL
    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id,
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});
