<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteContent extends Model
{
    protected $fillable = ['section', 'key', 'value'];

    /**
     * Get all key-value pairs for a given section as an associative array.
     */
    public static function forSection(string $section): array
    {
        return static::where('section', $section)
            ->pluck('value', 'key')
            ->toArray();
    }

    /**
     * Get a single value, with optional default.
     */
    public static function get(string $section, string $key, string $default = ''): string
    {
        $row = static::where('section', $section)->where('key', $key)->first();
        return $row?->value ?? $default;
    }

    /**
     * Upsert an entire section's data from an associative array.
     */
    public static function setSection(string $section, array $data): void
    {
        foreach ($data as $key => $value) {
            static::updateOrCreate(
                ['section' => $section, 'key' => $key],
                ['value'   => $value]
            );
        }
    }
}
