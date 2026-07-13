<?php

namespace App\Modules\Category\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Category\Requests\StoreCategoryRequest;
use App\Modules\Category\Requests\UpdateCategoryRequest;
use App\Modules\Category\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Modules\Shared\Response\ApiResponse;

class CategoryController extends Controller
{
    public function __construct(
        public readonly CategoryService $categoryService
    ){}

    public function index(Request $request): JsonResponse
    {
        $categories = $this->categoryService->getAll($request->user()->id);

        return ApiResponse::success($categories, 'Categories Retreived');
    }

    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->create(
            $request->validated(),
            $request->user()->id
        );
        return ApiResponse::success($category, 'Category Created', 201);
    }

    public function update(UpdateCategoryRequest $request, int $id): JsonResponse
    {
        $category = $this->categoryService->update(
            $id,
            $request->validated(),
            $request->user()->id);
        return ApiResponse::success($category, 'Category Updated');
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->categoryService->delete(
            $id,
            $request->user()->id);
        
        return ApiResponse::success(null, 'Category Deleted');
    }

}