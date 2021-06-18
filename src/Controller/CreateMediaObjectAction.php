<?php

namespace App\Controller;

use ApiPlatform\Core\Bridge\Symfony\Validator\Exception\ValidationException;
use App\Entity\MediaObject;
use App\Form\MediaObjectType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bridge\Doctrine\RegistryInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class CreateMediaObjectAction
{
    private $validator;
    private $doctrine;
    private $factory;

    public function __construct(RegistryInterface $doctrine, FormFactoryInterface $factory, ValidatorInterface $validator)
    {
        $this->validator = $validator;
        $this->doctrine = $doctrine;
        $this->factory = $factory;
    }

    public function __invoke(Request $request): MediaObject
    {
        $mediaObject = new MediaObject();

        $form = $this->factory->create(MediaObjectType::class, $mediaObject);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $em = $this->doctrine->getManager();
            $em->persist($mediaObject);
            $em->flush();

            // Prevent the serialization of the file property
            $mediaObject->file = null;

            return $mediaObject;
        }

        // This will be handled by API Platform and returns a validation error.
        throw new ValidationException($this->validator->validate($mediaObject));
    }
}