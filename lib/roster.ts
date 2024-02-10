import { google } from "googleapis";

const { API_KEY, SPREADSHEET_ID } = process.env;
const getRoster = async () => {
  const sheets = google.sheets({
    version: "v4",
    auth: API_KEY,
  });

  const ranksSheet = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Ranks!A2:C",
  });

  const ranks = ranksSheet.data.values.reduce(
    (acc, [rank, index, Description]) => ({
      ...acc,
      [rank]: {
        index,
        Description,
        img: rank.replace(/[\s./]/g, "").toLowerCase(),
      },
    }),
    {}
  );

  const sheet = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Main Roster!B2:H",
  });

  const allMembers = sheet.data.values
    .map(
      ([name, rank, enlistDate, dischargeDate, company, platoon, squad]) => ({
        name,
        rank,
        rankDescription: ranks[rank].Description,
        rankImg: ranks[rank].img,
        enlistDate,
        dischargeDate,
        company,
        platoon,
        squad,
      })
    )
    .sort((a, b) => ranks[b.rank].index - ranks[a.rank].index);

  const activeMembersDiv = allMembers.filter((m) => !m.dischargeDate);
  const activeMembersFox = allMembers.filter((m) => !m.dischargeDate);
  const activeMembersKing = allMembers.filter((m) => !m.dischargeDate);
  const activeMembersReserves = allMembers.filter((m) => !m.dischargeDate);
  
  const foxPlatoons = ["First", "Second", "Third"];
  const KingPlatoons = ["First", "Second", "Third"];
  const squads = ["First", "Second", "Third", "Fourth"];
  const roster = {
    name: "Division and Battalion Command",
    members: activeMembersDiv.filter(
      (m) => m.company === "Division" || m.company === "Battalion"
    ),
    children: [
      {
        name: "HLL - Fox Company",
        members: activeMembersFox.filter(
          (m) => m.company === "Fox" && m.platoon === "Company"
        ),
        children: foxPlatoons.map((platoonName) => {
          const platoonMembers = activeMembersFox.filter(
            (m) => m.company === "Fox" && m.platoon === platoonName
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
        name: "HLL - King Company",
        members: activeMembersKing.filter(
          (m) => m.company === "King" && m.platoon === "Company"
        ),
        children: KingPlatoons.map((platoonName) => {
          const platoonMembers = activeMembersKing.filter(
            (m) => m.company === "King" && m.platoon === platoonName
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
        ],
      },
      {
        name: "Reserves",
        members: activeMembersReserves.filter((m) => m.platoon === "Reserves"),
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
