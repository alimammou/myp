<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\BooleanFilter;

/**
 * @ApiResource(attributes={"pagination_enabled"=false},normalizationContext={"groups"={"documentread"}}, denormalizationContext={"groups"={"documentwrite"}})
 * @ApiFilter(BooleanFilter::class, properties={"isGeneric"})
 * @ORM\Entity(repositoryClass="App\Repository\DocumentRepository")
 */
class Document
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"documentread","documentwrite"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="sentDocuments")
     * @Groups({"documentread","documentwrite","partyread","partywrite"})
     */
    private $sender;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\User", inversedBy="documents")
     * @Groups({"documentread","documentwrite"})
     */
    private $targetUsers;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\MediaObject",)
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"documentread","documentwrite","partyread","partywrite","uniuserread"})
     */
    private $file;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"documentread","documentwrite"})
     */
    private $isGeneric;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Party", inversedBy="documents")
     * @Groups({"documentread","documentwrite"})
     */
    private $party;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Commity", inversedBy="documents")
     * @Groups({"documentread","documentwrite"})
     */
    private $commity;

    public function __construct()
    {
        $this->targetUsers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSender(): ?int
    {
        if($this->sender)
        return $this->sender->getId();
        else
        return $this->sender;
    }

    public function setSender(?User $sender): self
    {
        $this->sender = $sender;

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getTargetUsers(): Collection
    {
        return $this->targetUsers;
    }

    public function addTargetUser(User $targetUser): self
    {
        if (!$this->targetUsers->contains($targetUser)) {
            $this->targetUsers[] = $targetUser;
        }

        return $this;
    }

    public function removeTargetUser(User $targetUser): self
    {
        if ($this->targetUsers->contains($targetUser)) {
            $this->targetUsers->removeElement($targetUser);
        }

        return $this;
    }

    public function getFile(): ?string
    {
        return $this->file->getContentUrl();
    }

    public function setFile(MediaObject $contentUrl): self
    {
        $this->file = $contentUrl;

        return $this;
    }

    public function getIsGeneric(): ?bool
    {
        return $this->isGeneric;
    }

    public function setIsGeneric(bool $isGeneric): self
    {
        $this->isGeneric = $isGeneric;

        return $this;
    }

    public function getParty(): ?int
    {
        if($this->party)
        return $this->party->getId();
        else
        return $this->party;
    }

    public function getActualParty(): ?Party
    {
        return $this->party;
    }

    public function setParty(?Party $party): self
    {
        $this->party = $party;

        return $this;
    }

    public function getCommity(): ?int
    {
        if($this->commity)
        return $this->commity->getId();
        else
        return $this->commity;
    }

    public function getActualCommity(): ?Commity
    {
        return $this->commity;
    }

    public function setCommity(?Commity $commity): self
    {
        $this->commity = $commity;

        return $this;
    }
}
