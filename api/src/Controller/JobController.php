<?php

namespace App\Controller;

use App\Repository\CompanyRepository;
use App\Repository\JobRepository;
use App\Service\JobService;
use App\Trait\ValidationTrait;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use App\Enum\JobStatus;

#[Route('/api/jobs')]
class JobController extends AbstractController
{
    use ValidationTrait;

    #[Route('', methods: ['GET'])]
    public function index(Request $request, JobRepository $repository): JsonResponse
    {
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 10);
        $offset = ($page - 1) * $limit;

        $filters = [];

        if ($location = $request->query->get('location')) {
            $filters['location'] = $location;
        }

        if ($status = $request->query->get('status')) {
            $filters['status'] = JobStatus::tryFrom($status);
        }
        $jobs = $repository->findByFilters($filters, $limit, $offset);
        $total = count($repository->findAll());

        return $this->json([
            'data' => array_map(fn($job) => $job->toArray(), $jobs),
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
        ]);
    }

    #[Route('/locations', methods: ['GET'])]
    public function locations(JobRepository $repository): JsonResponse
    {
        return $this->json($repository->findDistinctLocations());
    }
    
    #[Route('/{id}', methods: ['GET'])]
    public function show(int $id, JobRepository $repository): JsonResponse
    {
        $job = $repository->find($id);

        if (!$job) {
            return $this->json(['message' => 'Job not found'], 404);
        }

        return $this->json($job->toArray());
    }

    #[Route('', methods: ['POST'])]
    public function create(Request $request, CompanyRepository $companyRepository, JobService $jobService, ValidatorInterface $validator): JsonResponse
    {
        $this->denyAccessUnlessGranted('ROLE_USER');
        $data = json_decode($request->getContent(), true);

        $company = $companyRepository->find($data['company_id'] ?? null);

        if (!$company) {
            return $this->json(['message' => 'Company not found'], 404);
        }

        $job = $jobService->buildJobFromData($data, $company);

        $errors = $validator->validate($job);
        if (count($errors) > 0) {
            return $this->formatValidationErrors($errors);
        }

        $jobService->createJob($data, $company);

        return $this->json(['message' => 'Job created!', 'id' => $job->getId()], 201);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(int $id, Request $request, JobRepository $repository, JobService $jobService, ValidatorInterface $validator): JsonResponse
    {
        $job = $repository->find($id);

        if (!$job) {
            return $this->json(['message' => 'Job not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $updatedJob = $jobService->buildJobFromData($data, $job->getCompany(), $job);

        $errors = $validator->validate($updatedJob);
        if (count($errors) > 0) {
            return $this->formatValidationErrors($errors);
        }

        $jobService->updateJob($data, $job);

        return $this->json(['message' => 'Job updated!']);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(int $id, JobRepository $repository, JobService $jobService): JsonResponse
    {
        $job = $repository->find($id);

        if (!$job) {
            return $this->json(['message' => 'Job not found'], 404);
        }

        $jobService->deleteJob($job);

        return $this->json(['message' => 'Job deleted!']);
    }
}