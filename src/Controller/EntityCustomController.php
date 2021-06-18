<?php

namespace App\Controller;


use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use App\Entity\Endorsement;

class EntityCustomController extends Controller{

    /**
     * @Route("/endorsements/for_mods", name="mods_endorsements")
     * @Method({"GET"})
     */
    public function getEndorsementsForMods(Request $request)
    {
        $data = $this->getDoctrine()->getRepository(Endorsement::class)
        ->findAllForMods();

        return new JsonResponse($data);
    }
}