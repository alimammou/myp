<?php

namespace App\Repository;

use App\Entity\Commity;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Commity|null find($id, $lockMode = null, $lockVersion = null)
 * @method Commity|null findOneBy(array $criteria, array $orderBy = null)
 * @method Commity[]    findAll()
 * @method Commity[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CommityRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Commity::class);
    }

//    /**
//     * @return Commity[] Returns an array of Commity objects
//     */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('c.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Commity
    {
        return $this->createQueryBuilder('c')
            ->andWhere('c.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
