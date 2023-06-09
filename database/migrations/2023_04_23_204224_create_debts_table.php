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
        Schema::create('debts', function (Blueprint $table) {
            $table->id();
            $table->string('description')->nullable();
            $table->boolean("is_pay")->default(false);
            $table->unsignedDecimal('debt_amount', 19, 2)->default(0);
            $table->decimal('debt_before', 19, 2)->default(0);
            $table->decimal('debt_after', 19, 2)->default(0);
            $table->unsignedBigInteger('debter_id')->nullable();
            $table->foreign('debter_id')->references('id')->on('debters')
                ->nullOnDelete()
                ->restrictOnUpdate();
            $table->unsignedBigInteger('balance_id')->nullable();
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
        Schema::dropIfExists('debts');
    }
};
