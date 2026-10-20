<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;

class WebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (\Exception $e) {
            Log::error('Stripe webhook signature verification failed: ' . $e->getMessage());
            return response('Invalid signature', 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $paymentIntent = $event->data->object;

            $payment = Payment::where('stripe_payment_intent_id', $paymentIntent->id)->first();

            if ($payment) {
                $payment->update(['status' => 'paid']);

                $payment->load('product');

                try {
                    Http::post(config('services.realtime.url') . '/broadcast-payment', [
                        'secret' => config('services.realtime.secret'),
                        'payment' => [
                            'id' => $payment->id,
                            'product_id' => $payment->product_id,
                            'product_name' => $payment->product->name,
                            'stripe_payment_intent_id' => $payment->stripe_payment_intent_id,
                            'amount' => $payment->amount,
                            'currency' => $payment->currency,
                            'customer_email' => $payment->customer_email,
                            'customer_name' => $payment->customer_name,
                            'status' => $payment->status,
                            'created_at' => $payment->created_at->toISOString(),
                            'updated_at' => $payment->updated_at->toISOString(),
                        ],
                    ]);
                } catch (\Exception $e) {
                    Log::error('Failed to broadcast payment update: ' . $e->getMessage());
                }
            }
        }

        return response('OK', 200);
    }
}
