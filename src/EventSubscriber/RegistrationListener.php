<?php

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Event\KernelEvent;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\KernelEvents;
use App\Entity\PasswordTocken;



final class RegistrationListener implements EventSubscriberInterface
{

    private $em;
    private $container;
    private $passwordEncoder;

    public function __construct(EntityManagerInterface $em, UserPasswordEncoderInterface $passwordEncoder, ContainerBagInterface $container)
    {
        $this->em = $em;
        $this->container = $container;
        $this->passwordEncoder = $passwordEncoder;
    }


    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ["hashPassword", EventPriorities::PRE_WRITE],
            // KernelEvents::VIEW => ["deleteTokenDependencyOnDelete",EventPriorities::PRE_DESERIALIZE]
        ];
    }

    public function hashPassword(GetResponseForControllerResultEvent $event)
    {
        $user = $event->getControllerResult();
        $request = $event->getRequest();
        $request = json_decode($request->getContent(), true);
        $method = $event->getRequest()->getMethod();
        $kernel = $event->getKernel();

        if ($user instanceof User && $method == Request::METHOD_POST && $request["role"] === "ROLE_PARTICIPANT") {
            $encodedPassword = $this->passwordEncoder->encodePassword($user, $request["password"]);
            $user->setPassword($encodedPassword);
        }
        return;

    }

    public function deleteTokenDependencyOnDelete(GetResponseForControllerResultEvent $event)
    {
        $user = $event->getControllerResult();
        if ($user instanceof User) {

            $method = $event->getRequest()->getMethod();

            if ($method === Request::METHOD_DELETE) {

                $request = $event->getRequest();
                $request = json_decode($request->getContent(), true);

                $q = $em->createQuery('delete from App\Entity\PasswordTocken m where m.user_id = '.$user->getId());
                $q->execute();
            }
        }
        return;
    }
}