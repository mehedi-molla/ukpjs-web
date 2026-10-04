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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('legacy_id')->nullable()->unique();
            $table->string('voucher_no')->unique();
            $table->string('type')->index();
            $table->string('fund_type')->default('general_hadiya')->index();
            $table->string('category_id')->nullable()->index();
            $table->string('category_name')->nullable();
            $table->decimal('amount', 14, 2);
            $table->boolean('is_demo')->default(false)->index();
            $table->date('occurred_at')->index();
            $table->foreignId('project_id')->nullable()->constrained('projects')->nullOnDelete();
            $table->foreignId('member_id')->nullable()->constrained('members')->nullOnDelete();
            $table->string('donor_name')->nullable();
            $table->boolean('is_anonymous')->default(false);
            $table->string('payment_method')->default('cash');
            $table->string('reference_no')->nullable()->index();
            $table->text('description')->nullable();
            $table->string('paid_to')->nullable();
            $table->string('attachment_path')->nullable();
            $table->string('status')->default('completed')->index();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('correction_of_id')->nullable()->constrained('transactions')->nullOnDelete();
            $table->text('cancellation_reason')->nullable();
            $table->timestamps();
        });

        Schema::create('monthly_donations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_id')->constrained('members')->cascadeOnDelete();
            $table->unsignedTinyInteger('month');
            $table->unsignedSmallInteger('year');
            $table->decimal('expected_amount', 14, 2)->default(0);
            $table->decimal('paid_amount', 14, 2)->default(0);
            $table->date('payment_date')->nullable();
            $table->string('payment_method')->nullable();
            $table->string('voucher_no')->nullable();
            $table->string('status')->default('pending')->index();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->unique(['member_id', 'month', 'year']);
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('action')->index();
            $table->string('module')->index();
            $table->string('record_type')->nullable();
            $table->string('record_id')->nullable();
            $table->text('details')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->ipAddress('ip_address')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('monthly_donations');
        Schema::dropIfExists('transactions');
    }
};
