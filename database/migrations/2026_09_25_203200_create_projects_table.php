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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('legacy_id')->nullable()->unique();
            $table->string('code')->unique();
            $table->string('slug')->unique();
            $table->string('title_bn');
            $table->string('title_en')->nullable();
            $table->string('category')->nullable()->index();
            $table->text('short_desc_bn')->nullable();
            $table->text('short_desc_en')->nullable();
            $table->longText('full_desc_bn')->nullable();
            $table->longText('full_desc_en')->nullable();
            $table->string('featured_image')->nullable();
            $table->json('gallery_images')->nullable();
            $table->string('video_url')->nullable();
            $table->date('start_date')->nullable();
            $table->date('estimated_end_date')->nullable();
            $table->date('actual_end_date')->nullable();
            $table->decimal('estimated_budget', 14, 2)->default(0);
            $table->string('status')->default('upcoming')->index();
            $table->string('location')->nullable();
            $table->json('responsible_members')->nullable();
            $table->unsignedInteger('beneficiaries_count')->nullable();
            $table->text('beneficiary_info_bn')->nullable();
            $table->text('beneficiary_info_en')->nullable();
            $table->boolean('is_published')->default(false)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->text('completion_outcome_bn')->nullable();
            $table->text('completion_outcome_en')->nullable();
            $table->boolean('is_demo')->default(false)->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
