<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PublicOtpController extends Controller
{
    public function send(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $email = $data['email'];

        $code = (string) random_int(100000, 999999);
        $token = Str::random(40);

        Cache::put('otp:pending:'.$token, [
            'email' => $email,
            'code_hash' => Hash::make($code),
        ], now()->addMinutes(10));

        Mail::raw('Your verification code is: '.$code, function ($message) use ($email) {
            $message->to($email)->subject('Verification code');
        });

        return response()->json([
            'ok' => true,
            'token' => $token,
        ]);
    }

    public function verify(Request $request)
    {
        $data = $request->validate([
            'token' => ['required', 'string'],
            'code' => ['required', 'string'],
        ]);

        $token = $data['token'];
        $code = preg_replace('/\D/', '', $data['code']);

        $pending = Cache::get('otp:pending:'.$token);
        if (! is_array($pending) || empty($pending['code_hash']) || empty($pending['email'])) {
            return response()->json(['message' => 'Invalid or expired code'], 422);
        }

        if (! Hash::check($code, $pending['code_hash'])) {
            return response()->json(['message' => 'Invalid or expired code'], 422);
        }

        Cache::forget('otp:pending:'.$token);

        Cache::put('otp:verified:'.$token, [
            'email' => $pending['email'],
            'verified' => true,
        ], now()->addMinutes(30));

        return response()->json([
            'ok' => true,
        ]);
    }
}
