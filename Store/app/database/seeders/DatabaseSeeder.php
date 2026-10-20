<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Product::create(['name' => 'Wireless Headphones', 'price' => 79.99]);
        Product::create(['name' => 'Mechanical Keyboard', 'price' => 129.99]);
        Product::create(['name' => 'USB-C Hub', 'price' => 49.99]);
        Product::create(['name' => 'Laptop Stand', 'price' => 39.99]);
        Product::create(['name' => '4K Monitor', 'price' => 349.99]);
        Product::create(['name' => 'Webcam HD', 'price' => 69.99]);
    }
}
