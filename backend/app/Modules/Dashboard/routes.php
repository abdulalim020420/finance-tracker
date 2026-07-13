<?php

namespace App\Modules\Dashboard;

use App\Modules\Dashboard\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::prefix('api/v1')
    ->middleware(['api', 'auth:sanctum'])
    ->group(function () {
        Route::get('/dashboard/summary', [DashboardController::class, 'summary']);
    });