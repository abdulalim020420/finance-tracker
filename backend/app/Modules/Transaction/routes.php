<?php

namespace App\Modules\Transaction;

use App\Modules\Transaction\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

Route::prefix('api/v1')
    ->middleware(['api', 'auth:sanctum'])
    ->group(function() {
        Route::apiResource('transactions', TransactionController::class)
            ->only(['index', 'store', 'update', 'destroy']);
    });