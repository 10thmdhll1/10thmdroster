import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MembersTable from "@/components/MembersTable";

export default function Roster({ roster, isRoot = false }) {
  return (
    <>
      <Accordion defaultExpanded={isRoot}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            {roster.name} {isRoot && "Command"}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {!isRoot && roster.children && (
            <Typography>{roster.name} Command</Typography>
          )}
          <MembersTable members={roster.members} />
          {!isRoot &&
            roster.children?.map((c) => <Roster key={c.name} roster={c} />)}
        </AccordionDetails>
      </Accordion>
      {isRoot &&
        roster.children?.map((c) => <Roster key={c.name} roster={c} />)}
    </>
  );
}
