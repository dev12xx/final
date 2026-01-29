<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appeal;
use App\Models\Submission;
use App\Models\SubmissionAttachment;
use App\Models\SubmissionStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class PublicSubmissionController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', 'string'],
            'subject' => ['nullable', 'string'],
            'description' => ['required', 'string'],
            'location' => ['nullable', 'string'],
            'incidentDate' => ['nullable', 'string'],
            'anonymous' => ['nullable', 'boolean'],
            'fullName' => ['nullable', 'string'],
            'company' => ['nullable', 'string'],
            'phone' => ['nullable', 'string'],
            'email' => ['nullable', 'email'],
            'otp_token' => ['nullable', 'string'],
            'orderNumber' => ['nullable', 'string'],
            'department' => ['nullable', 'string'],
            'relationType' => ['nullable', 'string'],
            'employeeId' => ['nullable', 'string'],
            'position' => ['nullable', 'string'],
            'supervisor' => ['nullable', 'string'],
            'personsInvolved' => ['nullable', 'string'],
            'schbDepartment' => ['nullable', 'string'],

            'evidence' => ['nullable', 'string'],
            'evidence_file' => ['nullable', 'file', 'max:10240'],
        ]);

        if (! empty($data['email'])) {
            $token = $data['otp_token'] ?? null;
            $verified = is_string($token) && $token !== '' ? Cache::get('otp:verified:'.$token) : null;

            if (! is_array($verified) || empty($verified['verified']) || ($verified['email'] ?? null) !== $data['email']) {
                return response()->json(['message' => 'Email verification required'], 422);
            }
        }

        $reference = $this->generateReference();

        $submission = Submission::create([
            'reference' => $reference,
            'type' => $data['type'],
            'status' => 'Pending',
            'subject' => $data['subject'] ?? null,
            'description' => $data['description'],
            'location' => $data['location'] ?? null,
            'incident_date' => $data['incidentDate'] ?? null,
            'anonymous' => array_key_exists('anonymous', $data) ? (bool) $data['anonymous'] : true,
            'full_name' => $data['fullName'] ?? null,
            'company' => $data['company'] ?? null,
            'phone' => $data['phone'] ?? null,
            'email' => $data['email'] ?? null,
            'order_number' => $data['orderNumber'] ?? null,
            'department' => $data['department'] ?? null,
            'relation_type' => $data['relationType'] ?? null,
            'employee_id' => $data['employeeId'] ?? null,
            'position' => $data['position'] ?? null,
            'supervisor' => $data['supervisor'] ?? null,
            'persons_involved' => $data['personsInvolved'] ?? null,
            'schb_department' => $data['schbDepartment'] ?? null,
            'evidence' => $data['evidence'] ?? null,
        ]);

        if ($request->hasFile('evidence_file')) {
            $file = $request->file('evidence_file');
            $storedPath = $file->storeAs(
                'private/submissions/'.$submission->reference,
                Str::random(12).'-'.$file->getClientOriginalName()
            );

            SubmissionAttachment::create([
                'submission_id' => $submission->id,
                'original_name' => $file->getClientOriginalName(),
                'path' => $storedPath,
                'mime_type' => $file->getClientMimeType(),
                'size' => $file->getSize(),
            ]);

            $submission->update(['evidence' => $file->getClientOriginalName()]);
        }

        SubmissionStatusHistory::create([
            'submission_id' => $submission->id,
            'from_status' => null,
            'to_status' => 'Pending',
            'changed_by' => null,
            'note' => 'Submission created',
        ]);

        return response()->json([
            'id' => $submission->reference,
            'reference' => $submission->reference,
            'status' => $submission->status,
        ], 201);
    }

    public function show(string $reference)
    {
        $submission = Submission::query()
            ->where('reference', $reference)
            ->with('appeal')
            ->firstOrFail();

        return response()->json($this->toFrontendSubmission($submission));
    }

    public function appeal(Request $request, string $reference)
    {
        $submission = Submission::query()
            ->where('reference', $reference)
            ->with('appeal')
            ->firstOrFail();

        if ($submission->status !== 'Declined') {
            return response()->json(['message' => 'Appeal not allowed for this submission'], 422);
        }

        if ($submission->appeal) {
            return response()->json(['message' => 'Appeal already submitted'], 422);
        }

        $data = $request->validate([
            'reason' => ['required', 'string'],
            'evidence' => ['nullable', 'string'],
            'evidence_file' => ['nullable', 'file', 'max:10240'],
        ]);

        $attachmentId = null;
        $evidenceName = $data['evidence'] ?? null;

        if ($request->hasFile('evidence_file')) {
            $file = $request->file('evidence_file');
            $storedPath = $file->storeAs(
                'private/submissions/'.$submission->reference.'/appeal',
                Str::random(12).'-'.$file->getClientOriginalName()
            );

            $attachment = SubmissionAttachment::create([
                'submission_id' => $submission->id,
                'original_name' => $file->getClientOriginalName(),
                'path' => $storedPath,
                'mime_type' => $file->getClientMimeType(),
                'size' => $file->getSize(),
            ]);

            $attachmentId = $attachment->id;
            $evidenceName = $file->getClientOriginalName();
        }

        Appeal::create([
            'submission_id' => $submission->id,
            'reason' => $data['reason'],
            'evidence_attachment_id' => $attachmentId,
        ]);

        $fromStatus = $submission->status;
        $submission->update(['status' => 'Appeal']);

        SubmissionStatusHistory::create([
            'submission_id' => $submission->id,
            'from_status' => $fromStatus,
            'to_status' => 'Appeal',
            'changed_by' => null,
            'note' => 'Appeal submitted',
        ]);

        return response()->json([
            'ok' => true,
            'reference' => $submission->reference,
            'status' => $submission->status,
            'appealData' => [
                'reason' => $data['reason'],
                'evidence' => $evidenceName,
                'date' => now()->toDateString(),
            ],
        ]);
    }

    private function generateReference(): string
    {
        do {
            $reference = 'REF-'.random_int(1000, 9999);
        } while (Submission::query()->where('reference', $reference)->exists());

        return $reference;
    }

    private function toFrontendSubmission(Submission $submission): array
    {
        $appealData = null;
        if ($submission->appeal) {
            $appealEvidence = null;
            if ($submission->appeal->evidence_attachment_id) {
                $appealEvidence = SubmissionAttachment::query()
                    ->where('id', $submission->appeal->evidence_attachment_id)
                    ->value('original_name');
            }

            $appealData = [
                'reason' => $submission->appeal->reason,
                'evidence' => $appealEvidence,
                'date' => optional($submission->appeal->created_at)->toDateString(),
            ];
        }

        return [
            'id' => $submission->reference,
            'type' => $submission->type,
            'dateSubmitted' => optional($submission->created_at)->toDateString(),
            'status' => $submission->status,
            'subject' => $submission->subject,
            'description' => $submission->description,
            'location' => $submission->location,
            'incidentDate' => $submission->incident_date,
            'anonymous' => $submission->anonymous,
            'fullName' => $submission->full_name,
            'company' => $submission->company,
            'phone' => $submission->phone,
            'email' => $submission->email,
            'orderNumber' => $submission->order_number,
            'department' => $submission->department,
            'relationType' => $submission->relation_type,
            'employeeId' => $submission->employee_id,
            'position' => $submission->position,
            'supervisor' => $submission->supervisor,
            'personsInvolved' => $submission->persons_involved,
            'schbDepartment' => $submission->schb_department,
            'evidence' => $submission->evidence,
            'appealData' => $appealData,
        ];
    }
}
