<?php

use App\Providers\AppServiceProvider;
use App\Modules\Auth\AuthServiceProvider;
use App\Modules\Category\CategoryServiceProvider;
use App\Modules\Transaction\TransactionServiceProvider;
use App\Modules\Dashboard\DashboardServiceProvider;

return [
    AppServiceProvider::class,
    AuthServiceProvider::class,
    CategoryServiceProvider::class,
    TransactionServiceProvider::class,
    DashboardServiceProvider::class,
];
