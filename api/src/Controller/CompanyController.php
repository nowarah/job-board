<?php

namespace App\Controller;

use App\Entity\Company;
use App\Repository\CompanyRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/companies')]
class CompanyController extends AbstractController
{
    #[Route('', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $company = new Company();
        $company->setName($data['name']);
        $company->setEmail($data['email']);
        $company->setLocation($data['location']);

        $em->persist($company);
        $em->flush();

        return $this->json(['message' => 'Company created!', 'id' => $company->getId()], 201);
    }

    #[Route('', methods: ['GET'])]
    public function index(CompanyRepository $repository): JsonResponse
    {
        $companies = $repository->findAll();
        return $this->json(array_map(fn($company) => [
            'id' => $company->getId(),
            'name' => $company->getName(),
        ], $companies));
    }
}