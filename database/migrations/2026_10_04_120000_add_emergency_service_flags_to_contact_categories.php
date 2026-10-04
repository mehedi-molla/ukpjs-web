<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_categories', function (Blueprint $table): void {
            $table->boolean('is_emergency_service')->default(false)->index()->after('is_core');
            $table->boolean('is_home_featured')->default(false)->after('is_emergency_service');
        });
    }

    public function down(): void
    {
        Schema::table('contact_categories', function (Blueprint $table): void {
            $table->dropIndex(['is_emergency_service']);
            $table->dropColumn(['is_emergency_service', 'is_home_featured']);
        });
    }
};
