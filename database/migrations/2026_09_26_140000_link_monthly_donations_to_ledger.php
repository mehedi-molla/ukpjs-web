<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('monthly_donations', function (Blueprint $table): void {
            $table->foreignId('transaction_id')->nullable()->unique()->after('member_id')->constrained('transactions')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('monthly_donations', function (Blueprint $table): void {
            $table->dropForeign(['transaction_id']);
            $table->dropUnique(['transaction_id']);
            $table->dropColumn('transaction_id');
        });
    }
};
