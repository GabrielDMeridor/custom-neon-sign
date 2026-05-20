<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteContent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContentController extends Controller
{
    // Section schema definition shared with the frontend
    public const SECTIONS = [
        'hero' => [
            'label' => 'Hero Section',
            'description' => 'Main headline, sub-text, and CTA buttons on the homepage.',
            'fields' => [
                ['key' => 'headline',      'label' => 'Headline',            'type' => 'text'],
                ['key' => 'subheadline',   'label' => 'Sub-headline',        'type' => 'textarea'],
                ['key' => 'cta1_text',     'label' => 'Primary Button Text', 'type' => 'text'],
                ['key' => 'cta2_text',     'label' => 'Secondary Button Text','type' => 'text'],
            ],
        ],
        'stats' => [
            'label' => 'Stats Bar',
            'description' => 'The four trust/social proof numbers shown on the homepage.',
            'fields' => [
                ['key' => 'stat1_value', 'label' => 'Stat 1 Value', 'type' => 'text'],
                ['key' => 'stat1_label', 'label' => 'Stat 1 Label', 'type' => 'text'],
                ['key' => 'stat2_value', 'label' => 'Stat 2 Value', 'type' => 'text'],
                ['key' => 'stat2_label', 'label' => 'Stat 2 Label', 'type' => 'text'],
                ['key' => 'stat3_value', 'label' => 'Stat 3 Value', 'type' => 'text'],
                ['key' => 'stat3_label', 'label' => 'Stat 3 Label', 'type' => 'text'],
                ['key' => 'stat4_value', 'label' => 'Stat 4 Value', 'type' => 'text'],
                ['key' => 'stat4_label', 'label' => 'Stat 4 Label', 'type' => 'text'],
            ],
        ],
        'how_it_works' => [
            'label' => 'How It Works',
            'description' => 'The four-step process section on the homepage.',
            'fields' => [
                ['key' => 'step1_icon',  'label' => 'Step 1 Emoji',   'type' => 'text'],
                ['key' => 'step1_title', 'label' => 'Step 1 Title',   'type' => 'text'],
                ['key' => 'step1_body',  'label' => 'Step 1 Body',    'type' => 'textarea'],
                ['key' => 'step2_icon',  'label' => 'Step 2 Emoji',   'type' => 'text'],
                ['key' => 'step2_title', 'label' => 'Step 2 Title',   'type' => 'text'],
                ['key' => 'step2_body',  'label' => 'Step 2 Body',    'type' => 'textarea'],
                ['key' => 'step3_icon',  'label' => 'Step 3 Emoji',   'type' => 'text'],
                ['key' => 'step3_title', 'label' => 'Step 3 Title',   'type' => 'text'],
                ['key' => 'step3_body',  'label' => 'Step 3 Body',    'type' => 'textarea'],
                ['key' => 'step4_icon',  'label' => 'Step 4 Emoji',   'type' => 'text'],
                ['key' => 'step4_title', 'label' => 'Step 4 Title',   'type' => 'text'],
                ['key' => 'step4_body',  'label' => 'Step 4 Body',    'type' => 'textarea'],
            ],
        ],
        'global' => [
            'label' => 'Global Settings',
            'description' => 'Site-wide settings: contact info, shipping threshold, top bar message.',
            'fields' => [
                ['key' => 'site_name',                 'label' => 'Site Name',                    'type' => 'text'],
                ['key' => 'phone',                     'label' => 'Phone Number',                 'type' => 'text'],
                ['key' => 'email',                     'label' => 'Email Address',                'type' => 'text'],
                ['key' => 'topbar_message',            'label' => 'Top Bar Message',              'type' => 'text'],
                ['key' => 'free_shipping_threshold',   'label' => 'Free Shipping Threshold ($)',  'type' => 'text'],
            ],
        ],
        'about' => [
            'label' => 'About Page',
            'description' => 'Content for the About Us page.',
            'fields' => [
                ['key' => 'headline',   'label' => 'Headline',    'type' => 'text'],
                ['key' => 'mission',    'label' => 'Mission Text','type' => 'textarea'],
                ['key' => 'body',       'label' => 'Main Body',   'type' => 'textarea'],
            ],
        ],
        'seo' => [
            'label' => 'SEO & Meta Tags',
            'description' => 'Meta titles, descriptions, and keywords for every storefront page. Edit these to control how your site appears in Google, AI search, and social sharing.',
            'fields' => [
                ['key' => 'home_title',           'label' => 'Homepage — Meta Title (50–60 chars)',          'type' => 'text'],
                ['key' => 'home_description',     'label' => 'Homepage — Meta Description (150–160 chars)', 'type' => 'textarea'],
                ['key' => 'home_keywords',        'label' => 'Homepage — Keywords (comma-separated)',        'type' => 'text'],
                ['key' => 'catalog_title',        'label' => 'Shop/Catalog — Meta Title',                   'type' => 'text'],
                ['key' => 'catalog_description',  'label' => 'Shop/Catalog — Meta Description',             'type' => 'textarea'],
                ['key' => 'about_title',          'label' => 'About — Meta Title',                          'type' => 'text'],
                ['key' => 'about_description',    'label' => 'About — Meta Description',                    'type' => 'textarea'],
                ['key' => 'gallery_title',        'label' => 'Gallery — Meta Title',                        'type' => 'text'],
                ['key' => 'gallery_description',  'label' => 'Gallery — Meta Description',                  'type' => 'textarea'],
                ['key' => 'designer_title',       'label' => 'Designer — Meta Title',                       'type' => 'text'],
                ['key' => 'designer_description', 'label' => 'Designer — Meta Description',                 'type' => 'textarea'],
                ['key' => 'og_image',             'label' => 'Default OG / Share Image Path (e.g. /cns_assets/image.png)', 'type' => 'text'],
            ],
        ],
        'faq' => [
            'label' => 'FAQ Section',
            'description' => 'The 8 questions & answers shown on the homepage FAQ section. These also feed Google "People Also Ask" rich results and AI search engines.',
            'fields' => [
                ['key' => 'faq1_q', 'label' => 'Question 1', 'type' => 'text'],
                ['key' => 'faq1_a', 'label' => 'Answer 1',   'type' => 'textarea'],
                ['key' => 'faq2_q', 'label' => 'Question 2', 'type' => 'text'],
                ['key' => 'faq2_a', 'label' => 'Answer 2',   'type' => 'textarea'],
                ['key' => 'faq3_q', 'label' => 'Question 3', 'type' => 'text'],
                ['key' => 'faq3_a', 'label' => 'Answer 3',   'type' => 'textarea'],
                ['key' => 'faq4_q', 'label' => 'Question 4', 'type' => 'text'],
                ['key' => 'faq4_a', 'label' => 'Answer 4',   'type' => 'textarea'],
                ['key' => 'faq5_q', 'label' => 'Question 5', 'type' => 'text'],
                ['key' => 'faq5_a', 'label' => 'Answer 5',   'type' => 'textarea'],
                ['key' => 'faq6_q', 'label' => 'Question 6', 'type' => 'text'],
                ['key' => 'faq6_a', 'label' => 'Answer 6',   'type' => 'textarea'],
                ['key' => 'faq7_q', 'label' => 'Question 7', 'type' => 'text'],
                ['key' => 'faq7_a', 'label' => 'Answer 7',   'type' => 'textarea'],
                ['key' => 'faq8_q', 'label' => 'Question 8', 'type' => 'text'],
                ['key' => 'faq8_a', 'label' => 'Answer 8',   'type' => 'textarea'],
            ],
        ],
    ];

    public function index()
    {
        $sections = collect(self::SECTIONS)->map(function ($schema, $key) {
            $data = SiteContent::forSection($key);
            return [
                'key'         => $key,
                'label'       => $schema['label'],
                'description' => $schema['description'],
                'field_count' => count($schema['fields']),
                'lastUpdated' => SiteContent::where('section', $key)->latest('updated_at')->value('updated_at'),
            ];
        })->values();

        return Inertia::render('Admin/Content/Index', compact('sections'));
    }

    public function edit(string $section)
    {
        abort_unless(isset(self::SECTIONS[$section]), 404);

        $schema  = self::SECTIONS[$section];
        $current = SiteContent::forSection($section);

        return Inertia::render('Admin/Content/Edit', [
            'section' => $section,
            'schema'  => $schema,
            'values'  => $current,
        ]);
    }

    public function update(Request $request, string $section)
    {
        abort_unless(isset(self::SECTIONS[$section]), 404);

        $schema = self::SECTIONS[$section];
        $keys   = array_column($schema['fields'], 'key');
        $data   = $request->only($keys);

        SiteContent::setSection($section, $data);

        return back()->with('success', $schema['label'] . ' saved successfully.');
    }
}
