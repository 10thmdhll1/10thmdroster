import getRoster from "@/lib/roster";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Roster({ roster }) {
  console.log(roster);
  return (
    <Container maxWidth="xl">
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{roster.name} Command</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </Typography>
        </AccordionDetails>
      </Accordion>
      {roster.children.map((c) => (
        <Accordion key={c.name}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{c.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
}

export async function getStaticProps() {
  const roster = await getRoster();

  return {
    props: {
      roster,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}
