<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colors = ['#FF003C', '#FF6EC7', '#00FFFF', '#39FF14', '#FFFF00', '#FF8C00', '#BF5FFF', '#FFFFFF'];
        $sizes  = [
            ['label' => 'Small (30cm)', 'price' => 0],
            ['label' => 'Medium (60cm)', 'price' => 50],
            ['label' => 'Large (90cm)', 'price' => 120],
            ['label' => 'XL (120cm)', 'price' => 200],
        ];

        $products = [
            [
                'name'           => 'Open Sign',
                'slug'           => 'open-sign',
                'description'    => 'Classic neon OPEN sign. Perfect for businesses and storefronts.',
                'category'       => 'prebuilt',
                'base_price'     => 189,
                'image'          => null,
                'colors'         => $colors,
                'sizes'          => $sizes,
                'is_customizable' => false,
            ],
            [
                'name'           => 'Love Heart',
                'slug'           => 'love-heart',
                'description'    => 'Romantic neon heart for weddings, events, and home décor.',
                'category'       => 'prebuilt',
                'base_price'     => 149,
                'image'          => null,
                'colors'         => $colors,
                'sizes'          => $sizes,
                'is_customizable' => false,
            ],
            [
                'name'           => 'Good Vibes Only',
                'slug'           => 'good-vibes-only',
                'description'    => 'Spread positivity with this iconic neon phrase.',
                'category'       => 'prebuilt',
                'base_price'     => 219,
                'image'          => null,
                'colors'         => $colors,
                'sizes'          => $sizes,
                'is_customizable' => false,
            ],
            [
                'name'           => 'Neon Bar Sign',
                'slug'           => 'neon-bar-sign',
                'description'    => 'Retro bar neon sign — great for home bars and man caves.',
                'category'       => 'prebuilt',
                'base_price'     => 199,
                'image'          => null,
                'colors'         => $colors,
                'sizes'          => $sizes,
                'is_customizable' => false,
            ],
            [
                'name'           => 'Custom Text Sign',
                'slug'           => 'custom-text-sign',
                'description'    => 'Design your own neon sign with any text and font.',
                'category'       => 'custom',
                'base_price'     => 169,
                'image'          => null,
                'colors'         => $colors,
                'sizes'          => $sizes,
                'is_customizable' => true,
            ],
            [
                'name'           => 'Custom Logo Sign',
                'slug'           => 'custom-logo-sign',
                'description'    => 'Upload your logo and we\'ll turn it into a neon masterpiece.',
                'category'       => 'custom',
                'base_price'     => 299,
                'image'          => null,
                'colors'         => $colors,
                'sizes'          => $sizes,
                'is_customizable' => true,
            ],
            [
                'name'           => 'Birthday Bash',
                'slug'           => 'birthday-bash',
                'description'    => 'Make birthdays unforgettable with this fun neon sign.',
                'category'       => 'prebuilt',
                'base_price'     => 179,
                'image'          => null,
                'colors'         => $colors,
                'sizes'          => $sizes,
                'is_customizable' => false,
            ],
            [
                'name'           => 'Lets Party',
                'slug'           => 'lets-party',
                'description'    => 'Perfect for events, celebrations, and parties.',
                'category'       => 'prebuilt',
                'base_price'     => 189,
                'image'          => null,
                'colors'         => $colors,
                'sizes'          => $sizes,
                'is_customizable' => false,
            ],
        ];

        foreach ($products as $product) {
            \App\Models\Product::updateOrCreate(['slug' => $product['slug']], $product);
        }
    }
}
