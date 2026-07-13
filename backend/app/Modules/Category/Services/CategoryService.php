<?php

namespace App\Modules\Category\Services;

use App\Modules\Category\Models\Category;
use App\Modules\Category\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Exceptions\HttpResponseException;
use App\Modules\Shared\Responses\ApiResponse;

class CategoryService
{
    public function __construct(
        private readonly CategoryRepositoryInterface $categoryRepository
    ) {}

    public function getAll (int $userId): Collection
    {
        return $this->categoryRepository->getAllByUser($userId);
    }

    public function create (array $data, int $userId): Category
    {
        
        return $this->categoryRepository->create([
            ...$data,
            'user_id' => $userId,
        ]);
    }

    public function update (int $id, array $data, int $userId): Category
    {
        $category = $this->findOrFail($id, $userId);
        return $this->categoryRepository->update($category, $data);
    }

    public function delete (int $id, int $userId) : void
    {
        $category = $this->findOrFail($id, $userId);
        $this->categoryRepository->delete($category);
    }

    public function findOrFail(int $id, int $userId): Category
    {
        $category = $this->categoryRepository->findByUser($id, $userId);

        if (!$category){
            throw new HttpResponseException(
                ApiResponse::error('Category Not Found', 404)
            );
        }
        return $category;
    }


}