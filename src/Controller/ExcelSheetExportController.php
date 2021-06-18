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



class ExcelSheetExportController extends Controller
{

    /**
     * @Route("/export/applications", name="export_applications")
     * @Method({"GET"})
     */
    public function exportApplications(Request $request)
    {
        $spreadsheet = new Spreadsheet();
        $repo = $this->getDoctrine()->getRepository(\App\Entity\UserProfile::class);
        $applications = $repo->findAll();

        $headerArray = [
            'font' => [
                'bold' => true,
                'color' => [
                    'argb' => 'FFFFFFFF',
                ]
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
            ],
            'borders' => [
                'top' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
                'bottom' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'rotation' => 90,
                'color' => [
                    'argb' => 'FF009EE3',
                ]
            ],
        ];

        $identifierArray = [
            'font' => [
                'bold' => true,
                'color' => [
                    'argb' => 'FFFFFFFF',
                ]
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'rotation' => 90,
                'color' => [
                    'argb' => 'FFE5007D',
                ]
            ],
        ];

        $identifierValuesArray = [
            'font' => [
                'bold' => false,
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'rotation' => 90,
                'color' => [
                    'argb' => 'FFF280BE',
                ],
                'endColor' => [
                    'argb' => 'FFFFFFFF',
                ],
            ],
        ];


        $identifierOddArray = [
            'font' => [
                'bold' => true,
                'color' => [
                    'argb' => 'FFFFFFFF',
                ]
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'rotation' => 90,
                'color' => [
                    'argb' => 'FF26ABE3',
                ]
            ],
        ];

        $identifierOddValuesArray = [
            'font' => [
                'bold' => false,
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'rotation' => 90,
                'color' => [
                    'argb' => 'FF93D5F1',
                ],
                'endColor' => [
                    'argb' => 'FFFFFFFF',
                ],
            ],
        ];

        $spreadsheet->setActiveSheetIndex(0);


        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setCellValue("A1", "Name");
        $sheet->setCellValue("B1", "USJ Email");
        $sheet->setCellValue("C1", "DOB");
        $sheet->setCellValue("D1", "Phone Number");
        $sheet->setCellValue("E1", "City");
        $sheet->setCellValue("F1", "Faculty");
        $sheet->setCellValue("G1", "Campus");
        $sheet->setCellValue("H1", "Major");
        $sheet->setCellValue("I1", "Accomodation Needed");
        $sheet->setCellValue("J1", "Previous Participation");
        $sheet->setCellValue("K1", "Similar Participation");
        $sheet->setCellValue("L1", "Incoming Exposure");
        $sheet->setCellValue("M1", "Opinion");
        $sheet->setCellValue("N1", "Status");


        $sheet->getStyle('A1:N2')->applyFromArray($headerArray);


        $i = 3;
        for ($d = 0; $d < count($applications); $d++) {
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setCellValue("A" . $i, $applications[$d]->getUser()->getName());
            $sheet->setCellValue("B" . $i, $applications[$d]->getUser()->getUsjEmail());
            $sheet->setCellValue("C" . $i, $applications[$d]->getBirthday());
            $sheet->setCellValue("D" . $i, $applications[$d]->getPhone());
            $sheet->setCellValue("E" . $i, $applications[$d]->getCity());
            $sheet->setCellValue("F" . $i, $applications[$d]->getFaculty());
            $sheet->setCellValue("G" . $i, $applications[$d]->getCampus());
            $sheet->setCellValue("H" . $i, $applications[$d]->getMajor());
            if ($applications[$d]->getAccomodationNeeded())
                $sheet->setCellValue("I" . $i, "true");
            else
                $sheet->setCellValue("I" . $i, "false");

            if ($applications[$d]->getDidParticipate())
                $sheet->setCellValue("J" . $i, "true");
            else
                $sheet->setCellValue("J" . $i, "false");
            if ($applications[$d]->getSimilarParticipation())
                $sheet->setCellValue("K" . $i, "true");
            else
                $sheet->setCellValue("K" . $i, "false");
            $sheet->setCellValue("L" . $i, $applications[$d]->getHearingWay());
            $sheet->setCellValue("M" . $i, $applications[$d]->getOpinion());
            $sheet->setCellValue("N" . $i, $applications[$d]->getStatus());

            if ($i % 2 === 0) {
                $sheet->getStyle('A' . ($i))->applyFromArray($identifierOddArray);
                $sheet->getStyle('B' . ($i) . ':N' . ($i))->applyFromArray($identifierOddValuesArray);
            } else {
                $sheet->getStyle('A' . ($i))->applyFromArray($identifierArray);
                $sheet->getStyle('B' . ($i) . ':N' . ($i))->applyFromArray($identifierValuesArray);
            }

            $i++;
        }

        foreach(range('A','N') as $columnID) {
            $spreadsheet->getActiveSheet()->getColumnDimension($columnID)
                ->setAutoSize(true);
        }

        $filename = "exports/applications_" . date("ymd") . ".xlsx";
        $writer = new Xlsx($spreadsheet);
        $writer->save($filename);

        return $this->file($filename);
    }


