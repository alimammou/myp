<?php

namespace App\Repository;

use App\Entity\PasswordTocken;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method PasswordTocken|null find($id, $lockMode = null, $lockVersion = null)
 * @method PasswordTocken|null findOneBy(array $criteria, array $orderBy = null)
 * @method PasswordTocken[]    findAll()
 * @method PasswordTocken[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PasswordTockenRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, PasswordTocken::class);
    }

//    /**
//     * @return PasswordTocken[] Returns an array of PasswordTocken objects
//     */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?PasswordTocken
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
