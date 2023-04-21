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
        Schema::create('cashflows', function (Blueprint $table) {
            $table->id();
            $table->string('description');
            $table->unsignedDecimal('amount', 19, 2)->default(0);
            $table->unsignedBigInteger('balance_id')->nullable();
            $table->string('type')->default('inflow');
            $table->unsignedDecimal('amount_balance_before', 19, 2)->default(0);
            $table->unsignedDecimal('amount_balance_after', 19, 2)->default(0);
            $table->foreign('balance_id')->references('id')->on('balances')
                ->restrictOnDelete()
                ->restrictOnUpdate();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cashflows');
    }
};
