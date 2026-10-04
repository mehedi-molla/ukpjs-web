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
        Schema::create('contact_categories', function (Blueprint $table) {
            $table->id();
            $table->string('legacy_id')->nullable()->unique();
            $table->string('slug')->unique();
            $table->string('name_bn');
            $table->string('name_en')->nullable();
            $table->string('icon')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true)->index();
            $table->boolean('is_core')->default(false);
            $table->text('description_bn')->nullable();
            $table->text('description_en')->nullable();
            $table->timestamps();
        });

        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('legacy_id')->nullable()->unique();
            $table->foreignId('category_id')->nullable()->constrained('contact_categories')->nullOnDelete();
            $table->string('name_bn');
            $table->string('name_en')->nullable();
            $table->string('designation_bn')->nullable();
            $table->string('designation_en')->nullable();
            $table->string('union_name')->nullable();
            $table->string('ward')->nullable();
            $table->string('area')->nullable();
            $table->string('phone')->nullable();
            $table->string('alt_phone')->nullable();
            $table->string('whatsapp')->nullable();
            $table->text('address_bn')->nullable();
            $table->text('address_en')->nullable();
            $table->text('description_bn')->nullable();
            $table->text('description_en')->nullable();
            $table->string('photo_path')->nullable();
            $table->string('vehicle_photo_path')->nullable();
            $table->string('service_area')->nullable();
            $table->string('availability')->nullable();
            $table->boolean('is_emergency')->default(false)->index();
            $table->boolean('is_verified')->default(false)->index();
            $table->date('last_verified_at')->nullable();
            $table->boolean('is_published')->default(false)->index();
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_demo')->default(false)->index();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        Schema::create('notices', function (Blueprint $table) {
            $table->id();
            $table->string('legacy_id')->nullable()->unique();
            $table->string('title_bn');
            $table->string('title_en')->nullable();
            $table->longText('content_bn')->nullable();
            $table->longText('content_en')->nullable();
            $table->date('publish_date')->nullable()->index();
            $table->boolean('is_pinned')->default(false)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('website_settings', function (Blueprint $table) {
            $table->id();
            $table->string('org_name_bn');
            $table->string('org_name_en');
            $table->string('slogan_bn')->nullable();
            $table->string('slogan_en')->nullable();
            $table->unsignedSmallInteger('established_year')->nullable();
            $table->string('logo_path')->nullable();
            $table->text('address_bn')->nullable();
            $table->text('address_en')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('whatsapp_number')->nullable();
            $table->string('facebook_url')->nullable();
            $table->string('youtube_url')->nullable();
            $table->longText('mission_bn')->nullable();
            $table->longText('mission_en')->nullable();
            $table->longText('vision_bn')->nullable();
            $table->longText('vision_en')->nullable();
            $table->longText('about_history_bn')->nullable();
            $table->longText('about_history_en')->nullable();
            $table->longText('donation_instructions_bn')->nullable();
            $table->longText('donation_instructions_en')->nullable();
            $table->string('bkash_number')->nullable();
            $table->string('nagad_number')->nullable();
            $table->string('rocket_number')->nullable();
            $table->text('bank_account_details')->nullable();
            $table->string('currency_symbol', 10)->default('৳');
            $table->boolean('is_public_transparency_enabled')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('website_settings');
        Schema::dropIfExists('notices');
        Schema::dropIfExists('contacts');
        Schema::dropIfExists('contact_categories');
    }
};
