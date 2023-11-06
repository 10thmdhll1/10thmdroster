import { google } from "googleapis";

var { API_KEY, SPREADSHEET_ID } = process.env;
var getRoster = async () => {
  var sheets = google.sheets({
    version: "v4",
    auth: API_KEY,
  });

  var ranksSheet = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Ranks!A2:C",
  });

  var ranks = ranksSheet.data.values.reduce(
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

  var sheet = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Main Roster!B2:H",
  });

  var allMembers = sheet.data.values
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

  var activeMembers = allMembers.filter((m) => !m.dischargeDate);
  var foxPlatoons = ["First", "Second", "Third"];
  var bravoPlatoons = ["First", "Second", "Third"];
  var squads = ["First", "Second", "Third", "Fourth"];
  
  var roster = 
  {
    name: "Division and Battalion Command",
    members: activeMembers.filter
	(
      (m) => m.company === "Division" || m.company === "Battalion"
    ),
    children: 
	[
      {
        name: "HLL - Fox Company",
        members: activeMembers.filter
		(
          (m) => m.company === "Fox" && m.platoon === "Company"
        ),
        children: foxPlatoons.map((platoonName) => 
		{
          var platoonMembers = activeMembers.filter
		  (
            (m) => m.company === "Fox" && m.platoon === platoonName
          );
          var squadsNames = squads.filter
		  ((s) =>
            platoonMembers.some((m) => m.squad === s)
          );
          return 
		  {
            //name: `${platoonName} Platoon`,
            members: platoonMembers.filter((m) => m.squad === "Company"),
            children: squadsNames.map
			(
				(squadName) => 
					(
						{
							name: `${squadName} Squad`,
							members: platoonMembers.filter((m) => m.squad === squadName),
						}
					)
			),
          };
        }
		),
      },
      {
        name: "Squad - Bravo Company",
        members: activeMembers.filter(
          (m) => m.company === "Bravo" && m.platoon === "Company"
        ),
        children: bravoPlatoons.map((platoonName) => {
          var platoonMembers = activeMembers.filter(
            (m) => m.company === "Bravo" && m.platoon === platoonName
          );
          var squadsNames = squads.filter((s) =>
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
