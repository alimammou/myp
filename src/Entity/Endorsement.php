<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

/**
 * @ApiResource(
 *      normalizationContext={"groups"={"endRead"}},
 *      denormalizationContext={"groups"={"endWrite"}},
 * )
 * @ApiFilter(SearchFilter::class, properties={"id": "exact", "sender.id":"exact"})
 * @ORM\Entity(repositoryClass="App\Repository\EndorsementRepository")
 */
class Endorsement
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"endRead","endWrite"})
     */
    private $id;

    /**
     * @ORM\Column(type="datetime", options={"default": 0})
     * @Groups({"endRead"})
     */
    private $date;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"endRead","endWrite"})
     */
    private $type;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="sentEndorsements")
     * @Groups({"endWrite"})
     */
    private $sender;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="endorsements")
     * @Groups({"endWrite"})
     */
    private $reciever;

    public function __construct(){
        $this->date = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    
    /**
    * @Groups({"endRead"})
    */
    public function getSenderId():int{
        return $this->sender->getId();
    }

    public function getSender(): ?User
    {
        return $this->sender;
    }

    public function setSender(?User $sender): self
    {
        $this->sender = $sender;

        return $this;
    }

    /**
    * @Groups({"endRead"})
    */
    public function getRecieverId():int{
        return $this->reciever->getId();
    }

    public function getReciever(): ?User
    {
        return $this->reciever;
    }

    public function setReciever(?User $reciever): self
    {
        $this->reciever = $reciever;

        return $this;
    }


}
