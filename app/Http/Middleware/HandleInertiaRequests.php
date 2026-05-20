<?php

namespace App\Http\Middleware;

use App\Models\SiteContent;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $appUrl    = rtrim(config('app.url'), '/');
        $seoData   = SiteContent::forSection('seo');
        $faqData   = SiteContent::forSection('faq');

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'seo' => [
                'appUrl'     => $appUrl,
                'currentUrl' => $request->url(),
                'ogImage'    => $appUrl . ($seoData['og_image'] ?? '/cns_assets/Mock up-08.png'),
            ],
            'seoContent' => $seoData,
            'faqContent' => $faqData,
        ];
    }
}
