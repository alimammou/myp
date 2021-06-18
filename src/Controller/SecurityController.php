<?php

namespace App\Controller;

use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use App\Entity\User;
use App\Entity\PasswordTocken;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\XmlEncoder;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Encoder\JsonDecode;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

class SecurityController extends Controller
{


    /**
     * @Route("/login", name="login")
     * @Method({"POST"})
     */
    public function login(Request $request)
    {
        if ($request->isMethod("POST")) {
            $user = $this->getUser();
            if ($user->getRole() === "ROLE_PARTICIPANT") {
                $userProfile = $user->getUserProfile();
                if ($userProfile->getStatus() !== "accepted")
                    return new JsonResponse(array("success" => false));
            }
            $encoder = array(new JsonEncoder());
            $normalizer = new ObjectNormalizer();
            $normalizer->setCircularReferenceLimit(0);
            $normalizer->setCircularReferenceHandler(function ($object) {
                return $object->getId();
            });

            $normalizers = array($normalizer);


            $serializer = new Serializer($normalizers, $encoder);

            return (new JsonResponse($user->jsonSerialize()));
        }
        return new JsonResponse(array(" success " => false));
    }

    /**
     * @Route("/users/register_mod", name="register_mod")
     * @Method({"POST"})
     * @Security("has_role('ROLE_MODERATOR')")
     */
    public function registerMod(Request $request, UserPasswordEncoderInterface $encoder)
    {
        $request = json_decode($request->getContent(), true);
        $user = new User();
        $user->setName($request["name"]);
        $user->setEmail($request["email"]);
        $user->setUsjEmail($request["email"]);
        $user->setRole($request["role"]);

        $encodedPassword = $encoder->encodePassword($user, $request["password"]);

        $user->setPassword($encodedPassword);
        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->flush();

        return new JsonResponse($user->jsonSerialize());
    }



    /**
     * @Route("/logout",name= "logout")
     */
    public function logout(Request $request)
    {
        return new JsonResponse(array(" success " => true));
    }

    /**
     * @Route("/currentUser", name="cuser")
     */
    public function currentUser(Request $request)
    {
        $user = $this->getUser();

        return new Response($user->serialize());
    }

    /**
     * @Route("/check_token/{token}", name="ctoken")
     * @Method({"GET"})
     */
    public function checkTocken(Request $request, $token)
    {
        if (isset($token)) {
            $token = $this->getDoctrine()->getRepository(PasswordTocken::class)->findOneBy(array("token" => $token, "isValid" => true));
            if ($token) {
                return new JsonResponse(array("valid" => true, "name" => $token->getUser()->getName()));
            }
            return new JsonResponse(array("valid" => false));
        }

        return new JsonResponse(array("valid" => false));
    }

    /**
     * @Route("/confirm_application", name="capplication")
     * @Method({"POST"})
     */
    public function confirmApplication(Request $request, UserPasswordEncoderInterface $encoder)
    {
        $request = json_decode($request->getContent(), true);
        if (isset($request["token"]) && isset($request["password"])) {
            $token = $request["token"];
            $plain_password = $request["password"];

            $em = $this->getDoctrine()->getManager();

            $tokenEntity = $em->getRepository(PasswordTocken::class)->findOneBy(array("token" => $token, "isValid" => true));
            $user = $tokenEntity->getUser();

            $encodedPassword = $encoder->encodePassword($user, $request["password"]);

            $user->setPassword($encodedPassword);

            $em->flush();
            $em->remove($tokenEntity);
            $em->flush();

            return new JsonResponse(array("success" => true));
        }
        return new JsonResponse(array("success" => false));
    }

