import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Image from "next/image";

export default function MembersTable({ members }) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Display Name</TableCell>
            <TableCell>Member Since</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  {row.rankImg !== "pvt" && row.rankImg !== "rct" && (
                    <Image
                      alt={row.rankDescription}
                      src={`/assets/ranks/${row.rankImg}.png`}
                      width={50}
                      height={50}
                    />
                  )}
                  <span>{row.rankDescription}</span>
                </div>
              </TableCell>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.enlistDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
