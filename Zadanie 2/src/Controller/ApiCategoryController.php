<?php

namespace App\Controller;

use App\Entity\Category;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/categories', name: 'api_categories_')]
class ApiCategoryController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(EntityManagerInterface $em): JsonResponse
    {
        $categories = $em->getRepository(Category::class)->findAll();
        $data = [];

        foreach ($categories as $category) {
            $data[] = [
                'id' => $category->getId(),
                'name' => $category->getName(),
            ];
        }

        return $this->json($data);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $content = json_decode($request->getContent(), true);

        $category = new Category();
        $category->setName($content['name'] ?? 'Brak nazwy');

        $em->persist($category);
        $em->flush();

        return $this->json([
            'id' => $category->getId(),
            'name' => $category->getName(),
        ], 201);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id, EntityManagerInterface $em): JsonResponse
    {
        $category = $em->getRepository(Category::class)->find($id);

        if (!$category) {
            return $this->json(['message' => 'Nie znaleziono kategorii'], 404);
        }

        return $this->json([
            'id' => $category->getId(),
            'name' => $category->getName(),
        ]);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $category = $em->getRepository(Category::class)->find($id);

        if (!$category) {
            return $this->json(['message' => 'Nie znaleziono kategorii'], 404);
        }

        $content = json_decode($request->getContent(), true);

        if (isset($content['name'])) {
            $category->setName($content['name']);
        }

        $em->flush();

        return $this->json([
            'id' => $category->getId(),
            'name' => $category->getName(),
        ]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $em): JsonResponse
    {
        $category = $em->getRepository(Category::class)->find($id);

        if (!$category) {
            return $this->json(['message' => 'Nie znaleziono kategorii'], 404);
        }

        $em->remove($category);
        $em->flush();

        return $this->json(['message' => 'Kategoria usunięta pomyślnie']);
    }
}