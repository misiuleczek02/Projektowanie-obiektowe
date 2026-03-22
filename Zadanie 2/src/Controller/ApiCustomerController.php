<?php

namespace App\Controller;

use App\Entity\Customer;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/customers', name: 'api_customers_')]
class ApiCustomerController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(EntityManagerInterface $em): JsonResponse
    {
        $customers = $em->getRepository(Customer::class)->findAll();
        $data = [];

        foreach ($customers as $customer) {
            $data[] = [
                'id' => $customer->getId(),
                'firstName' => $customer->getFirstName(),
                'lastName' => $customer->getLastName(),
                'email' => $customer->getEmail(),
            ];
        }

        return $this->json($data);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $content = json_decode($request->getContent(), true);

        $customer = new Customer();
        $customer->setFirstName($content['firstName'] ?? 'Brak');
        $customer->setLastName($content['lastName'] ?? 'Brak');
        $customer->setEmail($content['email'] ?? 'brak@email.com');

        $em->persist($customer);
        $em->flush();

        return $this->json([
            'id' => $customer->getId(),
            'firstName' => $customer->getFirstName(),
            'lastName' => $customer->getLastName(),
            'email' => $customer->getEmail(),
        ], 201);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id, EntityManagerInterface $em): JsonResponse
    {
        $customer = $em->getRepository(Customer::class)->find($id);

        if (!$customer) {
            return $this->json(['message' => 'Nie znaleziono klienta'], 404);
        }

        return $this->json([
            'id' => $customer->getId(),
            'firstName' => $customer->getFirstName(),
            'lastName' => $customer->getLastName(),
            'email' => $customer->getEmail(),
        ]);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT'])]
    public function update(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $customer = $em->getRepository(Customer::class)->find($id);

        if (!$customer) {
            return $this->json(['message' => 'Nie znaleziono klienta'], 404);
        }

        $content = json_decode($request->getContent(), true);

        if (isset($content['firstName'])) $customer->setFirstName($content['firstName']);
        if (isset($content['lastName'])) $customer->setLastName($content['lastName']);
        if (isset($content['email'])) $customer->setEmail($content['email']);

        $em->flush();

        return $this->json([
            'id' => $customer->getId(),
            'firstName' => $customer->getFirstName(),
            'lastName' => $customer->getLastName(),
            'email' => $customer->getEmail(),
        ]);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $em): JsonResponse
    {
        $customer = $em->getRepository(Customer::class)->find($id);

        if (!$customer) {
            return $this->json(['message' => 'Nie znaleziono klienta'], 404);
        }

        $em->remove($customer);
        $em->flush();

        return $this->json(['message' => 'Klient usunięty pomyślnie']);
    }
}