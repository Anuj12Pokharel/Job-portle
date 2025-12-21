import { useEffect, useState } from "react";

/* ===============================
   1️⃣ TYPES (TypeScript Interface)
================================ */
interface TeamMember {
  id: number;
  name: string;
  designation: string;
  image: string;
  description: string;
}

/* ===============================
   2️⃣ DUMMY API (Mock Backend)
================================ */
const fetchTeamMembers = (): Promise<TeamMember[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "Singh Bahadur Moktan",
          designation: "Executive Chairman",
          image: "/images/chairman.jpg",
          description:
            "With more than 20 years of experience in Sales, HR, and operation.",
        },
        {
          id: 2,
          name: "Ramesh Adhikari",
          designation: "Managing Director",
          image: "/images/director.jpg",
          description:
            "Experienced leader with strong business and operational skills.",
        },
      ]);
    }, 800);
  });
};

/* ===============================
   3️⃣ TEAM CARD COMPONENT
================================ */
const TeamCard = ({
  name,
  designation,
  image,
  description,
}: Omit<TeamMember, "id">) => {
  return (
    <div className="w-[300px] h-[420px] perspective-1000 group">
      {/* 👆 group added here */}

      <div
        className="
          relative w-full h-full
          transform-style-preserve-3d
          transition-transform duration-700 ease-in-out
          group-hover:rotate-y-180
        "
      >
        {/* FRONT */}
        <div className="absolute inset-0 backface-hidden border-2 border-cyan-500 rounded-lg bg-white text-center p-5">
          <img
            src={image}
            alt={name}
            className="w-[120px] h-[120px] mx-auto mt-5 rounded-lg object-cover"
          />
          <h3 className="mt-4 text-xl font-semibold text-cyan-500">
            {name}
          </h3>
          <p className="mt-2 text-gray-700">{designation}</p>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 border-2 border-cyan-500 rounded-lg bg-white text-center p-5">
          <h3 className="text-xl font-semibold text-cyan-500">About</h3>
          <p className="mt-4 text-gray-700 text-sm">
            {description}
          </p>
          <button className="mt-6 w-11 h-11 bg-cyan-500 text-white text-2xl rounded-md">
            +
          </button>
        </div>
      </div>
    </div>
  );
};

/* ===============================
   4️⃣ MAIN TEAM COMPONENT
================================ */
const OurTeam = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers().then((data) => {
      setTeam(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading team...</p>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-8">
      {team.map((member) => (
        <TeamCard
          key={member.id}
          name={member.name}
          designation={member.designation}
          image={member.image}
          description={member.description}
        />
      ))}
    </div>
  );
};

export default OurTeam;
