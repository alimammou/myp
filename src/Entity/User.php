<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * @ApiResource(attributes={"pagination_enabled"=false},collectionOperations={"get"={"normalization_context"={"groups"={"userread"}}},"post"={"denormalization_context"={"groups"={"userwrite"}}}},itemOperations={"get"={"normalization_context"={"groups"={"uniuserread"}}},"put"={"denormalization_context"={"groups"={"userwrite"}}},"delete"={"denormalization_context"={"groups"={"userwrite"}}}})
 * @ApiFilter(SearchFilter::class, properties={"id": "exact", "role": "exact" ,"isPasswordSet": "exact" , "userProfile.status": "exact"})
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User implements UserInterface,\Serializable,\JsonSerializable
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"userread","user_profile","documentread","uniuserread","partyread"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"userread","userwrite","user_profile","uniuserread","partyread"})
     */
    private $name;

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\PasswordTocken",mappedBy="user",cascade={"persist","remove"})
     */
    private $token;

    /**
     * @ORM\Column(type="string", length=255,  options={"collation":"utf8_unicode_ci"})
     * @Groups({"userread","userwrite","user_profile","uniuserread"})
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255,  options={"collation":"utf8_unicode_ci"})
     * @Groups({"userread","userwrite","user_profile","uniuserread"})
     */
    private $usjEmail;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"userwrite",})
     */
    private $password;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"userread","userwrite","uniuserread"})
     */
    private $role;


    /**
     * @ORM\OneToOne(targetEntity="App\Entity\UserProfile", inversedBy="user", cascade={"persist", "remove"})
     * @Groups({"userread","userwrite","uniuserread"})
     */
    private $userProfile;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Party", inversedBy="users")
     * @Groups({"userread","userwrite","uniuserread"})
     */
    private $party;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Commity", inversedBy="users")
     * @Groups({"userread","userwrite","uniuserread"})
     */
    private $commity;


    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Document", mappedBy="sender")
     * @ApiSubresource
     */
    private $sentDocuments;

    /**
     * @ORM\ManyToMany(targetEntity="App\Entity\Document", mappedBy="targetUsers")
     * @ApiSubresource
     * @Groups({"uniuserread"})
     */
    private $documents;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Endorsement", mappedBy="sender",cascade={"persist","remove"})
     */
    private $sentEndorsements;

    /**
     * @ApiSubresource
     * @ORM\OneToMany(targetEntity="App\Entity\Endorsement", mappedBy="reciever", cascade={"persist", "remove"})
     */
    private $endorsements;

    public function __construct()
    {
        $this->sentDocuments = new ArrayCollection();
        $this->documents = new ArrayCollection();
        $this->sentEndorsements = new ArrayCollection();
        $this->endorsements = new ArrayCollection();
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

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getUsjEmail(): ?string
    {
        return $this->usjEmail;
    }

    public function setUsjEmail(string $usjEmail): self
    {
        $this->usjEmail = $usjEmail;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    public function getRole(): ?string
    {
        return $this->role;
    }

    public function setRole(string $role): self
    {
        $this->role = $role;

        return $this;
    }

    public function getUserProfile(): ?UserProfile
    {
        return $this->userProfile;
    }

    public function setUserProfile(?UserProfile $userProfile): self
    {
        $this->userProfile = $userProfile;

        return $this;
    }

    public function getParty(): ?Party
    {
        return $this->party;
    }

    public function setParty(?Party $party): self
    {
        $this->party = $party;

        return $this;
    }

    public function getCommity(): ?Commity
    {
        return $this->commity;
    }

    public function setCommity(?Commity $commity): self
    {
        $this->commity = $commity;

        return $this;
    }

    public function getUsername(){
        return $this->usjEmail;
    }
    
    public function getSalt()
    {
        return null;
    }


    public function getRoles()
    {
        return array($this->role);
    }

    /**
    * @Groups({"userread","user_profile"})
    */
    public function getIsPasswordSet(){
        return $this->password !== "ss";
    }

    

    public function eraseCredentials()
    {

    }

    public function jsonSerialize() {
        return [ "id" => $this->id, 
        "usjEmail" => $this->usjEmail,
        "name" => $this->name,
        "role" => $this->role
    ];
    }

    public function serialize()
    {
        return serialize(array(
            $this->id,
            $this->usjEmail,
            $this->password,
            // see section on salt below
            // $this->salt,
        ));
    }

    public function unserialize($serialized)
    {
        list (
            $this->id, 
            $this->usjEmail,
            $this->password,
            // see section on salt below
            // $this->salt
        ) = unserialize($serialized, array('allowed_classes' => false));
    }

    // /**
    //  * @return Collection|Document[]
    //  */
    // public function getTargetUser(): Collection
    // {
    //     return $this->targetUser;
    // }

    // public function addTargetUser(Document $targetUser): self
    // {
    //     if (!$this->targetUser->contains($targetUser)) {
    //         $this->targetUser[] = $targetUser;
    //         $targetUser->setSender($this);
    //     }

    //     return $this;
    // }

    // public function removeTargetUser(Document $targetUser): self
    // {
    //     if ($this->targetUser->contains($targetUser)) {
    //         $this->targetUser->removeElement($targetUser);
    //         // set the owning side to null (unless already changed)
    //         if ($targetUser->getSender() === $this) {
    //             $targetUser->setSender(null);
    //         }
    //     }

    //     return $this;
    // }

    /**
     * @return Collection|Document[]
     */
    public function getSentDocuments(): Collection
    {
        return $this->sentDocuments;
    }

    public function addSentDocument(Document $sentDocument): self
    {
        if (!$this->sentDocuments->contains($sentDocument)) {
            $this->sentDocuments[] = $sentDocument;
            $sentDocument->setSender($this);
        }

        return $this;
    }

    public function removeSentDocument(Document $sentDocument): self
    {
        if ($this->sentDocuments->contains($sentDocument)) {
            $this->sentDocuments->removeElement($sentDocument);
            // set the owning side to null (unless already changed)
            if ($sentDocument->getSender() === $this) {
                $sentDocument->setSender(null);
            }
        }

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
            $document->addTargetUser($this);
        }

        return $this;
    }

    public function removeDocument(Document $document): self
    {
        if ($this->documents->contains($document)) {
            $this->documents->removeElement($document);
            $document->removeTargetUser($this);
        }

        return $this;
    }

    /**
     * @return Collection|Endorsement[]
     */
    public function getSentEndorsements(): Collection
    {
        return $this->sentEndorsements;
    }

    public function addSentEndorsement(Endorsement $sentEndorsement): self
    {
        if (!$this->sentEndorsements->contains($sentEndorsement)) {
            $this->sentEndorsements[] = $sentEndorsement;
            $sentEndorsement->setSender($this);
        }

        return $this;
    }

    public function removeSentEndorsement(Endorsement $sentEndorsement): self
    {
        if ($this->sentEndorsements->contains($sentEndorsement)) {
            $this->sentEndorsements->removeElement($sentEndorsement);
            // set the owning side to null (unless already changed)
            if ($sentEndorsement->getSender() === $this) {
                $sentEndorsement->setSender(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|Endorsement[]
     */
    public function getEndorsements(): Collection
    {
        return $this->endorsements;
    }

    public function addEndorsement(Endorsement $endorsement): self
    {
        if (!$this->endorsements->contains($endorsement)) {
            $this->endorsements[] = $endorsement;
            $endorsement->setReciever($this);
        }

        return $this;
    }

    public function removeEndorsement(Endorsement $endorsement): self
    {
        if ($this->endorsements->contains($endorsement)) {
            $this->endorsements->removeElement($endorsement);
            // set the owning side to null (unless already changed)
            if ($endorsement->getReciever() === $this) {
                $endorsement->setReciever(null);
            }
        }

        return $this;
    }
}

// subresourceOperations={
//     *          "name_get_subresource"= {
//     *              "method"="GET",
//     *              "path"="/users/{id}/names"
//     *          },
//     *      }
