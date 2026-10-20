<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class CheckoutController extends Controller
{
    public function show(Product $product)
    {
        return Inertia::render('Checkout/Show', [
            'product' => $product,
            'stripeKey' => config('services.stripe.key'),
        ]);
    }

    public function store(Request $request, Product $product)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
        ]);

        Stripe::setApiKey(config('services.stripe.secret'));

        $paymentIntent = PaymentIntent::create([
            'amount' => (int) ($product->price * 100),
            'currency' => 'usd',
            'metadata' => [
                'product_id' => $product->id,
                'customer_email' => $request->customer_email,
            ],
        ]);

        Payment::create([
            'product_id' => $product->id,
            'stripe_payment_intent_id' => $paymentIntent->id,
            'amount' => $product->price,
            'currency' => 'usd',
            'customer_email' => $request->customer_email,
            'customer_name' => $request->customer_name,
            'status' => 'pending',
        ]);

        return response()->json([
            'clientSecret' => $paymentIntent->client_secret,
        ]);
    }

    public function success(Product $product)
    {
        return Inertia::render('Checkout/Success', [
            'product' => $product,
        ]);
    }
}
