<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $fillable = [
        'reference',
        'type',
        'status',
        'subject',
        'description',
        'location',
        'incident_date',
        'evidence',
        'anonymous',
        'full_name',
        'company',
        'phone',
        'email',
        'order_number',
        'department',
        'relation_type',
        'employee_id',
        'position',
        'supervisor',
        'persons_involved',
        'schb_department',
    ];

    protected $casts = [
        'anonymous' => 'boolean',
    ];

    public function attachments(): HasMany
    {
        return $this->hasMany(SubmissionAttachment::class);
    }

    public function appeal(): HasOne
    {
        return $this->hasOne(Appeal::class);
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(SubmissionStatusHistory::class);
    }
}
