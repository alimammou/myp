<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiProperty;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Controller\CreateMediaObjectAction;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;


/**
 * @ORM\Entity
 * @ApiResource(iri="http://schema.org/MediaObject", collectionOperations={
 *     "get"={
 *          "normalization_context"={"groups"={"partyread","documentread"}},
 *          "denormalization_context"={"groups"={"partywrite","documentwrite"}}},
 *     "post"={
 *         "method"="POST",
 *         "path"="/media_objects",
 *         "controller"=CreateMediaObjectAction::class,
 *         "defaults"={"_api_receive"=false},
 *          "normalization_context"={"groups"={"partyread","documentread"}},
 *          "denormalization_context"={"groups"={"partywrite","documentwrite"}},
 *     },
 * })
 * @Vich\Uploadable
 */
class MediaObject
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"partyread","partywrite"})
     */
    private $id;

    /**
     * @var File|null
     * @Assert\NotNull()
     * @Vich\UploadableField(mapping="media_object", fileNameProperty="contentUrl")
     */
    public $file;

     /**
     * @var string|null
     * @ORM\Column(nullable=true)
     * @ApiProperty(iri="http://schema.org/contentUrl")
     * @Groups({"partyread","partywrite","documentread","documentwrite","uniuserread"})
     */
    public $contentUrl;

    public function getId(): ?int
    {
        return $this->id;
    }


    public function getContentUrl(): ?string
    {
        return $this->contentUrl;
    }

    public function setContentUrl(string $contentUrl): self
    {
        $this->contentUrl = $contentUrl;

        return $this;
    }
}
