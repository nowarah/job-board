<?php

namespace App\Service;

use App\Entity\Job;
use App\Entity\Company;
use App\Enum\JobStatus;
use Doctrine\ORM\EntityManagerInterface;

class JobService
{
    public function __construct(
        private EntityManagerInterface $em
    ) {}

    public function buildJobFromData(array $data, Company $company, ?Job $job = null): Job
    {
        $job = $job ?? new Job();

        $job->setTitle($data['title'] ?? $job->getTitle() ?? '');
        $job->setDescription($data['description'] ?? $job->getDescription() ?? '');
        $job->setSalary($data['salary'] ?? $job->getSalary());
        $job->setLocation($data['location'] ?? $job->getLocation() ?? '');
        $job->setStatus(JobStatus::tryFrom($data['status'] ?? '') ?? $job->getStatus() ?? JobStatus::Pending);

        if ($job->getCreatedAt() === null) {
            $job->setCreatedAt(new \DateTimeImmutable());
        }

        $job->setCompany($company);

        return $job;
    }

    public function createJob(array $data, Company $company): Job
    {
        $job = $this->buildJobFromData($data, $company);
        $this->em->persist($job);
        $this->em->flush();
        return $job;
    }

    public function updateJob(array $data, Job $job): Job
    {
        $job = $this->buildJobFromData($data, $job->getCompany(), $job);
        $this->em->flush();
        return $job;
    }

    public function deleteJob(Job $job): void
    {
        $this->em->remove($job);
        $this->em->flush();
    }
}