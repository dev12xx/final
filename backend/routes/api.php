<?php

use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\AdminAttachmentController;
use App\Http\Controllers\Api\AdminSubmissionController;
use App\Http\Controllers\Api\PublicSubmissionController;
use App\Http\Controllers\Api\PublicOtpController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json([
        'ok' => true,
        'service' => 'api',
    ]);
});

Route::post('/submissions', [PublicSubmissionController::class, 'store']);
Route::get('/submissions/{reference}', [PublicSubmissionController::class, 'show']);
Route::post('/submissions/{reference}/appeal', [PublicSubmissionController::class, 'appeal']);

Route::post('/otp/send', [PublicOtpController::class, 'send']);
Route::post('/otp/verify', [PublicOtpController::class, 'verify']);

Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/me', [AdminAuthController::class, 'me'])->middleware('auth:sanctum');

    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::get('/submissions', [AdminSubmissionController::class, 'index']);
        Route::get('/submissions/{reference}', [AdminSubmissionController::class, 'show']);
        Route::patch('/submissions/{reference}/status', [AdminSubmissionController::class, 'updateStatus']);
        Route::get('/attachments/{attachment}', [AdminAttachmentController::class, 'show']);
    });
});
