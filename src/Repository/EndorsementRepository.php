<?php

namespace App\Repository;

use App\Entity\Endorsement;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method Endorsement|null find($id, $lockMode = null, $lockVersion = null)
 * @method Endorsement|null findOneBy(array $criteria, array $orderBy = null)
 * @method Endorsement[]    findAll()
 * @method Endorsement[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class EndorsementRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, Endorsement::class);
    }


    public function findAllForMods():array{
        $qb = $this->createQueryBuilder('e')
        ->select("e")
            ->addSelect("Count(e.type) as endorsements")
            ->join("e.reciever", "u")
            ->groupBy("e.type")
            ->addGroupBy("u.name")
            ->orderBy("u.name")
            ->addOrderBy("e.type")
            ->addSelect("e.type as type")
            ->addSelect("u.name as name")
            ->addSelect("u.id as userId")
            ->getQuery();

            return $qb->execute();
    }

//    /**
//     * @return Endorsement[] Returns an array of Endorsement objects
//     */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('e.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Endorsement
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
