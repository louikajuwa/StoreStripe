<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Payments/Index', [
            'payments' => Payment::with('product')->latest()->paginate(15),
        ]);
    }
}
