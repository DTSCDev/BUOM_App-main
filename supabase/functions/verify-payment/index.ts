
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
    const { sessionId } = await req.json();

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Check the payment status
    const isPaid = session.payment_status === 'paid';

    // If paid, update the order status in Supabase
    if (isPaid && session.customer) {
      await supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('stripe_session_id', sessionId);

      // Retrieve the associated membership ID
      const membershipId = session.metadata?.membership_id;
      
      // If there's a membership ID, update the user's subscription status
      if (membershipId) {
        // First try to find if the user exists
        const { data: memberData } = await supabase
          .from('free-rs-calculator')
          .select()
          .eq('membership_id', membershipId)
          .single();
        
        if (memberData) {
          // Update the existing record
          await supabase
            .from('free-rs-calculator')
            .update({
              subscription_status: 'active',
              subscription_type: session.amount_total === 35000 ? 'lifetime' : 
                               (session.mode === 'subscription' && session.amount_total === 1200) ? 'monthly' : 'annual',
              updated_at: new Date().toISOString()
            })
            .eq('membership_id', membershipId);
        } else {
          // Create a new record
          await supabase
            .from('free-rs-calculator')
            .insert({
              membership_id: membershipId,
              subscription_status: 'active',
              subscription_type: session.amount_total === 35000 ? 'lifetime' : 
                              (session.mode === 'subscription' && session.amount_total === 1200) ? 'monthly' : 'annual',
            });
        }
      }
    }

    // Return the payment status
    return new Response(
      JSON.stringify({ 
        paid: isPaid,
        session: {
          id: session.id,
          payment_status: session.payment_status,
          amount_total: session.amount_total,
          currency: session.currency,
          customer: session.customer,
        }
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
    console.error('Error verifying payment:', error);
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