    /**
     * @Route("/export/endorsements2", name="export_endorsements2")
     * @Method({"GET"})
     */
    public function exportEndorsements2()
    {
        $spreadsheet = new Spreadsheet();
        $spreadsheet->getProperties()
            ->setCreator("Muhammad Hashim")
            ->setLastModifiedBy("Muhammad Hashim")
            ->setTitle("Endoresements MYP 2")
            ->setSubject("Endoresements MYP 2")
            ->setDescription(
                "Automatically generated excel sheet for endoresement"
            )
            ->setKeywords("MYP endorsement automated xonboard xob")
            ->setCategory("MYP 2");


        $spreadsheet->setActiveSheetIndex(0);

        $qb = $this->getDoctrine()
            ->getRepository(Endorsement::class)
            ->createQueryBuilder("e")
            ->select("e")
            ->addSelect("Count(e.type) as endorsements")
            ->join("e.reciever", "u")
            ->groupBy("e.type")
            ->addGroupBy("u.name")
            ->orderBy("u.name")
            ->addOrderBy("e.type")
            ->addSelect("e.type as type")
            ->addSelect("u.name as name")
            ->getQuery();

        $i = 3;
        $totalCounter = 0;
        $currentPart = "";


        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setCellValue("A1", "Name");
        $sheet->setCellValue("B1", "Type");
        $sheet->setCellValue("C1", "Endorsements");

        $styleArray = [
            'font' => [
                'bold' => true,
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT,
            ],
            'borders' => [
                'top' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'rotation' => 90,
                'color' => [
                    'argb' => 'FFA0A0A0',
                ],
                'endColor' => [
                    'argb' => 'FFFFFFFF',
                ],
            ],
        ];

        $headerArray = [
            'font' => [
                'bold' => true,
                'color' => [
                    'argb' => 'FFFFFFFF',
                ]
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
            ],
            'borders' => [
                'top' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
                'bottom' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'rotation' => 90,
                'color' => [
                    'argb' => 'FF009EE3',
                ]
            ],
        ];

        $identifierArray = [
            'font' => [
                'bold' => true,
                'color' => [
                    'argb' => 'FFFFFFFF',
                ]
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'rotation' => 90,
                'color' => [
                    'argb' => 'FFE5007D',
                ]
            ],
        ];
        $identifierValuesArray = [
            'font' => [
                'bold' => false,
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'rotation' => 90,
                'color' => [
                    'argb' => 'FFF280BE',
                ],
                'endColor' => [
                    'argb' => 'FFFFFFFF',
                ],
            ],
        ];

        $identifierOddArray = [
            'font' => [
                'bold' => true,
                'color' => [
                    'argb' => 'FFFFFFFF',
                ]
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'rotation' => 90,
                'color' => [
                    'argb' => 'FF26ABE3',
                ]
            ],
        ];
        $identifierOddValuesArray = [
            'font' => [
                'bold' => false,
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'rotation' => 90,
                'color' => [
                    'argb' => 'FF93D5F1',
                ],
                'endColor' => [
                    'argb' => 'FFFFFFFF',
                ],
            ],
        ];

        $result = $qb->getResult();

        $styleStarter = 0;

        for ($d = 0; $d < count($result); $d++) {
            $sheet = $spreadsheet->getActiveSheet();
            if ($currentPart !== $result[$d]["name"] && $d !== 0) {
                $sheet->setCellValue("B" . $i, ucfirst("total"));
                $sheet->setCellValue("C" . $i, $totalCounter);
                $totalCounter = 0;
                $i++;
            }

            if ($currentPart !== $result[$d]["name"]) {
                $sheet->setCellValue("A" . $i, $result[$d]["name"]);
                if ($i % 2 === 0) {
                    $sheet->getStyle('A' . $styleStarter . ':A' . ($i - 1))->applyFromArray($identifierArray);
                    $sheet->getStyle('B' . $styleStarter . ':C' . ($i - 1))->applyFromArray($identifierValuesArray);
                    $sheet->getStyle('B' . ($i - 1) . ':C' . ($i - 1))->applyFromArray($identifierArray);
                } else {
                    $sheet->getStyle('A' . $styleStarter . ':A' . ($i - 1))->applyFromArray($identifierOddArray);
                    $sheet->getStyle('B' . $styleStarter . ':C' . ($i - 1))->applyFromArray($identifierOddValuesArray);
                    $sheet->getStyle('B' . ($i - 1) . ':C' . ($i - 1))->applyFromArray($identifierOddArray);
                }
                $styleStarter = $i;
            }
            $sheet->setCellValue("B" . $i, ucfirst($result[$d]["type"]));
            $sheet->setCellValue("C" . $i, $result[$d]["endorsements"]);
            $totalCounter += $result[$d]["endorsements"];
            $currentPart = $result[$d]["name"];
            $i++;
        }

        $sheet->setCellValue("B" . $i, ucfirst("total"));
        $sheet->setCellValue("C" . $i, $totalCounter);
        if ($i % 2 !== 0) {
            $sheet->getStyle('A' . $styleStarter . ':A' . ($i))->applyFromArray($identifierArray);
            $sheet->getStyle('B' . $styleStarter . ':C' . ($i))->applyFromArray($identifierValuesArray);
            $sheet->getStyle('B' . $i . ':C' . ($i))->applyFromArray($identifierArray);
        } else {
            $sheet->getStyle('A' . $styleStarter . ':A' . ($i))->applyFromArray($identifierOddArray);
            $sheet->getStyle('B' . $styleStarter . ':C' . ($i))->applyFromArray($identifierOddValuesArray);
            $sheet->getStyle('B' . $i . ':C' . ($i))->applyFromArray($identifierOddArray);
        }
        $sheet->getStyle('A1:C2')->applyFromArray($headerArray);
        $totalCounter = 0;

        $filename = "exports/endoresments_" . date('ymd') . ".xlsx";

        $writer = new Xlsx($spreadsheet);

        $writer->save($filename);

        return $this->file($filename);
    }

