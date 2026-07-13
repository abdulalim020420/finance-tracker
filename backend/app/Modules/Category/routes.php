<?php

namespace App\Modules\Category;

use Illuminate\Support\Facades\Route;
use App\Modules\Category\Controllers\CategoryController;

Route::prefix('api/v1')
    ->middleware(['api', 'auth:sanctum'])
    ->group(function (){
        Route::apiResource('categories', CategoryController::class)
        ->only(['index', 'store', 'update', 'destroy']);
    });