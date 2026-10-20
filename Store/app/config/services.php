<?php

return [
    'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],
    'realtime' => [
        'url' => env('REALTIME_SERVER_URL', 'http://node:3000'),
        'secret' => env('REALTIME_API_SECRET', 'realtime-secret-key'),
    ],
];
