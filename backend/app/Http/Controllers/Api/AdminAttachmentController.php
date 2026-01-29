<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SubmissionAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminAttachmentController extends Controller
{
    public function show(Request $request, SubmissionAttachment $attachment)
    {
        $path = $attachment->path;

        if (! $path || ! Storage::exists($path)) {
            abort(404);
        }

        $download = $request->boolean('download', false);
        $disposition = $download ? 'attachment' : 'inline';
        $fileName = $attachment->original_name ?: basename($path);

        $headers = [
            'Content-Type' => $attachment->mime_type ?: 'application/octet-stream',
            'Content-Disposition' => $disposition.'; filename="'.$fileName.'"',
        ];

        return response()->file(Storage::path($path), $headers);
    }
}
