<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;

class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            'hero' => [
                'headline'    => 'Shine Bright with Custom Neon Signs',
                'subheadline' => 'Premium LED neon signs handcrafted in Australia. Perfect for homes, businesses, weddings & events.',
                'cta1_text'   => '✦ Design Yours',
                'cta2_text'   => 'Shop Signs',
            ],
            'stats' => [
                'stat1_value' => '5,000+', 'stat1_label' => 'Signs Delivered',
                'stat2_value' => '100%',   'stat2_label' => 'Custom Made',
                'stat3_value' => '24 hrs', 'stat3_label' => 'Proof Turnaround',
                'stat4_value' => '5★',     'stat4_label' => 'Average Review',
            ],
            'how_it_works' => [
                'step1_icon'  => '🎨', 'step1_title' => 'Design It',    'step1_body'  => 'Use our Design Studio to customise your text, font, colour and size — or upload your logo.',
                'step2_icon'  => '✅', 'step2_title' => 'Get a Proof',  'step2_body'  => 'Our team sends a free digital proof within 24 hours. Revisions are always free.',
                'step3_icon'  => '⚡', 'step3_title' => 'We Build It',  'step3_body'  => 'Once approved, we hand-craft your sign in our Sydney workshop using premium LED neon flex.',
                'step4_icon'  => '🚚', 'step4_title' => 'We Deliver',   'step4_body'  => 'Your sign is packed securely and shipped tracked Australia-wide with transit insurance.',
            ],
            'global' => [
                'site_name'               => 'Custom Neon Signs Australia',
                'phone'                   => '1800 NEON AU',
                'email'                   => 'hello@customneonsigns.com.au',
                'topbar_message'          => '🚀 Free shipping on orders over $300 · Australia-wide delivery',
                'free_shipping_threshold' => '300',
            ],
            'about' => [
                'headline' => 'We Make Things Glow',
                'mission'  => 'Premium neon at an accessible price, with zero compromises on quality.',
                'body'     => 'Custom Neon Signs Australia was founded by a team of designers and makers who believed every space deserves a statement.',
            ],
            'seo' => [
                'home_title'           => 'Custom Neon Signs Australia | Buy LED Neon Signs Online',
                'home_description'     => "Australia's #1 custom LED neon sign shop. Design your own personalised neon sign from \$169. 12 colours, free design tool, 2-year warranty, ships nationwide in 5–7 days.",
                'home_keywords'        => 'custom neon signs australia, led neon signs australia, personalised neon sign, neon sign maker australia, buy neon signs online australia, custom neon wedding sign, neon sign for home, business neon sign',
                'catalog_title'        => 'Buy Custom Neon Signs Australia | LED Neon Signs Shop',
                'catalog_description'  => 'Shop premium custom LED neon signs in Australia. Choose from pre-built designs or use our free tool to create a personalised neon sign. From $169 with 2-year warranty and Australia-wide delivery.',
                'about_title'          => 'About Custom Neon Signs Australia | Handcrafted LED Neon',
                'about_description'    => "Learn about Custom Neon Signs Australia — the team behind Australia's premium LED neon signs. Handcrafted in Sydney, 8,400+ signs delivered, 4.9-star rated, 2-year warranty.",
                'gallery_title'        => 'Custom Neon Sign Gallery & Ideas | Custom Neon Signs Australia',
                'gallery_description'  => 'Browse real custom neon sign photos for inspiration. Neon signs for weddings, bedrooms, bars, businesses, and events — all handcrafted in Australia.',
                'designer_title'       => 'Free Custom Neon Sign Designer | Design Your LED Neon Sign Online',
                'designer_description' => 'Design your own custom neon sign online for free. Choose your text, font, colour and size. Live glowing preview before you buy. Ships Australia-wide from $169 with 2-year warranty.',
                'og_image'             => '/cns_assets/Mock up-08.png',
            ],
            'faq' => [
                'faq1_q' => 'How much do custom neon signs cost in Australia?',
                'faq1_a' => 'Custom neon signs at Custom Neon Signs Australia start from $169 for a small 30cm sign. Medium (60cm) from $219, Large (90cm) from $289, and XL (120cm) from $369. Price depends on text length, size, and colour. All prices include a 2-year warranty and Australian plug.',
                'faq2_q' => 'How long do LED neon signs last?',
                'faq2_a' => 'Our premium LED neon flex signs are rated to 50,000+ hours — over 15 years of 8-hour daily use. Unlike traditional glass neon, LED neon never requires recharging, re-gassing, or specialist maintenance.',
                'faq3_q' => 'Are LED neon signs safe for bedrooms and kids\' rooms?',
                'faq3_a' => 'Yes. Our signs run on a safe 12V DC low-voltage driver and are cool to the touch. They contain no mercury, no toxic gas, and are safe for residential use including bedrooms and children\'s rooms. All signs include a certified Australian-standard (Type I) plug.',
                'faq4_q' => 'How long does delivery take across Australia?',
                'faq4_a' => 'Production takes 5–7 business days. We then ship via express courier Australia-wide. Most customers in Sydney, Melbourne, Brisbane, and Perth receive their order within 7–10 business days total. We deliver to every state and territory.',
                'faq5_q' => 'Can I design my own neon sign for free?',
                'faq5_a' => 'Absolutely. Our free online Design Studio lets you type any text, choose from 6 neon fonts, pick from 12 LED colours, select your acrylic backing, and see a live glowing preview — all before you order. No account required to start designing.',
                'faq6_q' => 'What is the difference between LED neon and traditional glass neon?',
                'faq6_a' => 'LED neon uses flexible silicone tubing with LED strips to produce the same warm glow as traditional glass neon, but with major advantages: it is shatterproof, contains no toxic gas, uses 80% less energy, is lighter, and is far safer for indoor and residential use.',
                'faq7_q' => 'Do you make custom neon signs for weddings?',
                'faq7_a' => 'Yes — wedding neon signs are one of our most popular products. We create custom signs for ceremony backdrops, reception walls, and photo booths. Popular choices include couple names, "Mr & Mrs", "Better Together", and custom wedding dates.',
                'faq8_q' => 'Can I get my business logo made into a neon sign?',
                'faq8_a' => 'Yes. Our Logo to Neon service lets you upload your business logo and our team will recreate it as a custom LED neon sign. Ideal for shopfronts, reception desks, offices, restaurants, and bars. Contact us for a custom quote.',
            ],
        ];

        foreach ($defaults as $section => $fields) {
            foreach ($fields as $key => $value) {
                SiteContent::updateOrCreate(
                    ['section' => $section, 'key' => $key],
                    ['value'   => $value]
                );
            }
        }
    }
}
