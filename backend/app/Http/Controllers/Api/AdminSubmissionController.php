<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Submission;
use App\Models\SubmissionAttachment;
use App\Models\SubmissionStatusHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class AdminSubmissionController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status');

        $query = Submission::query()->with('appeal');

        if (is_string($status) && $status !== '' && $status !== 'all') {
            $query->where('status', $status);
        }

        $submissions = $query->orderByDesc('created_at')->get();

        return response()->json([
            'data' => $submissions->map(fn (Submission $s) => $this->toFrontendSubmission($s))->values(),
        ]);
    }

    public function show(string $reference)
    {
        $submission = Submission::query()
            ->where('reference', $reference)
            ->with('appeal')
            ->firstOrFail();

        return response()->json($this->toFrontendSubmission($submission));
    }

    public function updateStatus(Request $request, string $reference)
    {
        $data = $request->validate([
            'status' => ['required', 'in:Pending,Accepted,Declined,Appeal'],
            'note' => ['nullable', 'string'],
        ]);

        $submission = Submission::query()
            ->where('reference', $reference)
            ->firstOrFail();

        $fromStatus = $submission->status;
        $submission->update([
            'status' => $data['status'],
        ]);

        SubmissionStatusHistory::create([
            'submission_id' => $submission->id,
            'from_status' => $fromStatus,
            'to_status' => $data['status'],
            'changed_by' => $request->user()?->id,
            'note' => $data['note'] ?? null,
        ]);

        return response()->json([
            'ok' => true,
            'submission' => $this->toFrontendSubmission($submission->fresh(['appeal'])),
        ]);
    }

    private function toFrontendSubmission(Submission $submission): array
    {
        $evidenceAttachment = SubmissionAttachment::query()
            ->where('submission_id', $submission->id)
            ->where('path', 'not like', '%/appeal/%')
            ->orderByDesc('created_at')
            ->first();

        $evidenceAttachmentData = null;
        if ($evidenceAttachment) {
            $evidenceAttachmentData = [
                'id' => $evidenceAttachment->id,
                'name' => $evidenceAttachment->original_name,
                'mimeType' => $evidenceAttachment->mime_type,
                'url' => URL::to('/api/admin/attachments/'.$evidenceAttachment->id),
                'downloadUrl' => URL::to('/api/admin/attachments/'.$evidenceAttachment->id.'?download=1'),
            ];
        }

        $appealData = null;
        if ($submission->appeal) {
            $appealEvidence = null;
            if ($submission->appeal->evidence_attachment_id) {
                $appealEvidence = SubmissionAttachment::query()
                    ->where('id', $submission->appeal->evidence_attachment_id)
                    ->value('original_name');
            }

            $appealAttachmentData = null;
            if ($submission->appeal->evidence_attachment_id) {
                $appealAttachment = SubmissionAttachment::query()
                    ->where('id', $submission->appeal->evidence_attachment_id)
                    ->first();

                if ($appealAttachment) {
                    $appealAttachmentData = [
                        'id' => $appealAttachment->id,
                        'name' => $appealAttachment->original_name,
                        'mimeType' => $appealAttachment->mime_type,
                        'url' => URL::to('/api/admin/attachments/'.$appealAttachment->id),
                        'downloadUrl' => URL::to('/api/admin/attachments/'.$appealAttachment->id.'?download=1'),
                    ];
                }
            }

            $appealData = [
                'reason' => $submission->appeal->reason,
                'evidence' => $appealEvidence,
                'evidenceAttachment' => $appealAttachmentData,
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
            'evidenceAttachment' => $evidenceAttachmentData,
            'appealData' => $appealData,
        ];
    }
}
