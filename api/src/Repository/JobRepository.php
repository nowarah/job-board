<?php

namespace App\Repository;

use App\Entity\Job;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Job>
 */
class JobRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Job::class);
    }

    /**
    * @return Job[] Returns an array of Job objects
    */
    public function findByFilters(array $filters, int $limit, int $offset): array
    {
        $qb = $this->createQueryBuilder('j');

        if (!empty($filters['location'])) {
            $qb->andWhere('LOWER(j.location) LIKE LOWER(:location)')
            ->setParameter('location', '%' . $filters['location'] . '%');
        }

        if (!empty($filters['status'])) {
            $qb->andWhere('j.status = :status')
            ->setParameter('status', $filters['status']);
        }

        return $qb
            ->orderBy('j.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->setFirstResult($offset)
            ->getQuery()
            ->getResult();
    }

    public function findDistinctLocations(): array
    {
        return $this->createQueryBuilder('j')
            ->select('DISTINCT j.location')
            ->orderBy('j.location', 'ASC')
            ->getQuery()
            ->getSingleColumnResult();
    }

}
