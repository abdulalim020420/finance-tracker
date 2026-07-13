<?php

namespace App\Modules\Dashboard\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Dashboard\Services\DashboardService;
use App\Modules\Shared\Responses\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboardService
    )
    {}

    public function summary(Request $request) : JsonResponse
    {
        $month = $request->query('month', now()->format('Y-m'));

        $summary = $this->dashboardService->getSummary(
            $request->user()->id,
            $month
        );

        return ApiResponse::success($summary, 'Dashboard summary retrieved');
    }
}