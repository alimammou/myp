<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource(normalizationContext={"groups"={"partyread"}},denormalizationContext={"groups"={"partywrite"}},collectionOperations={
 *         "get"={"access_control"="is_granted('ROLE_MODERATOR')"},
 *         "post"={"access_control"="is_granted('ROLE_MODERATOR')"}
 *     },
 *     itemOperations={
 *         "get"={"access_control"="is_granted('ROLE_PARTICIPANT')"},
 *         "put" = {"access_control"="is_granted('ROLE_MODERATOR')"},
 *         "delete" = {"access_control"="is_granted('ROLE_MODERATOR')"},
 *     })
 * @ORM\Entity(repositoryClass="App\Repository\PartyRepository")
 */
class Party
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"partyread","userread","documentread","uniuserread"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"partyread","partywrite","userread","uniuserread"})
     */
    private $name;


    /**
     * @ORM\OneToMany(targetEntity="App\Entity\User", mappedBy="party")
     * @ApiSubresource
     * @Groups({"partyread"})
     */
    public $users;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\MediaObject")
     * @Groups({"partyread","partywrite","uniuserread"})
     */
    private $image;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Document", mappedBy="party")
     * @ApiSubresource
     * @Groups({"uniuserread"})
     */
    private $documents;

    public function __construct()
    {
        $this->users = new ArrayCollection();
        $this->documents = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }


    /**
     * @return Collection|User[]
     */
    public function getUsers(): Collection
    {
        return $this->users;
    }

    public function addUser(User $user): self
    {
        if (!$this->users->contains($user)) {
            $this->users[] = $user;
            $user->setParty($this);
        }

        return $this;
    }

    public function removeUser(User $user): self
    {
        if ($this->users->contains($user)) {
            $this->users->removeElement($user);
            // set the owning side to null (unless already changed)
            if ($user->getParty() === $this) {
                $user->setParty(null);
            }
        }

        return $this;
    }

    public function getImage(): ?MediaObject
    {
        return $this->image;
    }

    public function setImage(?MediaObject $image): self
    {
        $this->image = $image;

        return $this;
    }

    /**
     * @return Collection|Document[]
     */
    public function getDocuments(): Collection
    {
        return $this->documents;
    }

    public function addDocument(Document $document): self
    {
        if (!$this->documents->contains($document)) {
            $this->documents[] = $document;
            $document->setParty($this);
        }

        return $this;
    }

    public function removeDocument(Document $document): self
    {
        if ($this->documents->contains($document)) {
            $this->documents->removeElement($document);
            // set the owning side to null (unless already changed)
            if ($document->getParty() === $this) {
                $document->setParty(null);
            }
        }

        return $this;
    }
}
