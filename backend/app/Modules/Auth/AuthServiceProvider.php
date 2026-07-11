<?php

namespace App\Modules\Auth;


use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider 
{
    public function boot():void
    {
        Route::prefix('api/v1')
            ->middleware('api')
            ->group(__DIR__ . '/routes.php');
    }

    public function register():void
    {
        //
    }
}