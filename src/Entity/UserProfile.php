<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource(attributes={"pagination_enabled"=false},normalizationContext={"groups"={"user_profile"}},denormalizationContext={"groups"={"user_profile"}})
 * @ORM\Entity(repositoryClass="App\Repository\UserProfileRepository")
 */
class UserProfile
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"userread","user_profile"})
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"userread","userwrite","user_profile"})
     * 
     */
    private $birthday;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"userread","userwrite","user_profile","uniuserread"})
     */
    private $phone;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"userread","userwrite","user_profile","uniuserread"})
     */
    private $city;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"userread","userwrite","user_profile","uniuserread"})
     */
    private $faculty;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"userread","userwrite","user_profile","uniuserread"})
     */
    private $campus;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"userread","userwrite","user_profile","uniuserread"})
     */
    private $major;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"userread","userwrite","user_profile"})
     */
    private $accomodationNeeded;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"userread","userwrite","user_profile"})
     */
    private $didParticipate;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"userread","userwrite","user_profile"})
     */
    private $similarParticipation;

    /**
     * @ORM\Column(type="array", nullable=true)
     * @Groups({"userread","userwrite","user_profile"})
     */
    private $similarParticipationNames = [];

    /**
     * @ORM\Column(type="text")
     * @Groups({"userread","userwrite","user_profile"})
     */
    private $hearingWay;

    /**
     * @ORM\Column(type="text")
     * @Groups({"userread","userwrite","user_profile"})
     */
    private $opinion;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"userread","userwrite","user_profile"})
     */
    private $isApproved=false;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"userread","userwrite","user_profile"})
     */
    private $isVerified=false;

    /**
     * @ORM\Column(type="datetime", columnDefinition="DATETIME on update CURRENT_TIMESTAMP")
     * @Groups({"userread","userwrite","user_profile"})
     */
    private $dateApplied;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"userread","userwrite","user_profile"})
     */
    private $status="unknown";

    /**
     * @ORM\OneToOne(targetEntity="App\Entity\User", mappedBy="userProfile", cascade={"persist", "remove"})
     * @Groups({"user_profile"})
     */
    private $user;

    public function __construct()
    {
        $this->dateApplied = new \DateTime("now");
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBirthday(): ?\DateTimeInterface
    {
        return $this->birthday;
    }

    public function setBirthday(\DateTimeInterface $birthday): self
    {
        $this->birthday = $birthday;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): self
    {
        $this->phone = $phone;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getFaculty(): ?string
    {
        return $this->faculty;
    }

    public function setFaculty(string $faculty): self
    {
        $this->faculty = $faculty;

        return $this;
    }

    public function getCampus(): ?string
    {
        return $this->campus;
    }

    public function setCampus(string $campus): self
    {
        $this->campus = $campus;

        return $this;
    }

    public function getMajor(): ?string
    {
        return $this->major;
    }

    public function setMajor(string $major): self
    {
        $this->major = $major;

        return $this;
    }

    public function getAccomodationNeeded(): ?bool
    {
        return $this->accomodationNeeded;
    }

    public function setAccomodationNeeded(bool $accomodationNeeded): self
    {
        $this->accomodationNeeded = $accomodationNeeded;

        return $this;
    }

    public function getDidParticipate(): ?bool
    {
        return $this->didParticipate;
    }

    public function setDidParticipate(bool $didParticipate): self
    {
        $this->didParticipate = $didParticipate;

        return $this;
    }

    public function getSimilarParticipation(): ?bool
    {
        return $this->similarParticipation;
    }

    public function setSimilarParticipation(bool $similarParticipation): self
    {
        $this->similarParticipation = $similarParticipation;

        return $this;
    }

    public function getSimilarParticipationNames(): ?array
    {
        return $this->similarParticipationNames;
    }

    public function setSimilarParticipationNames(?array $similarParticipationNames): self
    {
        $this->similarParticipationNames = $similarParticipationNames;

        return $this;
    }

    public function getHearingWay(): ?string
    {
        return $this->hearingWay;
    }

    public function setHearingWay(string $hearingWay): self
    {
        $this->hearingWay = $hearingWay;

        return $this;
    }

    public function getOpinion(): ?string
    {
        return $this->opinion;
    }

    public function setOpinion(string $opinion): self
    {
        $this->opinion = $opinion;

        return $this;
    }

    public function getIsApproved(): ?bool
    {
        return $this->isApproved;
    }

    public function setIsApproved(bool $isApproved): self
    {
        $this->isApproved = $isApproved;

        return $this;
    }

    public function getIsVerified():?bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified):self
    {
        $this->isVerified = $isVerified;

        return $this;
    }

    public function getDateApplied(): ?\DateTimeInterface
    {
        return $this->dateApplied;
    }

    public function setDateApplied(\DateTimeInterface $dateApplied): self
    {
        $this->dateApplied = $dateApplied;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        // set (or unset) the owning side of the relation if necessary
        $newUserProfile = $user === null ? null : $this;
        if ($newUserProfile !== $user->getUserProfile()) {
            $user->setUserProfile($newUserProfile);
        }

        return $this;
    }
}
