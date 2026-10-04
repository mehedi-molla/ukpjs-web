<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blood_donors', function (Blueprint $table): void {
            $table->id();
            $table->string('legacy_id')->nullable()->unique();
            $table->string('name_bn');
            $table->string('name_en')->nullable();
            $table->string('blood_group', 5)->index();
            $table->string('area_bn')->nullable();
            $table->string('area_en')->nullable();
            $table->string('phone', 30)->nullable();
            $table->date('last_donation_date')->nullable();
            $table->boolean('is_available')->default(true)->index();
            $table->boolean('is_public')->default(false)->index();
            $table->boolean('is_verified')->default(false)->index();
            $table->boolean('is_demo')->default(false)->index();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blood_donors');
    }
};
