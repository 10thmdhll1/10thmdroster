const getRoster = async () => {
  const roster = {
    name: "Battalion",
    members: [
      { name: "Matthews", rank: "Col.", medals: [] },
      { name: "Bill", rank: "Maj.", medals: [] },
    ],
    children: [
      {
        name: "Able Company",
        members: [
          { name: "Big_Tex", rank: "Cpt.", medals: [] },
          { name: "Fox", rank: "1st. Lt", medals: [] },
        ],
        children: [
          {
            name: "First Platoon",
            members: [
              { name: "Bob9008", rank: "2Lt.", medals: [] },
              { name: "RidleySerber", rank: "WO.", medals: [] },
            ],
            children: [
              {
                name: "First Squad",
                members: [
                  { name: "Red1776", rank: "S/Sgt.", medals: [] },
                  { name: "mike", rank: "Sgt.", medals: [] },
                ],
              },
              {
                name: "Second Squad",
                members: [
                  { name: "Slick47", rank: "S/Sgt.", medals: [] },
                  { name: "scndrespondr", rank: "Sgt.", medals: [] },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "King Company",
        members: [
          { name: "Tankk", rank: "Cpt.", medals: [] },
          { name: "HellSiege", rank: "1st Lt.", medals: [] },
        ],
        children: [
          {
            name: "First Squadron",
            members: [
              { name: "6PuckClutch", rank: "M/Sgt.", medals: [] },
              { name: "Texasrod", rank: "T/Sgt.", medals: [] },
            ],
            children: [
              {
                name: "First Squadron",
                members: [
                  { name: "Mass", rank: "T/3", medals: [] },
                  { name: "Nutz", rank: "T/3", medals: [] },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "Reserves",
        members: [
          { name: "Shepard", rank: "CWO.", medals: [] },
          { name: "Salvador", rank: "T/3", medals: [] },
        ],
      },
      {
        name: "Retired Members",
        members: [
          { name: "Clem", rank: "Cpt.", medals: [] },
          { name: "T-Rex", rank: "2Lt.", medals: [] },
        ],
      },
    ],
  };

  return roster;
};

export default getRoster;
