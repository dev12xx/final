<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->string('type');

            $table->string('status')->default('Pending');

            $table->string('subject')->nullable();
            $table->text('description');

            $table->string('location')->nullable();
            $table->string('incident_date')->nullable();

            $table->string('evidence')->nullable();

            $table->boolean('anonymous')->default(true);
            $table->string('full_name')->nullable();
            $table->string('company')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();

            $table->string('order_number')->nullable();
            $table->string('department')->nullable();
            $table->string('relation_type')->nullable();
            $table->string('employee_id')->nullable();
            $table->string('position')->nullable();
            $table->string('supervisor')->nullable();
            $table->text('persons_involved')->nullable();
            $table->string('schb_department')->nullable();

            $table->index(['status', 'created_at']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
