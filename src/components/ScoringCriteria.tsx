
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ScoringCriteriaProps {
  type: "punches" | "kicks" | "throws";
}

const ScoringCriteria: React.FC<ScoringCriteriaProps> = ({ type }) => {
  const criteriaData = {
    punches: {
      title: "Pukulan",
      description: "Kriteria penilaian pukulan dalam pertandingan",
      items: [
        { score: "8-10", description: "Pukulan yang tepat sasaran dan bertenaga" },
        { score: "5-7", description: "Pukulan yang cukup baik namun kurang bertenaga" },
        { score: "1-4", description: "Pukulan yang tidak tepat sasaran" },
      ]
    },
    kicks: {
      title: "Tendangan",
      description: "Kriteria penilaian tendangan dalam pertandingan",
      items: [
        { score: "8-10", description: "Tendangan yang tepat sasaran dan bertenaga" },
        { score: "5-7", description: "Tendangan yang cukup baik namun kurang bertenaga" },
        { score: "1-4", description: "Tendangan yang tidak tepat sasaran" },
      ]
    },
    throws: {
      title: "Jatuhan",
      description: "Kriteria penilaian jatuhan dalam pertandingan",
      items: [
        { score: "8-10", description: "Jatuhan yang sempurna dengan teknik yang baik" },
        { score: "5-7", description: "Jatuhan yang cukup baik namun kurang sempurna" },
        { score: "1-4", description: "Usaha jatuhan yang tidak berhasil" },
      ]
    }
  };

  const criteria = criteriaData[type];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kriteria {criteria.title}</CardTitle>
        <CardDescription>{criteria.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Nilai</TableHead>
              <TableHead>Deskripsi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {criteria.items.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.score}</TableCell>
                <TableCell>{item.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ScoringCriteria;
