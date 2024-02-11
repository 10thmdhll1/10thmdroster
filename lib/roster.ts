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

  const ActiveMembers = allMembers.filter((m) => !m.dischargeDate);
  const Platoons = ["First", "Second", "Third", "Fourth", "Reserves"];
  const Squads = ["First", "Second", "Third", "Fourth"];
  const roster = {
    name: "Division and Battalion Command",
    members: ActiveMembers.filter((m) => m.company === "Division" || m.company === "Battalion"),
    children: [
      {
        name: "HLL - Fox Company",
        members: ActiveMembers.filter((m) => m.company === "Fox" && m.platoon === "Company"),
        children: Platoons.map((platoonName) => {
          const platoonMembers = ActiveMembers.filter((m) => m.company === "Fox" && m.platoon === platoonName);
          const squadsNames = Squads.filter((s) => platoonMembers.some((m) => m.squad === s));
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
        members: ActiveMembers.filter((m) => m.company === "King" && m.platoon === "Company"),
        children: Platoons.map((platoonName) => {
          const platoonMembers = ActiveMembers.filter((m) => m.company === "Fox" && m.platoon === platoonName);
          const squadsNames = Squads.filter((s) => platoonMembers.some((m) => m.squad === s));
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
        name: "Reserves",
        members: allMembers.filter((m) => !m.dischargeDate && m.platoon === "Reserves"),
      },
      {
        name: "Retired",
        members: allMembers.filter((m) => m.dischargeDate && m.platoon === "Retired"),
      },
    ],
  };

  return roster;
};

export default getRoster;
