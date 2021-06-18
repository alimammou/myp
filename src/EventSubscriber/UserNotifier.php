<?php

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\UserProfile;
use App\Entity\User;
use App\Entity\Document;
use App\Entity\PasswordTocken;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\ParameterBag\ContainerBagInterface;

final class UserNotifier implements EventSubscriberInterface
{
    private $mailer;
    private $em;
    private $container;

    public function __construct(\Swift_Mailer $mailer, EntityManagerInterface $em, ContainerBagInterface $container)
    {
        $this->mailer = $mailer;
        $this->em = $em;
        $this->container = $container;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['sendMail', EventPriorities::POST_WRITE],
        ];
    }

    public function sendMail(GetResponseForControllerResultEvent $event)
    {
        $userProfile = $event->getControllerResult();
        $request = $event->getRequest();
        $request = json_decode($request->getContent(), true);
        $method = $event->getRequest()->getMethod();
        $kernel = $event->getKernel();

        // if (!$userProfile instanceof UserProfile || !isset($request["status"])  || $request["status"] !=="accepted" || Request::METHOD_PUT !== $method) {
        //     return;
        // }

        if ($userProfile instanceof UserProfile && isset($request["status"]) && $request["status"] === "accepted" && Request::METHOD_PUT === $method) {
            $user = $userProfile->getUser();

            $message = new \Swift_Message("MYP Application accepted");
            $message
                ->setFrom(array("noreply@myplebanon.com" => "MYP Lebanon"))
                ->setTo(array($user->getUsjEmail()))
                ->setBody("Dear ".$user->getName()."
Congratulations, we are glad to inform you that your application for the MYP 2019 has beenaccepted.

The program starts on March 1 st at USJ Medical Science Campus, Amphithéâtre C.
Registration is open at 4:00 pm – the opening starts 4:30 pm, please be on time.

Before the start, please visit https://www.myplebanon.com and log in to find the preparatory material.
Some frequently asked questions and answers about the program:
                    
1) Do I have to attend the whole program?
Yes, the MYP is an intensive program. To participate successfully, you need to attend the full three and a half days.

2) What and how can I win?
Four outstanding participants will be selected for a political visiting program to Germany. The criteria for the selection are:
    • Leadership
    • Work on Content
    • Engagement

The winners will be found following the rating system on www.myplebanon.com, the opinion of the mentors as well as the impression of USJ and FNF staff.

3) What is the dress code at the Model Youth Parliament?
The dress code at the Model Youth Parliament is business casual, except for the Gala Dinner and the last day in Parliament, where formal dress is required.

4) Am I entitled to accommodation provided by USJ and FNF?
Accommodation is provided only for participants from outside Beirut and after communication with USJ student life.

5) I have more questions – who can help me?
For any additional question you can reach Lea Choueifaty from the USJ student life department at: 71 762 922


We hope you will enjoy the program!");

            $this->mailer->send($message);
            return;
        }

        if ($userProfile instanceof UserProfile && $method === Request::METHOD_POST) {
            $user = $userProfile->getUser();
            $message = new \Swift_Message("MYP Application received");
            $message
                ->setFrom(array("noreply@myplebanon.com" => "MYP Lebanon"))
                ->setTo(array($user->getUsjEmail()))
                ->setBody("Thank you for your application for the Model Youth Parliament 2019!<br/>As soon as we verified the data that you submitted, we will contact you.<br/><br/>Thank you for your patience.");
            $this->mailer->send($message);

            return;
        }

        if ($userProfile instanceof Document && Request::METHOD_POST === $method) {
            $file = $userProfile->getFile();
            $isGeneric = $userProfile->getIsGeneric();
            $party = $userProfile->getActualParty();
            $commity = $userProfile->getActualCommity();
            $recievers = array();
            $mapper = function ($user) {
                return ($user->getUsjEmail());
                // return ($recievers,$user->getUsjEmail());
            };

            if ($isGeneric) {
                $users = $this->em->getRepository(User::class)->findBy(array("role" => "ROLE_PARTICIPANT"));
                foreach ($users as $user) {
                    if ($user->getPassword() !== "ss") {
                        $recievers[] = $user->getEmail();
                        $recievers[] = $user->getUsjEmail();
                    }
                }
            } elseif ($party) {
                $users = $this->em->getRepository(User::class)->findBy(array("party" => $party));
                foreach ($users as $user) {
                    $recievers[] = $user->getEmail();
                    $recievers[] = $user->getUsjEmail();
                }
            } elseif ($commity) {
                $users = $this->em->getRepository(User::class)->findBy(array("commity" => $commity));
                foreach ($users as $user) {
                    $recievers[] = $user->getEmail();
                    $recievers[] = $user->getUsjEmail();
                }
            }

            dump($recievers);
            $message = new \Swift_Message("MYP - new document recieved");
            $message
                ->setFrom(array("noreply@myplebanon.com" => "MYP Lebanon"))
                ->setTo($recievers)
                ->setBody("Dear participant of the MYP!<br/>You have received a new document. Please click here to view it <a href='https://endpoints.myplebanon.com/media/{$file}'>link</a> or find it on
                <a href='https://www.myplebanon.com'>www.myplebanon.com</a> in the corresponding group.<br/><br/>We hope you are enjoying the program!", "text/html");
            $this->mailer->send($message);
            return;
        }
        return;
    }



    private function generateCode()
    {
        $unique = false;
        $length = 28;
        $chrDb = array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9');


        $str = '';
        for ($count = 0; $count < $length; $count++) {
            $chr = $chrDb[rand(0, count($chrDb) - 1)];

            if (rand(0, 1) == 0) {
                $chr = strtolower($chr);
            }
            if (3 == $count) {
                $str .= '-';
            }
            $str .= $chr;
        }
        return $str;
    }
}