    /**
     * @Route("/resend_emails", name="resendEmails")
     * @Method({"GET"})
     */
    public function resendEmails(Request $request, \Swift_Mailer $mailer)
    {
        $em = $this->getDoctrine()->getManager();
        $tokens = $em->getRepository(PasswordTocken::class)->findAll();
        foreach ($tokens as $tokenEntity) {
            $user = $tokenEntity->getUser();
            $token = $tokenEntity->getToken();
            $message = new \Swift_Message("MYP Application Reminder");
            $message
                ->setFrom(array("noreply@myplebanon.com" => "MYP Lebanon"))
                ->setTo(array($user->getEmail(), $user->getUsjEmail()))
                ->setBody("<strong syle='font-size:16px;'>Dear {$user->getName()}</strong><br/><br/><span syle='font-size:16px;'>We are glad to inform you, that your application for the MYP 2018 has been accepted.<br/>Please complete the registration using the link below:</span><br/><br/>https://www.myplebanon.com/confirm_registration/{$token} <br/><br/>After setting a password, you can see the MYP Homescreen where you will find first information about the program.<br/>We hope you will enjoy the program!", "text/html");
            $mailer->send($message);
        }
        return new JsonResponse(["Success" => "true"]);

    }

    /**
     * @Route("/resend_email", name="resendEmail")
     * @Method({"POST"})
     */
    public function resendEmail(Request $request, \Swift_Mailer $mailer)
    {
        $request = json_decode($request->getContent(), true);
        $userId = $request["userId"];
        $em = $this->getDoctrine()->getManager();

        $user = $em->getRepository(User::class)->find($userId);
        $tokenEntity = $em->getRepository(PasswordTocken::class)->findOneBy(array("user" => $userId));
        $token = "";

        if ($tokenEntity) {
            $token = $tokenEntity->getToken();
        } else {
            $token = $this->generateCode();
            $password_token = new PasswordTocken();
            $password_token->setToken($token)->setIsValid(true)->setUser($user);
            
            $em->persist($password_token);
            $em->flush();
        }

        $message = new \Swift_Message("MYP Application");
        $message
            ->setFrom(array("noreply@myplebanon.com" => "MYP Lebanon"))
            ->setTo(array($user->getUsjEmail()))
            ->setBody("<strong syle='font-size:16px;'>Dear {$user->getName()}</strong><br/><br/><span syle='font-size:16px;'>You have requested a password reset.<br/>To complete your request visit the link below:</span><br/><br/>https://www.myplebanon.com/confirm_registration/{$token} <br/><br/>", "text/html");

        $mailer->send($message);
        return new JsonResponse(["success" => "true"]);

    }

    /**
     * @Route("/reset_password", name="resetPass")
     * @Method({"POST"})
     */
    public function resetPassword(Request $request, \Swift_Mailer $mailer)
    {
        $request = json_decode($request->getContent(), true);
        if (isset($request["email"])) {
            $email = $request["email"];
            $em = $this->getDoctrine()->getManager();
            $user = $em->getRepository(User::class)->findOneBy(array("usjEmail" => $email));
            $pt = $em->getRepository(PasswordTocken::class)->findOneBy(array("user" => $user));
            if ($user->getPassword() !== "ss" || ($user->getPassword() === "ss" && $pt)) {
                $token = $this->generateCode();


                $message = new \Swift_Message("MYP Application");
                $message
                    ->setFrom(array("noreply@myplebanon.com" => "MYP Lebanon"))
                    ->setTo(array($user->getUsjEmail()))
                    ->setBody("<strong syle='font-size:16px;'>Dear {$user->getName()}</strong><br/><br/><span syle='font-size:16px;'>You have requested a password reset.<br/>To complete your request visit the link below:</span><br/><br/>https://www.myplebanon.com/confirm_registration/{$token} <br/><br/>", "text/html");

                $mailer->send($message);

                if ($pt) {
                    $pt->setToken($token);
                } else {
                    $password_token = new PasswordTocken();
                    $password_token->setToken($token)->setIsValid(true)->setUser($user);

                    $em->persist($password_token);
                }
                $em->flush();

                return new JsonResponse(array("success" => true));
            }

            return new JsonResponse(array("success" => false));
        }

        return new JsonResponse(array("success" => false));
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
