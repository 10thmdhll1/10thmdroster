import getRoster from "@/lib/roster";

import Container from "@mui/material/Container";
import Roster from "@/components/Roster";

export default function RosterPage({ roster }) {
  return (
    <Container maxWidth="xl">
      <Roster roster={roster} isRoot />
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