    /**
     * @Route("/export/endorsements", name="export_endorsements")
     * @Method({"GET"})
     */
    public function exportEndorsements()
    {
        $spreadsheet = new Spreadsheet();
        $spreadsheet->getProperties()
            ->setCreator("Muhammad Hashim")
            ->setLastModifiedBy("Muhammad Hashim")
            ->setTitle("Endoresements MYP 2")
            ->setSubject("Endoresements MYP 2")
            ->setDescription(
                "Automatically generated excel sheet for endoresement"
            )
            ->setKeywords("MYP endorsement automated xonboard xob")
            ->setCategory("MYP 2");


        $spreadsheet->setActiveSheetIndex(0);

        $result = $this->getDoctrine()
            ->getRepository(Endorsement::class)
            ->findAllForMods();



        $d = array();
        $holder = array("userId" => -1);

        for ($i = 0; $i < count($result); $i++) {
            if ($holder["userId"] !== $result[$i]["userId"]) {

                if ($holder["userId"] !== -1) {
                    $holder["total"] = $holder["management"] + $holder["content"] + $holder["leadership"];
                    array_push($d, $holder);
                }

                $holder = ["userId" => $result[$i]["userId"], "name" => $result[$i]["name"], "management" => 0, "content" => 0, "leadership" => 0];
            }

            $holder[$result[$i]["type"]] = $result[$i]["endorsements"];
        }

        $holder["total"] = $holder["management"] + $holder["content"] + $holder["leadership"];

        array_push($d, $holder);
        $result = $d;

       usort($result, function ($a, $b) {
            if ($a['total'] == $b['total']) return 0;
            return $a['total'] < $b['total'] ? 1 : -1;
        });

        $i = 3;
        $totalCounter = 0;
        $currentPart = "";


        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setCellValue("A1", "Name");
        $sheet->setCellValue("B1", "Content");
        $sheet->setCellValue("C1", "Leadership");
        $sheet->setCellValue("D1", "Engagement");
        $sheet->setCellValue("E1", "Total");

        $styleArray = [
            'font' => [
                'bold' => true,
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT,
            ],
            'borders' => [
                'top' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_GRADIENT_LINEAR,
                'rotation' => 90,
                'startColor' => [
                    'argb' => 'FFA0A0A0',
                ],
                'endColor' => [
                    'argb' => 'FFFFFFFF',
                ],
            ],
        ];

        $headerArray = [
            'font' => [
                'bold' => true,
                'color' => [
                    'argb' => 'FFFFFFFF',
                ]
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
            ],
            'borders' => [
                'top' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
                'bottom' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                ],
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'rotation' => 90,
                'color' => [
                    'argb' => 'FF009EE3',
                ]
            ],
        ];

