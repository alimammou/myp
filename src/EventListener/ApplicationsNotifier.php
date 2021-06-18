<?php

namespace App\EventListener;

use Doctrine\Common\Persistence\Event\LifecycleEventArgs; use Doctrine\ORM\Event\PreFlushEventArgs;
use App\Entity\UserProfile;
use App\Entity\User;


class ApplicationsNotifier{
    private $mailer;

    public function __construct(\Swift_Mailer $mailer)
    {
        $this->mailer = $mailer;
    }

    public function preFlush(User $user, PreFlushEventArgs $args){
        $message = new \Swift_Message("test");
        $message
        ->setFrom(array("noreply@myplebanon.com"=>"MYP Lebanon"))
        ->setTo("convictmoody@gmail.com")
        ->setBody(json_encode($user),"text/html");

        $this->mailer->send($message);
    }
}