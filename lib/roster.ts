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

  const activeMembers = allMembers.filter((m) => !m.dischargeDate);
  
  const roster = 
  {
	// Division and Battalion Command
    name: "Division and Battalion Command",
    members: activeMembers.filter((m) => m.company === "Division" || m.company === "Battalion"),
    children: 
	[
     /* {
        name: "HLL - Fox Company",
        members: activeMembers.filter((m) => m.company === "Fox" && m.platoon === "Company"),
        children: foxPlatoons.map((platoonName) => 
		{
          const platoonMembers = activeMembers.filter((m) => m.company === "Fox" && m.platoon === platoonName);
          const squadsNames = squads.filter((s) =>platoonMembers.some((m) => m.squad === s));
          return 
		  {
            name: `${platoonName} Platoon`,
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
      }, */
      {
		// Fox Company Command  
        name: "HLL - Fox Company",
        members: activeMembers.filter((m) => m.company === "Fox" && m.platoon === "Company"),
		children:
		[
			{
				// FP1 Command
				name: "HLL - FP1",
				members: activeMembers.filter((m) => m.company === "Fox" && m.platoon === "First" && m.squad === "Company"),
				children:
				[
					{
						// FP1S1 Members
						name: "HLL - FP1S1",
						members: activeMembers.filter((m) => m.company === "Fox" && m.platoon === "First" && m.squad === "First"),
					},				
					{
						// FP1S2 Members
						name: "HLL - FP1S2",
						members: activeMembers.filter((m) => m.company === "Fox" && m.platoon === "First" && m.squad === "Second"),
					},				
					{
						// FP1S3 Members
						name: "HLL - FP1S3",
						members: activeMembers.filter((m) => m.company === "Fox" && m.platoon === "First" && m.squad === "Third"),
					},
					{
						// FP1S4 Members
						name: "HLL - FP1S4",
						members: activeMembers.filter((m) => m.company === "Fox" && m.platoon === "First" && m.squad === "Fourth"),
					},
				],
			}, 
			{
				// FP2 Command
				name: "HLL - FP2",
				members: activeMembers.filter((m) => m.company === "Fox" && m.platoon === "Second" && m.squad === "Company"),
				children:
				[
					{
						// FP2S1 Members
						name: "HLL - FP2S1",
						members: activeMembers.filter((m) => m.company === "Fox" && m.platoon === "Second" && m.squad === "First"),
					},				
					{
						// FP2S2 Members
						name: "HLL - FP2S2",
						members: activeMembers.filter((m) => m.company === "Fox" && m.platoon === "Second" && m.squad === "Second"),
					},				
					{
						// FP2S3 Members
						name: "HLL - FP2S3",
						members: activeMembers.filter((m) => m.company === "Fox" && m.platoon === "Second" && m.squad === "Third"),
					},
					{
						// FP2S4 Members
						name: "HLL - FP2S4",
						members: activeMembers.filter((m) => m.company === "Fox" && m.platoon === "Second" && m.squad === "Fourth"),
					},
				],
			}, 
			{
				// FP3 Command
				name: "HLL - FP3",
				members: activeMembers.filter((m) => m.company === "Fox" && m.platoon === "Third" && m.squad === "Company"),
				children:
				[
					{
						// FP3S1 Members
						name: "HLL - FP3S1",
						members: activeMembers.filter((m) => m.company === "Fox" && m.platoon === "Third" && m.squad === "First"),
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
        members: allMembers.filter((m) => m.dischargeDate && m.platoon === "Retired"),
      },
    ], 
  };

  return roster;
};

export default getRoster;