        $identifierArray = [
            'font' => [
                'bold' => true,
                'color' => [
                    'argb' => 'FFFFFFFF',
                ]
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'rotation' => 90,
                'color' => [
                    'argb' => 'FFE5007D',
                ]
            ],
        ];

        $identifierValuesArray = [
            'font' => [
                'bold' => false,
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'rotation' => 90,
                'color' => [
                    'argb' => 'FFF280BE',
                ],
                'endColor' => [
                    'argb' => 'FFFFFFFF',
                ],
            ],
        ];

        $identifierOddArray = [
            'font' => [
                'bold' => true,
                'color' => [
                    'argb' => 'FFFFFFFF',
                ]
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'rotation' => 90,
                'color' => [
                    'argb' => 'FF26ABE3',
                ]
            ],
        ];
        $identifierOddValuesArray = [
            'font' => [
                'bold' => false,
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'rotation' => 90,
                'color' => [
                    'argb' => 'FF93D5F1',
                ],
                'endColor' => [
                    'argb' => 'FFFFFFFF',
                ],
            ],
        ];


        $styleStarter = 0;

        for ($d = 0; $d < count($result); $d++) {
            $sheet = $spreadsheet->getActiveSheet();
            $sheet->setCellValue("B".$i,$result[$d]["content"]);
            $sheet->setCellValue("C".$i,$result[$d]["leadership"]);
            $sheet->setCellValue("D".$i,$result[$d]["management"]);
            $sheet->setCellValue("E".$i,$result[$d]["total"]);
            

                $sheet->setCellValue("A" . $i, $result[$d]["name"]);
                if ($i % 2 === 0) {
                    $sheet->getStyle('A' . ($i))->applyFromArray($identifierOddArray);
                    $sheet->getStyle('B' . ($i) . ':D' . ($i))->applyFromArray($identifierOddValuesArray);
                    $sheet->getStyle('E'.($i))->applyFromArray($identifierOddArray);
                } else {
                    $sheet->getStyle('A' . ($i))->applyFromArray($identifierArray);
                    $sheet->getStyle('B' . ($i) . ':D' . ($i))->applyFromArray($identifierValuesArray);
                    $sheet->getStyle('E'.($i))->applyFromArray($identifierArray);
                }

            $i++;
        }


        $sheet->getStyle('A1:E2')->applyFromArray($headerArray);
        foreach(range('A','E') as $columnID) {
            $spreadsheet->getActiveSheet()->getColumnDimension($columnID)
                ->setAutoSize(true);
        }

        $filename = "exports/endoresments_" . date('ymd') . ".xlsx";

        $writer = new Xlsx($spreadsheet);

        $writer->save($filename);

        return $this->file($filename);
    }
}