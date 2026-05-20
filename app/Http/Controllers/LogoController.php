<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LogoController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'logo' => 'required|file|image|mimes:png,jpg,jpeg,svg,gif|max:10240',
        ]);

        $path = $request->file('logo')->store('logos', 'public');
        $url  = Storage::disk('public')->url($path);

        return response()->json(['url' => $url]);
    }
}
