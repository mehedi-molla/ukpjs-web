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
        Schema::create('members', function (Blueprint $table) {
            $table->id();
            $table->string('legacy_id')->nullable()->unique();
            $table->string('member_no')->unique();
            $table->string('name_bn');
            $table->string('name_en')->nullable();
            $table->string('phone')->nullable();
            $table->string('whatsapp')->nullable();
            $table->string('email')->nullable();
            $table->text('address_bn')->nullable();
            $table->text('address_en')->nullable();
            $table->string('village')->nullable();
            $table->string('country')->nullable();
            $table->string('occupation_bn')->nullable();
            $table->string('occupation_en')->nullable();
            $table->string('member_type')->default('general')->index();
            $table->decimal('monthly_pledge_amount', 14, 2)->default(0);
            $table->date('joining_date')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_public_profile')->default(false)->index();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('members');
    }
};
