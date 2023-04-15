import { google } from "googleapis";

const { API_KEY, SPREADSHEET_ID } = process.env;

const getRoster = async () => {
  const sheets = google.sheets({
    version: "v4",
    auth: API_KEY,
  });

  const sheet = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Main Roster!C2:I",
  });

  const allMembers = sheet.data.values.map(
    ([name, rank, enlistDate, dischargeDate, company, platoon, squad]) => ({
      name,
      rank,
      enlistDate,
      dischargeDate,
      company,
      platoon,
      squad,
    })
  );

  const activeMembers = allMembers.filter((m) => !m.dischargeDate);
  const ablePlatoons = ["First", "Second", "Third"];
  const squads = ["First", "Second", "Third", "Fourth", "Fifth"];
  const roster = {
    name: "Battalion",
    members: activeMembers.filter(
      (m) => m.company === "Division" || m.company === "Battalion"
    ),
    children: [
      {
        name: "Able Company",
        members: activeMembers.filter(
          (m) => m.company === "Able" && m.platoon === "Company"
        ),
        children: ablePlatoons.map((platoonName) => {
          const platoonMembers = activeMembers.filter(
            (m) => m.company === "Able" && m.platoon === platoonName
          );
          const squadsNames = squads.filter((s) =>
            platoonMembers.some((m) => m.squad === s)
          );
          return {
            name: `${platoonName} Platoon`,
            members: platoonMembers.filter((m) => m.squad === "Company"),
            children: squadsNames.map((squadName) => ({
              name: `${squadName} Squad`,
              members: platoonMembers.filter((m) => m.squad === squadName),
            })),
          };
        }),
      },
      {
        name: "King Company",
        members: activeMembers.filter(
          (m) => m.company === "King" && m.platoon === "Company"
        ),
        children: [
          {
            name: "First Squadron",
            members: activeMembers.filter(
              (m) =>
                m.company === "King" &&
                m.platoon === "First" &&
                m.squad === "Company"
            ),
            children: [
              {
                name: "First Squadron",
                members: activeMembers.filter(
                  (m) =>
                    m.company === "King" &&
                    m.platoon === "First" &&
                    m.squad === "First"
                ),
              },
            ],
          },
        ],
      },
      {
        name: "Reserves",
        members: activeMembers.filter((m) => m.platoon === "Reserves"),
      },
      {
        name: "Retired Members",
        members: allMembers.filter(
          (m) => m.dischargeDate && m.platoon === "Retired"
        ),
      },
    ],
  };

  return roster;
};

export default getRoster;
