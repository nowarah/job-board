<?php

namespace App\DataFixtures;

use App\Entity\Company;
use App\Entity\Job;
use App\Enum\JobStatus;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $companies = [
            ['name' => 'Aircury', 'email' => 'hello@aircury.com', 'location' => 'Granada'],
            ['name' => 'Liferay', 'email' => 'jobs@liferay.com', 'location' => 'Madrid'],
            ['name' => 'Tugo', 'email' => 'careers@tugo.com', 'location' => 'Málaga'],
            ['name' => 'Sngular', 'email' => 'jobs@sngular.com', 'location' => 'Bilbao'],
        ];

        foreach ($companies as $i => $data) {
            $company = new Company();
            $company->setName($data['name']);
            $company->setEmail($data['email']);
            $company->setLocation($data['location']);
            $manager->persist($company);
            $this->addReference('company_' . $i, $company);
        }

        $jobs = [
            ['title' => 'Backend Developer', 'description' => 'Symfony and PHP expert needed', 'salary' => 32000, 'location' => 'Granada', 'status' => JobStatus::Active, 'company' => 0],
            ['title' => 'Frontend Developer', 'description' => 'React and Next.js expert needed', 'salary' => 30000, 'location' => 'Granada', 'status' => JobStatus::Active, 'company' => 0],
            ['title' => 'Full Stack Developer', 'description' => 'Next.js and Symfony full stack role', 'salary' => 38000, 'location' => 'Madrid', 'status' => JobStatus::Active, 'company' => 1],
            ['title' => 'DevOps Engineer', 'description' => 'AWS and Docker experience required', 'salary' => 45000, 'location' => 'Madrid', 'status' => JobStatus::Pending, 'company' => 1],
            ['title' => 'Mobile Developer', 'description' => 'React Native for iOS and Android', 'salary' => 35000, 'location' => 'Málaga', 'status' => JobStatus::Active, 'company' => 2],
            ['title' => 'UI/UX Designer', 'description' => 'Figma and user research skills needed', 'salary' => 28000, 'location' => 'Málaga', 'status' => JobStatus::Inactive, 'company' => 2],
            ['title' => 'Data Engineer', 'description' => 'Python and SQL data pipelines', 'salary' => 42000, 'location' => 'Bilbao', 'status' => JobStatus::Active, 'company' => 3],
            ['title' => 'QA Engineer', 'description' => 'Automated testing with Cypress', 'salary' => 27000, 'location' => 'Bilbao', 'status' => JobStatus::Pending, 'company' => 3],
        ];

        foreach ($jobs as $data) {
            $job = new Job();
            $job->setTitle($data['title']);
            $job->setDescription($data['description']);
            $job->setSalary($data['salary']);
            $job->setLocation($data['location']);
            $job->setStatus($data['status']);
            $job->setCreatedAt(new \DateTimeImmutable());
            $job->setCompany($this->getReference('company_' . $data['company'], Company::class));
            $manager->persist($job);
        }

        $manager->flush();
    }
}