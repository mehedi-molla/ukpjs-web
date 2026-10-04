<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donation_submissions', function (Blueprint $table): void {
            $table->id();
            $table->string('donor_name')->nullable();
            $table->string('phone', 30)->nullable();
            $table->decimal('amount', 14, 2);
            $table->string('fund_type', 50)->index();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->string('payment_method', 30);
            $table->string('reference_no')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_anonymous')->default(false);
            $table->string('status', 30)->default('pending')->index();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donation_submissions');
    }
};
