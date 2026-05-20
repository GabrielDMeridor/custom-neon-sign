<?php

namespace Database\Seeders;

use App\Models\GalleryItem;
use Illuminate\Database\Seeder;

class GalleryItemSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['title' => 'Salon Neon',       'category' => 'Business Signs',    'color' => '#FF00CC', 'emoji' => '✂️',  'description' => 'Pink fuchsia on frosted acrylic',       'badge' => 'POPULAR',    'sort_order' => 1],
            ['title' => 'Mr & Mrs',          'category' => 'Wedding & Events',  'color' => '#FFE580', 'emoji' => '💍',  'description' => 'Warm white wedding reception sign',     'badge' => 'TOP SELLER', 'sort_order' => 2],
            ['title' => 'Open Sign',         'category' => 'Bar & Hospitality', 'color' => '#39FF14', 'emoji' => '🍸',  'description' => 'Neon green tube on black acrylic',      'badge' => null,         'sort_order' => 3],
            ['title' => 'Good Vibes Only',   'category' => 'Home & Bedroom',    'color' => '#BF5FFF', 'emoji' => '✨',  'description' => 'Purple glow, clear acrylic',            'badge' => 'TRENDING',   'sort_order' => 4],
            ['title' => 'Your Name Here',    'category' => 'Custom Text',       'color' => '#00FFFF', 'emoji' => '✏️',  'description' => 'Custom script lettering in cyan',       'badge' => null,         'sort_order' => 5],
            ['title' => 'Coffee Shop',       'category' => 'Business Signs',    'color' => '#FF8C00', 'emoji' => '☕',  'description' => 'Orange warm tone on white acrylic',     'badge' => null,         'sort_order' => 6],
            ['title' => 'Just Married',      'category' => 'Wedding & Events',  'color' => '#FF6EC7', 'emoji' => '💒',  'description' => 'Script font, hot pink glow',            'badge' => 'POPULAR',    'sort_order' => 7],
            ['title' => 'Bar & Grill',       'category' => 'Bar & Hospitality', 'color' => '#FF2244', 'emoji' => '🔥',  'description' => 'Bold red neon on frosted acrylic',      'badge' => null,         'sort_order' => 8],
            ['title' => 'Be Yourself',       'category' => 'Home & Bedroom',    'color' => '#FF00CC', 'emoji' => '🌸',  'description' => 'Fuchsia bedroom wall sign',             'badge' => null,         'sort_order' => 9],
            ['title' => 'Dream Big',         'category' => 'Custom Text',       'color' => '#FFFF00', 'emoji' => '⭐',  'description' => 'Yellow neon on black panel',            'badge' => null,         'sort_order' => 10],
            ['title' => 'Tech Studio',       'category' => 'Business Signs',    'color' => '#4488FF', 'emoji' => '💻',  'description' => 'Electric blue on clear acrylic',        'badge' => null,         'sort_order' => 11],
            ['title' => 'Cheers!',           'category' => 'Bar & Hospitality', 'color' => '#39FF14', 'emoji' => '🥂',  'description' => 'Glowing green bar sign',                'badge' => 'FAN FAVE',   'sort_order' => 12],
        ];

        foreach ($items as $item) {
            GalleryItem::updateOrCreate(
                ['title' => $item['title']],
                array_merge($item, ['active' => true])
            );
        }
    }
}
