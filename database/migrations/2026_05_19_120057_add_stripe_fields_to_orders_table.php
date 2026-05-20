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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('payment_intent_id')->nullable()->after('payment_status');
            $table->string('payment_method_type')->nullable()->after('payment_intent_id');
            $table->string('currency', 3)->default('AUD')->after('payment_method_type');
            $table->text('customer_notes')->nullable()->after('currency');
            $table->timestamp('paid_at')->nullable()->after('customer_notes');
            $table->timestamp('shipped_at')->nullable()->after('paid_at');
            $table->timestamp('completed_at')->nullable()->after('shipped_at');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['payment_intent_id','payment_method_type','currency','customer_notes','paid_at','shipped_at','completed_at']);
        });
    }
};
