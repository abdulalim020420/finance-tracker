<?php

namespace App\Modules\Category;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use App\Modules\Category\Repositories\CategoryRepository;
use App\Modules\Category\Repositories\Interfaces\CategoryRepositoryInterface;

class CategoryServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Route::group([], __DIR__ . '/routes.php');
    }

    public function register()
    {
        $this->app->bind(
            CategoryRepositoryInterface::class,
            CategoryRepository::class
        );
    }
}