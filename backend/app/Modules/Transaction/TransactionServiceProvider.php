<?php

namespace App\Modules\Transaction;

use App\Modules\Transaction\Repositories\Interfaces\TransactionRepositoryInterface;
use App\Modules\Transaction\Repositories\TransactionRepository;
use Carbon\Laravel\ServiceProvider;
use Illuminate\Support\Facades\Route;


class TransactionServiceProvider extends ServiceProvider
{
    public function boot():void
    {
        Route::group([], __DIR__ . '/routes.php');
    }

    public function register():void
    {
        $this->app->bind(
            TransactionRepositoryInterface::class,
            TransactionRepository::class
        );
    }
}