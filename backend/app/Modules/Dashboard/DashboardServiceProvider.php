<?php

namespace App\Modules\Dashboard;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Override;

class DashboardServiceProvider extends ServiceProvider
{
    public function boot():void
    {
        Route::group([], __DIR__ . '/routes.php');
    }

    #[Override]
    public function register():void
    {
        //
    }
}